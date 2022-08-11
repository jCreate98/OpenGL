var VSHADER_SOURCE = 
	'attribute vec3 a_Position; \n' +
	'uniform mat4 u_ViewMatrix;\n' +
	'uniform mat4 u_ModelMatrix;\n' +
	'uniform mat4 u_ProjMatrix;\n' +
	'attribute vec3 Color; \n' +
	'varying vec3 vColor; \n' +
	'void main() { \n' +
	' gl_Position = u_ProjMatrix * u_ViewMatrix * u_ModelMatrix * vec4(a_Position, 1.0); \n' +
	' gl_PointSize = 10.0; \n' +
	' vColor = Color; \n' +
	'} \n';

var FSHADER_SOURCE = 'precision mediump float;' +
	'varying vec3 vColor; \n' +
	'void main() { \n' +
	' gl_FragColor = vec4(vColor, 1.0); \n' +
	'} \n';

var vertices = new Float32Array([
	11/2, 1/2, 1/2, 1, 1, 1,
	9/2, 1/2, 1/2, 1, 0, 1,
	9/2, -1/2, 1/2, 1, 0, 0,
	11/2, -1/2, 1/2, 1, 1, 0,
	11/2, -1/2, -1/2, 0, 1, 0,
	11/2, 1/2, -1/2, 0, 1, 1,
	9/2, 1/2, -1/2, 0, 0, 1,
	9/2, -1/2, -1/2, 0, 0, 0,
	
	-9/2, 1/2, 1/2, 1, 1, 1,
	-11/2, 1/2, 1/2, 1, 0, 1,
	-11/2, -1/2, 1/2, 1, 0, 0,
	-9/2, -1/2, 1/2, 1, 1, 0,
	-9/2, -1/2, -1/2, 0, 1, 0,
	-9/2, 1/2, -1/2, 0, 0, 1,
	-11/2, 1/2, -1/2, 0, 0, 1,
	-11/2, -1/2, -1/2, 0, 0, 0,
]);

var indices = new Uint8Array ([
	0, 1, 2, 0, 2, 3,
	0, 3, 4, 0, 4, 5,
	0, 5, 6, 0, 6, 1,
	1, 6, 7, 1, 7, 2,
	7, 4, 3, 7, 3, 2,
	4, 7, 6, 4, 6, 5,

	8, 9, 10, 8, 10, 11,
	8, 11, 12, 8, 12, 13,
	8, 13, 14, 8, 14, 9,
	9, 14, 15, 9, 15, 10,
	15, 12, 11, 15, 11, 10,
	12, 15, 14, 12, 14, 13
]);

var canvas = document.getElementById('webgl');
var gl = canvas.getContext('webgl');
var eye_x = 0.0, eye_y = 0.0, eye_z = 10.0;
var fov = 90;
var rot = 0;

var modelMatrix = new Matrix4();
var viewMatrix = new Matrix4();
var projMatrix = new Matrix4();

var u_ViewMatrix;
var u_ModelMatrix;
var u_ProjMatrix;

function checkKeyPressed(e) {
	if (e.charCode === 97) {
		rot -= 0.01;
		viewMatrix.setLookAt(eye_x, eye_y, eye_z, Math.sin(rot), 0, eye_z - Math.cos(rot), 0, 1, 0);
		gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
		gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_BYTE, 0);
	}
	if (e.charCode === 100) {
		rot += 0.01;
		viewMatrix.setLookAt(eye_x, eye_y, eye_z, Math.sin(rot), 0, eye_z - Math.cos(rot), 0, 1, 0);
		gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
		gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_BYTE, 0);
	}
	if (e.charCode === 115) {
		fov += 0.2;
		projMatrix.setPerspective(fov, (canvas.width)/(canvas.height), 1, 100);
		gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);
		gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_BYTE, 0);
	}
	if (e.charCode === 119) {
		fov -= 0.2;
		projMatrix.setPerspective(fov, (canvas.width)/(canvas.height), 1, 100);
		gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);
		gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_BYTE, 0);
	}
}

function main() {
	if(!gl) { return; }
	if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) { return; }

	window.addEventListener("keypress", checkKeyPressed, false);

	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

	var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
	var Color = gl.getAttribLocation(gl.program, 'Color');
	u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
	u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
	u_ProjMatrix = gl.getUniformLocation(gl.program, 'u_ProjMatrix');

	modelMatrix.setTranslate(0, 0, 0);
	viewMatrix.setLookAt(eye_x, eye_y, eye_z, 0, 0, 0, 0, 1, 0);
	projMatrix.setPerspective(fov, (canvas.width)/(canvas.height), 1, 100);
	gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
	gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
	gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);

	var vbuf = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vbuf);

	var indexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

	gl.clearColor(0.9, 0.9, 0.9, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, gl.false, 24, 0);
	gl.enableVertexAttribArray(a_Position);

	gl.vertexAttribPointer(Color, 3, gl.FLOAT, gl.false, 24, 12);
	gl.enableVertexAttribArray(Color);

	gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

	gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_BYTE, 0);
}
