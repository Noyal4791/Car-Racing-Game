import * as THREE from 'three';
import { createCube } from './cube';
import { createCircle } from './circle';
import { createSquare } from './square';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';

let active = 0, health = 100;
let score = 0, time = 0, side = 1;
let lap = 1, set_lap = 0, stat = 0;
let fuel = 100, next_fuel = 200, prev_fuel = 0;
let idx = 1, set_idx = 0, rank = -1, cam = 1;
let dist = [], arr = [], startTime;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set( 0, 0, 0 );
camera.lookAt( 0, 20, 0 );

const frontcam = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
frontcam.position.set( 0, 0, 0 );
frontcam.lookAt( 0, 20, 0 );

const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.pointerEvents = 'none';
document.body.appendChild( labelRenderer.domElement );

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true }); 
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor( 0x87ceeb, 0.25 );
document.body.appendChild( renderer.domElement );

// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// const controls = new OrbitControls( camera, renderer.domElement );
// controls.update();

const webcam = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
webcam.position.set( 8.8, 0.25, 0 );
webcam.lookAt( 8.8, 0, 0 );

const renderer2 = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer2.setSize( window.innerWidth / 4, window.innerHeight / 4 );
renderer2.domElement.style.position = 'absolute';
renderer2.domElement.style.top = '2px';
renderer2.domElement.style.right = '2px';
document.body.appendChild( renderer2.domElement );

// ############################# AUDIENCE #############################
for (let i = -7.4; i < 5.5; i += 0.1) {
	scene.add( createCube(i, 0.01, -4.8, 0.02) );
	scene.add( createCube(i, 0.01, -5.2, 0.02) );
	scene.add( createCube(i, 0.01, 3.8, 0.02) );
	scene.add( createCube(i, 0.01, 4.2, 0.02) );
}

for (let i = -2.4; i < 1.4; i += 0.1) {
	scene.add( createCube(-10.4, 0.04, i, 0.02) );
	scene.add( createCube(-10.8, 0.04, i, 0.02) );
	scene.add( createCube(8.50, 0.01, i, 0.02) );
	scene.add( createCube(8.90, 0.01, i, 0.02) );
}

for (let i = 0; i <= 90; i += 5) {
	scene.add( createCube(5.5+3*Math.cos(Math.PI/180*i+3*Math.PI/2), 0.01, -2.4+2.4*Math.sin(Math.PI/180*i+3*Math.PI/2), 0.02) );
	scene.add( createCube(5.5+3.4*Math.cos(Math.PI/180*i+3*Math.PI/2), 0.01, -2.4+2.8*Math.sin(Math.PI/180*i+3*Math.PI/2), 0.02) );
	scene.add( createCube(-7.4+3*Math.cos(Math.PI/180*i+Math.PI), 0.04, -2.4+2.4*Math.sin(Math.PI/180*i+Math.PI), 0.02) );
	scene.add( createCube(-7.4+3.4*Math.cos(Math.PI/180*i+Math.PI), 0.04, -2.4+2.8*Math.sin(Math.PI/180*i+Math.PI), 0.02) );
	scene.add( createCube(-7.4+3*Math.cos(Math.PI/180*i+Math.PI/2), 0.04, 1.4+2.4*Math.sin(Math.PI/180*i+Math.PI/2), 0.02) );
	scene.add( createCube(-7.4+3.4*Math.cos(Math.PI/180*i+Math.PI/2), 0.04, 1.4+2.8*Math.sin(Math.PI/180*i+Math.PI/2), 0.02) );
	scene.add( createCube(5.5+3*Math.cos(Math.PI/180*i), 0.01, 1.4+2.4*Math.sin(Math.PI/180*i), 0.02) );
	scene.add( createCube(5.5+3.4*Math.cos(Math.PI/180*i), 0.01, 1.4+2.8*Math.sin(Math.PI/180*i), 0.02) );
}

