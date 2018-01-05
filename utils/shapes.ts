import * as PIXI from 'pixi.js';

interface IPoint {
  x: number;
  y: number;
}

export const triangle = (a: IPoint, b: IPoint, c: IPoint, color: number) => {
  return new PIXI.Graphics()
    .beginFill(color)
    .moveTo(a.x, a.y)
    .lineTo(b.x, b.y)
    .lineTo(c.x, c.y)
    .lineTo(a.x, a.y)
    .endFill();
};

export const circle = (x: number, y: number, radius: number, color) => {
  return new PIXI.Graphics()
    .beginFill(color)
    .drawCircle(x, y, radius);
};

export const rectangle = (x, y, width: number, height: number, color: number = 0xFFFFFF) => {
  const r = new PIXI.Graphics()
    .beginFill(color)
    .drawRect(x, y, width, height);
  return r;
}