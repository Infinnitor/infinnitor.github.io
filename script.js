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
	startColours: [
		new RgbColour(163, 50, 63),
		new RgbColour(56, 50, 163)
	]
};



const backgroundRenderFunctions = {
	gradient: function(c1, c2) {
		c1 = c1 ?? new RgbColour(0, 0, 0);
		c2 = c2 ?? new RgbColour(255, 255, 255);

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

		const SQUARE_SIZE = 64;

		for (let y=0; y<window.outerHeight; y+=SQUARE_SIZE) {
			for (let x=0; x<window.outerWidth; x+=SQUARE_SIZE) {
				ctx.fillStyle = getColourInGradient(x, y);
				ctx.fillRect(x, y, SQUARE_SIZE, SQUARE_SIZE)
			}
		}

		document.body.style.backgroundImage = `url(${canvas.toDataURL()})`;
		// canvas.remove();
	}
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

	backgroundRenderFunctions.gradient(...GLOBALS.startColours);
}


main();
