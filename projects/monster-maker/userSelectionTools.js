// This class acts as a manager for multiple buttons
// It is used to position them and dispose of them when one of them has been clicked
class SelectionOptions {
	LAYER = "UI";

	constructor(pos, choices, choiceType, exitCallback) {
		this.x = pos[0];
		this.y = height*1.5;

		// Create buttons based on the availible choices
		this._choices = choices;
		this._buttons = [];
		for (let i=0; i<this._choices.length; i++) {
			let image = this._choices[i];

			let buttonPos = [
				this.x + (i - Math.floor(this._choices.length/2))*100,
				pos[1]
			];

			let button = monsterPartSelector(
				buttonPos,
				image,
				choiceType,
				this
			);

			this._buttons.push(button);
		}

		this._entryVel = 0;
		this._onExit = (exitCallback ?? function() {});
	}

	// This function runs when one of the buttons is clicked
	registerClick(buttonClicked) {
		this._disposingVel = 0

		// Deactivate all the buttons
		for (let button of this._buttons) {
			button.deactivate = true;
		}
	}

	update() {
		// Iterate over and display buttons
		for (let i=0; i<this._buttons.length; i++) {
			let button = this._buttons[i];
			button.update([this.x, this.y]);

			if (this._disposingVel != null) {
				button.y -= this._disposingVel;
			}
		}

		// If the object is currently disposing, then increment an animation of it moving it upwards
		if (this._disposingVel != null) {
			this._disposingVel += 0.5;
			this.y -= this._disposingVel;
		}

		// Remove sprite if offscreen
		if (this.y < -height/2) {
			this._onExit();
			this.destroy = true;
		}

		if (this.y > height/2) {
			this.y -= this._entryVel;
			this._entryVel += 0.5;
		}

		else if (this._disposingVel == null) {
			this.y = height/2;
		}
	}
}


// Class for creating buttons that use onclick behaviour
class Button {
	LAYER = "UI";

	// The callback given to the constructor will be called once when the button is clicked by the user
	constructor(pos, size, sprite, callback) {
		this.x = pos[0];
		this.y = pos[1];

		this.w = size[0];
		this.h = size[0];

		this._sprite = sprite;
		this._callback = (callback ?? function () {});

		this._deactivate = false;
	}

	// Function to check if the mouse is hovering above the button. Returns a boolean
	_checkMouseHover() {
		const centeredPos = {
			x: this.x-this.w/2,
			y: this.y-this.h/2
		};

		if (mouseX > centeredPos.x && mouseX < centeredPos.x + this.w) {
			if (mouseY > centeredPos.y && mouseY < centeredPos.y + this.h) {
				return true;
			}
		}

		return false;
	}

	// Function to check if the button is clicked. Returns a boolean
	_checkMouseClick() {
		return this._checkMouseHover() && inputManager.mouse.left;
	}

	// offsetPos is the offset from where the button should be displayed
	// It only affects the Y value at the moment
	update(offsetPos) {
		// Default position to display the buttons at if no offsetPos is given
		let pos = offsetPos ?? [width/2, height/2];

		// If the button is clicked and hasn't been deactivated by its parent, then run the callback
		if (this._checkMouseClick() && !this.deactivate) {
			this._callback();
		}

		// Draw a rectangle around the button if it is hovered
		if (this._checkMouseHover()) {
			stroke(5);
			strokeWeight(5);
			fill(0, 0, 0, 0, 10);
			rectMode(CENTER);
			rect(this.x, pos[1], this.w, this.h);
		}

		imageMode(CENTER);

		// Button sprite sizes are scaled when displayed
		let imageScale = (this._sprite.width > this._sprite.height) ? (this.w-15)/this._sprite.width : (this.h-15)/this._sprite.height;
		image(this._sprite, this.x, pos[1], this._sprite.width*imageScale, this._sprite.height*imageScale);
		strokeWeight(0);
	}
}


// Create a simple button that changes an option in monsterConfig when clicked
function monsterPartSelector(pos, imageLink, monsterPartType, parent) {
	return new Button(pos, [100, 100], imageLink, function() {
		monsterConfig.setType(monsterPartType, imageLink);
		this.destroy = true;
		parent.registerClick(this);
	});
}
