import * as PIXI from 'pixi.js';
import createStores from './stores/createStores';
import * as _ from 'lodash';
import { circle, rectangle, triangle } from './utils/shapes';
import sleep from './utils/sleep';


const stores = createStores();
window['STORES'] = stores;
const loader = PIXI.loader;
const { app: store, api, userSettings } = stores;
const app = new PIXI.Application(innerWidth, innerHeight);
// The application will create a canvas element for you that you
// can then insert into the DOM
document.body.appendChild(app.view);
// make sure the renderer always covers the whole screen
window.onresize = () => {
  app.renderer.resize(innerWidth, innerHeight)
  rocket.x = app.renderer.width / 2 - rocket.width / 3;
};

const cosmoBackground = new PIXI.Container();

function randomlyPlaceCosmoCirclesAt(container: PIXI.Container) {
  for (let i = 1; i < innerWidth; i = i + 1) {
    const randomX = _.random(1 + i, innerWidth - i * _.random(10));
    const randomY = _.random(1 + i, innerHeight - _.random(100));
    const cosmoCircle = circle(randomX, randomY, 1, 0xffffff);
    container.addChild(cosmoCircle);
  }
}
randomlyPlaceCosmoCirclesAt(cosmoBackground);
app.stage.addChild(cosmoBackground);

function animateCosmo() {
  if (store.animateBackground) {
    const s = cosmoBackground.y;
    if (s > -innerHeight) {
      cosmoBackground.y -= 0.5;
    } else {
      cosmoBackground.y = 0;
    }
  }
  requestAnimationFrame(animateCosmo);
}

