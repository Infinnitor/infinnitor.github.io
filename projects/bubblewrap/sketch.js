class RgbColour {
	constructor(r, g, b) {
		this.r = r;
		this.g = g;
		this.b = b;

		this._correctSelf();
	}

	_correctSelf() {
		this.r = (this.r < 0) ? 0 : (this.r > 255) ? 255 : this.r;
		this.g = (this.g < 0) ? 0 : (this.g > 255) ? 255 : this.g;
		this.b = (this.b < 0) ? 0 : (this.b > 255) ? 255 : this.b;
	}

	toCssRgb() {
		return `rgb(${this.r}, ${this.g}, ${this.b})`;
	}

	toArray() {
		return [this.r, this.g, this.b]
	}

	shift(x) {
		this.r += x;
		this.g += x;
		this.b += x;

		this._correctSelf();

		return this;
	}

	lerp(other, rate) {
		return new RgbColour(
			this.r - ((this.r-other.r)*rate),
			this.g - ((this.g-other.g)*rate),
			this.b - ((this.b-other.b)*rate),
		);
	}
}


function setup() {
	// createCanvas(window.innerWidth, window.innerHeight);
	createCanvas(window.innerWidth, window.innerHeight);

	// createCanvas(800, 800);
	noStroke();
}


let simMove = {
	x: 0,
	y: 0,
	xvel: 0,
	yvel: 0,
	toggleFollow: true
}


function draw() {
	background(25, 25, 25);

	let longSide = (width > height) ? width : height;

	const rate = longSide/25;
	const bgCircleStroke = Math.floor(longSide/250);
	const minCircleSize = Math.floor(longSide/180);

	fill(125, 115, 210);

	// const c1 = new RgbColour(163, 50, 63);
	// const c2 = new RgbColour(56, 50, 163);

	const c1 = new RgbColour(230, 95, 106);
	const c2 = new RgbColour(106, 95, 230);

	let circles = [];
	let bgCircles = [];

	simX = simMove.x;
	simY = simMove.y;

	if (mouseIsPressed || simMove.toggleFollow) {
		simMove.xvel = (mouseX-simX)*0.1;
		simMove.yvel = (mouseY-simY)*0.1;
	}

	simMove.x += simMove.xvel;
	simMove.y += simMove.yvel;

	simMove.xvel *= 0.9;
	simMove.yvel *= 0.9;

	simMove.xvel = (Math.abs(simMove.xvel) < 1) ? 0 : simMove.xvel;
	simMove.yvel = (Math.abs(simMove.yvel) < 1) ? 0 : simMove.yvel;


	for (let y=rate; y<height-rate; y+=rate) {
		for (let x=rate; x<width-rate; x+=rate) {

			// fill(230, 65+(x/width)*110, 75+(x/width)*110);

			let radiusRate = (
				(Math.abs(simX-x)/width) + (Math.abs(simY-y)/width)
			) / 2;

			const xrate = x/width;
			const yrate = y/height;
			let avg = (xrate+yrate)/2;

			let radius = (rate*((1-radiusRate)**10))*2;
			radius = (radius < minCircleSize) ? minCircleSize : radius;

			circles.push([x, y, radius, c1.lerp(c2, avg).toArray()]);
			bgCircles.push([x, y, radius+bgCircleStroke, c1.lerp(c2, avg).shift(50).toArray()]);
		}
	}

	for (let c of bgCircles) {
		fill(...c[3]);
		circle(c[0], c[1], c[2]);
	}


	for (let c of circles) {
		fill(...c[3]);
		circle(c[0], c[1], c[2]);
	}
}


function mousePressed() {
	if (mouseButton == RIGHT) {
		simMove.toggleFollow = !simMove.toggleFollow;
	}
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}