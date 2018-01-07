import * as PIXI from "pixi.js";
import { circle, rectangle, triangle } from '../utils/shapes';
import * as particles from 'pixi-particles';


function createFireParticle(container) {
  const emitter: particles.Emitter = new particles.Emitter(

    // The PIXI.Container to put the emitter in
    // if using blend modes, it's important to put this
    // on top of a bitmap, and not use the root stage Container
    container,

    // The collection of particle images to use

    ['src/img/particle.png', 'src/img/Fire.png'],
    // Emitter configuration, edit this to change the look
    // of the emitter
    {
      alpha: {
        start: 0.62,
        end: 0,
      },
      scale: {
        start: 0.25,
        end: 0.35,
      },
      color: {
        start: 'fff191',
        end: 'ff622c',
      },
      speed: {
        start: 500,
        end: 500,
      },
      startRotation: {
        min: 70,
        max: 100,
      },
      rotationSpeed: {
        min: 50,
        max: 50,
      },
      lifetime: {
        min: 0.1,
        max: 0.13,
      },
      blendMode: 'normal',
      frequency: 0.001,
      emitterLifetime: 0,
      maxParticles: 1000,
      pos: {
        x: 0,
        y: 0,
      },
      addAtBack: false,
      spawnType: 'circle',
      spawnCircle: {
        x: 0,
        y: 0,
        r: 10,
      },
    },
  );

// Calculate the current time
  let elapsed = Date.now();

// Update function every frame
  const update = function () {

    // Update the next frame
    requestAnimationFrame(update);

    const now = Date.now();

    // The emitter requires the elapsed
    // number of seconds since the last update
    emitter.update((now - elapsed) * 0.001);
    elapsed = now;

    // Should re-render the PIXI Stage
    // renderer.render(stage);
  };

// Start emitting
  emitter.emit = true;

// Start the update
  update();
}

export function createRocket(x: number, y: number, colors?: object) {
  const container = new PIXI.Container();
  const body = rectangle(20, 0, 30, 100);
  const leftA = new PIXI.Point(20, 50);
  const leftB = new PIXI.Point(20, 0);
  const leftC = new PIXI.Point(0, 50);
  const rightA = new PIXI.Point(20, 50);
  const rightB = new PIXI.Point(0, 0);
  const rightC = new PIXI.Point(0, 50);
  const leftWing = triangle(leftA, leftB, leftC, 0xffffff);
  const rightWing = triangle(rightA, rightB, rightC, 0xffffff);
  const head = circle(35, -5, 15, 0xffffff);
  const particleContainer = new PIXI.Container();
  createFireParticle(particleContainer);

  rightWing.x = 50;
  rightWing.y = 50;
  leftWing.x = 0;
  leftWing.y = 50;
  particleContainer.x = 35;
  particleContainer.y = 75;
  container.addChild(head);
  container.addChild(particleContainer);
  container.addChild(leftWing);
  container.addChild(body);
  container.addChild(rightWing);
  container.x = x - container.width / 3;
  console.error('container width', container.width)
  container.y = y;
  return container;
}

export function createBlock(x, y, width: number = 60, height: number = 60, color: number = 0xffffff) {
  const container = new PIXI.Container();
  const rect = rectangle(0, 0, width, height, color);
  container.addChild(rect);
  container.x = x;
  container.y = y;
  return container;
}

export function createLineOfBlocks(count, xStart = 0, yStart = 0, xSpace) {
  const blocksArr = [];
  for (let i = 0; i < count; i = i + 1) {
    let x = xSpace * i;
    if (i > 0) {
      x += 60 * i;
    }
    const block = createBlock(x, 0, 60, 20);
    blocksArr.push(block);
  }
  blocksArr[0].x = xStart;
  blocksArr[0].y = yStart;
  return blocksArr;
}

export function createHealthBar(x, y, width, height, fillColor = 0xffffff, bgColor = 0x000000) {
  const container = new PIXI.Container();
  const background = rectangle(0, 0, width, height, 0xff0000);
  const fill = rectangle(0, 0, width, height, fillColor);
  const text = new PIXI.Text('HP', { fontFamily: 'Helvetica', fill: 0x000000, fontWeight: 'bold' });
  container.addChild(background);
  container.addChild(fill);
  container.addChild(text);
  text.y = 5;
  container.x = x;
  container.y = y;
  container.width = width;
  container.height = height;
  return container;
}

export function createPointsBar(x, y, width, height, fillColor = 0xffffff, bgColor = 0x234fff) {
  const container = new PIXI.Container();
  const background = rectangle(0, 0, width, height, bgColor);
  const text = new PIXI.Text('Очки', { fontFamily: 'Helvetica', fill: 0x000000, fontWeight: 'bold' });
  container.addChild(background);
  container.addChild(text);
  text.y = 5;
  container.x = x;
  container.y = y;
  container.width = width;
  container.height = height;
  return container;
}
