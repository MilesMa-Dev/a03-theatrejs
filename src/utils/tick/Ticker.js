import gsap from 'gsap/all';
import FrameDriver from './FrameDriver';
import './RAF';

class Ticker {
  constructor() {
    this.driver = new FrameDriver();

    gsap.ticker.lagSmoothing(500, 17);
    gsap.ticker.add(this.tick);
  }

  tick = (elapesd, delta, frame) => {
    this.driver.update(elapesd, delta, frame);
  }

  setFPS = (frameRate) => {
    this.driver.setFPS(frameRate);
  }

  start() {
    this.driver.start();
  }

  stop() {
    this.driver.stop();
  }

  add(ticker) {
    this.driver.addTicker(ticker);
  }

  remove(ticker) {
    this.driver.removeTicker(ticker);
  }
}

export default new Ticker();