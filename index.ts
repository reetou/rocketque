import * as PIXI from 'pixi.js';
import createStores from './stores/createStores';
import { rectangle } from './utils/shapes';
import {
  createHealthBar,
  createLineOfBlocks,
  createRocket,
  createPointsBar,
  randomlyPlaceCosmoCirclesAt,
  randomizeBlocksPositions,
} from './src/gameElements';
import { checkRocketAndBlocksCollision } from './src/collisionTest';


const stores = createStores();
const { app: store } = stores;
const app = new PIXI.Application(innerWidth, innerHeight);

document.body.appendChild(app.view);

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

function createMainMenuScreen(x, y, style?) {
  const container = new PIXI.Container();
  const button: PIXI.Container = new PIXI.Container();
  button.interactive = true;
  button.buttonMode = true;
  const playAgain: PIXI.Text = new PIXI.Text(
    'Начать игру',
    { fill: 0xff7776, fontFamily: 'Helvetica' },
  );
  const buttonBg = rectangle(0, 5, playAgain.width * 1.5, playAgain.height * 1.5, 0xff3333);
  playAgain.x += 50;
  playAgain.y += 10;
  button.addChild(buttonBg);
  button.addChild(playAgain);
  button.x = x - button.width / 2;
  button.y = y;
  button.on('click', startGame);
  container.addChild(button);
  return container;
}

const createGameStateContainer = () => {
  const container = new PIXI.Container();
  const bg = rectangle(0, 0, app.renderer.width, app.renderer.height, 0x000000);
  container.addChild(bg);
  return container;
};

function startGame() {
  if (!store.started) {
    store.started = true;
    mainMenuScreen.visible = false;
  }
  gameStateContainer.visible = false;
  store.animateBlocks = true;
  store.showHealthBar = true;
  store.showPointsBar = true;
  store.animateBackground = true;
  store.health = store.maxHealth;
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

function handleGameState() {
  if (!store.started) {
    gameStateContainer.visible = true;
    gameStateContainer.addChild(mainMenuScreen);
  }
  if (store.startNew) {
    store.health = store.maxHealth;
    store.points = 0;
    store.startNew = false;
  }
  if (store.health <= 0) {
    gameStateContainer.visible = true;
    store.animateBlocks = false;
    store.showHealthBar = false;
    store.animateBackground = false;
    gameStateContainer.interactive = true;
    if (!store.gameEnd) {
      gameStateContainer.addChild(gameOverScreen(store.points));
      store.gameEnd = true;
    }
  } else {
    pointsBar.children[1].text = 'Очки ' + store.points;
  }
  requestAnimationFrame(handleGameState);
}

function animateBlocks() {
  if (store.animateBlocks) {
    // Двигаем блоки
    lineOfBlocks.forEach(b => b.y += store.gameSpeed);
    const collision = checkRocketAndBlocksCollision(rocket, lineOfBlocks);
    if (!store.hitOccurred && collision) {
      store.hitOccurred = true;
      store.points -= 500;
      // Полоса здоровья становится шириной меньше на 20
      if (store.health >= 0) {
        store.health -= store.hitAmount;
      }
    } else if (!store.hitOccurred && !collision) {
      store.points += 1;
    }
    if (lineOfBlocks[0].y > app.renderer.height) {
      store.hitOccurred = false;
      const { width, height } = app.renderer;
      lineOfBlocks = randomizeBlocksPositions(lineOfBlocks, width, height, 120);
    }
  }
  requestAnimationFrame(animateBlocks);
}

function handleInterface() {
  healthBar.visible = store.showHealthBar;
  pointsBar.visible = store.showPointsBar;
  requestAnimationFrame(handleInterface);
}

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

function handleHealth() {
  healthBar.children[1].width = store.health;
  requestAnimationFrame(handleHealth);
}

function initKeyboardEvents() {
  window.addEventListener('keydown', e => {
    if (e.key === 'Enter' && store.pauseGame) {
      resumeGame();
    }
    if (store.pauseGame) {
      return;
    }
    const canMove = (val: number, axis: number, compare: number) => {
      return axis + val >= 0 && axis + val <= compare;
    };
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

const gameStateContainer = createGameStateContainer();
const gameOverScreen = points => createGameOverScreen(
  app.renderer.width / 2,
  app.renderer.height / 3,
  `ТЫ ПРОИГРАЛ\nОчков набрано: ${points}`,
  { fill: 0xff0000 },
);

const mainMenuScreen = createMainMenuScreen(
  app.renderer.width / 2,
  app.renderer.height / 3,
  { fill: 0xff0000 },
);

gameStateContainer.visible = false;
const pauseText = new PIXI.Text(
  'ПАУЗА\nENTER для старта',
  { fill: 0xad3333, fontWeight: 'bold', fontSize: 36, align: 'center' },
);
pauseText.x = app.renderer.width / 2 - pauseText.width / 2;
pauseText.y = 200;
app.stage.addChild(pauseText);
pauseText.visible = false;

const rocket = createRocket(app.renderer.width / 2, innerHeight - 200);
const cosmoBackground = new PIXI.Container();
randomlyPlaceCosmoCirclesAt(cosmoBackground);
let lineOfBlocks = createLineOfBlocks(3, 200, 60, 150);
const healthBar = createHealthBar(0, 10, 350, 40);
const pointsBar = createPointsBar(innerWidth - 250, 10, 250, 40);

app.stage.addChild(cosmoBackground);
lineOfBlocks.forEach(b => app.stage.addChild(b));
lineOfBlocks = randomizeBlocksPositions(lineOfBlocks, app.renderer.width, app.renderer.height, 120);
app.stage.addChild(rocket);
app.stage.addChild(healthBar);
app.stage.addChild(pointsBar);
app.stage.addChild(gameStateContainer);

initKeyboardEvents();
animateCosmo();
animateBlocks();
handleInterface();
handleGameState();
handleHealth();
