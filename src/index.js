'use strict';
require('./style.css');
const rgb = require('./rgb');
const Matter = require('matter-js');
const { Box, Circle } = require('./shapes');
const math = require('improved-math');
const Engine = Matter.Engine;
const World = Matter.World;

const PIXI = require('pixi.js');
global.app = new PIXI.Application({
   width: window.innerWidth,
   height: window.innerHeight,
   view: document.querySelector('canvas'),
   antialias: true,
   resolution: window.devicePixelRatio,
   backgroundColor: rgb(255, 255, 255),
   autoDensity: true,
})
global.engine = Engine.create();
global.objects = new PIXI.Container();

app.stage.addChild(global.objects);

window.addEventListener('resize', () => {
   app.renderer.resize(window.innerWidth, window.innerHeight);
});

let drag = false;
let hue = 0;
window.addEventListener('mousedown', () => {
   drag = true;
});
window.addEventListener('mousemove', (event) => {
   if (!drag) return;
   global.shapes.push(new Circle(event.pageX, event.pageY, unitSize / 5, null, hue));
});
window.addEventListener('mouseup', () => {
   drag = false;
});
const unitSize = 50;
const boxA = new Box(window.innerWidth / 4, 50, unitSize * 3, unitSize * 3);
boxA.stayForever = true;
const boxB = new Box(window.innerWidth / 2 + window.innerWidth / 5, 50, unitSize * 3, unitSize * 3);
boxB.stayForever = true;
const boxC = new Box(window.innerWidth / 2, -150, unitSize * 3, unitSize * 3);
boxC.stayForever = true;
const boxD = new Box(window.innerWidth / 2 - window.innerWidth / 10, -150, unitSize * 3, unitSize * 3);
boxD.stayForever = true;
const boxE = new Box(10, window.innerHeight / 2, 20, window.innerHeight, { isStatic: true });
boxE.stayForever = true;
const boxF = new Box(window.innerWidth - 10, window.innerHeight / 2, 20, window.innerHeight, { isStatic: true });
boxF.stayForever = true;
const ground = new Box(window.innerWidth / 2, window.innerHeight - 50, window.innerWidth, 100, { isStatic: true });
ground.stayForever = true;
const ground2 = new Box(
   window.innerWidth / 2,
   window.innerHeight - 100,
   window.innerWidth / 4,
   50,
   { isStatic: true },
   34
);
ground2.body.restitution = 1;
ground2.body.friction = 0.01;
ground2.stayForever = true;
const circle = new Circle(window.innerWidth / 2 - window.innerWidth / 10, 300, unitSize * 1.5);
circle.stayForever = true;
circle.body.friction = 0;
circle.body.restitution = 1;
global.shapes = [boxA, boxB, boxC, boxD, boxE, boxF, ground, circle, ground2];

addToWorld(global.shapes);
Engine.run(global.engine);
//Render.run(render);
let lastTime = 0;
(function render(time) {
   /*if (Math.random() > 0.8) {
      global.shapes.push(new Box(Math.random() * window.innerWidth, Math.random() * 150 + 50, unitSize, unitSize));
   }*/
   const delta = ((time != null ? time : 0) - lastTime) / 1000;
   hue = hue + (delta ? delta : 1 / 60) * 90;
   hue = hue % 360;
   lastTime = time;
   const x = math.map(hue, 0, 360, 0, window.innerWidth);
   if (Math.random() > 0.5) global.shapes.push(new Circle(x, 50, unitSize / 2, null, hue));

   for (let index = global.shapes.length - 1; index >= 0; index--) {
      const shape = global.shapes[index];
      shape.setToPhysics();
      if (!shape.stayForever) {
         shape.time += delta ? delta : 1 / 60;
      }
      if (!shape.stayForever && shape.time > 10) {
         shape.remove();
         global.shapes.splice(index, 1);
      }
   }
   requestAnimationFrame(render);
})();
function addToWorld(objects) {
   World.add(global.engine.world, objects);
}