scene.add( createCircle(9, 0.1, -1.2, 3) );
scene.add( createCircle(9, 0.1, -1.3, 3) );
scene.add( createCircle(9, 0.1, -1.7, 3) );
scene.add( createCircle(9, 0.1, -1.8, 3) );
scene.add( createCircle(9.1, 0.14, -1.25, 3) );
scene.add( createCircle(9.1, 0.14, -1.35, 3) );
scene.add( createCircle(9.1, 0.14, -1.65, 3) );
scene.add( createCircle(9.1, 0.14, -1.75, 3) );
scene.add( createCircle(0.5, 0.1, 3.6, 0) );
scene.add( createCircle(0.5, 0.14, 3.5, 0) );
scene.add( createCircle(0.6, 0.1, 3.6, 0) );
scene.add( createCircle(0.6, 0.14, 3.5, 0) );
scene.add( createCircle(0.0, 0.1, 3.6, 0) );
scene.add( createCircle(0.0, 0.14, 3.5, 0) );
scene.add( createCircle(0.1, 0.1, 3.6, 0) );
scene.add( createCircle(0.1, 0.14, 3.5, 0) );
scene.add( createCircle(-0.5, 0.1, 3.6, 0) );
scene.add( createCircle(-0.5, 0.14, 3.5, 0) );
scene.add( createCircle(-0.6, 0.1, 3.6, 0) );
scene.add( createCircle(-0.6, 0.14, 3.5, 0) );
scene.add( createCircle(-0.1, 0.1, 3.6, 0) );
scene.add( createCircle(-0.1, 0.14, 3.5, 0) );
scene.add( createCircle(-1.5, 0.1, 3.6, 0) );
scene.add( createCircle(-1.5, 0.14, 3.5, 0) );
scene.add( createCircle(-1.6, 0.1, 3.6, 0) );
scene.add( createCircle(-1.6, 0.14, 3.5, 0) );

scene.add( createSquare(9, 0.075, -1.2, 0x0000ff, 3) );
scene.add( createSquare(9, 0.075, -1.3, 0x00ff00, 3) );
scene.add( createSquare(9, 0.075, -1.7, 0x00ff00, 3) );
scene.add( createSquare(9, 0.075, -1.8, 0x0000ff, 3) );
scene.add( createSquare(9.1, 0.115, -1.25, 0x00ff00, 3) );
scene.add( createSquare(9.1, 0.115, -1.35, 0x0000ff, 3) );
scene.add( createSquare(9.1, 0.115, -1.65, 0x0000ff, 3) );
scene.add( createSquare(9.1, 0.115, -1.75, 0x00ff00, 3) );
scene.add( createSquare(0.5, 0.075, 3.6, 0x0000ff, 0) );
scene.add( createSquare(0.5, 0.115, 3.5, 0x00ff00, 0) );
scene.add( createSquare(0.6, 0.075, 3.6, 0x00ff00, 0) );
scene.add( createSquare(0.6, 0.115, 3.5, 0x0000ff, 0) );
scene.add( createSquare(0.0, 0.075, 3.6, 0x00ff00, 0) );
scene.add( createSquare(0.0, 0.115, 3.5, 0x0000ff, 0) );
scene.add( createSquare(0.1, 0.075, 3.6, 0x0000ff, 0) );
scene.add( createSquare(0.1, 0.115, 3.5, 0x00ff00, 0) );
scene.add( createSquare(-0.5, 0.075, 3.6, 0x0000ff, 0) );
scene.add( createSquare(-0.5, 0.115, 3.5, 0x00ff00, 0) );
scene.add( createSquare(-0.6, 0.075, 3.6, 0x00ff00, 0) );
scene.add( createSquare(-0.6, 0.115, 3.5, 0x0000ff, 0) );
scene.add( createSquare(-0.1, 0.075, 3.6, 0x0000ff, 0) );
scene.add( createSquare(-0.1, 0.115, 3.5, 0x00ff00, 0) );
scene.add( createSquare(-1.5, 0.075, 3.6, 0x0000ff, 0) );
scene.add( createSquare(-1.5, 0.115, 3.5, 0x00ff00, 0) );
scene.add( createSquare(-1.6, 0.075, 3.6, 0x00ff00, 0) );
scene.add( createSquare(-1.6, 0.115, 3.5, 0x0000ff, 0) );

// ############################# LIGHT #############################
const dl = new THREE.DirectionalLight( 0xfdb813, 0.25 );
dl.position.set( 0, 20, 0 );
scene.add(dl);
const al = new THREE.AmbientLight( 0xffffff, 1 );
al.position.set(0, 0, 0 );
scene.add(al);

