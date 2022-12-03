// Object for holding assets (visuals / sound(?))
const assets = {
};


// Load the assets
function preload() {
	// Assets are grouped by type and stored in arrays
	assets.EYE = [
		loadImage("data/sprites/eye1.png"),
		loadImage("data/sprites/eye2.png"),
		loadImage("data/sprites/eye3.png"),
	];

	assets.NOSE = [
		loadImage("data/sprites/nose1.png"),
		loadImage("data/sprites/nose2.png"),
		loadImage("data/sprites/nose3.png"),
	];

	assets.BODY = [
		loadImage("data/sprites/body1.png"),
		loadImage("data/sprites/body2.png"),
		loadImage("data/sprites/body3.png"),
	];

	assets.MOUTH = [
		loadImage("data/sprites/mouth1.png"),
		loadImage("data/sprites/mouth2.png"),
		loadImage("data/sprites/mouth3.png"),
	];

	// Sprite for the start button
	assets.BUTTON_SPRITE = loadImage("data/sprites/startButton.png");

	soundFormats("mp3", "ogg");
	assets.audio = {
		// buttonClick: loadSound("assets/doorbell")
	}
}
