let monsterConfig = {
	// Attrs that need to have image data for config to work properly
	mouth: null,
	eye: null,
	nose: null,
	body: null,

	// Private function to create a MonsterPart
	_createPart: function(x, y, name, callback) {
		return new MonsterPart([x, y], name, callback);
	},

	// Callbacks for MonsterPart onclick behaviour
	// These callbacks are passed into MonsterPart constructors, and are executed when the object is clicked
	_partCallbacks: {

		 // When clicked, vibrate randomly
		shake: function() {
			this.offset.x = Math.random()*10 - 5;
			this.offset.y = Math.random()*10 - 5;
		},

		// When clicked, bob up and down
		sine: function() {
			this.offset.y = 10*sin(frameCount/2)
		},

		// When clicked bob, sideways
		sineHorizontal: function() {
			this.offset.x = 10*sin(frameCount/2)
		},

		// When clicked, vibrate and spawn particles
		emitTears: function() {
			let posBase = this._getVisualPos();
			let part = new Particle([posBase.x+randInt(-25, 25), posBase.y], 7, [0, 5], color(10, 10, 10));

			spriteManager.add(part);

			this.offset.x = Math.random()*10 - 5;
			this.offset.y = Math.random()*10 - 5;
		},

	},

	nameToSprite: function(name) {
		switch (name) {
			case "mouth":
				return this.mouth;
			case "eye":
				return this.eye;
			case "nose":
				return this.nose;
			case "body":
				return this.body;

			default:
				return null
		}
	},

	// Create a MonsterPart given a name and position
	fromPartName: function(name, x, y) {
		let callback;

		switch (name) {
			case "mouth":
				callback = this._partCallbacks.sine;
				break;
			case "eye":
				callback = this._partCallbacks.emitTears;
				break;
			case "nose":
				callback = this._partCallbacks.sineHorizontal;
				break;
			default:
				callback = function() {};
		}

		return this._createPart(x, y, name, callback);
	},

	// Set image links for monsterParts
	setType: function(name, imLink) {
		switch (name) {
			case "mouth":
				this.mouth = imLink; break;

			case "eye":
				this.eye = imLink; break;

			case "nose":
				this.nose = imLink; break;

			case "body":
				this.body = imLink; break;

			default:
				throw new Error(`${name} is not real`);
		}
	}
}


// This function is run once to instantiate a MonsterBase object based on the values in monsterConfig
function createMonster() {

	// This local function determines which map to use to define where the monster's features will be and how many of them there will be
	function getMonsterItemPoints(bodyNum) {
		switch (bodyNum) {
			case 0:
				return [
					[
						{name: "body", x: 105, y: 170}
					],

					[
						{name: "nose", x: 105, y: 140},

						{name: "eye", x: 105, y: 55},
						{name: "eye", x: 105, y: 90},

						{name: "mouth", x: 105-40, y: 210},
						{name: "mouth", x: 105+30, y: 210},
					]

				];

			case 1:
				return [
					[
						{name: "body", x: 150, y: 150},
					],

					[
						{name: "eye", x: 80, y: 100},
						{name: "eye", x: 155, y: 75},
						{name: "eye", x: 230, y: 100},

						{name: "nose", x: 125, y: 150},
						{name: "nose", x: 175, y: 150},

						{name: "mouth", x: 155, y: 210},
					]
				];

			case 2:
				return [
					[
						{name: "body", x: 204, y: 204}
					],

					[
						{name: "eye", x: 90, y: 90},
						{name: "eye", x: 170, y: 105},
						{name: "eye", x: 280, y: 95},

						{name: "eye", x: 115, y: 150},
						{name: "eye", x: 200, y: 155},

						{name: "mouth", x: 280, y: 145},

						{name: "eye", x: 115, y: 220},
						{name: "eye", x: 250, y: 200},

						{name: "nose", x: 175, y: 210},
						{name: "mouth", x: 175, y: 300},
						{name: "eye", x: 90, y: 270},

					]
				]

			default:
				return 	[
					[
						{name: "body", x: 110, y: 180}
					],

					[
						{name: "eye", x: 100, y: 100},
						{name: "eye", x: 120, y: 150},
						{name: "nose", x: 150, y: 200},
						{name: "mouth", x: 95, y: 220}
					]
				];
		}
	}

	return new MonsterBase(
		[width/2, height/2],
		[monsterConfig.body.width, monsterConfig.body.height],
		getMonsterItemPoints(assets.BODY.indexOf(monsterConfig.body))
	)
}
