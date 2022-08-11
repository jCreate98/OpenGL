function computerNormal(v1, v2, v3) {
	a = new Float32Array([ v2[0] - v1[0],
		       v2[1] - v1[1],
		       v2[2] - v1[2] ]);

	var a_size = Math.sqrt(a[0]*a[0] + a[1]*a[1] + a[2]*a[2]);

	b = new Float32Array([ v3[0] - v2[0],
		        v3[1] - v2[1],
		        v3[2] - v2[2] ]);

	var b_size = Math.sqrt(b[0]*b[0] + b[1]*b[1] + b[2]*b[2]);

	var dot = a_size * b_size;

	normal = new Float32Array([ (a[1]*b[2] - a[2]*b[1]) / dot, 
			      (a[2]*b[0] - a[0]*b[2]) / dot,
			      (a[0]*b[1] - a[1]*b[0]) / dot ]);
	
	return normal;
}

function main() {
	v1 = new Float32Array([ 1, 0, 0 ]);
	v2 = new Float32Array([ 0, 2, 0 ]);
	v3 = new Float32Array([ 0, 0, 3 ]);

	answer = new Float32Array(computerNormal(v1, v2, v3));

	console.log(answer[0]);
	console.log(answer[1]);
	console.log(answer[2]);
}