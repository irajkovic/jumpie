function World(context) {
    
    this.x = 0;
	this.groundHeight = 250;
    this.context = context;
    
    // map: horizontal coordinate -> object render function
    this.objects = {
		100: ['drawPlatform', 2, 300, 400],
		200: ['drawPlatform', 4, 300, 400, -250],
		500: ['drawPlatform', 5, 300, 400, -250],
		800: ['drawPlatform', 6, 300, 400, -250],
		1100: ['drawPlatform', 7, 300, 400, -250],
		/*
		1500: ['drawPlatform', 500, 400, 3],
        1600: ['drawPlatform', 300, 400, 2],
        1800: ['drawPlatform', 150, 300, 1],
		2200: ['drawPlatform', 300, 400, 2],
		*/
    };
    
    this.terrain = [
        { x : 0, y : CONST.CANVAS_HEIGHT },
        { x : 100, y : CONST.CANVAS_HEIGHT - 100},
        { x : 500, y : CONST.CANVAS_HEIGHT - 200 },
        { x : 1000, y : CONST.CANVAS_HEIGHT }
    ]
    
    this.point = this.terrain[0];
        
    // preload images
	this.imagePaths = [
		'images/building.png', 
		'images/building2.png', 
		'images/tree.png', 
		'images/volcano.png',
		'images/rocks1.png',
		'images/rocks2.png',
		'images/rocks3.png',
		'images/rocks4.png'
		
	];
	this.imageMap = [];
	this.imageInd = 0;
	for (var ind in this.imagePaths) {
		this.imageMap[ind] = new Image();
		this.imageMap[ind].src = this.imagePaths[ind];	
	}
	
    
    

}

World.prototype.render = function() {

    // calculate visible area
    this.context.fillStyle = '#f00';
    this.context.beginPath();
    this.context.moveTo(this.point.x, this.point.y);
    
    var i = 0;
    while (true) {
        if (i++ >= this.terrain.length - 1) {
            break;
        }   
        this.point = this.terrain[i];
        this.context.lineTo(this.point.x, this.point.y);
    }

    this.context.closePath();
    this.context.fill();



    

	// GROUND
	/*
	this.context.beginPath();
	this.context.rect(-100, CONST.CANVAS_HEIGHT - this.groundHeight, CONST.CANVAS_WIDTH + 200, this.groundHeight);
	this.context.fillStyle = 'green';
	this.context.fill();
	this.context.lineWidth = 5;
	this.context.strokeStyle = 'black';
	this.context.stroke();
	*/
	
	// render other objects
	for (var ind in this.objects) {
	
	    // eval(this.objects[ind][0])(ind);
	    switch(this.objects[ind][0]) {
	        case 'drawPlatform':
	            this.objectX = ind;
	            this.drawPlatform.apply(this, this.objects[ind]);
	            break;
	    }
	}
}

World.prototype.drawPlatform = function(name, ind, width, height, y) {

	y = y || 0;
/*
	this.context.beginPath();
	this.context.rect(this.objectX - this.x, CONST.CANVAS_HEIGHT - height, width, height);
	this.context.fillStyle = 'green';
	this.context.fill();
	this.context.lineWidth = 5;
	this.context.strokeStyle = 'black';
	this.context.stroke();
	*/
	
	this.context.drawImage(this.imageMap[ind], this.objectX - this.x, CONST.CANVAS_HEIGHT - height - this.groundHeight - y, width, height);

}









