function start() {

    // Get canvas, WebGL context
    var canvas = document.getElementById("myCanvas");
    var gl = canvas.getContext("webgl");

    // Initializing slider values
    var slider1 = document.getElementById('slider1');
    slider1.value = -15;
    var slider2 = document.getElementById('slider2');
    slider2.value = 0;
    var slider3 = document.getElementById('slider3');
    slider3.value = 0;
    var slider4 = document.getElementById('slider4');
    slider4.value = 110;
    var checkbox1 = document.getElementById('checkbox1');

    // Initialing checkbox to off
    var funLight;
    if(checkbox1.checked) {
        funLight = 1;
    } else {
        funLight = 0;
    }

    // Read shader source
    var vertexSource = document.getElementById("vertexShader").text;
    var fragmentSource = document.getElementById("fragmentShader").text;

    // Compile vertex shader
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader,vertexSource);
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
	alert(gl.getShaderInfoLog(vertexShader)); return null; }
    
    // Compile fragment shader
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader,fragmentSource);
    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
	alert(gl.getShaderInfoLog(fragmentShader)); return null; }
    
    // Attach the shaders and link
    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
	alert("Could not initialize shaders"); }
    gl.useProgram(shaderProgram);	    
    
    // Passing vertex positions to the vertex shader attribute
    shaderProgram.PositionAttribute = gl.getAttribLocation(shaderProgram, "vPosition");
    gl.enableVertexAttribArray(shaderProgram.PositionAttribute);
    
    // Passing vertex colors to the vertex shader attribute
    shaderProgram.ColorAttribute = gl.getAttribLocation(shaderProgram, "vColor");
    gl.enableVertexAttribArray(shaderProgram.ColorAttribute);   
    
    // Passing vertex normals to the vertex shader attribute
    shaderProgram.NormalAttribute = gl.getAttribLocation(shaderProgram, "normal");
    gl.enableVertexAttribArray(shaderProgram.NormalAttribute);
    
    // this gives us access to the matrix uniform
    shaderProgram.MVPmatrix = gl.getUniformLocation(shaderProgram,"uMVP");

    // Getting access to the sliders and checkbox uniforms in the fragment shader
    shaderProgram.diffuseValue = gl.getUniformLocation(shaderProgram,"sliderVal1");
    shaderProgram.discardValue = gl.getUniformLocation(shaderProgram,"sliderVal2");
    shaderProgram.boxValue = gl.getUniformLocation(shaderProgram,"checkboxVal");
    

    // Data ...

    var offset = 0.3;
    
    // vertex positions
    var vertexPos = new Float32Array(
        [  // front side of duck positions
           0.0, 0.0, 0.0,    0.3, 0.1, -0.05,  -0.1,0.3,-0.1,    -0.6,0.35, -0.1,
           0.2, -0.4, 0.2,   0.8,-0.3, 0.1,     1,-0.25,0,        0.9, 0.1,0,
           0.7, 0.12, -0.1,  0.95, 0.4,-0.15,   0.97, -0.7,0.2,   0.75, -0.85, 0.2,
           0.6, -0.8, 0.3,   0.1,-1, 0.2,      -0.2,-0.8,0.3,    -0.57,-0.9, 0.3,
          -0.59,-0.45,0.3,  -0.75,-0.85,0.15,  -0.9,-0.5, 0.1,   -0.74,-0.42, 0.2,
          -0.85,-0.3,0.1,   -0.8,0.1,0,        -0.7, 0.2,-0.05,   -0.65, 0.7,0,
          -0.3,0.65,0,      -0.05, 0.4,-0.1,  -0.08, 0.75,-0.1, -0.3, 0.95, -0.1,
          -0.5, 1, -0.1,    -0.67, 0.97,-0.1,  -0.75, 0.85,-0.1, -0.82, 0.67, -0.1,
          -0.85, 0.5, -0.1, -0.83, 0.7,-0.1,   -0.95, 0.64, -0.1,

          // reflect duck over z axis + an offset to get back side of duck positions
           0.0, 0.0, 0.0    - offset,   0.3, 0.1, 0.05    - offset,   -0.1,0.3,0.1      - offset,  -0.6,0.35, 0.1       - offset,
           0.2, -0.4, -0.2  - offset,   0.8,-0.3, -0.1    - offset,    1,-0.25,0        - offset,   0.9, 0.1,0          - offset,
           0.7, 0.12, 0.1   - offset,   0.95, 0.4,0.15    - offset,    0.97,-0.7,-0.2   - offset,   0.75, -0.85, -0.2   - offset,
           0.6, -0.8, -0.3  - offset,   0.1,-1, -0.2      - offset,   -0.2,-0.8,-0.3    - offset,  -0.57,-0.9, -0.3     - offset,
          -0.59,-0.45,-0.3  - offset,  -0.75,-0.85,-0.15  - offset,   -0.9,-0.5, -0.1   - offset,  -0.74,-0.42, -0.2    - offset,
          -0.85,-0.3,-0.1   - offset,  -0.8,0.1,0         - offset,   -0.7, 0.2,0.05     - offset,  -0.65, 0.7,0         - offset,
          -0.3,0.65,0       - offset,  -0.05, 0.4,0.1     - offset,   -0.08, 0.75,0.    - offset,  -0.3, 0.95, 0.1      - offset,
          -0.5, 1, 0.1      - offset,  -0.67, 0.97,0.1    - offset,   -0.75, 0.85,0.1   - offset,  -0.82, 0.67, 0.1     - offset,
          -0.85, 0.5, 0.1   - offset,  -0.83, 0.7,0.1     - offset,   -0.95, 0.64, 0.1  - offset,
           
           // eye positions
           -0.7,0.75,0,    -0.7,0.65,0,    -0.6,0.75,0,       -0.6,0.65,0,
           -0.7,0.75,0 - offset,   -0.7,0.65,0 - offset,   -0.6,0.75,0 - offset,      -0.6,0.65,0 - offset ]);

    // vertex colors
    var vertexColors = new Float32Array(
        [  // front + back of duck have various shades of yellow
           1, 0.6, 0,   1, 0.7, 0,   1, 0.5, 0,   1, 0.7, 0,
           1, 0.9, 0,   1, 0.7, 0,   1, 0.7, 0,   1, 0.8, 0,
           1, 0.5, 0,   1, 0.6, 0,   1, 0.6, 0,   1, 0.6, 0,
           1, 0.6, 0,   1, 0.6, 0,   1, 0.8, 0,   1, 0.6, 0,
           1, 0.9, 0,   1, 0.6, 0,   1, 0.6, 0,   1, 0.8, 0,
           1, 0.6, 0,   1, 0.7, 0,   1, 0.65, 0,   1, 0.8, 0,
           1, 0.7, 0,   1, 0.6, 0,   1, 0.7, 0,   1, 0.7, 0, 
           1, 0.8, 0,   1, 0.8, 0,   1, 0.8, 0,   1, 0.9, 0,
           1, 0.8, 0,   1, 0, 0,     1, 0, 0,
        
           1, 0.6, 0,   1, 0.7, 0,   1, 0.5, 0,   1, 0.7, 0,
           1, 0.9, 0,   1, 0.7, 0,   1, 0.7, 0,   1, 0.8, 0,
           1, 0.5, 0,   1, 0.6, 0,   1, 0.6, 0,   1, 0.6, 0,
           1, 0.6, 0,   1, 0.6, 0,   1, 0.8, 0,   1, 0.6, 0,
           1, 0.9, 0,   1, 0.6, 0,   1, 0.6, 0,   1, 0.8, 0,
           1, 0.6, 0,   1, 0.7, 0,   1, 0.65, 0,   1, 0.8, 0,
           1, 0.7, 0,   1, 0.6, 0,   1, 0.7, 0,   1, 0.7, 0, 
           1, 0.8, 0,   1, 0.8, 0,   1, 0.8, 0,   1, 0.9, 0,
           1, 0.8, 0,   1, 0, 0,     1, 0, 0,
        
           // black eyes
           0,0,0,  0,0,0,  0,0,0,  0,0,0,
           0,0,0,  0,0,0,  0,0,0,  0,0,0]);
    
    // element index array
    var triangleIndices = new Uint8Array(
        [  0,1,2,     0,2,3,    // front of duck triangles
           0,1,4,     1,4,5,    
           5,6,7,     5,7,8,    
           1,5,8,     8,9,7,    
           9,7,6,     5,6,10,    
	   10,11,12,  5,12,10, 
           11,12,13,  12,13,14,
           4,12,14,   13,14,15,
           4,14,16,   14,15,16,
           4,5,12,    15,16,17,
           16,17,19,  17,18,19,
           18,19,20,  19,20,21,
           16,19,21,  3,16,21,
           0,3,16,    0,4,16,
           3,21,22,   3,23,22,
           3,24,2,    3,23,24,
           2,24,25,   24,25,26,
           27,26,24,  23,24,27,
           23,27,28,  23,28,29,
           30,23,29,  30,23,22,
           22,30,31,  32,31,22,
           30,31,33,  31,33,34,
           31,34,32,

           35,36,37,      35,37,38,    // back of duck triangles
           35,36,39,      36,39,40,    
           40,41,42,      40,42,43,    
           36,40,43,      43,44,42,    
           44,42,41,      40,41,45,    
	   45,46,47,      40,47,45, 
           46,47,48,      47,48,49,
           39,47,49,      48,49,50,
           39,49,51,      49,50,51,
           39,40,47,      50,51,52,
           51,52,54,      52,53,54,
           53,54,55,      54,55,56,
           51,54,56,      38,51,56,
           35,38,51,      35,39,51,
           38,56,57,      38,58,57,
           38,59,37,      38,58,59,
           37,59,60,      59,60,61,
           62,61,59,      58,59,62,
           58,62,63,      58,63,64,
           65,58,64,      65,58,57,
           57,65,66,      67,66,57,
           65,66,68,      66,68,69,
           66,69,67,
           
           10,6,45,       6,41,45,  // connecting both sides of duck 
           6,9,41,        9,41,44,
           9,8,44,        8,44,43,
           1,8,43,        1,43,36,
           1,2,36,        2,36,37,
           2,25,37,       25,37,60,
           25,26,60,      26,60,61,
           26,27,61,      27,61,62,
           27,28,62,      28,62,63,
           28,29,63,      29,63,64,
           29,30,64,      30,64,65,
           30,33,65,      33,65,68,
           33,34,68,      34,68,69,
           34,32,69,      32,69,67,
           32,22,67,      22,67,57,
           22,21,57,      21,57,56,
           21,20,56,      20,56,55,
           20,18,55,      18,55,53,
           18,17,53,      17,53,52,
           17,15,52,      15,52,50,
           15,13,50,      13,50,48,
           13,11,48,      11,48,46,
           11,10,46,      10,46,45,

           70,71,72,      71,72,73, // eyes of the duck
           74,75,76,      75,76,77
        ]); 

    // vertex normals
    var vertexNormal = new Float32Array(
        [  0.0, 0.0, 0.7,    0.0, 1.0, 0.4,     1.0, 1.0, 0.7,    0.0, 0.0, 1.0,   // 0 - 3
           0.0, 0.0, 1.0,    0.0, 0.0, 1.0,     1.0, 0.0, 0.5,    0.0, 0.0, 1.0,   // 4 - 7
           0.0, 1.0, 0.5,    0.0, 1.0, 0.5,     0.0, 0.0, 0.5,    0.0, 0.0, 0.5,   // 8 - 11
           0.0, 0.0, 1.0,    0.0, 0.0, 0.5,     0.0, 0.0, 1.0,    0.0, 0.0, 0.6,   // 12 - 15
           0.0, 0.0, 1.0,    0.0, 0.0, 0.7,     0.0, 0.0, 0.7,    0.0, 0.0, 1.0,   // 16 - 19
           0.0, 0.0, 0.7,    0.0, 0.0, 0.7,     0.0, 0.0, 1.0,    0.0, 0.5, 1.0,   // 20 - 23
           0.0, 0.0, 1.0,    0.5, 1.0, 0.5,     0.0, 1.0, 0.5,    0.0, 1.0, 0.5,   // 24 - 27
           0.0, 1.0, 0.6,    0.0, 1.0, 0.5,     -0.5, 1.0, 0.7,   0.0, 0.0, 1.0,  // 28 - 31
           0.0, 0.0, 0.6,    -0.2, 1.0,0.5,     0.0, 1.0, 0.5,                    // 32 - 34

           0.0, 0.0, -0.7,    0.0, 1.0, -0.4,     1.0, 1.0, -0.7,    0.0, 0.0, -1.0,   // 0 - 3
           0.0, 0.0, -1.0,    0.0, 0.0, -1.0,     1.0, 0.0, -0.5,    0.0, 0.0, -1.0,   // 4 - 7
           0.0, 1.0, -0.5,    0.0, 1.0, -0.5,     0.0, 0.0, -0.5,    0.0, 0.0, -0.5,   // 8 - 11
           0.0, 0.0, -1.0,    0.0, 0.0, -0.5,     0.0, 0.0, -1.0,    0.0, 0.0, -0.6,   // 12 - 15
           0.0, 0.0, -1.0,    0.0, 0.0, -0.7,     0.0, 0.0, -0.7,    0.0, 0.0, -1.0,   // 16 - 19
           0.0, 0.0, -0.7,    0.0, 0.0, -0.7,     0.0, 0.0, -1.0,    0.0, 0.5, -1.0,   // 20 - 23
           0.0, 0.0, -1.0,    0.5, 1.0, -0.5,     0.0, 1.0, -0.5,    0.0, 1.0, -0.5,   // 24 - 27
           0.0, 1.0, -0.6,    0.0, 1.0, -0.5,     -0.5, 1.0, -0.7,   0.0, 0.0, -1.0,  // 28 - 31
           0.0, 0.0, -0.6,    -0.2, 1.0,-0.5,     0.0, 1.0, -0.5,                    // 32 - 34

           
           0.0, 0.0, 0.0,    0.0, 0.0, 0.0,     0.0, 0.0, 0.0,    0.0, 0.0, 0.0,
           0.0, 0.0, 0.0,    0.0, 0.0, 0.0,     0.0, 0.0, 0.0,    0.0, 0.0, 0.0 ]);


    // we need to put the vertices into a buffer so we can
    // block transfer them to the graphics hardware
    var trianglePosBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, trianglePosBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertexPos, gl.STATIC_DRAW);
    trianglePosBuffer.itemSize = 3;
    trianglePosBuffer.numItems = 78;
    
    // a buffer for colors
    var colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertexColors, gl.STATIC_DRAW);
    colorBuffer.itemSize = 3;
    colorBuffer.numItems = 78;

    // a buffer for indices
    var indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, triangleIndices, gl.STATIC_DRAW);    

    // a buffer for normals
    var triangleNormalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertexNormal, gl.STATIC_DRAW);
    triangleNormalBuffer.itemSize = 3;
    triangleNormalBuffer.numItems = 78;

    // Scene (re-)draw routine
    function draw() {
	
        // Translate slider values to angles in the [-pi,pi] interval
        var angle1 = slider1.value*0.01*Math.PI;

        // Storing light and pixel limit values as a vectors
        var lightAmt = vec3.create();
        lightAmt = [slider2.value / 100,0,0];

        var pixelLimit = vec3.create();
        pixelLimit = [slider4.value / 100,0,0];
	
        // Circle in xz plane
        var eye = [400*Math.sin(angle1),150.0,400.0*Math.cos(angle1)];
        var target = [0,0,0];
        var up = [0,1,0];
	
        // Sin fn in xy plane
        var angle2 = slider3.value*0.01*Math.PI;
        var tModel = mat4.create();
        mat4.fromScaling(tModel,[100,100,100]);
        mat4.translate(tModel,tModel,[slider3.value * 0.025,0.35*Math.sin(angle2 * 2),0 ]);
	
        var tCamera = mat4.create();
        mat4.lookAt(tCamera, eye, target, up);      

        var tProjection = mat4.create();
        mat4.perspective(tProjection,Math.PI/4,1,10,1000);
	
        var tMVP = mat4.create();
        mat4.multiply(tMVP,tCamera,tModel); // "modelView" matrix
        mat4.multiply(tMVP,tProjection,tMVP);
	
        // Clear screen, prepare for rendering
        // Draw background with a blue color
        gl.clearColor(0.0, 0.4, 0.7, 1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
        // Set up uniforms & attributes
        gl.uniformMatrix4fv(shaderProgram.MVPmatrix,false,tMVP);
        gl.uniform3fv(shaderProgram.diffuseValue,lightAmt);
        gl.uniform3fv(shaderProgram.discardValue,pixelLimit);

        gl.uniform1i(shaderProgram.boxValue,funLight);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.vertexAttribPointer(shaderProgram.ColorAttribute, colorBuffer.itemSize,
			       gl.FLOAT,false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, trianglePosBuffer);
        gl.vertexAttribPointer(shaderProgram.PositionAttribute, trianglePosBuffer.itemSize,
			       gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, triangleNormalBuffer);
        gl.vertexAttribPointer(shaderProgram.NormalAttribute, triangleNormalBuffer.itemSize,
			       gl.FLOAT, false, 0, 0);

	// Do the drawing
        gl.drawElements(gl.TRIANGLES, triangleIndices.length, gl.UNSIGNED_BYTE, 0);

    }

    // Updates for the sliders and checkbox
    slider1.addEventListener("input",draw);
    slider2.addEventListener("input",draw);
    slider3.addEventListener("input",draw);
    slider4.addEventListener("input",draw);

    checkbox1.addEventListener("change", function () {
        if (this.checked) {
            funLight = 1;
            draw();
        } else {
            funLight = 0;
            draw();
        }
    });

    draw();
}

window.onload=start;
