'use strict';
const { Bodies, World } = require('matter-js');
// MUAHAAHA IM EVIL
const defaultOptions = {
   friction: 0.3,
   restitution: 0.8,
};
module.exports = {
   Box: class Box {
      constructor(x, y, width, height, options = null, color = null) {
         this.type = 'box';
         this.body = Bodies.rectangle(
            x,
            y,
            width,
            height,
            options === null ? defaultOptions : { ...options, ...defaultOptions }
         );
         this.width = width;
         this.height = height;
         this.time = 0;
         if (options && options.isStatic) {
            this.stayForever = true;
         }
         if (color === null) {
            this.color = 'hsl(0, 100%, 0%)';
         } else {
            this.color = `hsl(${color}, 100%, 50%)`;
         }
         World.add(global.engine.world, [this.body]);
      }
   },
   Circle: class Circle {
      constructor(x, y, radius, options = null, color = null) {
         if (color === null) {
            this.color = 'hsl(0, 100%, 0%)';
         } else {
            this.color = `hsl(${color}, 100%, 50%)`;
         }
         if (options && options.isStatic) {
            this.stayForever = true;
         }
         this.time = 0;
         this.type = 'circle';
         this.body = Bodies.circle(x, y, radius, options === null ? defaultOptions : { ...options, ...defaultOptions });
         this.radius = radius;
         World.add(global.engine.world, [this.body]);
      }
   },
};
