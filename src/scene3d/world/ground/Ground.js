import ObjectBase from "@/scene3d/ObjectBase";
import Debug from '@/utils/Debug';
import { isDebug } from "@/utils/setting";
import Experience from '@/utils/three/Experience';
import * as THREE from 'three';
import GroundReflectMaterial from './GroundReflectMaterial';
import ReflectMesh from './ReflectMesh';

export default class Ground extends ObjectBase {
    constructor() {
        super();

        this.setGround();
    }

    setGround() {
        const geometry = new THREE.PlaneGeometry(70, 70);
        geometry.rotateX(-Math.PI * 0.5)

        const ground = new ReflectMesh(geometry, { isRender: true });
        ground.material = new GroundReflectMaterial({});

        this.ground = ground;
        this.container.add(ground);

        if (isDebug) {
            const debugFolder = Debug.addFolder({
                title: 'ground',
                expanded: false
            });
            Experience.addMaterialDebug(ground.material, debugFolder);
        }
    }

    update(delta) {
    }

    dispose() {
        super.dispose();
    }
}