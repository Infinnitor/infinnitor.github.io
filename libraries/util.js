function randInt(a, b) {
	return Math.floor(Math.random() * (b+1 - a) + a);
}


function randChoice(x) {
	return x[0, x.length-1];
}


function distance(p, q) {
	return Math.sqrt((p[0] - q[0])**2 + (p[1] - q[1])**2);
}


function distanceObj(p, q) {
	return distance([p.x, p.y], [q.x, q.y]);
}



function lerpValues(a, b, v) {
	v = (v > 1.0) ? 1.0 : (v < 0) ? 0 : v;
	return ((b-a)*v)+a;
}


class NoiseMap {
	constructor(w, h, rate=1) {
		this.w = w;
		this.h = h;

		this.mapPoints = [];
		for (let y=0; y<this.h; y++) {
			let mp = [];
			for (let x=0; x<this.w; x++) {
				mp.push([Math.random()*rate]);
			}
			this.mapPoints.push(mp);
		}
	}

	forEachPosition(callback) {
		for (let y=0; y<this.h; y++) {
			for (let x=0; x<this.w; x++) {
				callback(x, y, this.mapPoints[y][x]);
			}
		}
	}

	map(callback) {
		this.forEachPosition(function(x, y, value) {
			this.mapPoints[y][x] = callback(value);
		});
	}
}
