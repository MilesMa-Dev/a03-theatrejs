import { Object3D } from 'three';

/**
 * 模型物体基类
 */
 export default class ObjectBase {
    constructor() {
        this.container = new Object3D();
        this.container.matrixAutoUpdate = false;
    }

    setModel() {
    }

    // 激活物体
    activate() {}

    // 静默物体
    deactivate() {}

    update() {}

    // 销毁物体
    dispose() {
        const disposeObject = (object) => {
            if (!object || !object.children) return;
            while (object.children.length) {
                const child = object.children[0];
                if (child.children.length) {
                    disposeObject(child);
                } else {
                    if (child.geometry) {
                        child.geometry.boundsTree && child.geometry.disposeBoundsTree();
                        child.geometry.dispose();
                        child.geometry = null;
                    }
                    
                    if (child.material) {
                        child.material.dispose();
                        child.material.map && child.material.map.dispose();
                        child.material.envMap && child.material.envMap.dispose();
                        child.material.alphaMap && child.material.alphaMap.dispose();
                        child.material.bumpMap && child.material.bumpMap.dispose();
                        child.material.emissiveMap && child.material.emissiveMap.dispose();
                        child.material.metalnessMap && child.material.metalnessMap.dispose();
                        child.material.roughnessMap && child.material.roughnessMap.dispose();
                        child.material.normalMap && child.material.normalMap.dispose();
                        child.material.aoMap && child.material.aoMap.dispose();
                        child.material = null;
                    }

                    object.remove(child);
                }
            }
        }

        // console.log(this)
        disposeObject(this.container);
      
        this.container = null;
        this.mesh = null;
        this.model = null;
        this.material = null;
    }
}
