import ObjectBase from '../ObjectBase';
import Ground from './ground/Ground';
import * as THREE from 'three';
import Resources from '../../res/Resources';
import Tubes from './Tubes';

export default class World extends ObjectBase {
    constructor() {
        super();

        this.setTubes();

        // this.setGround();
    }

    setTubes() {
        this.tubes = new Tubes();
        this.container.add(this.tubes.container);
    }

    setGround() {
        this.ground = new Ground();
        this.container.add(this.ground.container);
    }

    update(delta, elapesd) {
        this.tubes.update(delta, elapesd);
    }
}