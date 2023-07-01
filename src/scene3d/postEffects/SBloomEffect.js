import {
    SelectiveBloomEffect
} from "postprocessing";

import Debug from "@/utils/Debug";
import { isDebug } from "@/utils/setting";

export default class SBloomEffect {
    constructor(scene, camera, options) {
        this.effect = new SelectiveBloomEffect(scene, camera, options);
        // this.effect.inverted = true;
        this.effect.ignoreBackground = true;

        this.effect.addSelection = (object) => {
            const selection = this.effect.selection;
    
            if(object !== null) {
    
                selection.toggle(object);
    
            }
        }

        if (isDebug) {
            const debugFolder = Debug.addFolder({
                title: 'pp - selectiveBloom',
                expanded: false
            });

            const effect = this.effect;
            const blendMode = effect.blendMode;

            debugFolder.addInput(effect, "intensity", {
                min: 0.0,
                max: 10.0,
                step: 0.001,
                label: 'intensity'
            })

            debugFolder.addInput(effect.mipmapBlurPass, "radius", {
                min: 0.0,
                max: 1.0,
                step: 0.001,
                label: 'radius'
            })

            debugFolder.addInput(effect.luminanceMaterial, "threshold", {
                min: 0.0,
                max: 1.0,
                step: 0.001,
                label: 'threshold'
            })

            debugFolder.addInput(effect.luminanceMaterial, "smoothing", {
                min: 0.0,
                max: 1.0,
                step: 0.001,
                label: 'smoothing'
            });

            debugFolder.addInput(blendMode.opacity, "value", {
                min: 0.0,
                max: 1.0,
                step: 0.01,
                label: 'opacity'
            })
        }

        return this.effect;
    }

    
}