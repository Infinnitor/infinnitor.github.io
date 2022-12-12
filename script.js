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

	shift(x) {
		this.r += x;
		this.g += x;
		this.b += x;

		this._correctSelf();

		return this;
	}

	add(other) {
		return new RgbColour(
			this.r + other.r,
			this.g + other.g,
			this.b + other.b
		);
	}

	subtract(other) {
		return new RgbColour(
			this.r - other.r,
			this.g - other.g,
			this.b - other.b
		);
	}


	lerp(other, rate) {
		rate = (rate > 1.0) ? 1.0 : (rate < 0) ? 0 : rate;

		return new RgbColour(
			this.r - ((this.r-other.r)*rate),
			this.g - ((this.g-other.g)*rate),
			this.b - ((this.b-other.b)*rate),
		);
	}
}


const PAGE_ELEMENTS = {
	sectionRoot: document.getElementsByClassName("section-page-root")[0],
	canvas: document.getElementById("canvas"),

	projectsRoot: document.getElementsByClassName("projects-content-root")[0],
	projects: (function() {
		let obj = {};
		for (let project of document.getElementsByClassName("project-item")) {
			obj[project.id] = project;
		}
		return obj;
	})(),
};


const GLOBALS = {
	gradientColours: [
		new RgbColour(163, 50, 63),
		new RgbColour(56, 50, 163)
	]
	// gradientColours: [
	// 	new RgbColour(255, 255, 255),
	// 	new RgbColour(10, 10, 10)
	// ]

};



