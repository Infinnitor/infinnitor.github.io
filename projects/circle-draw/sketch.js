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
		return new RgbColour(
			this.r + x,
			this.g + x,
			this.b + x
		);
	}

	lerp(other, rate) {
		return new RgbColour(
			this.r - ((this.r-other.r)*rate),
			this.g - ((this.g-other.g)*rate),
			this.b - ((this.b-other.b)*rate),
		);
	}
}

const drawCircles = [];
let longSide;
let rate;
const minSize = 10;
let maxSize;

let c1 = new RgbColour(163, 50, 63);
let c2 = new RgbColour(56, 50, 163);

function setup() {
	// createCanvas(window.innerWidth, window.innerHeight);
	createCanvas(window.innerWidth, window.innerHeight);

	// createCanvas(800, 800);
	noStroke();

	longSide = (width > height) ? width : height;
	rate = longSide/100;
	maxSize = rate*3;

	for (let y=rate; y<height-rate; y+=rate*2) {
		for (let x=rate; x<width-rate; x+=rate*2) {
			drawCircles.push({x: x, y: y, r: 10, c: c1.lerp(c2, (x/width + y/height)/2)});
		}
	}
}


let mouseControls = {
	left: false,
	right: false
}


function draw() {
	background(15, 15, 15);

	for (let c of drawCircles) {
		fill(...c.c.toArray());

		if (dist(mouseX, mouseY, c.x, c.y) < rate) {
			fill(...c.c.shift(50).toArray());

			if (mouseControls.left) {
				c.r += 5;
			}

			else if (mouseControls.right) {
				c.r -= 5;
			}

			c.r = (c.r < minSize) ? minSize : c.r;
			c.r = (c.r > maxSize) ? maxSize : c.r;
		}

		if (c.r != minSize) {

			circle(c.x, c.y, c.r);
		}

		else if (keyIsDown(32)) {
			fill(45, 45, 45);
			circle(c.x, c.y, c.r);
		}
	}

	fill(...c1.lerp(c2, (mouseX/width + mouseY/height)/2).toArray())
	circle(mouseX, mouseY, maxSize/2);

}


function mousePressed() {
	if (mouseButton == LEFT) {
		mouseControls.left = true;
	}

	if (mouseButton == RIGHT) {
		mouseControls.right = true;
	}
}


function mouseReleased() {
	if (mouseButton == LEFT) {
		mouseControls.left = false;
	}

	if (mouseButton == RIGHT) {
		mouseControls.right = false;
	}
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}