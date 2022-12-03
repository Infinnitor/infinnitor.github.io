const WIDTH = window.outerWidth;
const HEIGHT = window.outerHeight;


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



const backgroundRenderFunctions = {
	gradient: function(c1, c2) {
		c1 = c1 ?? new RgbColour(163, 50, 63);
		c2 = c2 ?? new RgbColour(56, 50, 163);

		function getColourInGradient(x, y) {
			const rate = x/WIDTH;
			const yrate = y/HEIGHT;
			let avg = (rate+yrate)/2;

			let c = c1.lerp(c2, avg);

			return c.shift(-35).toCssRgb();
		}


		const canvas = document.getElementById("canvas");
		const ctx = canvas.getContext("2d");

		ctx.canvas.width  = window.outerWidth;
		ctx.canvas.height = window.outerHeight;

		const SQUARE_SIZE = 64;

		for (let y=0; y<HEIGHT; y+=SQUARE_SIZE) {
			for (let x=0; x<WIDTH; x+=SQUARE_SIZE) {
				ctx.fillStyle = getColourInGradient(x, y);
				ctx.fillRect(x, y, SQUARE_SIZE, SQUARE_SIZE)
			}
		}

		document.body.style.backgroundImage = `url(${canvas.toDataURL()})`;
		canvas.remove();
	}
}



function main() {
	backgroundRenderFunctions.gradient();
}


main();