const backgroundRenderFunctions = {
	gradient: function(canvas, ctx) {
		let c1 = GLOBALS.gradientColours[0];
		let c2 = GLOBALS.gradientColours[1];

		function getColourInGradient(x, y) {
			const rate = x/window.outerWidth;
			const yrate = y/window.outerHeight;
			let avg = (rate+yrate)/2;

			let c = c1.lerp(c2, avg);

			return c.shift(0).toCssRgb();
		}

		const SQUARE_SIZE = Math.floor((window.outerWidth > window.outerHeight) ? window.outerWidth/25 : window.outerHeight/25);

		for (let y=0; y<window.outerHeight; y+=SQUARE_SIZE) {
			for (let x=0; x<window.outerWidth; x+=SQUARE_SIZE) {
				ctx.fillStyle = getColourInGradient(x, y);
				ctx.fillRect(x, y, SQUARE_SIZE, SQUARE_SIZE)
			}
		}

		return `url(${canvas.toDataURL()})`;
	},

	noisyGradient: function(canvas, ctx) {
		let c1 = GLOBALS.gradientColours[0];
		let c2 = GLOBALS.gradientColours[1];

		function getColourInGradient(x, y) {
			const rate = x/window.outerWidth;
			const yrate = y/window.outerHeight;
			let avg = (rate+yrate)/2;

			let c = c1.lerp(c2, avg);
			return c;
		}

		const SQUARE_SIZE = Math.floor((window.outerWidth > window.outerHeight) ? window.outerWidth/25 : window.outerHeight/25);

		const noiseMap = new NoiseMap(26, 26);
		noiseMap.forEachPosition(function(x, y, v) {
			x *= SQUARE_SIZE;
			y *= SQUARE_SIZE;

			ctx.fillStyle = getColourInGradient(x, y).shift(lerpValues(-5, 5, v)).toCssRgb();
			ctx.fillRect(x, y, SQUARE_SIZE, SQUARE_SIZE);
		});

		return `url(${canvas.toDataURL()})`;
	},

	equalizer: function(canvas, ctx) {
		let c1 = GLOBALS.gradientColours[0];
		let c2 = GLOBALS.gradientColours[1];

		ctx.fillRect(0, 0, window.outerWidth, window.outerHeight);

		function getColourInGradient(x, y) {
			const rate = x/window.outerWidth;
			const yrate = y/window.outerHeight;
			let avg = (rate+yrate)/2;

			let c = c1.lerp(c2, avg);
			return c;
		}

		const SQUARE_SIZE = Math.floor((window.outerWidth > window.outerHeight) ? window.outerWidth/25 : window.outerHeight/25);

		const noiseMap = new NoiseMap(26, 26);
		noiseMap.forEachPosition(function(x, y, v) {
			x *= SQUARE_SIZE;
			y *= SQUARE_SIZE;

			ctx.fillStyle = getColourInGradient(x, y).shift(lerpValues(-5, 5, v)).toCssRgb();
			ctx.fillRect(x, y, SQUARE_SIZE, SQUARE_SIZE);
		});

		const THICKNESS = window.outerWidth/65;
		const noiseMapLine = new NoiseMap(25, 1);
		const RATE = window.outerWidth/25;

		ctx.fillStyle = "rgb(10, 10, 10)";
		noiseMapLine.forEachPosition(function(x, y, v) {
			let h = lerpValues(THICKNESS*3, THICKNESS*15, v);

			ctx.fillRect((x*RATE)+window.outerWidth/96, window.outerHeight/2 - h/2, THICKNESS, h);
		})
		return `url(${canvas.toDataURL()})`;

	},

	dirt: function(canvas, ctx) {
		let c1 = new RgbColour(200, 200, 200);
		let c2 = new RgbColour(0, 0, 0);

		ctx.fillStyle = c1.toCssRgb();
		ctx.fillRect(0, 0, window.outerWidth, window.outerHeight)

		const SQUARE_SIZE = 4;
		for (let i=0; i<randInt(15, 20); i++) {
			const SIZE = randInt(5, 32)*SQUARE_SIZE;
			const RAD = SIZE/2;

			let centerPos = {
				x: randInt(SIZE*2, window.outerWidth - (SIZE*2)),
				y: randInt(SIZE, window.outerHeight - (SIZE))
			}

			const noise = new NoiseMap(SIZE, SIZE);
			for (let y=0; y<SIZE/SQUARE_SIZE; y++) {
				for (let x=0; x<SIZE/SQUARE_SIZE; x++) {
					let posObj = {
						x: centerPos.x-RAD+(x*SQUARE_SIZE),
						y: centerPos.y-RAD+(y*SQUARE_SIZE),
					};

					const dist = distanceObj(posObj, centerPos);
					if (dist == 0) {
						ctx.fillStyle = c1.lerp(c2, 0.5).toCssRgb();
						ctx.fillRect(posObj.x, 0, SQUARE_SIZE/4, window.outerHeight);

					}

					let v = dist / RAD;

					if (v > 1.0) {
						continue;
					}

					let finalC = c2.lerp(c1, v).shift(noise.mapPoints[y][x]*20);
					ctx.fillStyle = finalC.toCssRgb();
					ctx.fillRect(posObj.x, posObj.y, SQUARE_SIZE, SQUARE_SIZE);
				}
			}
		}

		// setTimeout(function() {backgroundRenderFunctions.dirt(canvas, ctx)}, 500);
		return `url(${canvas.toDataURL()})`;
	},

	noiseColour: function(canvas, ctx) {
		let noiseR = new NoiseMap(26, 26);
		let noiseG = new NoiseMap(26, 26);
		let noiseB = new NoiseMap(26, 26);

		const SQUARE_SIZE = Math.floor((window.outerWidth > window.outerHeight) ? window.outerWidth/25 : window.outerHeight/25);
		noiseR.forEachPosition(function(x, y, v) {
			let xp = x * SQUARE_SIZE;
			let yp = y * SQUARE_SIZE;

			// ctx.fillStyle = new RgbColour(255*v, 255*noiseG.mapPoints[y][x], 255*noiseB.mapPoints[y][x]).toCssRgb();
			ctx.fillStyle = GLOBALS.gradientColours[1].add(new RgbColour(50*v, 25*noiseG.mapPoints[y][x], 25*noiseB.mapPoints[y][x])).toCssRgb();

			ctx.fillRect(xp, yp, SQUARE_SIZE, SQUARE_SIZE);
		});

		return `url(${canvas.toDataURL()})`;

	},

	_lastRandomFunction: null,
	randomChoice: function() {
		let funcList = [
			this.gradient,
			this.noisyGradient,
			this.dirt,
			this.noiseColour,
		];

		let choice = funcList[randInt(0, funcList.length-1)];
		if (this._lastRandomFunction == choice) {
			return this.randomChoice();
		}

		this._lastRandomFunction = choice;
		return choice;
	}
};


function backgroundDraw() {
	const canvas = PAGE_ELEMENTS.canvas;
	const ctx = canvas.getContext("2d");

	ctx.canvas.width  = window.outerWidth;
	ctx.canvas.height = window.outerHeight;

	let dataUrlBackground = backgroundRenderFunctions.randomChoice()(canvas, ctx);
	document.body.style.backgroundImage = dataUrlBackground;
}



function main() {
	PAGE_ELEMENTS.projects["scare-project"].addEventListener("mouseenter", function() {
		setTimeout(function() {
			PAGE_ELEMENTS.projects["scare-project"].innerText = "“scare-quotes”";
		}, 50);
	});

	PAGE_ELEMENTS.projects["scare-project"].addEventListener("mouseleave", function() {
		PAGE_ELEMENTS.projects["scare-project"].innerText = "scare-quotes";
	});

	for (let element of document.getElementsByClassName("script-mouseover-property")) {
		element.mouseIsHovering = false;
		element.addEventListener("mouseleave", function() { element.mouseIsHovering = false; })
		element.addEventListener("mouseenter", function() { element.mouseIsHovering = true; })
	}

	document.body.addEventListener("click", function() {
		if (PAGE_ELEMENTS.projectsRoot.mouseIsHovering) {
			return;
		}

		backgroundDraw();
	});

	backgroundDraw();
}


main();
