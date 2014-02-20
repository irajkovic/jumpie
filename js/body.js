function Body(x, y, dx, dy, context) {
	
	this.x = x || 0;
	this.y = y || 0;
	this.dx = dx;					// horizontal position increment - speed
	this.dy = dy;					// vertical position increment - speed
	this.ddx = 0;					// horizontal acceleration
	this.ddy = CONST.GRAVITY;		// vertical acceleration
	this.width = 40;
	this.height = 65;
	this.FRICTION_AIR = CONST.FRICTION_AIR;		// 0 - no friction, 1 - maximum friction
	this.FRICTION_GROUND = CONST.FRICTION_GROUND;	// 0 - no friction, 1 - maximum friction
	this.ELASTICITY = CONST.ELASTICITY;			// amount of momentum preserved during collisions
	this.context = context;
	this.offsetX = 900;
	this.orientation = 1;			// 0 right, 1 left
	this.imageData = null;
	
	// fix constants (for unification purposes, some constants have values not suitable for later processing)
	this.FRICTION_GROUND = 1 - this.FRICTION_GROUND;
	
	// load sprites
	this.imagePaths = ['images/mouse_0.png', 'images/mouse_1.png'];
	this.imageMap = [];
	this.imageInd = 0;
	for (var ind in this.imagePaths) {
		this.imageMap[ind] = new Image();
		this.imageMap[ind].src = this.imagePaths[ind];	
	}
	
	this.cyclesOnGround = 0;
	
	
}

Body.prototype.probe = function(x, y) {

	/*
	// approach 1
	var p = this.context.getImageData(x, y, 1, 1).data;
	return p[0] != CONST.EMPTY_SPACE.RED || p[1] != CONST.EMPTY_SPACE.GREEN || p[2] != CONST.EMPTY_SPACE.BLUE;
	
	
	// approach 2
	if (!displayBuffer) {
		displayBuffer = this.context.getImageData(0, 0, CONST.CANVAS_WIDTH, CONST.CANVAS_HEIGHT).data;
	}
	
	var ind = (parseInt(y) - 1) * CONST.CANVAS_WIDTH * 4 + (parseInt(x) - 1) * 4;
	return displayBuffer[ind] != CONST.EMPTY_SPACE.RED || displayBuffer[ind + 1] != CONST.EMPTY_SPACE.GREEN || displayBuffer[ind + 2] != CONST.EMPTY_SPACE.BLUE;
	*/
	
	// approach 3
	var x = parseInt(x);
	var y = parseInt(y);
	var absDx = Math.abs(this.dx);
	var absDy = Math.abs(this.dy);
	var margin = parseInt(absDx > absDy ? absDx : absDy) + 70;
	
	if (!displayBuffer) {
		displayBuffer = {};
		displayBuffer.x = x - margin;
		displayBuffer.y = y - margin;
		displayBuffer.width = this.width + 2 * margin;
		displayBuffer.height = this.height + 2 * margin;	
		displayBuffer.data = this.context.getImageData(displayBuffer.x, displayBuffer.y, displayBuffer.width, displayBuffer.height).data;
	}
	
	x -= displayBuffer.x;
	y -= displayBuffer.y;
	
	var ind = (y - 1) * displayBuffer.width * 4 + (x - 1) * 4;
	
	return displayBuffer.data[ind] != CONST.EMPTY_SPACE.RED || displayBuffer.data[ind + 1] != CONST.EMPTY_SPACE.GREEN || displayBuffer.data[ind + 2] != CONST.EMPTY_SPACE.BLUE;
	
}

