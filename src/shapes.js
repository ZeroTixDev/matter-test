'use strict';
const { Bodies, World } = require('matter-js');
const PIXI = require('pixi.js');
const rgb = require('./rgb');

const defaultOptions = {
   friction: 0.3,
   restitution: 1,
};

function hsl(h, s, l){
    let r, g, b;

    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        var hue2rgb = function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

const getRectTexture = (width, height, color, renderer = app.renderer) => {
    const gfx = new PIXI.Graphics();
    
    gfx.beginFill(color);
    gfx.drawRect(0, 0, width, height);
    gfx.endFill();

    return renderer.generateTexture(gfx);
}

const getCircleTexture = (radius, color, renderer = app.renderer) => {
    const gfx = new PIXI.Graphics();
    
    gfx.beginFill(color);
    gfx.drawCircle(0, 0, radius);
    gfx.endFill();

    return renderer.generateTexture(gfx);
}

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
         this.body.inertia = 0.1;
         this.width = width;
         this.height = height;
         this.time = 0;
         if (options && options.isStatic) {
            this.stayForever = true;
         }
         if (color === null) {
            const _color = hsl(0, 100, 0);
            this.color = rgb(_color[0], _color[1], _color[2]);
         } else {
            const _color = hsl(color, 100, 50);
            this.color = rgb(_color[0], _color[1], _color[2]);
         }
         this.color = rgb(0, 0, 200); // idc about hue nwo
         World.add(global.engine.world, [this.body]);

         const texture = getRectTexture(width, height, this.color);
         this.sprite = new PIXI.Sprite(texture);
         this.sprite.x = this.x;
         this.sprite.y = this.y;
         this.sprite.anchor.set(0.5);
         global.objects.addChild(this.sprite);
      }
      setToPhysics() {
         this.sprite.x = this.body.position.x;
         this.sprite.y = this.body.position.y;
         this.sprite.rotation = this.body.angle;
      }
      remove() {
         World.remove(global.engine.world, [this.body]);
         global.objects.removeChild(this.sprite);
      }
   },
   Circle: class Circle {
      constructor(x, y, radius, options = null, color = null) {
         if (color === null) {
            const _color = hsl(0, 100, 0);
            this.color = rgb(_color[0], _color[1], _color[2]);
         } else {
            const _color = hsl(color, 100, 50);
            this.color = rgb(_color[0], _color[1], _color[2]);
         }
         this.color = rgb(0, 0, 0); // idc about hue nwo
         if (options && options.isStatic) {
            this.stayForever = true;
         }
         this.time = 0;
         this.type = 'circle';
         this.body = Bodies.circle(x, y, radius, options === null ? defaultOptions : { ...options, ...defaultOptions });
         this.radius = radius;
         World.add(global.engine.world, [this.body]);

         const texture = getCircleTexture(this.radius, this.color);
         this.sprite = new PIXI.Sprite(texture);
         this.sprite.x = this.x;
         this.sprite.y = this.y;
         this.sprite.anchor.set(0.5);
         global.objects.addChild(this.sprite);
         
      }
      setToPhysics() {
         this.sprite.x = this.body.position.x;
         this.sprite.y = this.body.position.y;
         this.sprite.rotation = this.body.angle;
      }
      remove() {
         global.objects.removeChild(this.sprite);
         World.remove(global.engine.world, [this.body]);
      }
   },
};
