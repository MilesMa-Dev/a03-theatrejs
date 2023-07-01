import { SIZE, CameraConfig } from '../utils/setting';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import Theatre from '../utils/Theatre';
import { types } from '@theatre/core'

export default class Camera {
    constructor(scene, canvas) {
        this.viewer = new THREE.PerspectiveCamera(55, SIZE.width / SIZE.height, CameraConfig.near, CameraConfig.far);
        this.viewer.position.set(0, 0, 1);
        scene.add(this.viewer);
        this.viewer.rotation.reorder('YXZ');
        this.viewer.updateMatrixWorld();
        this.viewer.updateProjectionMatrix();

        // this.controls = new OrbitControls(this.viewer, canvas);
        // this.controls.enableDamping = true;
        // this.controls.enablePan = false;
        // this.controls.enableZoom = true;
        // this.controls.dampingFactor = 0.03;
        // this.controls.maxPolarAngle = Math.PI * 0.45;

        const cameraObj = Theatre.sheet.object('Camera', {
            // Note that the rotation is in radians
            // (full rotation: 2 * Math.PI)
            rotation: types.compound({
                x: types.number(this.viewer.rotation.x, { range: [-2, 2] }),
                y: types.number(this.viewer.rotation.y, { range: [-2, 2] }),
                z: types.number(this.viewer.rotation.z, { range: [-2, 2] }),
            }),
            position: types.compound({
                x: types.number(this.viewer.position.x, { range: [-1, 1] }),
                y: types.number(this.viewer.position.y, { range: [-1, 1] }),
                z: types.number(this.viewer.position.z, { range: [-1, 1] }),
            }),
            fov: types.number(this.viewer.fov, {range: [0, 180]})
        })

        cameraObj.onValuesChange((values) => {
            this.viewer.position.set(values.position.x * Math.PI, values.position.y * Math.PI, values.position.z * Math.PI)
            this.viewer.rotation.set(values.rotation.x * Math.PI, values.rotation.y * Math.PI, values.rotation.z * Math.PI)
            this.viewer.fov = values.fov;
            
            this.viewer.updateProjectionMatrix();
            this.viewer.updateMatrixWorld();
        })
    }

    resize(width, height) {
        this.viewer.aspect = width / height;
        this.viewer.updateProjectionMatrix();
    }

    update(delta) {
        // this.controls.update();
    }

    dispose() {
        this.viewer.dispose();
    }
}