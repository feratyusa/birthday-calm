import * as THREE from "https://cdn.skypack.dev/three@0.135.0";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.135.0/examples/jsm/controls/OrbitControls.js";
import { FontLoader } from "https://cdn.skypack.dev/three@0.135.0/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "https://cdn.skypack.dev/three@0.135.0/examples/jsm/geometries/TextGeometry.js";

// Buttons
const buttons = document.getElementById("buttons");
const _no = document.getElementById("no");
_no.onclick = function no__(){
  controls.autoRotate = false;
  controls.rotateSpeed = 2.0;
  controls.autoRotateSpeed = 2.0;
  defaultState();
}

var rotateState = false;
const rotate = document.getElementById("rotate");
rotate.onclick = function rotateActive(){
  defaultState();
  rotateState = true;
}

var crazy_rotateState = false;
const crazy_rotate = document.getElementById("crazy-rotate");
crazy_rotate.onclick = function crazyAction(){
  defaultState();
  crazy_rotateState = true;
}

var brain_damageState = false;
const brain_damage = document.getElementById("brain-damage");
brain_damage.onclick = function brainAction(){
  if(!crazy_rotateState) defaultState();
  brain_damageState = true;
}

// canvas
const canvas = document.getElementById("c");

// scene and fog
const scene = new THREE.Scene();
scene.background = new THREE.Color("black");

// camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(0, 0, 60);

// Light
const lightB = new THREE.DirectionalLight(0xffffff, 1 );
lightB.position.set(0, 5, 40);

const lightF = new THREE.DirectionalLight(0xffffff, 1);
lightF.position.set(0, -5, -40);

// Light Helper
// const lightB_helper = new THREE.DirectionalLightHelper(lightB, 5, 0x0000ff);
// scene.add(lightB_helper);
// const lightF_helper = new THREE.DirectionalLightHelper(lightF, 5, 0x00ff00);
// scene.add(lightF_helper);

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.listenToKeyEvents(window);
controls.enableDampling = true;
controls.damplingFactor = 0.5;
controls.enableZoom = false;
controls.update();

// Text Geometry
const materials = [new THREE.MeshPhongMaterial({ color: new THREE.Color(0x1521ff) }), new THREE.MeshPhongMaterial({ color: new THREE.Color(0xff0000) })];

const loader = new FontLoader();


function loadText(x, y, z){
  loader.load("./fonts/Comforter_Regular.json", function (font) {
    const __top = "Happy Birthday, Rahma!";
    const top_geometry = new TextGeometry(__top, {
      font: font,
      size: 10,
      height: 4,
    });
    const topText = new THREE.Mesh(top_geometry, materials);
    topText.position.set(-50, 10, 0);
    scene.add(topText);

    // Bottom Text
    const __bottom = "Wish you All the Best!";
    const bottom_geometry = new TextGeometry(__bottom, {
      font: font,
      size: 8,
      height: 2,
    });
    const bottomText = new THREE.Mesh(bottom_geometry, materials);
    bottomText.position.set(-35, -10, 0);
    scene.add(bottomText);

    topText.rotation.x += x;
    topText.rotation.y += y;
    topText.rotation.z += z;
  });
}

// Audio
const listener = new THREE.AudioListener();
camera.add(listener);

let soundLights = new THREE.Audio(listener);
let loaderLights = new THREE.AudioLoader()
loaderLights.load(
  "./sounds/lights-on.mp3",
  function (res) {
    soundLights.setBuffer(res);
    soundLights.setVolume(0.5);
  }, 
  // onProgress callback
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },

  // onError callback
  function (err) {
    console.log("Un error ha ocurrido");
  }
);

// Functions
function defaultBackground() {
  const color = "pink";
  scene.background = new THREE.Color(color);
}

function addLights() {
  scene.add(lightB);
  scene.add(lightF);
}

function resizeRendererToDisplaySize(renderer) {
  const canvas = renderer.domElement;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
  }
  return needResize;
}

function defaultState() {
  rotateState = false;
  crazy_rotateState = false;
  brain_damageState = false;
  controls.reset();
  defaultBackground();
}

// MainLoop
var timer = 0;
var i = 0,
  maxI = 7;
var zoomin = 2;
const colors = [0xff5959, 0xff5959, 0xfff359, 0x5cff59, 0x59fff7, 0x5a59ff, 0xff59e6];
loadText(0,0,0);
const mainloop = function () {
  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }

  if(timer == 35){
    soundLights.play();
  }
  if(timer == 50){
    defaultBackground();
  }
  if(timer == 100){
    addLights();
  }
  if(timer == 150){
      lightB.intensity = 1;
      lightF.intensity = 1;
      buttons.style.display = "block";
  }
  if(timer <= 150) timer++;

  if(rotateState){
    controls.autoRotate = true;
    controls.autoRotateSpeed = 30.0;
  }
  if(crazy_rotateState){
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1000.0;
    controls.rotateSpeed = 1000.0;
  }
  if(brain_damageState){
    scene.background = new THREE.Color(colors[i++]);
    if(i == maxI) i = 0;
    camera.position.z += zoomin;
    zoomin *= -1;
  }

  renderer.render(scene, camera);
  controls.update();
  requestAnimationFrame(mainloop);
};

const startButton = document.getElementById("start");
startButton.onclick = function partyOn(){
  mainloop();  
  startButton.style.display = "none";
}