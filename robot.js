var animate = window.requestAnimationFrame || 
							window.webkitRequestAnimationFrame || 
							window.mozRequestAnimationFrame || 
							function(callback) 
							{
							 window.setTimeout(callback, 1000/60) 
							};

var canvas          = document.createElement('canvas');
var width           = 500;
var height          = 500;
canvas.width        = width;
canvas.height       = height;
var context         = canvas.getContext('2d');
var commandSequence = [];




function Robot(x, y, width, height) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.facing = 'n';
}

Robot.prototype.render = function() {
  context.fillStyle = "#0000FF";
  context.fillRect(this.x, this.y, this.width, this.height);
};

Robot.prototype.move = function(x, y) {
  this.x += x;
  this.y += y;
};

Robot.prototype.place = function(x,y,f) 
{
	this.x = x;
	this.y = y;
	this.facing = f;
};




function Player() {
	this.robot = new Robot(0, 400, 100, 100);
}

Player.prototype.render = function() {
  this.robot.render();
};

Player.prototype.place = function(x,y,f) 
{
	this.robot.place(x,y,f);
};




var player = new Player();

var render = function() {
  context.fillStyle = "#BBBBBB";
  context.fillRect(0, 0, width, height);
  player.render();
};

var step = function() 
{
  render();
  animate(step);
};

window.onload = function() 
{
  document.body.appendChild(canvas);
  animate(step);
};








function resetCommands()
{
	commandSequence = [];
	document.getElementById("sequence").innerHTML = '';
}

var updateSequence = function (){
	document.getElementById("sequence").innerHTML = '';
	for (var i in commandSequence) {
		var node = document.createElement("LI");
		var textnode = document.createTextNode(commandSequence[i]);
		node.appendChild(textnode);
		document.getElementById("sequence").appendChild(node);
	}
};

function addSequence(command){
	commandSequence.push(command);
	updateSequence();
};


function addPlace()
{
	var isNumeric = function(n) 
	{
	  return !isNaN(parseFloat(n)) && isFinite(n);
	};

	var x = document.getElementById("x").value;
	var y = document.getElementById("y").value;
	var f = document.getElementById("f").value;

	if (x === '' || !isNumeric(x)) { alert('Please key in a number for X (1 - 5)'); }
	else if (y === '' || !isNumeric(y)) { alert('Please key in a number for Y (1 - 5)'); }
	else if (f === '') { alert('Please key in a value for F (n, s, e, w)'); }
	else if ((f.charAt(0)) != "n" 
					&& f.charAt(0) != "s" 
					&& f.charAt(0) != "e" 
					&& f.charAt(0) != "w") { alert('F must be one of (n, s, e, w)'); }
 	else {
		addSequence('Place('+ x +','+ y +','+ f +')');
 	}		
};

function alertPlaceFirst()
{
	alert('You must place the robot first!');
}

function addMove() { 
	if (commandSequence[0] === undefined) {
		alertPlaceFirst();
	} else {
		addSequence('Move'); 
	}
}
function addLeft() { 
	if (commandSequence[0] === undefined) {
		alertPlaceFirst();
	} else {
		addSequence('Left'); 
	}
}
function addRight() { 
	if (commandSequence[0] === undefined) {
		alertPlaceFirst();
	} else {
		addSequence('Right'); 
	}
}
function addReport() { 
	if (commandSequence[0] === undefined) {
		alertPlaceFirst();
	} else {
		addSequence('Report'); 
	}
}

function alertFall()
{
		alert('Robot fall off table, all commands will be discarded!');
		resetCommands();
}

function resolvePlace(value) 
{
	var str = value.substring(6, value.length-1);
	var coordinates = str.split(',');
	if ((coordinates[0] * 100) < 0 || (coordinates[0] * 100) > 500 || (coordinates[1] * 100) < 0 || (coordinates[1] * 100) > 500) {
		alertFall();
	} else {
		player.place((coordinates[0] * 100)-100, (coordinates[1] * 100)-100, coordinates[2]);
	}
}


function resolveMove()
{
	if (player.robot.facing === 'n') {
		if (!((player.robot.y - 100) < 0)) { player.robot.move (0, -100); } 
		else { alertFall(); }
	}
	else if (player.robot.facing === 's') {
		if (!((player.robot.y + 100) >= 500)) { player.robot.move (0, +100); } 
		else { alertFall(); }
	}
	else if (player.robot.facing === 'e') {
		if (!((player.robot.x + 100) >= 500)) { player.robot.move (+100, 0); } 
		else { alertFall(); }
	}
	else if (player.robot.facing === 'w') {
		if (!((player.robot.x - 100) < 0)) { player.robot.move (-100, 0); } 
		else { alertFall(); }
	}
}

function resolveLeft()
{
	if (player.robot.facing === 'n') {
		player.robot.facing = 'w';
	}
	else if (player.robot.facing === 's') {
		player.robot.facing = 'e';
	}
	else if (player.robot.facing === 'e') {
		player.robot.facing = 'n';
	}
	else if (player.robot.facing === 'w') {
		player.robot.facing = 's';
	}
}

function resolveRight()
{
	if (player.robot.facing === 'n') {
		player.robot.facing = 'e';
	}
	else if (player.robot.facing === 's') {
		player.robot.facing = 'w';
	}
	else if (player.robot.facing === 'e') {
		player.robot.facing = 's';
	}
	else if (player.robot.facing === 'w') {
		player.robot.facing = 'n';
	}
}

function resolveReport()
{
	document.getElementById("report").innerHTML += '<p>X: '+
																								((player.robot.x/100)+1)+' | Y: '+
																								((player.robot.y/100)+1)+' | F: '+
																								player.robot.facing.toUpperCase()+
																								'<br />';
}



var runGame = function()
{
	var i = 0;
	var max = commandSequence.length;
	document.getElementById("report").innerHTML = '';
	
	function gameLoop() 
	{
		setTimeout(function(){
			if (commandSequence[i].toString().indexOf('Place') > -1) {
				resolvePlace(commandSequence[i]);
			}
			if (commandSequence[i].toString().indexOf('Move') > -1) {
				resolveMove(commandSequence[i]);
			}
			if (commandSequence[i].toString().indexOf('Left') > -1) {
				resolveLeft(commandSequence[i]);
			}
			if (commandSequence[i].toString().indexOf('Right') > -1) {
				resolveRight(commandSequence[i]);
			}
			if (commandSequence[i].toString().indexOf('Report') > -1) {
				resolveReport(commandSequence[i]);
			}
			i++;
			if (i < max && commandSequence[i] !== undefined) {
				gameLoop();
			} else {
				resetCommands();
			}
		}, 1000);
	}
	gameLoop();
};
