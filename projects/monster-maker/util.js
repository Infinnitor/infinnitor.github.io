// Function to return a random integer between a and b
function randInt(a, b) {
	return Math.floor(Math.random() * (b - a) + a);
}


// A Coroutine is an object that executes a callback after a certain number of frames have ellapsed
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