let divContainer = [], p = [], div = [];
// first page text
p[0] = document.createElement('p');
p[0].className = 'show';
var str1 = `Instructions: \n  Collect the fuel cans to maintain the fuel level. \n  You lose the game if fuel = 0 or health = 0 \n  Health decreases on collision with opponents. \n  Complete two laps first to win the race. \n Press 'T' to toggle between camera views. \n\nGame Controls: \n    increase speed of car : 'W' key (or) up arrow key \n    apply brakes              : 'S' key (or) down arrow key \n    move car left             : 'A' key (or) left arrow key \n    move car right           : 'D' key (or) right arrow key`;
p[0].textContent = str1;

const h11 = document.createElement('h1');
h11.textContent = 'Press SPACE to continue';

div[0] = document.createElement('div');
div[0].appendChild(p[0]);
div[0].appendChild(h11);
divContainer[0] = new CSS2DObject(div[0]);
divContainer[0].position.set(0, 20, 0);
scene.add(divContainer[0]);

// start text
p[1] = document.createElement('p');
p[1].className = 'begin';
p[1].textContent = 'Press ENTER to start';

div[1] = document.createElement('div');
div[1].appendChild(p[1]);
divContainer[1] = new CSS2DObject(div[1]);
divContainer[1].position.set(8.8, 10, -20);
scene.add(divContainer[1]);

// last page text
// you lose
p[2] = document.createElement('h1');
p[2].className = 'end';
var str3 = `Game Over \n YOU LOSE!`;
p[2].textContent = str3;

div[2] = document.createElement('div');
div[2].appendChild(p[2]);
divContainer[2] = new CSS2DObject(div[2]);
divContainer[2].position.set(0, -20, 0);
scene.add(divContainer[2]);

// you finish first
p[3] = document.createElement('p');
p[3].className = 'first';
var str4 = `Game Finish \nPosition: 1 \nYOU WIN!`;
p[3].textContent = str4;

div[3] = document.createElement('div');
div[3].appendChild(p[3]);
divContainer[3] = new CSS2DObject(div[3]);
divContainer[3].position.set(0, -20, 0);
scene.add(divContainer[3]);

// you don't finish first
p[4] = document.createElement('p');
p[4].className = 'done';
var str5 = `Game Finish \nPosition: 2 \nBetter Luck Next Time`;
p[4].textContent = str5;

div[4] = document.createElement('div');
div[4].appendChild(p[4]);
divContainer[4] = new CSS2DObject(div[4]);
divContainer[4].position.set(0, -20, 0);
scene.add(divContainer[4]);

p[5] = document.createElement('p');
p[5].className = 'done';
var str5 = `Game Finish \nPosition: 3 \nBetter Luck Next Time`;
p[5].textContent = str5;

div[5] = document.createElement('div');
div[5].appendChild(p[5]);
divContainer[5] = new CSS2DObject(div[5]);
divContainer[5].position.set(0, -20, 0);
scene.add(divContainer[5]);

p[6] = document.createElement('p');
p[6].className = 'done';
var str5 = `Game Finish \nPosition: 4 \nBetter Luck Next Time`;
p[6].textContent = str5;

div[6] = document.createElement('div');
div[6].appendChild(p[6]);
divContainer[6] = new CSS2DObject(div[6]);
divContainer[6].position.set(0, -20, 0);
scene.add(divContainer[6]);

// ############################# 3D WORLD #############################
const loader = new GLTFLoader();
loader.load('../world/scene.gltf', function (gltf) {
	scene.add(gltf.scene);
}, undefined, function (error) {
	console.error(error);
});

let flag = [];
loader.load('../flag/scene.gltf', function (gltf) {
	let scaled = 0.05;
	flag[0] = gltf.scene;
	flag[0].rotateY(Math.PI/2);
	flag[0].position.set(8.7, 0, -0.1);
	flag[0].scale.set(scaled, scaled, scaled);
	scene.add(flag[0]);
}, undefined, function (error) {
	console.error(error);
});

