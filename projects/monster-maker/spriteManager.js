// Private constant to define defaults layers
// The later on a layer appears in this list, the later it will be rendered
const _LAYERS = [
	"MANAGER",
	"BACKGROUND",
	"MONSTER",
	"PARTICLES",
	"FOREGROUND",
	"UI",
	"OVERLAY"
];


// The spriteManager object is a global const shared between all files
// It is used to keep track of all of the objects in the scene and update their behaviour and display 
// It also removes them from the scene when they are destroyed
// The spriteManager accepts any object that has a LAYER attribute and an update() function
const spriteManager = {

	// Layers object (string : array) created from IIFE
	layers: (function() {
		let ret = {};
		for (let s of _LAYERS) {
			ret[s] = [];
		}
		return ret;
	})(),

	// Public function to access a layer
	get: function(layer) {
		return this.layers[layer];
	},

	// Public function for adding new sprites
	add: function(sprite) {
		this.layers[sprite.LAYER].push(sprite);
	},

	// Function to update all sprites in the program
	update: function() {
		for (let layer of _LAYERS) {
			let arr = this.layers[layer];
			for (let i=arr.length-1; i>-1; i--) {
				let sprite = arr[i];
				sprite.update();

				// Remove sprite from spriteManager if it has the destroy attribute
				if (sprite.destroy == true) {
					arr.splice(i, 1);
				}
			}
		}
	}
};
