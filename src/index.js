'use strict';
require('./style.css');
const Matter = require('matter-js');
const Engine = Matter.Engine;
const World = Matter.World;
const { Box, Circle } = require('./shapes');
const canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d');
global.engine = Engine.create();
/*const render = Render.create({
   element: document.body,
   engine: global.engine,
});*/
window.addEventListener('resize', () => {
   canvas.width = window.innerWidth;
   canvas.height = window.innerHeight;
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
const ground = new Box(window.innerWidth / 2, window.innerHeight - 50, window.innerWidth, 100, { isStatic: true });
ground.stayForever = true;
const circle = new Circle(window.innerWidth / 2 - window.innerWidth / 10, 300, unitSize * 1.5);
circle.stayForever = true;
circle.body.friction = 0;
circle.body.restitution = 1;
global.shapes = [boxA, boxB, boxC, boxD, ground, circle];
console.log(circle.body);
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
   lastTime = time;
   ctx.clearRect(0, 0, canvas.width, canvas.height);
   const deleteArray = [];
   for (const [index, shape] of global.shapes.entries()) {
      if (!shape.stayForever) {
         shape.time += delta ? delta : 1 / 60;
      }
      if (!shape.stayForever && shape.time > 10) {
         deleteArray.push(index);
         Matter.Composite.remove(global.engine.world, shape.body);
         continue;
      }
      ctx.fillStyle = shape.color;
      ctx.save();
      ctx.translate(Math.round(shape.body.position.x), Math.round(shape.body.position.y));
      ctx.rotate(shape.body.angle);
      if (shape.type === 'box') {
         ctx.fillRect(-shape.width / 2, -shape.height / 2, shape.width, shape.height);
      } else if (shape.type === 'circle') {
         ctx.beginPath();
         ctx.arc(0, 0, shape.radius, 0, Math.PI * 2);
         ctx.fill();
      }
      ctx.restore();
   }
   for (const index of deleteArray) {
      global.shapes.splice(index, 1);
   }
   requestAnimationFrame(render);
})();
function addToWorld(objects) {
   World.add(global.engine.world, objects);
}
