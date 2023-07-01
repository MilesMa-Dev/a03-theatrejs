import { Color, Uniform, Vector3 } from "three";
import { BlendFunction, Effect, EffectAttribute } from "postprocessing";

import fragmentShader from "./glsl/depthEffect/fragment.glsl";
import Debug from "@/utils/Debug";
import { isDebug } from "@/utils/setting";

export default class DepthEffect extends Effect {
    constructor() {
        const params = {
            color: '#181b3f',
            strength: 207,
        }

        const uniforms = new Map([
            ["uColor", new Uniform(new Color(params.color))],
            ["uStrength", new Uniform(params.strength)]
        ]);

        super("DepthEffect", fragmentShader, {

            blendFunction: BlendFunction.Normal,
            attributes: EffectAttribute.DEPTH,
            uniforms: uniforms

        });

        if (isDebug) {
            const debugFolder = Debug.addFolder({
                title: 'pp - depth',
                expanded: false
            });

            debugFolder.addInput(params, 'color', {
                view: 'color',
                label: 'color'
            }).on('change', () => {
                uniforms.get("uColor").value.set(params.color)
            })

            debugFolder.addInput(params, 'strength', {
                min: 0.0,
                max: 500.0,
                step: 1,
                label: 'distance'
            }).on('change', () => {
                uniforms.get("uStrength").value = params.strength;
            })
        }
    }
}