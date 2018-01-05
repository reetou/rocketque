import UserSettingsStore from './UserSettingsStore';
import ApiStore from './ApiStore';
import { observable } from 'mobx';

interface IAppStore {
  userSettings?: any;
  api?: any;
  init?;
}

export default
class AppStore implements IAppStore {
  userSettings: any = null;
  api: any = null;

  constructor(userSettings: UserSettingsStore, api: ApiStore) {
    this.userSettings = userSettings;
    this.api = api;
  }

  @observable animateBackground = true;
  @observable animateBlocks = true;
  @observable showHealthBar = true;

  @observable hitAmount = 40;
  @observable health = 500;
  @observable gameSpeed = 7;

  @observable pauseGame: boolean = false;
  @observable startNew = false;
  @observable points: number = 0;

}
