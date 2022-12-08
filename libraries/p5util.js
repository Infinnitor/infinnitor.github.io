// This object keeps track of mouse presses and key strokes in a way that allows you to get that information from anywhere in the program
const inputManager = {
	_keyList: [],
	_firstFrame: [],

	// Object tracking mouse movement and clicks
	mouse: {
		left: false,
		right: false,
		middle: false,

		x: function() {
			return mouseX + camera.x;
		},

		y: function() {
			return mouseY + camera.y;
		},

		pos: function() {
			return [this.x(), this.y()];
		}
	},

	// Function to check if a key is pressed (only true on the first frame it is pressed)
	keyTapped: function(k) {
		return this._firstFrame.includes(k);
	},

	// Function to check if a key is held down
	keyDown: function(k) {
		return this._keyList.includes(k);
	}
}



function mousePressed() {
	// Stuff to make audio work
	userStartAudio();

	if (mouseButton == LEFT) {
		inputManager.mouse.left = true;
	}
	else if (mouseButton == RIGHT) {
		inputManager.mouse.right = true;
	}
	else if (mouseButton == CENTER) {
		inputManager.mouse.middle = true;
	}
}


function mouseReleased() {
	if (mouseButton == LEFT) {
		inputManager.mouse.left = false;
	}
	else if (mouseButton == RIGHT) {
		inputManager.mouse.right = false;
	}
	else if (mouseButton == CENTER) {
		inputManager.mouse.middle = false;
	}
}


function keyTyped() {
	if (!inputManager._keyList.includes(key)) {
		inputManager._keyList.push(key);
	}
	if (!inputManager._firstFrame.includes(key)) {
		inputManager._firstFrame.push(key);
	}
}

function keyPressed() {
	arrowKeys = [LEFT_ARROW, RIGHT_ARROW, UP_ARROW, DOWN_ARROW];

	if (!arrowKeys.includes(keyCode)) {
		return;
	}

	if (!inputManager._keyList.includes(keyCode)) {
		inputManager._keyList.push(keyCode);
	}
	if (inputManager._firstFrame.includes(key)) {
		var i = inputManager._firstFrame.indexOf(key);
		if (i != -1) {
			inputManager._firstFrame.splice(i, 1);
		}
	} else if (!inputManager._firstFrame.includes(keyCode)) {
		inputManager._firstFrame.push(keyCode);
	}
}

function keyReleased() {

	arrowKeys = [LEFT_ARROW, RIGHT_ARROW, UP_ARROW, DOWN_ARROW];

	if (arrowKeys.includes(keyCode)) {
		var i = inputManager._keyList.indexOf(keyCode);
		if (i != -1) {
			inputManager._keyList.splice(i, 1);
		}
	}

	if (inputManager._keyList.includes(key)) {
		var i = inputManager._keyList.indexOf(key);
		if (i != -1) {
			inputManager._keyList.splice(i, 1);
		}
	}
	if (inputManager._firstFrame.includes(key)) {
		var i = inputManager._firstFrame.indexOf(key);
		if (i != -1) {
			inputManager._firstFrame.splice(i, 1);
		}
	}

	return false;
}


class CoroutineFrame {
	LAYER = "MANAGER";

	constructor(frames, callback) {
		this._counter = 0;
		this._desiredFrames = frames;
		this._callback = callback;
	}

	update() {
		this._counter++;
		if (this._counter > this._desiredFrames) {
			this._callback();
			this.destroy = true;
		}
	}
}
