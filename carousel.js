// Carousel logic
let currentModel = 1;

document.getElementById('nextBtn').addEventListener('click', () => {
    currentModel = (currentModel % 3) + 1;
    rotateCarousel();
});

document.getElementById('prevBtn').addEventListener('click', () => {
    currentModel = (currentModel - 2 + 3) % 3 + 1;
    rotateCarousel();
});

function rotateCarousel() {
    // Logic to rotate carousel and load different 3D models
    console.log('Rotating to model', currentModel);
    // Switch canvas content based on currentModel
    loadModel(currentModel);
}

// 3D Model loading using three.js
function loadModel(modelIndex) {
    let canvas = document.getElementById(`modelCanvas${modelIndex}`);
    let renderer = new THREE.WebGLRenderer({ canvas });
    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera(75, canvas.width / canvas.height, 0.1, 1000);
    camera.position.z = 5;

    let geometry = new THREE.BoxGeometry(); // Replace with actual 3D model
    let material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    let cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    function animate() {
        requestAnimationFrame(animate);
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        renderer.render(scene, camera);
    }

    animate();
}

// Popup logic
let popup = document.getElementById('popup');
let productInfo = document.getElementById('product-info');
document.querySelectorAll('canvas').forEach((canvas, index) => {
    canvas.addEventListener('click', () => {
        productInfo.textContent = `Details of Product ${index + 1}`;
        popup.style.display = 'block';
    });
});

document.querySelector('.close-btn').addEventListener('click', () => {
    popup.style.display = 'none';
});

// Initial load of the first model
loadModel(currentModel);
