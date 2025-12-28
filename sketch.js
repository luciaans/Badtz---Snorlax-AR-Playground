let capture;
let badtzModel, snorlaxModel;
let activeModel = null;

let objects = [];
let selectedIndex = -1;

let globalScale = 1.3;

let clickSound, bgmSound;
let volumeLevel = 0.5;
let musicStarted = false;

function preload() {
  badtzModel = loadModel('badtz.obj', true);
  snorlaxModel = loadModel('snorlax.obj', true);

  clickSound = loadSound('click.mp3');
  bgmSound = loadSound('bgm.mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);

  capture = createCapture(VIDEO);
  capture.size(640, 480);
  capture.hide();

  noStroke();
}

function draw() {
  push();
  translate(-width / 2, -height / 2);
  image(capture, 0, 0, width, height);
  pop();

  ambientLight(160);
  directionalLight(255, 255, 255, 0.3, 1, -0.4);

  for (let i = 0; i < objects.length; i++) {
    let obj = objects[i];

    push();
    let floatY = sin(frameCount * 0.03 + obj.phase) * 6;
    translate(obj.x, obj.y + floatY, 0);
    rotateX(PI);
    rotateY(frameCount * 0.01);
    scale(obj.scale);

    ambientMaterial(i === selectedIndex ? [255,80,80] : obj.color);
    model(obj.model);
    pop();
  }
}

function playClick() {
  if (clickSound?.isLoaded()) {
    clickSound.setVolume(volumeLevel);
    clickSound.play();
  }
}

function startMusic() {
  if (!musicStarted && bgmSound?.isLoaded()) {
    bgmSound.setVolume(volumeLevel);
    bgmSound.loop();
    musicStarted = true;
  }
}

function mousePressed() {
  playClick();
  startMusic();

  for (let i = objects.length - 1; i >= 0; i--) {
    let obj = objects[i];
    let d = dist(mouseX - width/2, mouseY - height/2, obj.x, obj.y);
    if (d < 80) {
      selectedIndex = i;
      return;
    }
  }

  if (!activeModel) return;

  objects.push({
    model: activeModel,
    x: mouseX - width/2,
    y: mouseY - height/2,
    phase: random(TWO_PI),
    scale: globalScale,
    color: activeModel === badtzModel ? [255,230,0] : [0,220,255]
  });

  selectedIndex = objects.length - 1;
}

function selectAsset(name) {
  playClick();
  startMusic();
  activeModel = (name === 'badtz') ? badtzModel : snorlaxModel;
}

function setScale(val) {
  globalScale = parseFloat(val);
  if (selectedIndex !== -1) objects[selectedIndex].scale = globalScale;
}

function setVolume(val) {
  volumeLevel = parseFloat(val);
  if (bgmSound?.isPlaying()) bgmSound.setVolume(volumeLevel);
}

function deleteSelected() {
  playClick();
  if (selectedIndex !== -1) {
    objects.splice(selectedIndex, 1);
    selectedIndex = -1;
  }
}

function resetAR() {
  playClick();
  objects = [];
  selectedIndex = -1;
  activeModel = null;
}

function takeSnapshot() {
  playClick();
  saveCanvas('snapshot', 'png');
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