loader.load('../flag/scene.gltf', function (gltf) {
	let scaled = 0.05;
	flag[1] = gltf.scene;
	flag[1].rotateY(Math.PI/2);
	flag[1].position.set(8.8, 0, -0.3);
	flag[1].scale.set(scaled, scaled, scaled);
	scene.add(flag[1]);
}, undefined, function (error) {
	console.error(error);
});

loader.load('../flag/scene.gltf', function (gltf) {
	let scaled = 0.05;
	flag[2] = gltf.scene;
	flag[2].rotateY(Math.PI/2);
	flag[2].position.set(8.7, 0, -0.4);
	flag[2].scale.set(scaled, scaled, scaled);
	scene.add(flag[2]);
}, undefined, function (error) {
	console.error(error);
});

// ############################# PLAYER #############################
let car = '';
loader.load('../car/scene.gltf', function (gltf) {
	let scaled = 0.02;
	car = gltf.scene;
	car.speed = 0;
	car.angle = 0;
	car.position.set(8.8, 0.01, 0);
	car.scale.set(scaled, scaled, -scaled);
	scene.add(car);
}, undefined, function (error) {
	console.error(error);
});

let myFlag = [];
loader.load('../myFlag/scene.gltf', function (gltf) {
	let scaled = 0.25;
	myFlag = gltf.scene;
	myFlag.position.set(8.8, 0.035, 0);
	myFlag.scale.set(scaled, scaled, scaled);
	scene.add(myFlag);
}, undefined, function (error) {
	console.error(error);
});

// ############################# OPPONENTS #############################
let player = [];
loader.load('../player/scene.gltf', function (gltf) {
	let scaled = 0.035;
	player[0] = gltf.scene;
	player[0].speed = 0;
	player[0].angle = 0;
	player[0].max_speed = 0.026;
	player[0].scale.set(scaled, scaled, -scaled);
	player[0].position.set(8.7, 0.01, -0.1);
	scene.add(player[0]);
}, undefined, function (error) {
	console.error(error);
});

loader.load('../player/scene.gltf', function (gltf) {
	let scaled = 0.035;
	player[1] = gltf.scene;
	player[1].speed = 0;
	player[1].angle = 0;
	player[1].max_speed = 0.028;
	player[1].scale.set(scaled, scaled, -scaled);
	player[1].position.set(8.8, 0.01, -0.3);
	scene.add(player[1]);
}, undefined, function (error) {
	console.error(error);
});

loader.load('../player/scene.gltf', function (gltf) {
	let scaled = 0.035;
	player[2] = gltf.scene;
	player[2].speed = 0;
	player[2].angle = 0;
	player[2].max_speed = 0.030;
	player[2].scale.set(scaled, scaled, -scaled);
	player[2].position.set(8.7, 0.01, -0.4);
	scene.add(player[2]);
}, undefined, function (error) {
	console.error(error);
});

// ############################# FUEL CANS #############################
let can = [];
loader.load('../can/scene.gltf', function (gltf) {
	let scaled = 0.0001;
	can[0] = gltf.scene;
	can[0].scale.set(scaled, scaled, scaled);
	can[0].position.set(8.75, 0.001, 0.5);
	scene.add(can[0]);
}, undefined, function (error) {
	console.error(error);
});

loader.load('../can/scene.gltf', function (gltf) {
	let scaled = 0.0001;
	can[1] = gltf.scene;
	can[1].rotateY(Math.PI/2);
	can[1].scale.set(scaled, scaled, scaled);
	can[1].position.set(0, 0.001, -5.1);
	scene.add(can[1]);
}, undefined, function (error) {
	console.error(error);
});

loader.load('../can/scene.gltf', function (gltf) {
	let scaled = 0.0001;
	can[2] = gltf.scene;
	can[2].scale.set(scaled, scaled, scaled);
	can[2].position.set(-10.65, 0.02, 0);
	scene.add(can[2]);
}, undefined, function (error) {
	console.error(error);
});

loader.load('../can/scene.gltf', function (gltf) {
	let scaled = 0.0001;
	can[3] = gltf.scene;
	can[3].rotateY(3 * Math.PI/2);
	can[3].scale.set(scaled, scaled, scaled);
	can[3].position.set(0, 0.001, 4.1);
	scene.add(can[3]);
}, undefined, function (error) {
	console.error(error);
});

