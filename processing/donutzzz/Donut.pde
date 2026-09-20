class Donut {
  int pts = 40;
  float radius = 60.0;

  // lathe segments
  int segments = 60;
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

  // Icing covers the +Z half of the tube profile (the "top" of the ring).
  final float icingStart = -HALF_PI;
  final float icingEnd = HALF_PI;
  final float icingLift = 4.0;

  Sprinkle[] sprinkles;
  final int sprinkleCount = 90;

  Donut() {
    sprinkles = new Sprinkle[sprinkleCount];
    for (int i = 0; i < sprinkleCount; i++) {
      sprinkles[i] = makeSprinkle();
    }
  }

  Sprinkle makeSprinkle() {
    float tubeAngle = random(icingStart + 0.15, icingEnd - 0.15);
    float sweep = random(TWO_PI);
    float r = radius + icingLift + 1.5;
    float major = latheRadius + sin(tubeAngle) * r;
    PVector pos = new PVector(
      cos(sweep) * major,
      sin(sweep) * major,
      cos(tubeAngle) * r
    );
    PVector along = new PVector(
      sin(tubeAngle) * cos(sweep),
      sin(tubeAngle) * sin(sweep),
      -cos(tubeAngle)
    ).normalize();
    color c = sprinklePalette[int(random(sprinklePalette.length))];
    return new Sprinkle(pos, along, c, random(6, 11), random(1.6, 2.4));
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
      for (int j = 0; j <= icingPts; j++) {
        float t = j / float(icingPts);
        float tubeAngle = lerp(icingStart, icingEnd, t);
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
      PVector axis = s.along;
      float yaw = atan2(axis.y, axis.x);
      float pitch = -asin(constrain(axis.z, -1, 1));
      rotateZ(yaw);
      rotateY(pitch);
      rotateX(s.twirl);
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
  color fill;
  float len;
  float thick;
  float twirl;

  Sprinkle(PVector pos, PVector along, color fill, float len, float thick) {
    this.pos = pos;
    this.along = along;
    this.fill = fill;
    this.len = len;
    this.thick = thick;
    this.twirl = random(TWO_PI);
  }
}
