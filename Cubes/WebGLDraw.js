var VSHADER_SOURCE = 
	'attribute vec3 a_Position; \n' +
	'attribute vec3 Color; \n' +
	'varying vec3 vColor; \n' +
	'void main() { \n' +
	' gl_Position = vec4(a_Position, 1.0); \n' +
	' gl_PointSize = 10.0; \n' +
	' vColor = Color; \n' +
	'} \n';

var FSHADER_SOURCE = 'precision mediump float;' +
	'varying vec3 vColor; \n' +
	'void main() { \n' +
	' gl_FragColor = vec4(vColor, 1.0); \n' +
	'} \n';

var vertices = new Float32Array([
	1/2, 1/2, 1/2, 1/2, 1/2, 1/2,
	-1/2, 1/2, 1/2, 1/2, 0, 1/2,
	-1/2, -1/2, 1/2, 1/2, 0, 0,
	1/2, -1/2, 1/2, 1/2, 1/2, 0,
	1/2, -1/2, -1/2, 0, 1/2, 0,
	1/2, 1/2, -1/2, 0, 1/2, 1/2,
	-1/2, 1/2, -1/2, 0, 0, 1/2,
	-1/2, -1/2, -1/2, 0, 0, 0
]);

var indices = new Uint8Array ([
	0, 1, 2, 0, 2, 3,
	0, 3, 4, 0, 4, 5,
	0, 5, 6, 0, 6, 1,
	1, 6, 7, 1, 7, 2,
	7, 4, 3, 7, 3, 2,
	4, 7, 6, 4, 6, 5,
]);

var canvas = document.getElementById('webgl');
var gl = canvas.getContext('webgl');

function main() {
	if(!gl) { return; }
	if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) { return; }

	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

	var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
	var Color = gl.getAttribLocation(gl.program, 'Color');

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
