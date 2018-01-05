import ApiStore from './ApiStore';
import UserSettingsStore from './UserSettingsStore';
import { observable } from 'mobx';
import AppStore from './AppStore';

export
interface IStores {
  api?;
  userSettings?;
  app?;
  navigator?;
}

function createStores(): IStores {
  const api = new ApiStore();
  const userSettings = new UserSettingsStore(api);
  const app = new AppStore(userSettings, api);

  const s = observable({
    api,
    userSettings,
    app,
  }) as IStores;

  return s;
}

export default createStores;
