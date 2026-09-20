let donuts = [];
const maxDonuts = 1;
let webglOk = false;

function showWebglError(detail) {
  if (detail) console.error(detail);
  const el = document.getElementById("webgl-error");
  if (el) el.hidden = false;
  const host = document.getElementById("canvas-host");
  if (host) host.style.display = "none";
}

function tryCreateWebGLCanvas() {
  // Attempt 1: Chrome-friendly attributes (software GL allowed).
  try {
    setAttributes({
      alpha: true,
      depth: true,
      antialias: true,
      preserveDrawingBuffer: true,
      failIfMajorPerformanceCaveat: false,
    });
    const c = createCanvas(windowWidth, windowHeight, WEBGL);
    c.parent("canvas-host");
    return c;
  } catch (err) {
    console.warn("WebGL create attempt 1 failed", err);
  }

  // Attempt 2: default attributes only.
  try {
    setAttributes({
      alpha: true,
      depth: true,
      antialias: false,
      failIfMajorPerformanceCaveat: false,
    });
    const c = createCanvas(windowWidth, windowHeight, WEBGL);
    c.parent("canvas-host");
    return c;
  } catch (err) {
    console.warn("WebGL create attempt 2 failed", err);
  }

  return null;
}

function setup() {
  const density = typeof displayDensity === "function" ? displayDensity() : 1;
  pixelDensity(Math.min(Math.max(density, 1), 2));

  const canvas = tryCreateWebGLCanvas();
  if (!canvas) {
    showWebglError("createCanvas(WEBGL) failed");
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
    showWebglError(err);
    webglOk = false;
    noLoop();
  }
}
