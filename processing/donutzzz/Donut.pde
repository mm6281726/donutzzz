class Donut {
  int pts = 40;
  float radius = 60.0;

  // lathe segments
  int segments = 72;
  float latheRadius = 100.0;

  final color dough = color(212, 174, 55);
  final color icing = color(110, 45, 210);
  final color[] sprinklePalette = {
    color(255, 90, 120),
    color(255, 220, 70),
    color(90, 200, 255),
    color(255, 255, 255),
    color(70, 220, 140),
    color(255, 140, 60)
  };

  // Icing cap; edges wobble with smooth noise for uneven rounded drips.
  final float icingHalfBase = 0.48;
  final float icingEdgeWobble = 0.55;
  final float icingNoiseScale = 1.6;
  final float icingLift = 4.0;
  float icingSeedLeft;
  float icingSeedRight;

  Sprinkle[] sprinkles;
  final int sprinkleCount = 70;

  Donut() {
    icingSeedLeft = random(1000);
    icingSeedRight = random(1000);
    sprinkles = new Sprinkle[sprinkleCount];
    for (int i = 0; i < sprinkleCount; i++) {
      sprinkles[i] = makeSprinkle();
    }
  }

  // Local icing tube-angle range at a given lathe angle (radians).
  float[] icingBounds(float latheAngle) {
    float u = cos(latheAngle) * icingNoiseScale;
    float v = sin(latheAngle) * icingNoiseScale;
    float dripL =
      0.45 * noise(u + icingSeedLeft, v) +
      0.4 * noise(u * 2.4 + icingSeedLeft, v * 2.4) +
      0.35 * max(0, sin(latheAngle * 5.0 + icingSeedLeft)) +
      0.25 * max(0, sin(latheAngle * 2.3 + 1.7));
    float dripR =
      0.45 * noise(u + icingSeedRight, v + 40) +
      0.4 * noise(u * 2.4 + icingSeedRight, v * 2.4 + 40) +
      0.35 * max(0, sin(latheAngle * 4.0 - icingSeedRight)) +
      0.25 * max(0, sin(latheAngle * 2.7 + 0.4));
    float start = -icingHalfBase - icingEdgeWobble * constrain(dripL, 0, 1.4);
    float end = icingHalfBase + icingEdgeWobble * constrain(dripR, 0, 1.4);
    return new float[] { start, end };
  }

  Sprinkle makeSprinkle() {
    float sweep = random(TWO_PI);
    float[] bounds = icingBounds(sweep);
    float margin = 0.12;
    float tubeAngle = random(bounds[0] + margin, bounds[1] - margin);
    float r = radius + icingLift + 2.0;
    float major = latheRadius + sin(tubeAngle) * r;
    PVector pos = new PVector(
      cos(sweep) * major,
      sin(sweep) * major,
      cos(tubeAngle) * r
    );

    // Outward surface normal — do not align sprinkle length with this.
    PVector normal = new PVector(
      cos(sweep) * sin(tubeAngle),
      sin(sweep) * sin(tubeAngle),
      cos(tubeAngle)
    ).normalize();

    PVector toroidal = new PVector(-sin(sweep), cos(sweep), 0);
    PVector poloidal = new PVector(
      cos(sweep) * cos(tubeAngle),
      sin(sweep) * cos(tubeAngle),
      -sin(tubeAngle)
    ).normalize();

    float a = random(TWO_PI);
    PVector along = new PVector(
      toroidal.x * cos(a) + poloidal.x * sin(a),
      toroidal.y * cos(a) + poloidal.y * sin(a),
      toroidal.z * cos(a) + poloidal.z * sin(a)
    ).normalize();

    color c = sprinklePalette[int(random(sprinklePalette.length))];
    return new Sprinkle(pos, along, normal, c, random(18, 30), random(4.8, 7.2));
  }

  void draw() {
    pushMatrix();
    translate(width / 2.0, height / 2.0, -100);

    rotateX(frameCount * PI / 150);
    rotateY(frameCount * PI / 170);
    rotateZ(frameCount * PI / 90);

    drawBody();
    drawIcing();
    drawSprinkles();
    popMatrix();
  }

  void drawBody() {
    specular(51, 51, 51);
    noStroke();
    fill(dough);

    float latheAngle = 0;
    PVector[] prev = new PVector[pts + 1];
    PVector[] curr = new PVector[pts + 1];
    for (int j = 0; j <= pts; j++) {
      prev[j] = new PVector();
      curr[j] = new PVector();
    }

    for (int i = 0; i <= segments; i++) {
      for (int j = 0; j <= pts; j++) {
        float tubeAngle = j * (TWO_PI / pts);
        float px = latheRadius + sin(tubeAngle) * radius;
        float pz = cos(tubeAngle) * radius;
        curr[j].set(
          cos(radians(latheAngle)) * px,
          sin(radians(latheAngle)) * px,
          pz
        );
      }
      if (i > 0) {
        beginShape(QUAD_STRIP);
        for (int j = 0; j <= pts; j++) {
          vertex(prev[j].x, prev[j].y, prev[j].z);
          vertex(curr[j].x, curr[j].y, curr[j].z);
        }
        endShape();
      }
      for (int j = 0; j <= pts; j++) {
        prev[j].set(curr[j]);
      }
      latheAngle += 360.0 / segments;
    }
  }

  void drawIcing() {
    specular(180, 160, 220);
    noStroke();
    fill(icing);

    int icingPts = pts / 2;
    float latheAngle = 0;
    PVector[] prev = new PVector[icingPts + 1];
    PVector[] curr = new PVector[icingPts + 1];
    for (int j = 0; j <= icingPts; j++) {
      prev[j] = new PVector();
      curr[j] = new PVector();
    }

    for (int i = 0; i <= segments; i++) {
      float[] bounds = icingBounds(radians(latheAngle));
      for (int j = 0; j <= icingPts; j++) {
        float t = j / float(icingPts);
        float tubeAngle = lerp(bounds[0], bounds[1], t);
        float r = radius + icingLift;
        float px = latheRadius + sin(tubeAngle) * r;
        float pz = cos(tubeAngle) * r;
        curr[j].set(
          cos(radians(latheAngle)) * px,
          sin(radians(latheAngle)) * px,
          pz
        );
      }
      if (i > 0) {
        beginShape(QUAD_STRIP);
        for (int j = 0; j <= icingPts; j++) {
          vertex(prev[j].x, prev[j].y, prev[j].z);
          vertex(curr[j].x, curr[j].y, curr[j].z);
        }
        endShape();
      }
      for (int j = 0; j <= icingPts; j++) {
        prev[j].set(curr[j]);
      }
      latheAngle += 360.0 / segments;
    }
  }

  void drawSprinkles() {
    noStroke();
    for (int i = 0; i < sprinkles.length; i++) {
      Sprinkle s = sprinkles[i];
      pushMatrix();
      translate(s.pos.x, s.pos.y, s.pos.z);
      // Map box local +X → along (length), local +Y → normal (out of icing).
      PVector x = s.along;
      PVector z = x.cross(s.normal, null);
      if (z.magSq() < 1e-8) {
        z = x.cross(new PVector(0, 0, 1), null);
      }
      if (z.magSq() < 1e-8) {
        z = x.cross(new PVector(0, 1, 0), null);
      }
      z.normalize();
      PVector y = z.cross(x, null);
      y.normalize();
      applyMatrix(
        x.x, y.x, z.x, 0,
        x.y, y.y, z.y, 0,
        x.z, y.z, z.z, 0,
        0, 0, 0, 1
      );
      fill(s.fill);
      specular(40, 40, 40);
      box(s.len, s.thick, s.thick);
      popMatrix();
    }
  }
}

class Sprinkle {
  PVector pos;
  PVector along;
  PVector normal;
  color fill;
  float len;
  float thick;

  Sprinkle(PVector pos, PVector along, PVector normal, color fill, float len, float thick) {
    this.pos = pos;
    this.along = along;
    this.normal = normal;
    this.fill = fill;
    this.len = len;
    this.thick = thick;
  }
}
