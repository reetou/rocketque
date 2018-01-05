import { action, observable } from 'mobx';
import styles from '../styles';

interface IUserSettings {
  settings?: object;
  defaultSettings?: object;
}

class UserSettingsStore implements IUserSettings {
  api: any = null;
  constructor(api) {
    this.api = api;
  }

  defaultSettings = {
    thumbnailMaxWidth: 120,
    showPostsCount: true,
    fontColor: 'black',
    backgroundColor: 'white',
    fetchDataAsync: true,
    loadThreadsData: false,
    loadThreadsPics: false,
    theme: styles.whiteTheme,
  };

  @observable settings: object = this.defaultSettings;

  @action
  getDefaultSettings = () => this.settings = this.defaultSettings

  @action
  saveSettings = () => {
    localStorage.setItem('settings', JSON.stringify(this.api.settings));
  }

  @action
  loadSettings = () => {
    const storageSettings = localStorage.getItem('settings');
    if (storageSettings) {
      this.settings = JSON.parse(storageSettings);
    }
  }

}

export default UserSettingsStore;