function createRocket(x: number, y: number, colors?: object) {
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

function createBlock(x, y, width: number = 60, height: number = 60, color: number = 0xffffff) {
  const container = new PIXI.Container();
  const rect = rectangle(0, 0, width, height, color);
  container.addChild(rect);
  container.x = x;
  container.y = y;
  return container;
}

function createLineOfBlocks(count, xStart = 0, yStart = 0, xSpace) {
  const container = new PIXI.Container();
  for (let i = 0; i < count; i = i + 1) {
    let x = xSpace * i;
    if (i > 0) {
      x += 60 * i;
    }
    const block = createBlock(x, 0, 60, 20);
    container.addChild(block);
    container.x = xStart;
    container.y = yStart;
  }
  return container;
}

function createHealthBar(x, y, width, height, fillColor = 0xffffff, bgColor = 0x000000) {
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
function createPointsBar(x, y, width, height, fillColor = 0xffffff, bgColor = 0x234fff) {
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


let lineOfBlocks = createLineOfBlocks(3, 200, 60, 150);
const healthBar = createHealthBar(0, 10, 350, 40);
const pointsBar = createPointsBar(innerWidth - 250, 10, 250, 40);

function checkRocketAndBlocksCollision(rocket: PIXI.Container, blocks: PIXI.Container) {
  if (!rocket || !blocks) {
    console.error('false')
    return false;
  }
  const isHit = hitTestRectangle(rocket, blocks);
  return isHit;
}

function hitTestRectangle(r1, r2) {

  // Define the variables we'll need to calculate
  let hit;
  let combinedHalfWidths;
  let combinedHalfHeights;
  let vx;
  let vy;

  // hit will determine whether there's a collision
  hit = false;

  // Find the center points of each sprite
  r1.centerX = r1.x + r1.width / 2;
  r1.centerY = r1.y + r1.height / 2;
  r2.centerX = r2.x + r2.width / 2;
  r2.centerY = r2.y + r2.height / 2;

  // Find the half-widths and half-heights of each sprite
  r1.halfWidth = r1.width / 2;
  r1.halfHeight = r1.height / 2;
  r2.halfWidth = r2.width / 2;
  r2.halfHeight = r2.height / 2;

  // Calculate the distance vector between the sprites
  vx = r1.centerX - r2.centerX;
  vy = r1.centerY - r2.centerY;

  // Figure out the combined half-widths and half-heights
  combinedHalfWidths = r1.halfWidth + r2.halfWidth;
  combinedHalfHeights = r1.halfHeight + r2.halfHeight;

  // Check for a collision on the x axis
  if (Math.abs(vx) < combinedHalfWidths) {

    // A collision might be occuring. Check for a collision on the y axis
    if (Math.abs(vy) < combinedHalfHeights) {

      // There's definitely a collision happening
      hit = true;
    } else {

      // There's no collision on the y axis
      hit = false;
    }
  } else {

    // There's no collision on the x axis
    hit = false;
  }

  // `hit` will be either `true` or `false`
  return hit;
}

function createGameOverScreen(x, y, text = `ТЫ ПРОИГРАЛ`, style?) {
  const container = new PIXI.Container();
  const title: PIXI.Text = new PIXI.Text(text, style);
  title.x = x - title.width / 2;
  title.y = y;
  const button: PIXI.Container = new PIXI.Container();
  button.interactive = true;
  button.buttonMode = true;
  const playAgain: PIXI.Text = new PIXI.Text(
    'Начать заново',
    { fill: 0xff7776, fontFamily: 'Helvetica' },
  );
  const buttonBg = rectangle(0, 5, playAgain.width * 1.5, playAgain.height * 1.5, 0xff3333);
  playAgain.x += 50;
  playAgain.y += 10;
  button.addChild(buttonBg);
  button.addChild(playAgain);
  button.x = x - button.width / 2;
  button.y = y + title.height * 1.5;
  button.on('click', startGame);
  container.addChild(title);
  container.addChild(button);
  return container;
}

const rocket = createRocket(app.renderer.width / 2, innerHeight - 200);

function handleInterface() {
  healthBar.visible = store.showHealthBar;
  requestAnimationFrame(handleInterface);
}

const createGameStateContainer = () => {
  const container = new PIXI.Container();
  const bg = rectangle(0, 0, app.renderer.width, app.renderer.height, 0x000000);
  container.addChild(bg);
  return container;
};
const gameStateContainer = createGameStateContainer();
// gameStateContainer.visible = false;
const gameOverScreen = points => createGameOverScreen(
  app.renderer.width / 2,
  app.renderer.height / 3,
  `ТЫ ПРОИГРАЛ\nОчков набрано: ${points}`,
  { fill: 0xff0000 },
);
gameStateContainer.visible = false;
const pauseText = new PIXI.Text('ПАУЗА\nENTER для старта', { fill: 0xad3333, fontWeight: 'bold', fontSize: 36, align: 'center' })
pauseText.x = app.renderer.width / 2 - pauseText.width / 2;
pauseText.y = 200;
app.stage.addChild(pauseText);
pauseText.visible = false;

function startGame() {
  gameStateContainer.visible = false;
  store.animateBlocks = true;
  store.showHealthBar = true;
  store.animateBackground = true;
  store.health = 350;
  store.startNew = true;
  rocket.x = app.renderer.width / 2 - rocket.width / 3;
  rocket.y = app.renderer.height / 1.5;
  pauseText.visible = false;
}

function resumeGame() {
  store.animateBlocks = true;
  store.showHealthBar = true;
  pauseText.visible = false;
  store.pauseGame = false;
}

function pauseGame() {
  store.animateBlocks = false;
  store.animateBackground = false;
  pauseText.visible = true;
  store.pauseGame = true;
}

let created = false;
function handleGameState() {
  if (store.startNew) {
    healthBar.children[1].width = store.health;
    store.points = 0;
    store.startNew = false;
  }
  if (healthBar.children[1].width <= 0) {
    gameStateContainer.visible = true;
    store.animateBlocks = false;
    store.showHealthBar = false;
    store.animateBackground = false;
    gameStateContainer.interactive = true;
    app.stage.removeChild(lineOfBlocks)
    if (!created) {
      gameStateContainer.addChild(gameOverScreen(store.points));
      created = true;
    }
  } else {
    pointsBar.children[1].text = 'Очки ' + store.points;
  }
  requestAnimationFrame(handleGameState);
}

let wasHit: boolean = false;
function animateBlocks() {
  if (store.gameEnd) {
    lineOfBlocks.visible = false;
  } else {
    lineOfBlocks.visible = true;
  }
  if (store.animateBlocks) {
    // Шорт-хенд для изменения контейнера, содержашего блоки
    // TODO: Создать отдельный контейнер для блоков, т.к. при анимации бекграунда ломается коллизия
    const container = app.stage;
    container.removeChild(container);
    container.addChild(lineOfBlocks);
    lineOfBlocks.y += store.gameSpeed;
    if (!wasHit && checkRocketAndBlocksCollision(rocket, lineOfBlocks)) {
      wasHit = true;
      console.error('hit');
      store.points -= 500;
      // Полоса здоровья становится шириной меньше на 20
      if (healthBar.children[1].width >= 0) {
        healthBar.children[1].width -= store.hitAmount;
        console.error('points', store.points);
      }
    } else if (!wasHit && !checkRocketAndBlocksCollision(rocket, lineOfBlocks)) {
      store.points += 1;
    }
    if (lineOfBlocks.y > app.renderer.height) {
      container.removeChild(lineOfBlocks);
      lineOfBlocks = createLineOfBlocks(_.random(1, 4), _.random(10, 200), 10, 150);
      wasHit = false;
      container.addChild(lineOfBlocks);
    }
  }
  requestAnimationFrame(animateBlocks);
}

function initKeyboardEvents() {
  window.addEventListener('keydown', e => {
    if (e.key === 'Enter' && store.pauseGame) {
      resumeGame();
    }
    if (store.pauseGame) {
      return;
    }
    const canMove = (val: number, axis: number, compare: number) => axis + val >= 0 && axis + val <= compare;
    if (e.key === 'ArrowLeft' && canMove(-60, rocket.x, innerWidth)) {
      rocket.x -= 40;
    }
    if (e.key === 'ArrowRight' && canMove(120, rocket.x, innerWidth)) {
      rocket.x += 40;
    }
    if (e.key === 'ArrowUp' && canMove(-100, rocket.y, innerHeight)) {
      rocket.y -= 40;
    }
    if (e.key === 'ArrowDown' && canMove(130, rocket.y, innerHeight)) {
      rocket.y += 40;
    }
    if (e.key === 'Escape') {
      pauseGame();
    }
  });
}

app.stage.addChild(rocket);
app.stage.addChild(healthBar);
app.stage.addChild(pointsBar);
app.stage.addChild(gameStateContainer);

rocket.interactive = true;
rocket.buttonMode = true;
rocket.on('click', e => console.error(e))

initKeyboardEvents();
animateCosmo();
animateBlocks();
handleInterface();
handleGameState();
