import * as PIXI from "pixi.js";
import { circle, rectangle } from '../utils/shapes';

export function createRocket(x: number, y: number, colors?: object) {
  const container = new PIXI.Container();
  const body = rectangle(20, 0, 30, 100);
  const leftWing = circle(0, 80, 20, 0xffffff);
  const rightWing = circle(70, 80, 20, 0xffffff);
  const head = circle(35, -5, 15, 0xffffff);
  container.addChild(head);
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
  const text = new PIXI.Text('ЗДАРОВЬЕ', { fontFamily: 'Helvetica', fill: 0x000000, fontWeight: 'bold' });
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
