let donuts = [];
const maxDonuts = 1;

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  canvas.parent("canvas-host");
  createDonuts();
}

function draw() {
  background(50, 64, 42);
  setupLighting();
  setupCamera();
  for (let i = 0; i < donuts.length; i++) {
    donuts[i].draw();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function setupCamera() {
  const fov = PI / 3.0;
  const cameraZ = (height / 2.0) / Math.tan(fov / 2.0) * 2;
  perspective(fov, width / height, cameraZ / 10.0, cameraZ * 10.0);
}

function setupLighting() {
  ambientLight(128, 128, 128);
  directionalLight(128, 128, 128, 0, 0, -1);
  pointLight(128, 128, 128, 35, 20, 36);
}

function createDonuts() {
  if (donuts.length < maxDonuts) {
    donuts.push(new Donut());
  }
}
