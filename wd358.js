class Tile {
	constructor(paper, upLeft, size, direction) {
		this.paper = paper;
		this.size = size;
		this.upLeft = upLeft;
		this.upRight = point(upLeft.x + size, upLeft.y);
		this.lowRight = point(upLeft.x + size, upLeft.y + size);
		this.lowLeft = point(upLeft.x, upLeft.y + size);

		this.directions = new Array('NW', 'NE', 'SE', 'SW');
		this.direction = direction;

		this.arc = undefined;
		this.arcString = undefined;
		this.renderArc(direction);

		//sets bounds for mouse events
		this.bounds = undefined;
	}

	addBounds() {
		this.bounds = this.paper.rect(this.upLeft.x, this.upLeft.y, this.size, this.size);
		this.bounds.attr({stroke:'none', fill:'white', 'fill-opacity':'0.0'});
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

	rotate90() {
		let rotater = Raphael.animation({transform: '...r90'}, 250);
		console.log(this);
		this.arc.animate(rotater);
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
	paper.rect(0, 0, canvasWidth, canvasHeight).attr({'fill':'black'});


	let wall = new Array();
	for (var i = 0; i < tileColumns; i++) {
		for (var j = 0; j < tileRows; j++) {
			let tile = new Tile(paper, point(i * tileSize, j * tileSize), tileSize);
			wall.push(tile); 
		}
	}

	for (var i = 0; i < wall.length - 1; i++) {
		wall[i].addBounds();
		wall[i].bounds.mouseover(wall[i].rotate90.bind(wall[i]));
		wall[i].bounds.mouseout(wall[i].rotate90.bind(wall[i]));
	}
}
