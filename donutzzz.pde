Donut[] donuts;
int maxDonuts = 1;
int totalDonuts = 0;

void setup(){
  size(displayWidth,displayHeight, P3D);
  donuts = new Donut[maxDonuts];
  donuts[0] = new Donut();
}

void draw(){
  background(50, 64, 42);
  setupLighting();
  setupCamera();
  int count = 0;
  while(count < totalDonuts){
    donuts[count].draw();
    count++;
  }
}

void setupCamera(){  
  float fov = PI/3.0;
  float cameraZ = (height/2.0)/tan(fov/2.0) * 2;
  
  perspective(fov, float(width)/float(height), 
              cameraZ/10.0, cameraZ*10.0);
}

void setupLighting(){
  //lights();
  ambientLight(128, 128, 128);
  directionalLight(128, 128, 128, 0, 0, -1);
  lightFalloff(1, 0, 0);
  lightSpecular(204, 204, 204);
  pointLight(128, 128, 128, 35, 20, 36);
}

void createDonuts(){
  if(totalDonuts < maxDonuts){
     donuts[totalDonuts] = new Donut();
     totalDonuts++;
  }
}
