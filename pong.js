// credit: originally appropriate from the very helpful pong clone tutorial by Matt Mongeau at https://robots.thoughtbot.com/pong-clone-in-javascript


// requestAnimationFrame: similar to setTimeout but doesn't make any calls
// when the browser tab is inactive: basically it's a browser-optimized
// setTimeout

var animate = window.requestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.mozRequestAnimationFrame ||
	function(callback) { window.setTimeout(callback, 1000/60)};
var canvas = document.createElement('canvas');
var width = 400;
var height = 600;
canvas.width = width;
canvas.height = height;
var context = canvas.getContext('2d');
var player1 = new Player(175, 580);
var player2 = new Player2(175, 10);
var ball = new Ball(200, 300);

var keysDown = {};

var render = function() {
	context.fillStyle = "#9e97b8";
	context.fillRect(0, 0, width, height);
	player1.render();
	player2.render();
	ball.render();
};

var update = function() {
	player1.update();
	player2.update(ball);
	ball.update(player1.paddle, player2.paddle);
};

// step: updates, renders, animates.
var step = function() {
	update();
	render();
	animate(step);
}

function Paddle(x, y, width, height) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.x_speed = 0;
	this.y_speed = 0;
};

Paddle.prototype.render = function() {
	context.fillStyle = "#0000FF";
	context.fillRect(this.x, this.y, this.width, this.height);
};

Paddle.prototype.move = function (x, y) {
	this.x += x;
	this.y += y;
	this.x_speed = x;
	this.y_speed = y;
	if (this.x < 0) { // all the way to the left
    	this.x = 0;
    	this.x_speed = 0;
  	} else if (this.x + this.width > 400) { // all the way to the right
    	this.x = 400 - this.width;
    	this.x_speed = 0;
  	}
};

function Player2(x, y) {
	this.start_x = x;
	this.start_y = y;
	this.paddle = new Paddle(this.start_x, this.start_y, 50, 10);
};

Player2.prototype.render = function() {
	this.paddle.render();
};

Player2.prototype.update = function() {
  for (var key in keysDown) {
		var value = Number(key);
		if (value == 37) { // left arrow
			this.paddle.move(-4, 0);
		} else if (value == 39) { // right arrow
			this.paddle.move(4,0);
		} else {
			this.paddle.move(0,0);
		}
	};
};

function Player(x, y) {
	this.start_x = x;
	this.start_y = y;
    this.paddle = new Paddle(this.start_x, this.start_y, 50, 10);
};

Player.prototype.render = function () {
    this.paddle.render();
};

Player.prototype.update = function () {
	for (var key in keysDown) {
		var value = Number(key);
		if (value == 65) { // use a to move left
			this.paddle.move(-4, 0);
		} else if (value == 68) { // use d to move right
			this.paddle.move(4,0);
		} else {
			this.paddle.move(0,0);
		}
	};
};


function Ball(x, y) {
	this.x = x;
	this.y = y;
	this.x_speed = 0;
	this.y_speed = 3;
};

Ball.prototype.render = function() {
	context.beginPath();
	context.arc(this.x, this.y, 5, 2 * Math.PI, false);
	context.fillStyle = '#000000';
	context.fill();
};

Ball.prototype.update = function (paddle1, paddle2) {
	this.x += this.x_speed;
	this.y += this.y_speed;
	var top_x = this.x - 5;
	var top_y = this.y - 5;
	var bottom_x = this.x + 5;
	var bottom_y = this.y + 5;

	if (this.x - 5 < 0) { // bouncing off of the left wall
		this.x = 5;
		this.x_speed = -this.x_speed;
	} else if (this.x + 5 > 400) { // bouncing off of the right wall
		this.x = 395;
		this.x_speed = -this.x_speed;
	}

	if (this.y < 0 || this.y > 600) { // point scored here
		this.x_speed = 0;
		this.y_speed = 3;
		this.x = 200;
		this.y = 300;
	};

	if (top_y > 300) { // hitting player's paddle
		if(top_y < (paddle1.height + paddle1.y) && bottom_y > paddle1.y && top_x < (paddle1.x + paddle1.width) && bottom_x > paddle1.x) {
			this.y_speed = -3;
			this.x_speed += (paddle1.x_speed / 2);
			this.y += this.y_speed;
		}
	} else {
		// hitting Player2's paddle
		if(top_y < (paddle2.y + paddle2.height) && bottom_y > paddle2.y && top_x < (paddle2.x + paddle2.width) && bottom_x > paddle2.x) {
      		this.y_speed = 3;
      		this.x_speed += (paddle2.x_speed / 2);
      		this.y += this.y_speed;
    	}
  	}
};


document.body.appendChild(canvas);
animate(step);

window.addEventListener('keydown', function (event) {
	keysDown[event.keyCode] = true;
});

window.addEventListener('keyup', function (event) {
	delete keysDown[event.keyCode];
});

// features: scores, two paddles on each side, two balls, horizontal, coffeescript, psychedelic changing colors as paddle re-renders. Then make the entire thing psychedelic

