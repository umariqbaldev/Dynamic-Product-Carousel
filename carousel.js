// Three.js Setup

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xffffff);  // Set background to white
document.getElementById('carousel').appendChild(renderer.domElement);

// Lighting setup
var ambientLight = new THREE.AmbientLight(0xffffff, 0.8);  // white light
scene.add(ambientLight);

var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(0, 1, 1).normalize();
scene.add(directionalLight);

// Set up models array and loader
var models = [];
var currentModelIndex = 0;
var loader = new THREE.GLTFLoader();
var transitionSpeed = 0.1;  // Speed of the carousel transition
var modelSpacing = 15;  // Distance between each model
var modelsLoaded = 0;
var initialSetupDone = false;  // Flag to track the initial setup

// Raycaster to detect clicks on models
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

// Load multiple models
var modelPaths = ['models/city_compact.glb', 'models/heavy_off-roader.glb', 'models/nissan.glb'];

// Information for each model
var modelInfo = [
    'Information for Model 1: City Compact Car',
    'Information for Model 2: Heavy Off-Roader',
    'Information for Model 3: Nissan'
];

// Load each model and push to the models array
modelPaths.forEach((path, index) => {
    loader.load(path, function(gltf) {
        var model = gltf.scene;
        model.scale.set(0.5, 0.5, 0.5);  // Adjust size
        model.position.set(index * modelSpacing, 0, -5);  // Position models side by side
        scene.add(model);
        models.push(model);
        
        modelsLoaded++;
        
        // Set up the initial view once all models are loaded
        if (modelsLoaded === modelPaths.length) {
            // Only do the initial setup once
            if (!initialSetupDone) {
                initialSetup();
                initialSetupDone = true;
            }
        }
    }, undefined, function (error) {
        console.error('Error loading model:', error);
    });
});

camera.position.z = 7;

function initialSetup() {
    // Ensure camera is initially looking at the first model
    camera.lookAt(models[currentModelIndex].position);

    // Show the first model by default
    updateCarousel();
}

var moveInterval;  // Global variable to track the ongoing transition

// Function to smoothly transition between models
function updateCarousel() {
    if (models.length > 0) {
        var targetPosition = models[currentModelIndex].position;

        
        if (moveInterval) {
            clearInterval(moveInterval);
        }

        // Smooth camera movement
        moveInterval = setInterval(function() {
            if (Math.abs(camera.position.x - targetPosition.x) > 0.01) {
                camera.position.x += (targetPosition.x - camera.position.x) * transitionSpeed;
                camera.lookAt(models[currentModelIndex].position);
            } else {
                clearInterval(moveInterval);  
            }
        }, 16);  // 60fps
    }
}

// Button event handlers for next/previous model
document.getElementById('prevBtn').addEventListener('click', () => {
    currentModelIndex = (currentModelIndex - 1 + models.length) % models.length;
    updateCarousel();
});

document.getElementById('nextBtn').addEventListener('click', () => {
    currentModelIndex = (currentModelIndex + 1) % models.length;
    updateCarousel();
});

// Raycasting logic to detect clicks on models
function onMouseClick(event) {
    event.preventDefault();

    // Calculate mouse position in coordinates from (-1 to +1) for raycasting
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    // Check for intersections with models 
    var intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
        // Traverse up to find the root object (model) and match it with models array
        var clickedObject = intersects[0].object;

       
        while (clickedObject.parent && clickedObject.parent.type !== 'Scene') {
            clickedObject = clickedObject.parent;
        }

        // Find the clicked model by comparing the root nodes (the model scene root)
        var modelIndex = models.findIndex(model => model === clickedObject);

        if (modelIndex !== -1) {
            showPopup(modelIndex);  // Show the popup with the correct index
        }
    }
}

// Function to show the popup with the relevant model information
function showPopup(modelIndex) {
    document.getElementById("popup").style.display = "block";
    document.getElementById("product-info").innerText = modelInfo[modelIndex];
}

document.querySelector('.close').onclick = function() {
    document.getElementById("popup").style.display = "none";
};

// Attach mouse click event for raycasting
window.addEventListener('click', onMouseClick);

// Animation function
function animate() {
    requestAnimationFrame(animate);
 
    // Rotate each model slightly
  
    models.forEach(model => {
            model.rotation.y += 0.01;  // Adjust the speed of rotation
        });

    renderer.render(scene, camera);
}
animate();

// Resize handler
window.addEventListener('resize', function() {
    var width = window.innerWidth;
    var height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});
