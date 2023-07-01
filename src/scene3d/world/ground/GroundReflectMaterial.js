
import Resources from '@/res/Resources';
import Experience from '@/utils/three/Experience';
import { Color, MirroredRepeatWrapping, RepeatWrapping, ShaderMaterial, Vector2, Vector3 } from 'three';
import fragmentShader from '../../shaders/ground/fragment.glsl';
import vertexShader from '../../shaders/ground/vertex.glsl';
import Reflector from './Reflector';

export default class GroundReflectMaterial {
    constructor(options) {
        const { flowmapTexture, perlinNoiseTexture } = Resources.getInstance().items;
        flowmapTexture.wrapS = flowmapTexture.wrapT = RepeatWrapping;
        perlinNoiseTexture.wrapS = perlinNoiseTexture.wrapT = MirroredRepeatWrapping;

        const renderTargetTexture = Reflector.getInstance().getRenderTarget().texture;
        const textureMatrix = Reflector.getInstance().getRenderTextureMatrix();

        const params = {
            color: '#2f2f2f',
            groundColor: '#305c56',
            textureWidth: 1024,
            textureHeight: 1024,
        }

        //38afa4

        const uniforms = {
            tDiffuse: { value: renderTargetTexture, noDebug: true },
            textureMatrix: { value: textureMatrix, noDebug: true },
            resolution: { value: new Vector2(params.textureWidth, params.textureHeight), noDebug: true },
            color: { value: new Color(params.color) },
            tDudv: { value: flowmapTexture },
            uvOffset: { value: new Vector2(0.5, 0.08) },
            uReflectMix: { value: 0.6 },
            uDirection: { value: new Vector2(1.18, 1.18) },
            uBluriness: { value: 3 },
            uGroundColor: { value: new Color(params.groundColor) },
            uDistortionStrength: { value: 0.8 },
        }

        const material = new ShaderMaterial({
            uniforms,
            vertexShader,
            fragmentShader,
        });

        material.defines.USE_BLUR = true;
        material.defines.IS_SUPPORT_REFLECT = Experience.isSupportReflect();

        return material;
    }
}