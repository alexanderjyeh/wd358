class Tile {
	constructor(paper, upLeft, size, direction) {
		this.paper = paper;

		this.upLeft = upLeft;
		this.upRight = point(upLeft.x + size, upLeft.y);
		this.lowRight = point(upLeft.x + size, upLeft.y + size);
		this.lowLeft = point(upLeft.x, upLeft.y + size);
		//sets bounds for mouse events
		this.bounds = paper.rect(upLeft.x, upLeft.y, size, size);
		this.bounds.attr({stroke:'black', fill:'black'});

		this.directions = new Array('NW', 'NE', 'SE', 'SW');
		this.direction = direction;

		this.arc = undefined;
		this.arcString = undefined;
		this.renderArc(direction);
	}

	renderArc(direction) {
		if (direction == null) { //should catch null and undefined
			this.renderArc(this.directions[Math.floor(Math.random() * this.directions.length)]);
		} else {
			this.direction = direction;
			switch(direction) {
				case 'SW':
					this.arcString = this.stringBuilder(this.upLeft, this.lowLeft, this.lowRight);
					break;
				case 'NW':
					this.arcString = this.stringBuilder(this.lowLeft, this.upLeft, this.upRight);
					break;
				case 'NE':
					this.arcString = this.stringBuilder(this.upLeft, this.upRight, this.lowRight);
					break;
				case 'SE':
					this.arcString = this.stringBuilder(this.upRight, this.lowRight, this.lowLeft);
					break;
			}
			this.arc = this.paper.path(this.arcString);
			this.arc.attr({stroke:'white', 'stroke-width':'1.5'});
		}
	}

	stringBuilder(start, control, end) {
		let startString = `M ${start.x} ${start.y}`;	
		let controlString = `Q ${control.x} ${control.y}`
		let endString = `${end.x} ${end.y}`;	
		return `${startString} ${controlString} ${endString}`;
	}

	nextDirection() {
		let i = this.directions.indexOf(this.direction);

		if (i + 1 < this.directions.length) {
			this.renderArc(this.directions[i + 1]);
		} else {
			this.renderArc(this.directions[0]); //wrap to first element
		}
	}
}

function point(x,y) {
	let obj = {
		x: x,
		y: y
	}
	return obj;
}

window.onload = function() {
	let tileSize = 30;

	//stackexchange: https://stackoverflow.com/questions/3437786/get-the-size-of-the-screen-current-web-page-and-browser-window
	var width = window.innerWidth
	|| document.documentElement.clientWidth
	|| document.body.clientWidth;

	var height = window.innerHeight
	|| document.documentElement.clientHeight
	|| document.body.clientHeight;

	tileColumns = Math.floor(width/tileSize) 
	tileRows = Math.floor(height/tileSize) 
	canvasWidth = tileColumns * tileSize;
	canvasHeight = tileRows * tileSize;

	var paper = new Raphael(document.getElementById('canvas_container'), canvasWidth, canvasHeight);


	let wall = new Array();
	for (var i = 0; i < tileColumns; i++) {
		for (var j = 0; j < tileRows; j++) {
			wall.push(new Tile(paper, point(i * tileSize, j * tileSize), tileSize));
		}
	}

	function rotate90() {
		console.log('hi');
		wall[0].arc.animate(rotater);
	}

	rotater = Raphael.animation({transform: '...r90'}, 250);

	//good mouseover testing
	//function() { this.attr({ 'fill': Raphael.getColor() }) }

	wall[0].bounds.mouseover(rotate90);

}