// ############################# PROCESS INPUT #############################
function getRandom(min, max) {
	return Math.random() * (max - min) + min;
}

function appendZero(n) {
    return (n < 10) ? ("0" + n) : n;
}

var keyMap = [];
document.addEventListener('keydown', onDocumentKeyDown, true);
document.addEventListener('keyup', onDocumentKeyUp, true);
function onDocumentKeyDown(event) {
	var keyCode = event.keyCode;
	keyMap[keyCode] = true;
	// console.log(keyCode);
}
function onDocumentKeyUp(event) {
	var keyCode = event.keyCode;
	keyMap[keyCode] = false;
	if (keyCode == 84) {
		cam = 1 - cam;
	}
}
function keyInput() {
	if (!active) {
		if (keyMap[32]) {
			stat = 1;
			camera.position.set( 8.8, 0.1, 0.25 );
			camera.lookAt( 8.8, 0.1, 0 );
			frontcam.position.set( 8.8, 0.08, 0 );
			frontcam.lookAt( 8.8, 0.08, -10 );
		}

		if (stat && keyMap[13]) {
			active = 1;
			startTime = performance.now();
			divContainer[1].position.set(1000, 1000, 1000);
		}
	}

	if (active == 1) {
		if (car) {
			if (keyMap[87] || keyMap[38]) {
				if (car.speed < 0.03)
					car.speed += 0.001;
			}
			if (keyMap[83] || keyMap[40]) {
				if (car.speed >= 0.0015) 
					car.speed -= 0.0015;
				else 
					car.speed = 0;
			}
			if (keyMap[65] || keyMap[37]) {
				webcam.rotateZ(Math.PI/180 * 0.5);
				car.rotateY(Math.PI/180 * 0.5);
				myFlag.rotateY(Math.PI/180 * 0.5);
				camera.translateZ(-0.25);
				camera.rotateY(Math.PI/180 * 0.5);
				camera.translateZ(0.25);
				frontcam.rotateY(Math.PI/180 * 0.5);
				car.angle += 0.5;
			}
			if (keyMap[68] || keyMap[39]) {
				webcam.rotateZ(Math.PI/180 * (-0.5));
				car.rotateY(Math.PI/180 * (-0.5));
				myFlag.rotateY(Math.PI/180 * (-0.5));
				camera.translateZ(-0.25);
				camera.rotateY(Math.PI/180 * (-0.5));
				camera.translateZ(0.25);
				frontcam.rotateY(Math.PI/180 * (-0.5));
				car.angle -= 0.5;
			}
			if (keyMap[67]) {
				console.log(car.position);
			}

			let check = 0;
			if (car.position.x > 0 && car.position.z > 0) check++;
			if (car.position.x < 0 && car.position.z > 0) set_lap = 1;
			car.position.z -= car.speed * Math.cos(Math.PI/180 * car.angle);
			car.position.x -= car.speed * Math.sin(Math.PI/180 * car.angle);
			myFlag.position.z -= car.speed * Math.cos(Math.PI/180 * car.angle);
			myFlag.position.x -= car.speed * Math.sin(Math.PI/180 * car.angle);
			camera.position.z -= car.speed * Math.cos(Math.PI/180 * car.angle);
			camera.position.x -= car.speed * Math.sin(Math.PI/180 * car.angle);
			webcam.position.z -= car.speed * Math.cos(Math.PI/180 * car.angle);
			webcam.position.x -= car.speed * Math.sin(Math.PI/180 * car.angle);
			frontcam.position.z -= car.speed * Math.cos(Math.PI/180 * car.angle);
			frontcam.position.x -= car.speed * Math.sin(Math.PI/180 * car.angle);
			if (check && car.position.z < 0) {
				rank++;
				if (set_lap) {
					lap++;
					set_lap = 0
				}
			}

			if (set_lap && car.position.x > 0 && car.position.z < can[0].position.z) {
				can[0].position.set(8.75, 0.001, getRandom(-2, 0.8));
				can[1].position.set(getRandom(-6, 5.2), 0.001, -5.1);
				can[2].position.set(-10.65, 0.02, getRandom(-2, 0.8));
				can[3].position.set(getRandom(-6, 5.2), 0.001, 4.1);
			} 
			
			if (car.position.x > 0 && car.position.z < -3.5) side = 2
			if (car.position.z < 0 && car.position.x < -8.3) side = 3
			if (car.position.x < 0 && car.position.z > 2.4) side = 4
			if (car.position.z > 0 && car.position.x > 7) side = 1
			fuel -= Math.abs(car.speed) * 5;
			fuel = Math.max(0, fuel);

			let cnt = 0;
			if (-7.4 < car.position.x && car.position.x < 5.5) {
				if (-5.2 < car.position.z && car.position.z < -4.8) cnt += 2;
				else if (3.8 < car.position.z && car.position.z < 4.2) cnt += 2;
				else car.speed = 0.002;
			} else if (-2.4 < car.position.z && car.position.z < 1.4) {
				if (8.5 < car.position.x && car.position.x < 8.9) cnt += 2;
				else if (-10.8 < car.position.x && car.position.x < -10.4) cnt += 2;
				else car.speed = 0.002;
			} else {
				var i = car.angle;
				if (car.position.x > 0 && car.position.z < 0) {
					if (5.5 < car.position.x && car.position.x < 8.9) cnt++;
					if (-5.2 < car.position.z && car.position.z < -2.4) cnt++;
				} else if (car.position.x < 0 && car.position.z < 0) {
					if (-10.8 < car.position.x && car.position.x < -7.4) cnt++;
					if (-5.2 < car.position.z && car.position.z < -2.4) cnt++;
				} else if (car.position.x < 0 && car.position.z > 0) {
					if (-10.8 < car.position.x && car.position.x < -7.4) cnt++;
					if (1.4 < car.position.z && car.position.z < 4.2) cnt++;
				} else if (car.position.x > 0 && car.position.z > 0) {
					if (5.5 < car.position.x && car.position.x < 8.9) cnt++;
					if (1.4 < car.position.z && car.position.z < 4.2) cnt++;
				}
			}
			if (cnt < 2)
				car.speed = 0.002;
		}

		if (player.length == 3) {
			for (let i = 0; i < 3; i++) {
				if (player[i].speed < player[i].max_speed) {
					player[i].speed += 0.001;
				}
				if (player[i].position.x > 0 && player[i].position.z < -2) {
					if (player[i].speed > 0.025) {
						player[i].speed -= 0.002;
					} else  if (player[i].angle < 90 && player[i].position.z < -2.25) {
						player[i].angle += 1;
						player[i].rotateY(Math.PI/180 * 1);
						flag[i].rotateY(Math.PI/180 * 1);
					}
				}
				if (player[i].position.z < 0 && player[i].position.x < -6) {
					if (player[i].speed > 0.025) {
						player[i].speed -= 0.002;
					} else  if (player[i].angle < 180 && player[i].position.x < -8) {
						player[i].angle += 1;
						player[i].rotateY(Math.PI/180 * 1);
						flag[i].rotateY(Math.PI/180 * 1);
					}
				}
				if (player[i].position.x < 0 && player[i].position.z > 0.8) {
					if (player[i].speed > 0.025) {
						player[i].speed -= 0.002;
					} else  if (player[i].angle < 270 && player[i].position.z > 1.3) {
						player[i].angle += 1;
						player[i].rotateY(Math.PI/180 * 1);
						flag[i].rotateY(Math.PI/180 * 1);
					}
				}
				if (player[i].position.z > 0 && player[i].position.x > 4) {
					if (player[i].speed > 0.025) {
						player[i].speed -= 0.002;
					} else  if (player[i].angle < 360 && player[i].position.x > 6) {
						player[i].angle += 1;
						player[i].rotateY(Math.PI/180 * 1);
						flag[i].rotateY(Math.PI/180 * 1);
					}
				}
				if (player[i].angle == 360 && player[i].position.z < 0)
					player[i].angle = 0;
				
				let check = 0;
				if (player[i].position.x > 0 && player[i].position.z > 0) check++;
				player[i].position.z -= player[i].speed * Math.cos(Math.PI/180 * player[i].angle);
				player[i].position.x -= player[i].speed * Math.sin(Math.PI/180 * player[i].angle);
				flag[i].position.z -= player[i].speed * Math.cos(Math.PI/180 * player[i].angle);
				flag[i].position.x -= player[i].speed * Math.sin(Math.PI/180 * player[i].angle);
				if (check && player[i].position.z < 0) rank++;
			}
		}
	}
}

