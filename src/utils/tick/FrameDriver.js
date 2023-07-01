import gsap from "gsap/all";

export default class FrameDriver {
  constructor() {
    this._tickList = [];
    this._pause = true;
  }

  start() {
    this._pause = false;
  }

  stop() {
    this._pause = true;
  }

  get pause() {
    return this._pause;
  }

  setFPS = (frameRate) => {
    gsap.ticker.fps(frameRate);
  }

  addTicker(ticker) {
    if (this._tickList.indexOf(ticker) === -1) {
      this._tickList.push(ticker);
    }
  }

  removeTicker(ticker) {
    const index = this._tickList.indexOf(ticker);
    if (index !== -1) {
      this._tickList.splice(index, 1);
    }
  }

  update(elapesd, delta, frame) {
    if (this._pause) return;
    for (const tick of this._tickList) {
      tick.update(delta, elapesd);
    }
  }
}