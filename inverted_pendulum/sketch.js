var pole_balancer;
var T = 0;
var Step = 0.01;
var Active = false;
var car_image;

function PoleBalancer(car_mass, pole_mass, pole_length){
    this.car_mass = car_mass;
    this.pole_mass = pole_mass;
    this.pole_length = pole_length;

    this.x_coord = 0;
    this.angle = 0.01;
    this.x_velocity = 0;
    this.angle_velocity = 0;
    this.engine_force = 0;

    this.change_power = function (f) {
	this.engine_force = f;
    };

    this.eval_acceleration = function () {
	var x = this.x_coord;
	var a = this.angle;
	var vx = this.x_velocity;
	var va = this.angle_velocity;
	var m = this.pole_mass;
	var M = this.car_mass;
	var l = this.pole_length;
	var f = this.engine_force;
	var g = 9.81;

	var denominator = (4*(M+m) - 3*m*cos(a)*cos(a));
	var x_accel = (4*f + 2*m*l*sin(a)*va*va - 3*m*g*cos(a)*sin(a)) / denominator;
	var a_accel = (6*g*sin(a)*(M+m) - 6*f*cos(a) - 3*m*l*sin(a)*cos(a)*va*va) / l / denominator;

	return [x_accel, a_accel];
    };

    this.move = function (step) {
	var [x_accel, a_accel] = this.eval_acceleration();
	this.x_coord += this.x_velocity * step;
	this.x_velocity += x_accel * step;
	this.angle += this.angle_velocity * step;
	this.angle_velocity += a_accel * step;
    }
    
    this.draw = function () {
	// Draw a car
	fill(200, 200, 0);
	push();
	scale(0.2);
	image(car_image, 5*10*this.x_coord - 100, -60);

	pop();

	//Draw a pole
	var dx = this.pole_length * sin(this.angle);
	var dy = this.pole_length * cos(this.angle);
	
	stroke(200,200,200);
	line(10*this.x_coord, 0, 10*(this.x_coord + dx), -10*dy);
    };

}

function setup() {
    createCanvas(1024, 768);
    pole_balancer = new PoleBalancer(5, 2, 15);
    car_image = loadImage("car.png"); 
}



function draw() {
    background(30);
    stroke(0);
    line(0,height/2, width, height/2);
    line(width/2, 0, width/2, height);

    stroke(255);
    fill(255);
    text("Time: " + T, 20,20); 

    var power = touchX - width/2;
    text("Power: " + power, 20, 50);

    translate (width/2, height/2);
    pole_balancer.draw();

    if(Active) {
	pole_balancer.move(Step);
	pole_balancer.change_power(power);
	T += Step;
    } else {
	fill(200);
	stroke(255);
    	text("To start the game click to the center of the crossline", 20, 0);
    	if (mouseIsPressed || touchIsDown) {
    	    Active = true;
    	}
    }

}
