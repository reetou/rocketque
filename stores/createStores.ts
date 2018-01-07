import { observable } from 'mobx';
import AppStore from './AppStore';

export
interface IStores {
  app?;
}

function createStores(): IStores {
  const app = new AppStore();

  const s = observable({
    app,
  }) as IStores;

  return s;
}

export default createStores;
