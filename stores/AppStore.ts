import { observable } from 'mobx';

interface IAppStore {
  animateBackground: boolean;
  animateBlocks: boolean;
  showHealthBar: boolean;
  hitAmount: number;
  health: number;
  gameSpeed: number;
  pauseGame: boolean;
  gameEnd: boolean;
  startNew: boolean;
  points: number;
  hitOccurred: boolean;
  showPointsBar: boolean;
}

export default
class AppStore implements IAppStore {

  @observable animateBackground = false;
  @observable animateBlocks = false;
  @observable showHealthBar = false;
  @observable showPointsBar = false;

  @observable hitAmount = 40;
  @observable maxHealth = 350;
  @observable health = 350;
  @observable gameSpeed = 7;
  @observable hitOccurred = false;

  @observable started = false;
  @observable pauseGame = false;
  @observable gameEnd = false;
  @observable startNew = false;
  @observable points = 0;

}
