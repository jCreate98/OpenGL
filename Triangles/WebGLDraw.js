var VSHADER_SOURCE = 
	'uniform vec4 u_Transform;\n' +
	'uniform mat4 u_xformMatrix;\n' +
	'attribute vec4 a_Position;\n' +
	'void main() {\n' +
	' gl_Position = u_xformMatrix * a_Position + u_Transform;\n' +
	' gl_PointSize = 10.0;\n' +
	'}\n';

var FSHADER_SOURCE = 
	'void main() {\n' +
	' gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' +
	'}\n';

var myArray;
var canvas = document.getElementById('webgl');
var gl = canvas.getContext('webgl');
var u_Transform;
var u_xformMatrix;
var add = 0;
var objDraw;

function main() {
	if(!gl) {
		console.log('Failed to get the rendering context for WebGL');
		return;
	}

	canvas.onmousedown = function(event) {
		click(event, a_Position);
	};

	if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
		console.log('Failed to initialize shaders.');
		return;
	}

	u_Transform = gl.getUniformLocation(gl.program, 'u_Transform');
	u_xformMatrix = gl.getUniformLocation(gl.program, 'u_xformMatrix');

	objDraw = new Matrix4();
	gl.uniformMatrix4fv(u_xformMatrix, false, objDraw.elements);

	var a_Position = gl.getAttribLocation(gl.program, 'a_Position');

	gl.clearColor(0.8, 1.0, 0.9, 1.0);
	
	gl.clear(gl.COLOR_BUFFER_BIT);
}

function click(e, a_Position) {
	var x = e.clientX;
	var y = e.clientY;
	var rect = e.target.getBoundingClientRect();

	x = ((x - rect.left) - canvas.height/2)/(canvas.height/2);
	y = (canvas.width/2 - (y - rect.top))/(canvas.width/2);

	gl.clear(gl.COLOR_BUFFER_BIT);

	gl.vertexAttrib3f(a_Position, x, y, 0.0);

	myArray = new Float32Array([x, y, x - 0.3, y - 0.5, x + 0.3, y - 0.5]);	

	var vbuf = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vbuf);
	gl.bufferData(gl.ARRAY_BUFFER, myArray, gl.DYNAMIC_DRAW);
	gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(a_Position);

	gl.uniform4fv(u_Transform, [0.0, 0.0, 0.0, 0.0]);
	objDraw = new Matrix4();	

	gl.uniformMatrix4fv(u_xformMatrix, false, objDraw.elements);
	add = 0;

	gl.drawArrays(gl.TRIANGLES, 0, 3);
}

function move(e) {
	var interval = setInterval(function() {
		gl.uniform4fv(u_Transform, [0.02 * add, 0, 0, 0]);
		gl.clear(gl.COLOR_BUFFER_BIT);
		gl.drawArrays(gl.TRIANGLES, 0, 3);
		add = add+1;
	}, 100);
	
	setTimeout(function() {
		clearInterval(interval);
	}, 1000);
}

function rotate(e) {
	var interval = setInterval(function() {
		objDraw.rotate(1, 0, 0, 1);
		gl.uniformMatrix4fv(u_xformMatrix, false, objDraw.elements);
		gl.clear(gl.COLOR_BUFFER_BIT);
		gl.drawArrays(gl.TRIANGLES, 0, 3);
	}, 100);

	setTimeout(function() {
		clearInterval(interval);
	}, 1000);
}