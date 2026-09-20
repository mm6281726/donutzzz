class Donut {
  constructor() {
    this.pts = 40;
    this.segments = 72;
    this.radius = 60;
    this.latheRadius = 100;
    this.icingLift = 4;
    // Smaller icing cap; edges wobble with smooth noise for uneven rounded drips.
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
  }

  // Local icing tube-angle range at a given lathe angle (radians).
  icingBounds(latheAngle) {
    const u = Math.cos(latheAngle) * this.icingNoiseScale;
    const v = Math.sin(latheAngle) * this.icingNoiseScale;
    // Soft lobes keep drips rounded rather than jagged.
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
    const start =
      -this.icingHalfBase - this.icingEdgeWobble * constrain(dripL, 0, 1.4);
    const end =
      this.icingHalfBase + this.icingEdgeWobble * constrain(dripR, 0, 1.4);
    return { start, end };
  }

  makeSprinkle() {
    const sweep = random(TWO_PI);
    const bounds = this.icingBounds(sweep);
    const margin = 0.12;
    const tubeAngle = random(bounds.start + margin, bounds.end - margin);
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
    ).normalize();
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

    this.drawBody();
    this.drawIcing();
    this.drawSprinkles();
    pop();
  }

  drawBody() {
    specularMaterial(51, 51, 51);
    noStroke();
    fill(this.dough);

    let latheAngle = 0;
    const prev = [];
    const curr = [];
    for (let j = 0; j <= this.pts; j++) {
      prev[j] = createVector();
      curr[j] = createVector();
    }

    for (let i = 0; i <= this.segments; i++) {
      for (let j = 0; j <= this.pts; j++) {
        const tubeAngle = (j / this.pts) * TWO_PI;
        const px = this.latheRadius + Math.sin(tubeAngle) * this.radius;
        const pz = Math.cos(tubeAngle) * this.radius;
        curr[j].set(
          Math.cos(latheAngle) * px,
          Math.sin(latheAngle) * px,
          pz
        );
      }
      if (i > 0) {
        beginShape(QUAD_STRIP);
        for (let j = 0; j <= this.pts; j++) {
          vertex(prev[j].x, prev[j].y, prev[j].z);
          vertex(curr[j].x, curr[j].y, curr[j].z);
        }
        endShape();
      }
      for (let j = 0; j <= this.pts; j++) {
        prev[j].set(curr[j]);
      }
      latheAngle += TWO_PI / this.segments;
    }
  }

  drawIcing() {
    specularMaterial(180, 160, 220);
    noStroke();
    fill(this.icing);

    const icingPts = Math.floor(this.pts / 2);
    let latheAngle = 0;
    const prev = [];
    const curr = [];
    for (let j = 0; j <= icingPts; j++) {
      prev[j] = createVector();
      curr[j] = createVector();
    }

    for (let i = 0; i <= this.segments; i++) {
      const bounds = this.icingBounds(latheAngle);
      for (let j = 0; j <= icingPts; j++) {
        const t = j / icingPts;
        const tubeAngle = lerp(bounds.start, bounds.end, t);
        const r = this.radius + this.icingLift;
        const px = this.latheRadius + Math.sin(tubeAngle) * r;
        const pz = Math.cos(tubeAngle) * r;
        curr[j].set(
          Math.cos(latheAngle) * px,
          Math.sin(latheAngle) * px,
          pz
        );
      }
      if (i > 0) {
        beginShape(QUAD_STRIP);
        for (let j = 0; j <= icingPts; j++) {
          vertex(prev[j].x, prev[j].y, prev[j].z);
          vertex(curr[j].x, curr[j].y, curr[j].z);
        }
        endShape();
      }
      for (let j = 0; j <= icingPts; j++) {
        prev[j].set(curr[j]);
      }
      latheAngle += TWO_PI / this.segments;
    }
  }

  drawSprinkles() {
    noStroke();
    for (const s of this.sprinkles) {
      push();
      translate(s.pos.x, s.pos.y, s.pos.z);
      const axis = s.along;
      const yaw = Math.atan2(axis.y, axis.x);
      const pitch = -Math.asin(constrain(axis.z, -1, 1));
      rotateZ(yaw);
      rotateY(pitch);
      rotateX(s.twirl);
      fill(s.fill);
      specularMaterial(40, 40, 40);
      box(s.len, s.thick, s.thick);
      pop();
    }
  }
}
