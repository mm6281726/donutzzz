class Donut {
  int pts = 40; 
  float angle = 0;
  float radius = 60.0;

  // lathe segments
  int segments = 60;
  float latheAngle = 0;
  float latheRadius = 100.0;

  //vertices
  PVector vertices[], vertices2[];

  final color gold = color(212, 174, 55);
  
  void draw(){
    specular(51, 51, 51);       
    noStroke();    
    fill(gold);
    
    //center and spin toroid
    translate(width/2, height/2, -100);
  
    rotateX(frameCount*PI/150);
    rotateY(frameCount*PI/170);
    rotateZ(frameCount*PI/90);
  
    // initialize point arrays
    vertices = new PVector[pts+1];
    vertices2 = new PVector[pts+1];
  
    // fill arrays
    for(int i=0; i<=pts; i++){
      vertices[i] = new PVector();
      vertices2[i] = new PVector();
      vertices[i].x = latheRadius + sin(radians(angle))*radius;      
      vertices[i].z = cos(radians(angle))*radius;      
      angle+=360.0/pts;
    }
  
    // draw toroid
    latheAngle = 0;
    for(int i=0; i<=segments; i++){
      beginShape(QUAD_STRIP);
      for(int j=0; j<=pts; j++){
        if (i>0){
          vertex(vertices2[j].x, vertices2[j].y, vertices2[j].z);
        }
        vertices2[j].x = cos(radians(latheAngle))*vertices[j].x;
        vertices2[j].y = sin(radians(latheAngle))*vertices[j].x;
        vertices2[j].z = vertices[j].z;
        vertex(vertices2[j].x, vertices2[j].y, vertices2[j].z);
      } 
      
      latheAngle+=360.0/segments;      
      endShape();
    }
  }
}
