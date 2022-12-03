// Class for an individual particle
class Particle {
	LAYER = "PARTICLES";

	constructor(pos, size, vel, colour, lifetime) {
		this.x = pos[0];
		this.y = pos[1];

		this.r = size;

		// The Particle moves based on a given velocity
		this.xmove = vel[0];
		this.ymove = vel[1];

		this.c = colour;

		this._lifetime = (lifetime ?? 25);
		this._decay = this.r / this._lifetime;
	}

	update() {
		this.x += this.xmove;
		this.y += this.ymove;

		// When the Particle size is lower than 0, it is deleted
		this.r -= this._decay;
		if (this.r < 0) {
			this.destroy = true;
		}

		noStroke();
		rectMode(CENTER);
		fill(this.c);
		rect(this.x, this.y, this.r, this.r);
	}
}


// GrowParticles grow larger and move until they are offscreen
class GrowParticle {
	LAYER = "PARTICLES";

	constructor(pos, size, vel, colour, lifetime) {
		this.x = pos[0];
		this.y = pos[1];

		this.r = 0;
		this._desiredR = size;

		this.xmove = vel[0];
		this.ymove = vel[1];

		this.c = colour;

		this._lifetime = (lifetime ?? 25);
		this._decay = this._desiredR / this._lifetime;
	}

	update() {
		this.x += this.xmove;
		this.y += this.ymove;

		this.r += this._decay;
		// When the particle is offscreen, destroy it
		if ((this.x > width+this.r || this.x < -this.r) || (this.y > height+this.r || this.y < -this.r)) {
			this.destroy = true;
		}

		noStroke();
		rectMode(CENTER);
		fill(this.c);
		rect(this.x, this.y, this.r, this.r);
	}
}



// Function to create a Particle facing a random direction
function randomDirectionParticle(pos, size, speed, colour, lifetime) {
	return new Particle(
		pos,
		size,
		[(1-(Math.random()*2))*speed, (1-(Math.random()*2))*speed],
		colour,
		lifetime
	)
}

// Function to create a GrowParticle facing a random direction
function randomDirectionGrowParticle(pos, size, speed, colour, lifetime) {
	let a = Math.random()*TWO_PI;
	let vel = [
		cos(a)*speed,
		sin(a)*speed,
	];

	return new GrowParticle(
		pos,
		size,
		vel,
		colour,
		lifetime
	)
}
