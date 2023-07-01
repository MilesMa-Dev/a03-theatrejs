import AudioManager from '@/utils/audio/AudioManager';
import Debug from '@/utils/Debug';
import { isDebug, SIZE } from '@/utils/setting';
import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import Camera from './Camera';
import PostProcessing from './PostProcessing';
import WorldBuilder from './world/WorldBuilder';
import ClickEffectAudio from '../assets/audio/click.mp3';

class Application {
    constructor() { }

    init() {
        this.canvas = document.getElementById('three');

        this.debug = Debug;

        this.scene = new THREE.Scene();
        this.camera = new Camera(this.scene, this.canvas);

        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true
        })
        this.renderer.setSize(SIZE.width, SIZE.height)
        this.renderer.setClearColor('#000000');
        this.renderer.physicallyCorrectLights = true;

        this.passes = new PostProcessing({
            renderer: this.renderer,
            scene: this.scene,
            camera: this.camera.viewer
        })

        this.initEvents();
        this.initAudio();
        this.initWorld();

        if (isDebug) {
            this.stats = new Stats();
            document.querySelector('.App').appendChild(this.stats.dom);
        }
    }

    initEvents() {
        this.onResizeHandler = this.resize.bind(this);
        window.addEventListener('resize', this.onResizeHandler);
        window.addEventListener('orientationchange', this.onResizeHandler, false);
    }

    initAudio() {
        const clickEffect = AudioManager.createEffect('click', ClickEffectAudio);
        clickEffect.preload = true;
    }

    initWorld() {
        this.worldBuilder = new WorldBuilder(this.scene);
    }

    resize() {
        SIZE.width = window.innerWidth;
        SIZE.height = window.innerHeight;

        this.camera.resize(SIZE.width, SIZE.height);

        this.renderer.setSize(SIZE.width, SIZE.height)
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 3));

        this.passes.resize(SIZE.width, SIZE.height);
    }

    update(delta, elapesd) {
        isDebug && this.stats.update();

        this.camera.update(delta);

        this.passes && this.passes.update();

        this.worldBuilder.update(delta, elapesd);
    }
}

export default new Application();