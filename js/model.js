// js/model.js
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EXRLoader } from 'three/addons/loaders/EXRLoader.js';

document.addEventListener('DOMContentLoaded', () => {

    const container = document.getElementById('model-container');
    if (!container) return;

    // Adiciona um listener para a visibilidade do container para carregar o modelo apenas quando visível.
    const containerObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                initModel();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    containerObserver.observe(container);

    function initModel() {
        // 1. Configurar a Cena, Câmera e Renderizador
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.set(0, 5, 25);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.shadowMap.enabled = true;
        renderer.outputEncoding = THREE.sRGBEncoding;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.0; // Valor ajustado para evitar "estouro" de luz
        container.appendChild(renderer.domElement);

        // 2. Gerenciador de Carregamento para feedback visual
        const loadingManager = new THREE.LoadingManager();
        loadingManager.onStart = function (url, itemsLoaded, itemsTotal) {
            console.log('Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
            // Implemente aqui uma barra de progresso ou um ícone de carregamento
        };
        loadingManager.onLoad = function () {
            console.log('Loading complete!');
            // Esconda a barra de progresso e inicie a animação
        };
        loadingManager.onProgress = function (url, itemsLoaded, itemsTotal) {
            console.log('Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
        };
        loadingManager.onError = function (url) {
            console.log('There was an error loading ' + url);
        };

        // 3. Carregar HDRI para iluminação e ambiente
        const pmremGenerator = new THREE.PMREMGenerator(renderer);
        pmremGenerator.compileEquirectangularShader();

        new EXRLoader(loadingManager)
            .setPath('assets/3d/')
            .load('qwantani_moonrise_puresky_4k.exr', function (texture) {
                const envMap = pmremGenerator.fromEquirectangular(texture).texture;
                texture.dispose();
                pmremGenerator.dispose();

                scene.environment = envMap;
                scene.background = envMap;
            });

        // 4. Carregar o Modelo GLB
        const loader = new GLTFLoader(loadingManager);
        let model;

        loader.load(
            'assets/3d/container_ship.glb',
            function (gltf) {
                model = gltf.scene;
                model.scale.set(1.5, 1.5, 1.5);
                
                model.traverse((child) => {
                    if (child.isMesh) {
                        child.material.map && (child.material.map.encoding = THREE.sRGBEncoding);
                        child.material.needsUpdate = true;
                    }
                });

                scene.add(model);
            },
            undefined,
            function (error) {
                console.error('An error happened while loading the model:', error);
            }
        );

        // 5. Adicionar Controles de Órbita (Interatividade)
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.screenSpacePanning = false;
        controls.maxPolarAngle = Math.PI / 2;
        
        let isUserInteracting = false;
        controls.addEventListener('start', () => { isUserInteracting = true; });
        controls.addEventListener('end', () => { isUserInteracting = false; });
        
        // 6. Animação de Renderização
        function animate() {
            requestAnimationFrame(animate);

            controls.update();
            
            // Rotação automática quando o usuário não está interagindo
            if (model && !isUserInteracting) {
                model.rotation.y += 0.005;
            }

            renderer.render(scene, camera);
        }
        animate();

        // 7. Resposta Responsiva ao redimensionar a tela
        window.addEventListener('resize', () => {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        });

        // 8. Limpeza de recursos
        window.addEventListener('beforeunload', () => {
            scene.traverse((object) => {
                if (object.geometry) object.geometry.dispose();
                if (object.material) {
                    if (object.material.isMeshBasicMaterial || object.material.isMeshLambertMaterial) {
                        for (const key in object.material) {
                            const value = object.material[key];
                            if (value && typeof value === 'object' && 'dispose' in value) {
                                value.dispose();
                            }
                        }
                    } else if (object.material.isShaderMaterial) {
                        object.material.uniformsNeedUpdate = false;
                        object.material.dispose();
                    }
                }
            });
            renderer.dispose();
            controls.dispose();
        });
    }
});