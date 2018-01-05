import * as PIXI from 'pixi.js';

const loader = PIXI.loader;

interface ITextures {
  loader: any;
}

class Textures implements ITextures {
  loader = null;
  bunny = null;
  app = null;

  constructor(loader, app) {
    console.error('loaded');
    this.app = app;
    this.init(loader);
  }

  setTexture(name: string, path?: string) {
    if (!path) {
      this.loader
        .add(name)
        .load((loader, resources) => {
          console.error('loader', loader, 'res', resources)
          this[name] = resources[name].texture;
        });
    } else {
      console.error('app', this.app)
      this.loader
        .add(name, path)
        .on('error', e => console.error('error', e))
        .on('loading', e => console.error('loading', e.progress))
        .load((loader, resources) => {
          console.error('loaded image', resources[name].url);
          const texture = resources[name].texture;
          this[name] = new PIXI.Sprite(texture);
        });
      this.app.stage.addChild(this[name]);
    }
  }

  init(loader) {
    this.loader = loader;
    this.setTexture('ya', 'src/img/ya.jpg');
  }
}

export default Textures;

