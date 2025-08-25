// js/model.js
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

document.addEventListener('DOMContentLoaded', () => {

    const container = document.getElementById('model-container');
    if (!container) return;

    // 1. Configurar a Cena, Câmera e Renderizador
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);

    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(0, 1.5, 10);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // 2. Adicionar Luzes para iluminar o modelo
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight.position.set(5, 10, 7.5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    scene.add(directionalLight);

    // 3. Carregar o Modelo GLB
    const loader = new GLTFLoader();
    loader.load(
        'assets/3d/lighthouse.glb',
        function (gltf) {
            const model = gltf.scene;
            model.scale.set(1.5, 1.5, 1.5);
            
            // ✨ CORREÇÃO: Itera sobre os objetos do modelo para corrigir a codificação das texturas
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

    // 4. Adicionar Controles de Órbita (Interatividade)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.maxPolarAngle = Math.PI / 2;

    // 5. Animação de Renderização
    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }
    animate();

    // 6. Resposta Responsiva ao redimensionar a tela
    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
});
