import { Pane } from 'tweakpane';
import { isMobile } from './platform.js';
import { isDebug } from './setting.js';

class Debug {
  constructor() {
    if(!isDebug) return;

    this.debug = new Pane();
    this.debug.containerElem_.style.width = '320px';
    this.debug.containerElem_.style.right = '350px';

    if (isMobile()) {
      this.debug.dispose();
    }
    return this.debug.addFolder({ title: 'Debug' });
  }
}

export default new Debug();
