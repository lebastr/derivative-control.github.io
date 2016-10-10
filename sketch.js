var ship;
var Step = 0.01;
var Score = 50;
var Balls = [];
var Active = false;

var Ball = {
    x : 0,
    y : 0,
    score: 10,
    diameter: 10,
    active: true,
    
    draw: function draw(){
	if (this.active){
	    stroke(0);
	    if (this.score > 0){
		fill(0,200,0);
	    } else {
		fill(200, 0, 0);
	    }
	    
	    ellipse(this.x + width/2, this.y + height/2, this.diameter, this.diameter);
	}
    }
};

function checkCollision(){
    Balls.forEach(function(b) {
	if (b.active){
	    var distance = sqrt((b.x - ship.x)*(b.x - ship.x) + (b.y - ship.y)*(b.y - ship.y));
	    if (2*distance < ship.diameter + b.diameter) {
		Score += b.score;
		b.active = false;
	    }
	}
    });
}

function generateBalls(s){
    var arr = []
    for (var i = 0; i < s.total; i++){
	var x = random(-width/2, width/2);
	var y = random(-height/2, height/2);
	var t = random(0, 1.0);
	var score;
	if (t < s.good){
	    score = 10;
	} else {
	    score = -10;
	}

	var b = Object.create(Ball);
	b.x = x;
	b.y = y;
	b.score = score;
	arr[i] = b;
    }
    
    return arr;
}

function setup() {
    createCanvas(1024, 768);
    Balls = generateBalls({ total: 40
			    , good: 0.2 });
    ship = {
	x: 0,
	y: 0,
	vx: 0,
	vy: 0,
	diameter: 10,
	
	draw: function() {
	    fill(255);
	    ellipse(this.x + width/2, this.y + height/2, this.diameter, this.diameter);
	    stroke(0,0,200);
	    line(width/2, height/2, width/2+this.vx, height/2+this.vy);
	    text("Vel", width/2+this.vx, height/2+this.vy);
	},

	move: function(ax, ay) {
	    this.x = this.x + this.vx*Step;
	    this.y = this.y + this.vy*Step;
	    this.vx = this.vx + ax*Step;
	    this.vy = this.vy + ay*Step;
	}
    };
}

function draw() {
    background(30);

    stroke(0);
    line(0,height/2, width, height/2);
    line(width/2,0, width/2, height);

    if(Active){
	ship.draw();
	
	Balls.forEach(function(b) {b.draw();});
	
	fill(150);
	text("Score: " + Score, 10,20);
	
	checkCollision();
	ship.move(touchX - width/2, touchY - height/2);
    } else {
	Balls.forEach(function(b) {b.draw();});

	fill(200,0,0);
	ellipse(width/2, height/2, 5, 5);
	fill(200);
	text("To start game click to the center of the crossline", width/2, height/2);
	
	
	fill(150);
	text("Score: " + Score, 10,20);

	if (mouseIsPressed || touchIsDown) {
	    Active = true;
	}
    }
}