window.addEventListener('resize', function() {
	camera.aspect = this.window.innerWidth / this.window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
	labelRenderer.setSize(this.window.innerWidth, this.window.innerHeight);
	webcam.aspect = this.window.innerWidth / this.window.innerHeight;
	webcam.updateProjectionMatrix();
	renderer2.setSize(window.innerWidth / 4, window.innerHeight / 4);
})

// ############################# UPDATE STATUS #############################
function checkCollision() {
	for (let i = 0; i < player.length; i++) {
		var collide = 0;
		var delta_x = Math.abs(car.position.x - player[i].position.x);
		var delta_z = Math.abs(car.position.z - player[i].position.z);
		if (side % 2 == 1 && delta_x < 0.055 && delta_z < 0.16) collide++;
		if (side % 2 == 0 && delta_z < 0.055 && delta_x < 0.16) collide++;
		if (collide) {
			health = Math.max(0, health - 1);
			score = Math.max(0, score - 2);
			car.speed = Math.max(0, car.speed - 0.005);
		}
	}
}

function checkFuel() {
	for (let i = 0; i < can.length; i++) {
		var delta_x = Math.abs(car.position.x - can[i].position.x);
		var delta_z = Math.abs(car.position.z - can[i].position.z);
		if (delta_x < 0.04 && delta_z < 0.04) {
			can[i].position.set(0, 0, 0);
			fuel = 100;
		}

		// update next_fuel
		if (i == idx) {
			if (set_idx && next_fuel < 1) {
				idx++;
				set_idx = 0;
			}
			prev_fuel = next_fuel;
			next_fuel = 10 * (delta_x + delta_z);
			if (40 < next_fuel && next_fuel < 50) set_idx = 1;
			if (next_fuel > prev_fuel) {
				next_fuel = 200;
				idx++;
			}
			idx %= 4;
		}
	}
}

