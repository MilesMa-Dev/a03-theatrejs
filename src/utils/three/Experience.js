import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { getIOSVersion } from '../platform.js';
import { Color, sRGBEncoding, Texture, TextureLoader, Vector2, Vector3, Vector4 } from 'three';
import { isDebug } from '../setting.js';

class Experience {
    /**
     * 处理材质贴图
     * @param {*} texture 
     * @param {*} isDiffuse 是否为颜色贴图
     */
    setThreeTexture(texture, isDiffuse = true, flipY = false) {
        if (!texture) {
            console.warn('cannot found texture');
            return;
        }

        if (isDiffuse) { // 颜色贴图处理
            texture.encoding = sRGBEncoding;
        }
        texture.flipY = flipY;
    }

    /**
     * 销毁物体
     * @param {*} child 
     * @param {*} parent 
     */
    disposeObject(child, parent) {
        if (child.geometry) {
            child.geometry.boundsTree && child.geometry.disposeBoundsTree();
            child.geometry.dispose();
            child.geometry = null;
        }
        if (child.material) {
            child.material.map && child.material.map.dispose();
            child.material.envMap && child.material.envMap.dispose();
            child.material.alphaMap && child.material.alphaMap.dispose();
            child.material.bumpMap && child.material.bumpMap.dispose();
            child.material.emissiveMap && child.material.emissiveMap.dispose();
            child.material.metalnessMap && child.material.metalnessMap.dispose();
            child.material.roughnessMap && child.material.roughnessMap.dispose();
            child.material.normalMap && child.material.normalMap.dispose();
            child.material.aoMap && child.material.aoMap.dispose();
            child.material.dispose();
            child.material = null;
        }
        if (child.skeleton) {
            child.skeleton.dispose();
            child.skeleton = null;
        }
        parent && parent.remove(child);
    }

    /**
     * 上传本地材质贴图
     * @param {*} callback 
     */
    uploadLocalTexture(callback) {
        if (!this.textureLoader) {
            this.textureLoader = new TextureLoader();
        }
        const inputEle = document.createElement("input");
        inputEle.name = 'file-input';
        inputEle.id = 'file-input';
        inputEle.type = 'file';
        inputEle.addEventListener('change', e => {
            // console.log('change', e, inputEle.files)
            const files = inputEle.files;
            this.textureLoader.load(window.URL.createObjectURL(files[0]), data => {
                callback(data)
            })
        })
        inputEle.click();
    }

    /**
     * 上传本地glb/gltf模型
     * @param {*} callback 
     */
    uploadLocalGlb(callback) {
        if (!this.gltfLoader) {
            const dracoLoader = new DRACOLoader();
            dracoLoader.setDecoderPath('https://static.ssl.jimingkeji.com.cn/libs/draco/');
            dracoLoader.setDecoderConfig({
                type: 'js'
            });
            const gltfLoader = new GLTFLoader();
            gltfLoader.setDRACOLoader(dracoLoader);
            this.gltfLoader = gltfLoader;
        }

        const inputEle = document.createElement("input");
        inputEle.name = 'file-input';
        inputEle.id = 'file-input';
        inputEle.type = 'file';
        inputEle.addEventListener('change', e => {
            // console.log('change', e, inputEle.files)
            const files = inputEle.files;
            this.gltfLoader.load(window.URL.createObjectURL(files[0]), data => {
                callback(data)
            })
        })
        inputEle.click();
    }

    uploadJSON(callback) {
        const inputEle = document.createElement("input");
        inputEle.name = 'file-input';
        inputEle.id = 'file-input';
        inputEle.type = 'file';
        inputEle.addEventListener('change', e => {
            // console.log('change', e, inputEle.files)
            const files = inputEle.files;
            const reader = new FileReader();//新建一个FileReader
            reader.readAsText(files[0], "UTF-8");//读取文件
            reader.onload = function (evt) { //读取完文件之后会回来这里
                const fileString = evt.target.result; // 读取文件内容
                callback(JSON.parse(fileString))
            }
        })
        inputEle.click();
    }

    /**
     * 是否支持反射（部分Metal版本不支持）
     * @returns 
     */
    isSupportReflect() {
        // return false;
        const isMetalError = /15.4/.test(getIOSVersion());
        return !isMetalError;
    }

    /**
     * IOS 15.1/15.2版本材质出错
     */
    isTextureError() {
        return /15.1|15.2/.test(getIOSVersion());
    }

    addMaterialDebug(material, debugFolder) {
        if (!isDebug || !material || !material.uniforms || !debugFolder) return;

        for (let key in material.uniforms) {
            if (material.uniforms[key].noDebug || key === 'uTime') continue;

            const value = material.uniforms[key].value;
            const label = material.uniforms[key].label || key;
            if (value instanceof Texture) { // 贴图
                debugFolder.addButton({ title: '上传', label: label }).on('click', () => {
                    this.uploadLocalTexture(texture => {
                        texture.encoding = value.encoding;
                        texture.mapping = value.mapping;
                        texture.flipY = value.flipY;
                        texture.wrapS = value.wrapS;
                        texture.wrapT = value.wrapT;

                        material.uniforms[key].value = texture;
                    });
                });
            } else if (typeof (value) === 'number') { // 数字
                debugFolder.addInput(material.uniforms[key], "value", {
                    step: 0.001,
                    label: label
                })
            } else if (value instanceof Color) { // 颜色
                const params = {
                    color: '#' + value.getHexString()
                }

                debugFolder.addInput(params, 'color', {
                    view: 'color',
                    label: label
                }).on('change', () => {
                    material.uniforms[key].value.set(params.color);
                })
            } else if (value instanceof Vector2) { // Vector2
                debugFolder.addInput(material.uniforms[key], "value", {
                    x: { step: 0.01 },
                    y: { step: 0.01 },
                    label: label
                })
            } else if (value instanceof Vector3) { // Vector3
                debugFolder.addInput(material.uniforms[key], "value", {
                    x: { step: 0.01 },
                    y: { step: 0.01 },
                    z: { step: 0.01 },
                    label: label
                })
            } else if (value instanceof Vector4) { // Vector4
                debugFolder.addInput(material.uniforms[key], "value", {
                    x: { step: 0.01 },
                    y: { step: 0.01 },
                    z: { step: 0.01 },
                    w: { step: 0.01 },
                    label: label
                })
            }
        }
    }

    addModelDebug(model, material, debugFolder) {
        if (!isDebug || !model || !debugFolder) return;

        if (!this.modelList) {
            this.modelList = {};
        }

        this.modelList[model.uuid] = model;

        debugFolder.addButton({ title: '上传', label: 'glb模型', }).on('click', () => {
            this.uploadLocalGlb(gltf => {
                gltf.scene.traverse(child => {
                    if (child.isMesh) {
                        child.material = material;
                    }
                    child.matrixAutoUpdate = false;
                })
                this.modelList[model.uuid].parent.add(gltf.scene);
                this.modelList[model.uuid].parent.remove(this.modelList[model.uuid]);
                this.modelList[model.uuid] = gltf.scene;
            });
        })
    }
}

export default new Experience();