// Class for managing every sprite in the monster
// This class is used for creating the MonsterParts from a map, and for updating them
class MonsterBase {
	LAYER = "MONSTER";

	// itemPoints is a map defined in monsterConfig.js that tells the constructor where the different monster body parts are
	constructor(pos, size, itemPoints) {
		this.x = pos[0];

		this.y = height*1.5;
		this._desiredY = pos[1];

		this._entryVel = 0;

		this.w = size[0];
		this.h = size[1];

		// For loop creates new objects for each body part based on the itemPoints config
		this._sprites = [];
		for (let i=0; i<itemPoints.length; i++) {
			let arr = [];
			for (let item of itemPoints[i]) {
				arr.push(monsterConfig.fromPartName(item.name, item.x, item.y));
			}

			this._sprites.push(arr);
		}
	}

	// Sprite update methods run every frame
	update() {
		// Code to update the monster parts
		for (let layer of this._sprites) {
			for (let sprite of layer) {
				sprite.update([this.x-this.w/2, this.y-this.h/2]);
			}
		}

		// When the Monster is instantiated it is below the screen
		// This code moves it upwards until it reaches _desiredY (the halfway point)
		if (this.y > this._desiredY) {
			this.y -= this._entryVel;
			this._entryVel += 0.5;
		}

		else {
			// When the monster reaches the halfway point, prompt the user to name their monster
			if (this._entryVel != null) {
				this._name = prompt("Name the creature: ");
				this._entryVel = null;
			}

			this.y = this._desiredY;
		}

		// Display the monster's name if it has been defined
		if (this._name) {
			fill(10, 10, 10)
			textSize(50);
			textStyle(BOLD);
			textAlign(CENTER);
			text(this._name, this.x, this.y + height/3);
		}
	}
}


// Class for the individual parts of the monster
class MonsterPart {
	constructor(pos, partName, onclick) {
		this.x = pos[0];
		this.y = pos[1];

		this.offset = {
			x: 0,
			y: 0
		}

		this._parentPos = {
			x: 0,
			y: 0,
		};

		this._partName = partName;
		this._sprite = monsterConfig.nameToSprite(this._partName);

		this._onclick = (onclick ?? function() {}) // Assign to empty function if no argument is given
	}

	// Function to get the position of the monster relative to it's MonsterBase parent
	_getVisualPos() {
		return {
			x: this.x+this.offset.x+this._parentPos.x,
			y: this.y+this.offset.y+this._parentPos.y,
		}
	}

	// Check if mouse collides with and clicks on the object
	_checkMouseCollide(offset) {
		const centeredPos = {
			x: this.x-this._sprite.width/2 + this._parentPos.x,
			y: this.y-this._sprite.height/2 + this._parentPos.y
		};

		if (inputManager.mouse.left === true) {
			if (mouseX > centeredPos.x && mouseX < centeredPos.x + this._sprite.width) {
				if (mouseY > centeredPos.y && mouseY < centeredPos.y + this._sprite.height) {
					return true;
				}
			}
		}
		// this._sprite = monsterConfig.nameToSprite(this._partName);

		return false;
	}

	// Monster part updater
	update(pos) {
		if (this._checkMouseCollide()) {
			this._onclick();
		}

		else {
			this.offset.x = 0;
			this.offset.y = 0;
		}

		this._parentPos = {
			x: pos[0],
			y: pos[1],
		};

		imageMode(CENTER);
		let p = this._getVisualPos();
		image(this._sprite, p.x, p.y);
	}
}