function updateData() {
	if (active) {
		if (car.speed) score += 0.1;
		let nowTime = performance.now();
		time = Math.floor((nowTime - startTime)/10);
	}

	let ms = appendZero(time % 100);
	time = Math.floor(time / 100);
	let min = appendZero(Math.floor(time / 60));
	let sec = appendZero(time % 60);

	const hhealth = `${health}`;
	const ffuel = `${fuel.toFixed(2)}`;
	const sscore = `${Math.floor(score)}`;
	const ccan = `${next_fuel.toFixed(2)}m`;
	const mmin = `${min}:${sec}:${ms}`;
	document.getElementById('health').innerHTML = 'Health: ' + hhealth;
	document.getElementById('fuel').innerHTML = 'Fuel: ' + ffuel;
	document.getElementById('score').innerHTML = 'Score: ' + sscore;
	document.getElementById('time').innerHTML = 'Time: ' + mmin;
	document.getElementById('can').innerHTML = 'Next Fuel Can: ' + ccan;
}

function checkStatus() {
	if (fuel == 0 || health == 0) {
		active = stat = 2;
		camera.position.set(0, 0, 0);
		camera.lookAt(0, -20, 0);
		for (let i = 3; i < 7; i++) 
			divContainer[i].position.set(1000, 1000, 1000);
	}
	if (lap == 2) {
		var idx = 3 + rank%4;
		active = stat = 2;
		camera.position.set(0, 0, 0);
		camera.lookAt(0, -20, 0);
		for (let i = 2; i < 7; i++) {
			if (i != idx)
				divContainer[i].position.set(1000, 1000, 1000);
		}
	}
}

// ############################# RENDER LOOP #############################
function animate() {
	requestAnimationFrame( animate );

	// controls.update();
	keyInput();

	if (stat == 1) 
		updateData();

	if (active == 1) {
		checkFuel(); 
		checkCollision();
		checkStatus();
	}

	labelRenderer.render( scene, camera );
	if (cam)
		renderer.render( scene, camera );
	else 
		renderer.render( scene, frontcam );
	if (stat == 1)
		renderer2.render( scene, webcam );
};

animate();