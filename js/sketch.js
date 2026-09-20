let donuts = [];
const maxDonuts = 1;
let webglOk = false;

function showWebglError() {
  const el = document.getElementById("webgl-error");
  if (el) el.hidden = false;
  const host = document.getElementById("canvas-host");
  if (host) host.style.display = "none";
}

function webglIsAvailable() {
  try {
    const canvas = document.createElement("canvas");
    // failIfMajorPerformanceCaveat:false lets Chrome software GL (SwiftShader) work
    // in VMs / remote desktops instead of failing the context.
    const attrs = {
      alpha: true,
      depth: true,
      antialias: true,
      failIfMajorPerformanceCaveat: false,
      powerPreference: "high-performance",
    };
    return !!(
      canvas.getContext("webgl", attrs) ||
      canvas.getContext("experimental-webgl", attrs) ||
      canvas.getContext("webgl2", attrs)
    );
  } catch (e) {
    return false;
  }
}

function setup() {
  if (!webglIsAvailable()) {
    showWebglError();
    noLoop();
    return;
  }

  // Must be called before createCanvas(WEBGL). Helps Chrome across GPU / SwiftShader.
  setAttributes("alpha", true);
  setAttributes("depth", true);
  setAttributes("antialias", true);
  setAttributes("premultipliedAlpha", true);
  setAttributes("preserveDrawingBuffer", true);
  setAttributes("perPixelLighting", true);
  setAttributes("failIfMajorPerformanceCaveat", false);

  // Cap density so high-DPI Chrome laptops stay smooth.
  const density = typeof displayDensity === "function" ? displayDensity() : 1;
  pixelDensity(Math.min(density, 2));

  let canvas;
  try {
    canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  } catch (err) {
    console.error("createCanvas(WEBGL) failed", err);
    showWebglError();
    noLoop();
    return;
  }

  canvas.parent("canvas-host");

  // Confirm the GL context actually exists (Chrome can throw later otherwise).
  const renderer = canvas._renderer;
  if (!renderer || !(renderer.GL || renderer.drawingContext)) {
    showWebglError();
    noLoop();
    return;
  }

  webglOk = true;
  createDonuts();
}

function draw() {
  if (!webglOk) return;

  background(50, 64, 42);
  setupLighting();
  setupCamera();
  for (let i = 0; i < donuts.length; i++) {
    donuts[i].draw();
  }
}

function windowResized() {
  if (!webglOk) return;
  resizeCanvas(windowWidth, windowHeight);
}

function setupCamera() {
  const fov = PI / 3.0;
  const cameraZ = ((height / 2.0) / Math.tan(fov / 2.0)) * 2;
  const aspect = height === 0 ? 1 : width / height;
  perspective(fov, aspect, Math.max(cameraZ / 10.0, 1), cameraZ * 10.0);
}

function setupLighting() {
  ambientLight(128, 128, 128);
  directionalLight(140, 140, 140, 0.35, 0.4, -1);
  pointLight(120, 120, 120, 80, -40, 120);
}

function createDonuts() {
  try {
    if (donuts.length < maxDonuts) {
      donuts.push(new Donut());
    }
  } catch (err) {
    console.error("Donut setup failed", err);
    showWebglError();
    webglOk = false;
    noLoop();
  }
}
