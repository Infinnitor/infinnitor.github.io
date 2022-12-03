// Program entrypoint
function setup() {
    let renderer = createCanvas(800, 600);
	renderer.parent("game-canvas-container");

	imageMode(CENTER);
	noStroke();

	getAudioContext().suspend();

	assets.audio = {
		TEST: new p5.MonoSynth()
	}

	spriteManager.add(testBGman());

	// Function that will start of chain of callbacks that present the different options to the user
	let createSelectionOptions = function() {
		spriteManager.add(new SelectionOptions([width/2, height/2], assets.BODY, "body", function() {
			spriteManager.add(new SelectionOptions([width/2, height/2], assets.EYE, "eye", function() {
				spriteManager.add(new SelectionOptions([width/2, height/2], assets.NOSE, "nose", function() {
					spriteManager.add(new SelectionOptions([width/2, height/2], assets.MOUTH, "mouth", function() {
						spriteManager.add(createMonster());
					}));
				}));
			}));
		}));
	}

	// Create start button at the center of the screen
	spriteManager.add(new Button(
		[width/2, height/2],
		[100, 100],
		assets.BUTTON_SPRITE,

		// This callback will run when the Button is clicked
		function() {
			// assets.audio.TEST.play("A6");

			this.destroy = true;
			for (let i=0; i<50; i++) {
				spriteManager.add(randomDirectionParticle([this.x, this.y], 35, 7, color(200, 105, 235), 80));
			}

			// Add a coroutine that runs createSelectionOptions() after 45 frames
			spriteManager.add(new CoroutineFrame(45, createSelectionOptions));
		}
	));
}


function draw() {
	// The spriteManager is responsible for updating all sprite objects
	// See the spriteManager.js file for more information
	spriteManager.update();
}
