import { Color, Uniform, Vector2, Vector3 } from "three";
import { BlendFunction, Effect, EffectAttribute } from "postprocessing";

import fragmentShader from "./glsl/blurEffect/fragment.glsl";
import Debug from "@/utils/Debug";
import { isDebug } from "@/utils/setting";

export default class BlurEffect extends Effect {
    constructor() {
        const params = {
            strength: new Vector2(-1., 2.3)
        }

        const uniforms = new Map([
            ["uStrength", new Uniform(params.strength)]
        ]);

        super("BlurEffect", fragmentShader, {

            blendFunction: BlendFunction.Normal,
            uniforms: uniforms

        });

        if (isDebug) {
            const debugFolder = Debug.addFolder({
                title: 'pp - blur',
                expanded: false
            });

            debugFolder.addInput(params, 'strength', {
                x: {min: -10.0, max: 10, step: 0.001},
                y: {min: -10.0, max: 10, step: 0.001},
                label: 'strength'
            }).on('change', () => {
                uniforms.get("uStrength").value = params.strength;
            })
        }
    }
}