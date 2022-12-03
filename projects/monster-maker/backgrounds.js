// This class is used for managing the background
class BackgroundManager {
	LAYER = "BACKGROUND";

	constructor(colour, particleSpawner, spawnRate) {
		this._c = colour;
		this._particleSpawner = particleSpawner;

		this._sprites = [];

		this._spawnRate = spawnRate;
	}

	update() {
		// Set the background colour every frame
		background(this._c);

		// Code to do the particles
		for (let i=this._sprites.length-1; i>-1; i--) {
			const sprite = this._sprites[i];
			sprite.update();

			if (sprite.destroy) {
				this._sprites.splice(i, 1);
			}
		}

		// Spawn some particles every few frames
		if (frameCount % this._spawnRate == 0) {
			for (let sprite of this._particleSpawner()) {
				this._sprites.push(sprite);
			}
		}
	}
}

// Function to instantiate and return a BackgroundManager object with hardcoded values
function testBGman() { return new BackgroundManager(color(185, 95, 205), function() {
	return [...Array(7).keys()].map(() => randomDirectionGrowParticle([width/2, height/2], 15, 3, color(195, 105, 215), 200));
}, 4); }
