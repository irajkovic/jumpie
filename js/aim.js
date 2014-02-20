function Aim(context) {
	
	this.context = context;
	this.active = false;
	this.startX = 0;
	this.startY = 0;
	this.endX = 0;
	this.endY = 0;
	
	this.POINT_WIDTH = 10;
	this.POINT_HEIGHT = 10;
	this.MID_POINTS = 5;
	
	// load image
	this.aimPoint = new Image();
	this.aimPoint.src = 'images/cloud.jpg';
	
}

Aim.prototype.render = function() {
/*
	if (this.active) {
		this.context.beginPath();
		this.context.moveTo(this.startX, this.startY);
		this.context.lineTo(this.endX, this.endY);
		this.context.stroke();
	}
*/

	if (this.active) {
	
		//this.context.drawImage(this.aimPoint, this.startX, this.startY, this.POINT_WIDTH, this.POINT_HEIGHT);
		
		var distanceX = this.endX - this.startX;
		var distanceY = this.endY - this.startY;
		var dx = distanceX / this.MID_POINTS;
		var dy = distanceY / this.MID_POINTS;
		var ddy = 15 * CONST.GRAVITY * (1 - CONST.FRICTION_AIR);
		
		console.log(ddy);
		
		var x = this.startX;
		var y = this.startY;
		for (var i=0; i<this.MID_POINTS; i++) {
			x += dx;
			y += dy;
			dy += ddy;
			this.context.drawImage(this.aimPoint, x, y, this.POINT_WIDTH, this.POINT_HEIGHT);
		}
		//this.context.drawImage(this.aimPoint, this.endX, this.endY, this.POINT_WIDTH, this.POINT_HEIGHT);
	}
}