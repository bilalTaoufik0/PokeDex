import * as THREE from 'https://esm.sh/three@0.152.2';
import { GLTFLoader } from 'https://esm.sh/three@0.152.2/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://esm.sh/three@0.152.2/examples/jsm/controls/OrbitControls.js';

// Création de la page de chargement
const loaderContainer = document.createElement('div');
loaderContainer.id = 'loader-container';
loaderContainer.innerHTML = `<div class="pokeball"></div>`;
document.body.appendChild(loaderContainer);

// Ajouter un style CSS pour l'animation
const style = document.createElement('style');
style.innerHTML = `
    @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap'); 

    body {
        margin: 0;
        overflow: hidden;
    }
    #loader-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: white;
        background-image: url('src/fond.jpg');
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        transition: opacity 0.5s ease-in-out, visibility 0.5s ease-in-out;
    }
    .pokeball {
        width: 100px;
        height: 100px;
        background: radial-gradient(circle at center, red 50%, white 50%);
        border: 4px solid black;
        border-radius: 50%;
        position: absolute;
        bottom: 10%;
        left: 10%;
        animation: bounce 1.2s infinite;
    }
    .pokeball::after {
        content: '';
        width: 30px;
        height: 30px;
        background: white;
        border: 4px solid black;
        border-radius: 50%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-20px); }
    }
    @keyframes slideOut {
        0% { transform: translate(0, 0); opacity: 1; }
        100% { transform: translate(100vw, -100vh) scale(0.5); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Création de la scène
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);

// ✅ Position initiale de la caméra
camera.position.set(1, 1, 1);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lumières
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 5);
scene.add(light);

const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

// Définir la couleur du ciel en gris clair
scene.background = new THREE.Color(0xB0B0B0);

// Chargement du modèle
const loader = new GLTFLoader();
let pokemonModel = null;

loader.load('src/test.glb', (gltf) => {
    pokemonModel = gltf.scene;
    scene.add(pokemonModel);

    // ✅ Ajuster uniquement la direction de la caméra, sans toucher à sa position
    const box = new THREE.Box3().setFromObject(pokemonModel);
    const center = box.getCenter(new THREE.Vector3());
    camera.lookAt(center); // On garde la position initiale mais oriente la vue vers le modèle

    // Appliquer l'animation de sortie
    const pokeball = document.querySelector('.pokeball');
    pokeball.style.animation = 'slideOut 1s forwards';

    // ✅ Disparition fluide du loader et suppression complète
    setTimeout(() => {
        loaderContainer.style.opacity = '0'; // Rendre invisible
        setTimeout(() => {
            loaderContainer.style.display = 'none'; // Supprimer complètement
        }, 500);
    }, 1000);
}, undefined, (error) => {
    console.error('❌ Erreur de chargement du modèle:', error);
});

// Contrôles de la caméra
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enableZoom = false;  // Désactiver le zoom

// Animation de la scène
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();

// Ajustement de la taille du rendu lors du redimensionnement de la fenêtre
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
