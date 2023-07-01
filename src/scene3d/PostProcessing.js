import { BlendFunction, EffectComposer, EffectPass, RenderPass, SMAAEffect } from "postprocessing";
import DepthEffect from "./postEffects/DepthEffect";
import SBloomEffect from "./postEffects/SBloomEffect";

export default class PostProcessing {
    constructor(options) {
        this.renderer = options.renderer;
        this.scene = options.scene;
        this.camera = options.camera;

        this.renderPass = new RenderPass(this.scene, this.camera);

        this.antialiasEffect = new SMAAEffect();
        this.antialiasEffect.edgeDetectionMaterial.edgeDetectionThreshold = 0.05;

        this.depthEffect = new DepthEffect();

        this.bloomEffect = new SBloomEffect(this.scene, this.camera, {
            blendFunction: BlendFunction.ADD,
            mipmapBlur: false,
            luminanceThreshold: 0.065,
            luminanceSmoothing: 0.467,
            intensity: 10.,
            radius: 0.565,
        });

        this.composer = new EffectComposer(this.renderer);
        this.composer.addPass(this.renderPass);

        this.effectPass = new EffectPass(this.camera, this.antialiasEffect, this.depthEffect, this.bloomEffect);
        this.composer.addPass(this.effectPass);
    }

    update() {
        this.composer.render();
    }

    resize(width, height) {
        this.composer && this.composer.setSize(width, height);
    }

    dispose() {
    }
}