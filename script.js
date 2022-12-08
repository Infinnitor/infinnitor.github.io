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

	lerp(other, rate) {
		return new RgbColour(
			this.r - ((this.r-other.r)*rate),
			this.g - ((this.g-other.g)*rate),
			this.b - ((this.b-other.b)*rate),
		);
	}
}


const PAGE_ELEMENTS = {
	sectionRoot: document.getElementsByClassName("section-page-root")[0],
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
};



const backgroundRenderFunctions = {
	gradient: function() {
		let c1 = GLOBALS.gradientColours[0];
		let c2 = GLOBALS.gradientColours[1];

		function getColourInGradient(x, y) {
			const rate = x/window.outerWidth;
			const yrate = y/window.outerHeight;
			let avg = (rate+yrate)/2;

			let c = c1.lerp(c2, avg);

			return c.shift(0).toCssRgb();
		}


		const canvas = document.getElementById("canvas");
		const ctx = canvas.getContext("2d");

		ctx.canvas.width  = window.outerWidth;
		ctx.canvas.height = window.outerHeight;

		const SQUARE_SIZE = Math.floor((window.outerWidth > window.outerHeight) ? window.outerWidth/25 : window.outerHeight/25);

		for (let y=0; y<window.outerHeight; y+=SQUARE_SIZE) {
			for (let x=0; x<window.outerWidth; x+=SQUARE_SIZE) {
				ctx.fillStyle = getColourInGradient(x, y);
				ctx.fillRect(x, y, SQUARE_SIZE, SQUARE_SIZE)
			}
		}

		document.body.style.backgroundImage = `url(${canvas.toDataURL()})`;
	},

	noisyGradient: function() {
		let c1 = GLOBALS.gradientColours[0];
		let c2 = GLOBALS.gradientColours[1];

		function getColourInGradient(x, y) {
			const rate = x/window.outerWidth;
			const yrate = y/window.outerHeight;
			let avg = (rate+yrate)/2;

			let c = c1.lerp(c2, avg);
			return c;
		}

		const canvas = document.getElementById("canvas");
		const ctx = canvas.getContext("2d");

		ctx.canvas.width  = window.outerWidth;
		ctx.canvas.height = window.outerHeight;

		const SQUARE_SIZE = Math.floor((window.outerWidth > window.outerHeight) ? window.outerWidth/25 : window.outerHeight/25);

		const noiseMap = new NoiseMap(26, 26);
		noiseMap.forEachPosition(function(x, y, v) {
			x *= SQUARE_SIZE;
			y *= SQUARE_SIZE;

			ctx.fillStyle = getColourInGradient(x, y).shift(lerpValues(-5, 5, v)).toCssRgb();
			ctx.fillRect(x, y, SQUARE_SIZE, SQUARE_SIZE);
		});

		document.body.style.backgroundImage = `url(${canvas.toDataURL()})`;
	},

	equalizer: function() {
		let c1 = GLOBALS.gradientColours[0];
		let c2 = GLOBALS.gradientColours[1];

		const canvas = document.getElementById("canvas");
		const ctx = canvas.getContext("2d");

		ctx.canvas.width  = window.outerWidth;
		ctx.canvas.height = window.outerHeight;

		ctx.fillRect(0, 0, window.outerWidth, window.outerHeight);

		function getColourInGradient(x, y) {
			const rate = x/window.outerWidth;
			const yrate = y/window.outerHeight;
			let avg = (rate+yrate)/2;

			let c = c1.lerp(c2, avg);
			return c;
		}


		SQUARE_SIZE = 64;
		const noiseMap = new NoiseMap(26, 26);
		noiseMap.forEachPosition(function(x, y, v) {
			x *= SQUARE_SIZE;
			y *= SQUARE_SIZE;

			ctx.fillStyle = getColourInGradient(x, y).shift(lerpValues(-5, 5, v)).toCssRgb();
			ctx.fillRect(x, y, SQUARE_SIZE, SQUARE_SIZE);
		});

		const THICKNESS = 32;
		const noiseMapLine = new NoiseMap(25, 1);
		const RATE = window.outerWidth/25;

		ctx.fillStyle = "rgb(10, 10, 10)";
		noiseMapLine.forEachPosition(function(x, y, v) {
			let h = lerpValues(THICKNESS*3, THICKNESS*15, v);

			ctx.fillRect((x*RATE)+12, window.outerHeight/2 - h/2, THICKNESS, h);
		})
		document.body.style.backgroundImage = `url(${canvas.toDataURL()})`;

	},

	randomChoice: function() {
		let funcList = [
			this.gradient,
			this.noisyGradient,
			this.equalizer
		];

		return funcList[randInt(0, funcList.length-1)];
	}
};



function main() {
	PAGE_ELEMENTS.projects["scare-project"].addEventListener("mouseenter", function() {
		setTimeout(function() {
			PAGE_ELEMENTS.projects["scare-project"].innerText = "“scare-quotes”";
		}, 50);
	});

	PAGE_ELEMENTS.projects["scare-project"].addEventListener("mouseleave", function() {
		PAGE_ELEMENTS.projects["scare-project"].innerText = "scare-quotes";
	});

	backgroundRenderFunctions.equalizer();
}


main();
