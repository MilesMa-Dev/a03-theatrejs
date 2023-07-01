import {
    LinearFilter,
    MathUtils,
    Matrix4, PerspectiveCamera, RGBAFormat, WebGLRenderTarget
} from 'three';

export default class Reflector {
    static instance;

    constructor() {
        if (Reflector.instance) {
            return Reflector.instance;
        }
        Reflector.instance = this;

        const textureWidth = 1024;
        const textureHeight = 1024;

        const textureMatrix = new Matrix4();
        const virtualCamera = new PerspectiveCamera();

        const parameters = {
            minFilter: LinearFilter,
            magFilter: LinearFilter,
            format: RGBAFormat,
        };

        const renderTarget = new WebGLRenderTarget(textureWidth, textureHeight, parameters);

        if (!MathUtils.isPowerOfTwo(textureWidth) || !MathUtils.isPowerOfTwo(textureHeight)) {

            renderTarget.texture.generateMipmaps = false;

        }

        this.getRenderTarget = function () {
            return renderTarget;
        };

        this.getRenderTextureMatrix = function () {
            return textureMatrix;
        };

        this.getVirtualCamera = function () {
            return virtualCamera;
        };

    }

    /**
     * 创建单例
     */
    static getInstance() {
        if (Reflector.instance) {
            return Reflector.instance;
        }
        return (Reflector.instance = new Reflector());
    }

}