Body.prototype.move = function() {

	// update acceleration
	this.dx += this.ddx;
	this.dy += this.ddy;
	
	// apply horizontal air friction, proportional to the air speed
	if (this.dx != 0) {
		var frictionAmount = this.dx * this.FRICTION_AIR; frictionAmount *= frictionAmount;	// square by multiplication is faster
		this.dx += this.dx > 0 ? -frictionAmount : frictionAmount;
	}
	if (this.dy != 0) {
		var frictionAmount = this.dy * this.FRICTION_AIR; frictionAmount *= frictionAmount; // square by multiplication is faster
		this.dy += this.dy > 0 ? -frictionAmount : frictionAmount;
	}
		
	// ground - falling collision detection
	var isNotLifting = false;
	if (this.dy > 0) {
		var touchingGround = this.probe(this.offsetX, this.y + this.height);
		var isNotLifting = this.cyclesOnGround > 2;
		
		if (touchingGround) {
			var newDy = this.dy * -this.ELASTICITY;
			this.dy = Math.abs(newDy) > 2 ? newDy : 0;		
			this.cyclesOnGround++;
		}
		else {
			this.cyclesOnGround = 0;
		}
	}
	else {
		if (this.probe(this.offsetX, this.y)) {
			this.dy = this.dy * -this.ELASTICITY;
		}
	}
	
	// horizontal collision detection
	var x = this.dx < 0 ? this.offsetX : this.offsetX + this.width;
	var center = this.getCenterPoint();
	if ( this.probe(x, this.y) || this.probe(x, center.y)) {
		// hit detected, invert x
		this.dx *= -this.ELASTICITY;
	}
	
	if (isNotLifting) {
		// apply friction
		this.dx *= this.FRICTION_GROUND;
	}
	
	// update position
	this.x += this.dx;
	this.y += this.dy;
	
	//console.log(this.x + ' ' + this.y + ' ' + this.dx + ' ' + this.dy);
}

Body.prototype.draw = function() {
	// this.context.drawImage(this.imageMap[this.cyclesOnGround > 2 ? 0 : 1], this.x, this.y, this.width, this.height);
	// this.context.drawImage(this.imageMap[this.cyclesOnGround > 2 ? 0 : 1], this.offsetX, this.y, this.width, this.height);
	
	var image = this.imageMap[this.cyclesOnGround > 2 ? 0 : 1];
	this.orientation = Math.abs(this.dx) > 2 ? this.dx < 0 : this.orientation;
	drawFlippedImage(this.context, image, this.offsetX, this.y, this.width, this.height, this.orientation, 0);
}

Body.prototype.render = function() {
	this.move();
	this.draw();
}

Body.prototype.hasPointAt = function(x, y) {
	// return x >= this.x && x < this.x + this.width && y >= this.y && y < this.y + this.height;
	return x >= this.offsetX && x < this.offsetX + this.width && y >= this.y && y < this.y + this.height;
}

Body.prototype.getCenterPoint = function() {
	return {
		//x: this.x + this.width / 2,
		x: this.offsetX + this.width / 2,
        y: this.y + this.height / 2
	};
}


function drawFlippedImage(context, image, x, y, width, height, flipH, flipV) { 

	if (!flipH && !flipV) {
		context.drawImage(image, x, y, width, height); // draw the image
		return;
	}

	var scaleH = flipH ? -1 : 1, // Set horizontal scale to -1 if flip horizontal
		scaleV = flipV ? -1 : 1; // Set vertical scale to -1 if flip vertical
	x = flipH ? x * -1 - width : x, // Set x position to -100% if flip horizontal
	y = flipV ? y * -1 - height : y; // Set y position to -100% if flip vertical
 
    context.save(); // Save the current state
    context.scale(scaleH, scaleV); // Set scale to flip the image
    context.drawImage(image, x, y, width, height); // draw the image
    context.restore(); // Restore the last saved state

}

function drawRotatedImage(context, image, x, y, angle) { 
	
	var TO_RADIANS = Math.PI/180; 
 
	// save the current co-ordinate system 
	// before we screw with it
	context.save(); 
 
	// move to the middle of where we want to draw our image
	context.translate(x, y);
 
	// rotate around that point, converting our 
	// angle from degrees to radians 
	context.rotate(angle * TO_RADIANS);
 
	// draw it up and to the left by half the width
	// and height of the image 
	context.drawImage(image, -(image.width/2), -(image.height/2));
 
	// and restore the co-ords to how they were when we began
	context.restore(); 
}