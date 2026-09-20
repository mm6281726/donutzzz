/**
 * Browser-hardened WebGL donut for Chrome / Firefox / Safari / Edge.
 * Uses TRIANGLE_STRIP + buildGeometry so meshes work reliably across WebGL1.
 */
class Donut {
  constructor() {
    this.pts = 40;
    this.segments = 72;
    this.radius = 60;
    this.latheRadius = 100;
    this.icingLift = 4;
    this.icingHalfBase = 0.34;
    this.icingEdgeWobble = 0.55;
    this.icingNoiseScale = 1.6;
    this.icingSeedLeft = random(1000);
    this.icingSeedRight = random(1000);
    this.dough = color(212, 174, 55);
    this.icing = color(110, 45, 210);
    this.sprinklePalette = [
      color(255, 90, 120),
      color(255, 220, 70),
      color(90, 200, 255),
      color(255, 255, 255),
      color(70, 220, 140),
      color(255, 140, 60),
    ];
    this.sprinkles = [];
    for (let i = 0; i < 70; i++) {
      this.sprinkles.push(this.makeSprinkle());
    }

    // Bake static meshes once — avoids per-frame beginShape cost and Chrome jank.
    this.bodyGeo = buildGeometry(() => this.drawBodyMesh());
    this.icingGeo = buildGeometry(() => this.drawIcingMesh());
    this.sprinkleGeo = buildGeometry(() => this.drawSprinkleMeshes());
  }

  icingBounds(latheAngle) {
    const u = Math.cos(latheAngle) * this.icingNoiseScale;
    const v = Math.sin(latheAngle) * this.icingNoiseScale;
    const dripL =
      0.45 * noise(u + this.icingSeedLeft, v) +
      0.4 * noise(u * 2.4 + this.icingSeedLeft, v * 2.4) +
      0.35 * Math.max(0, Math.sin(latheAngle * 5.0 + this.icingSeedLeft)) +
      0.25 * Math.max(0, Math.sin(latheAngle * 2.3 + 1.7));
    const dripR =
      0.45 * noise(u + this.icingSeedRight, v + 40) +
      0.4 * noise(u * 2.4 + this.icingSeedRight, v * 2.4 + 40) +
      0.35 * Math.max(0, Math.sin(latheAngle * 4.0 - this.icingSeedRight)) +
      0.25 * Math.max(0, Math.sin(latheAngle * 2.7 + 0.4));
    return {
      start: -this.icingHalfBase - this.icingEdgeWobble * constrain(dripL, 0, 1.4),
      end: this.icingHalfBase + this.icingEdgeWobble * constrain(dripR, 0, 1.4),
    };
  }

  makeSprinkle() {
    const sweep = random(TWO_PI);
    const bounds = this.icingBounds(sweep);
    const margin = 0.12;
    const lo = bounds.start + margin;
    const hi = bounds.end - margin;
    const tubeAngle = lo < hi ? random(lo, hi) : (bounds.start + bounds.end) * 0.5;
    const r = this.radius + this.icingLift + 2.0;
    const major = this.latheRadius + Math.sin(tubeAngle) * r;
    const pos = createVector(
      Math.cos(sweep) * major,
      Math.sin(sweep) * major,
      Math.cos(tubeAngle) * r
    );
    const along = createVector(
      Math.sin(tubeAngle) * Math.cos(sweep),
      Math.sin(tubeAngle) * Math.sin(sweep),
      -Math.cos(tubeAngle)
    );
    if (along.magSq() > 0) along.normalize();
    return {
      pos,
      along,
      fill: random(this.sprinklePalette),
      len: random(18, 30),
      thick: random(4.8, 7.2),
      twirl: random(TWO_PI),
    };
  }

  draw() {
    push();
    translate(0, 0, -100);
    rotateX((frameCount * PI) / 150);
    rotateY((frameCount * PI) / 170);
    rotateZ((frameCount * PI) / 90);

    noStroke();

    ambientMaterial(this.dough);
    specularMaterial(60, 60, 60);
    shininess(18);
    fill(this.dough);
    model(this.bodyGeo);

    ambientMaterial(this.icing);
    specularMaterial(200, 180, 240);
    shininess(40);
    fill(this.icing);
    model(this.icingGeo);

    // Sprinkles are already colored inside the baked geometry.
    shininess(12);
    model(this.sprinkleGeo);

    pop();
  }

  // WebGL-native strip topology (Chrome / all browsers).
  emitStripRing(getPoint, count) {
    const prev = new Array(count + 1);
    const curr = new Array(count + 1);
    for (let j = 0; j <= count; j++) {
      prev[j] = createVector();
      curr[j] = createVector();
    }

    let latheAngle = 0;
    for (let i = 0; i <= this.segments; i++) {
      for (let j = 0; j <= count; j++) {
        const p = getPoint(latheAngle, j / count);
        curr[j].set(p.x, p.y, p.z);
      }
      if (i > 0) {
        beginShape(TRIANGLE_STRIP);
        for (let j = 0; j <= count; j++) {
          vertex(prev[j].x, prev[j].y, prev[j].z);
          vertex(curr[j].x, curr[j].y, curr[j].z);
        }
        endShape();
      }
      for (let j = 0; j <= count; j++) {
        prev[j].set(curr[j]);
      }
      latheAngle += TWO_PI / this.segments;
    }
  }

  drawBodyMesh() {
    noStroke();
    fill(this.dough);
    this.emitStripRing((latheAngle, t) => {
      const tubeAngle = t * TWO_PI;
      const px = this.latheRadius + Math.sin(tubeAngle) * this.radius;
      const pz = Math.cos(tubeAngle) * this.radius;
      return createVector(
        Math.cos(latheAngle) * px,
        Math.sin(latheAngle) * px,
        pz
      );
    }, this.pts);
  }

  drawIcingMesh() {
    noStroke();
    fill(this.icing);
    const icingPts = Math.floor(this.pts / 2);
    this.emitStripRing((latheAngle, t) => {
      const bounds = this.icingBounds(latheAngle);
      const tubeAngle = lerp(bounds.start, bounds.end, t);
      const r = this.radius + this.icingLift;
      const px = this.latheRadius + Math.sin(tubeAngle) * r;
      const pz = Math.cos(tubeAngle) * r;
      return createVector(
        Math.cos(latheAngle) * px,
        Math.sin(latheAngle) * px,
        pz
      );
    }, icingPts);
  }

  drawSprinkleMeshes() {
    noStroke();
    for (const s of this.sprinkles) {
      push();
      translate(s.pos.x, s.pos.y, s.pos.z);
      const axis = s.along;
      const yaw = Math.atan2(axis.y, axis.x);
      const zClamped = constrain(axis.z, -1, 1);
      const pitch = -Math.asin(zClamped);
      rotateZ(yaw);
      rotateY(pitch);
      rotateX(s.twirl);
      fill(s.fill);
      box(s.len, s.thick, s.thick);
      pop();
    }
  }
}
