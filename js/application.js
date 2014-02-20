var CONST = {
	GRAVITY : 0.55,
	CANVAS_WIDTH : 1500,
	CANVAS_HEIGHT : 768,
	EMPTY_SPACE : {
		RED : 0,
		GREEN : 0,
		BLUE : 0
	},
	FRICTION_AIR : 0.055,		// 0 - no friction, 1 - maximum friction
	FRICTION_GROUND : 0.15,		// 0 - no friction, 1 - maximum friction
	ELASTICITY : 0.55			// amount of momentum preserved during collisions
}

var renderables = null;
var displayBuffer = null;

$(function() {

	// adjust canvas size
	CONST.CANVAS_WIDTH = window.screen.width;
	CONST.CANVAS_HEIGHT = window.screen.height - 200;
	$('#canvas').attr('width', CONST.CANVAS_WIDTH);
	$('#canvas').attr('height', CONST.CANVAS_HEIGHT);
	
	
	// get animate function
	window.requestAnimFrame = (function(callback) {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
        function(callback) {
          window.setTimeout(callback, 1000 / 60);
        };
      })();
	
	// init canvas
	CONST.canvasContext = document.getElementById('canvas').getContext('2d');
	
	// init elements
	renderables = {
	    world: new World(CONST.canvasContext),
	    aim: new Aim(CONST.canvasContext),
		player: new Body(0, 300, 4, 0, CONST.canvasContext),
	}

	// init event handlers
	
	$('#canvas').mousemove(function(event) {
		if (renderables.aim.active) {
			renderables.aim.endX = event.clientX;
			renderables.aim.endY = event.clientY;
		}
		
	});
	
	$('#canvas').mousedown(function(event) {

			// make sure aim start is at character center
			if (renderables.player.hasPointAt(event.clientX , event.clientY)) {
				var centerPosition = renderables.player.getCenterPoint();
				renderables.aim.startX = centerPosition.x;
				renderables.aim.startY = centerPosition.y;
				renderables.aim.active = true;
			}	
		
	});
	
	$('#canvas').mouseup(function(event) {
		if (renderables.aim.active) {
			renderables.aim.endX = event.clientX;
			renderables.aim.endY = event.clientY;
			renderables.aim.active = false;
			// jump
			//renderables.player.dx = (renderables.aim.endX - renderables.player.x) / 40;
			renderables.player.dx = (renderables.aim.endX - renderables.player.offsetX) / 10;
            renderables.player.dy = (renderables.aim.endY - renderables.player.y) / 10;
			renderables.player.imageInd = 1;
		}

	});
	
	// start rendering
	render();
	
	
})

function render() {

	// clear canvas
	CONST.canvasContext.clearRect(0, 0, CONST.CANVAS_WIDTH, CONST.CANVAS_HEIGHT);
	
	// center world
	renderables.world.x = renderables.player.x;

	// render all objects
	for (var ind in renderables) {
		renderables[ind].render();
	}

	// flush display buffer
	displayBuffer = null;
	
	requestAnimFrame(function() {
		render();
	});
}















