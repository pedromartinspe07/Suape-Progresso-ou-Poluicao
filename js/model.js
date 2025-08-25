// js/model.js
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

document.addEventListener('DOMContentLoaded', () => {

    const container = document.getElementById('model-container');
    if (!container) return;

    // 1. Configurar a Cena, Câmera e Renderizador
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0); // Cor de fundo do contêiner

    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(0, 1.5, 3);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // 2. Adicionar Luzes para iluminar o modelo
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // 3. Carregar o Modelo GLB
    const loader = new GLTFLoader();
    loader.load(
        'assets/3d/lighthouse.glb',
        function (gltf) {
            const model = gltf.scene;
            model.scale.set(1.5, 1.5, 1.5); // Ajusta o tamanho do modelo
            scene.add(model);
        },
        undefined,
        function (error) {
            console.error('An error happened while loading the model:', error);
        }
    );

    // 4. Adicionar Controles de Órbita (Interatividade)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // Efeito de suavidade
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.maxPolarAngle = Math.PI / 2; // Limita a rotação vertical

    // 5. Animação de Renderização
    function animate() {
        requestAnimationFrame(animate);
        controls.update(); // Atualiza os controles
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
