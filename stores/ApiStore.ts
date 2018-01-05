import { action, computed, observable, toJS } from 'mobx';

interface IApiStore {
  route?: any;
  data?: any;
  ping?: any;
}

interface ICaptchaType {
  expires: number;
  id: string;
}

interface ICaptchaSettings {
  enabled?: number;
  result?: number;
  types?: ICaptchaType[];
}

class ApiStore implements IApiStore {

  @observable route: any = null;
  @observable data: any = null;
  @observable board: string = '';
  @observable threadData: any = null;
  @observable captchaSettings: ICaptchaSettings = {};
  @observable captcha: any = {};
  @observable captchaImage: string = '';
  @observable captchaValue: string = '';
  @observable recaptchaResponse: string = '';
  @observable sitekey: string = '6Le1gz4UAAAAAA7ypjVX5Rbo9gudxKQmY9-IRaxp';

  @computed get path() {
    return `https://2ch.hk`;
  }

  @computed get defaultPostPath() {
    return `makaba/posting.fcgi?json=1&task=post&name=anonim&email=someshit@mail.ru&image=0&board=${this.board}&thread=${this.threadData.current_thread}`;
  }

  @computed get captchaData() {
    const res = this.recaptchaResponse;
    return `captcha_type=recaptcha&captcha-key=${this.captcha.id}&g-recaptcha-response=${res}`;
  }

  @action
  getThreadData = async (thread) => {
    const threadData = await fetch(`${this.path}/${this.board}/res/${thread}.json`);
    const json = await threadData.json();
    if (threadData.ok) {
      console.error('data thread', thread, json);
      this.threadData = json;
    }
  }

  @action
  async getCaptchaSettings() {
    try {
      const data = await fetch(`${this.path}/api/captcha/settings/${this.board}`);
      if (data.ok) {
        const settings = await data.json();
        console.log('settings', settings);
        this.captchaSettings = settings;
        await this.getCaptchaId();
      }
    } catch (e) {
      return console.error('Error at getting captcha settings', e);
    }
  }

  @action
  async getCaptchaPublicKey(id) {
    try {
      const data = await fetch(`${this.path}/api/captcha/app/id/${id}`);
      const publicKey = await data.json();
      console.error('public key', publicKey, 'from url', data.url);
    } catch (e) {
      console.error('Error at getting public key', e);
    }
  }

  @action
  async getCaptchaId() {
    try {
      console.error('going to captcha id')
      const data = await fetch(`${this.path}/api/captcha/recaptcha/id`);
      const captcha = await data.json();
      this.captcha = captcha;
    } catch (e) {
      console.error('Error at get captcha', e);
    }
  }

  @action
  async sendPost() {
    if (!this.passcode) {
      const res = await fetch(
        `${this.path}/${this.defaultPostPath}&comment=Bump&${this.captchaData}`, {
          method: 'POST',
        });
      const json = await res.json();
      console.error('res', json);
    }
  }

  @action
  async verifyCaptcha() {
    try {
      const id = this.captcha.id;
      const value = this.captchaValue;
      const data = await fetch(`${this.path}/api/captcha/2chaptcha/check/${id}?value=${value}`);
      const verifyObj = data.json();
      console.error('verify object', toJS(verifyObj));
      return true;
    } catch (e) {
      console.error('Error at verifying captcha', e);
      return false;
    }
  }

  @action
  thumbnail(route: string) {
    return `${this.path}/${route}`;
  }

  @action
  fullPic(route: string) {
    return `${this.path}/${route}`;
  }

  @action
  getAllThreads = async (board: string = 'b') => {
    const data = await fetch(`${this.path}/${board}/index.json`, {
      method: 'GET',
      mode: 'cors',
      redirect: 'follow',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    });
    const json = await data.json();
    if (data.ok) {
      this.data = json;
      console.error('data', json);
    }
  }

  @action
  ping = async () => {
    await this.getAllThreads();
  }
}

export default ApiStore;
