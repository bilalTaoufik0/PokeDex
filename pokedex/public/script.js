import * as THREE from 'https://esm.sh/three@0.152.2';
import { GLTFLoader } from 'https://esm.sh/three@0.152.2/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://esm.sh/three@0.152.2/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
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
scene.background = new THREE.Color(0xB0B0B0); // Gris clair (presque blanc)

// Sol avec une couleur gris foncé (couleur neutre)
const grassMaterial = new THREE.MeshStandardMaterial({ color: 0x3E3E3E }); // Gris foncé pour le sol
const floorGeometry = new THREE.PlaneGeometry(100, 100);
const floor = new THREE.Mesh(floorGeometry, grassMaterial);
floor.rotation.x = -Math.PI / 2;
scene.add(floor);

// Chargement du modèle Pokémon
const loader = new GLTFLoader();
let pokemonModel = null;

loader.load('src/3ds-pokemon.glb', (gltf) => {
    pokemonModel = gltf.scene;
    pokemonModel.position.set(0, 0, 0);
    pokemonModel.scale.set(1, 1, 1);
    scene.add(pokemonModel);

    const box = new THREE.Box3().setFromObject(pokemonModel);
    const center = box.getCenter(new THREE.Vector3());
    camera.position.set(center.x - 0.4, center.y + 0.13, center.z + 0.6);
    camera.lookAt(center);
}, undefined, (error) => {
    console.error('Erreur de chargement du modèle:', error);
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
