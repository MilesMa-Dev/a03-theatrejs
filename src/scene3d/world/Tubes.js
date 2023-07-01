import ObjectBase from "../ObjectBase";
import * as THREE from 'three';
import vertexShader from '../shaders/tube/vertex.glsl';
import fragmentShader from '../shaders/tube/fragment.glsl';
import { TubeGeometry } from "three";
import { DoubleSide } from "three";
import { createNoise3D } from 'simplex-noise';
import { AdditiveBlending } from "three";
import { Vector3 } from "three";
import { Color } from "three";
import { isDebug } from "../../utils/setting";
import Debug from '@/utils/Debug';
import Experience from '@/utils/three/Experience';
import Application from '../Application';


export default class Tubes extends ObjectBase {
    constructor() {
        super();

        this.noise3D = createNoise3D();
        this.setModel();
        this.setLight();

    }

    setModel() {
        this.material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: {
                uTime: { value: 0.0 },
                uLight1Position: { value: new Vector3(), noDebug: true },
                uLight1Color: { value: new Color(1.0, 0.0, 0.0), noDebug: true  },
                uLight1Strength: { value: 3.0 },
                uLight2Position: { value: new Vector3(), noDebug: true },
                uLight2Color: { value: new Color(0.0, 0.0, 1.0), noDebug: true  },
                uLight2Strength: { value: 3.0 }
            },
            side: DoubleSide,
            // blending: AdditiveBlending
        })

        for (let i = 0; i < 300; i++) {
            let path = new THREE.CatmullRomCurve3(
                this.getCurve(new THREE.Vector3(
                    (Math.random() - 0.5) * 3.0,
                    (Math.random() - 0.5) * 3.0,
                    (Math.random() - 0.5) * 3.0
                ))
            );
            const geometry = new TubeGeometry(path, 600, 0.005, 8);
            const curve = new THREE.Mesh(geometry, this.material);
            Application.passes.bloomEffect.addSelection(curve);
            this.container.add(curve);
        }

        if (isDebug) {
            const debugFolder = Debug.addFolder({
                title: 'lines',
                expanded: false
            });

            Experience.addMaterialDebug(this.material, debugFolder);

            const params = {
                color1: '#ff0000',
                color2: '#0000ff',
            }
            debugFolder.addInput(params, 'color1', {
                view: 'color',
            }).on('change', () => {
                this.material.uniforms.uLight1Color.value.set(params.color1);
                this.light1.material.color.set(params.color1);
            })

            debugFolder.addInput(params, 'color2', {
                view: 'color',
            }).on('change', () => {
                this.material.uniforms.uLight2Color.value.set(params.color2);
                this.light2.material.color.set(params.color2);
            })
        }
    }

    setLight() {
        const geometry = new THREE.SphereGeometry(0.05, 12, 12);
        const material1 = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        this.light1 = new THREE.Mesh(geometry, material1);
        this.container.add(this.light1);
        Application.passes.bloomEffect.addSelection(this.light1);

        const material2 = new THREE.MeshBasicMaterial({ color: 0x0000ff });
        this.light2 = new THREE.Mesh(geometry, material2);
        this.container.add(this.light2);
        Application.passes.bloomEffect.addSelection(this.light2);

    }

    getCurve(start) {
        const points = [];
        let scale = 1;

        const currentPoint = start.clone();
        for (let i = 0; i < 600; i++) {
            const v = this.computeCurl(currentPoint.x / scale, currentPoint.y / scale, currentPoint.z / scale);
            currentPoint.addScaledVector(v, 0.001);

            points.push(currentPoint.clone());
        }

        return points;
    }

    computeCurl(x, y, z) {
        var eps = 0.0001;

        var curl = new THREE.Vector3();

        //Find rate of change in YZ plane
        var n1 = this.noise3D(x, y + eps, z);
        var n2 = this.noise3D(x, y - eps, z);
        //Average to find approximate derivative
        var a = (n1 - n2) / (2 * eps);
        var n1 = this.noise3D(x, y, z + eps);
        var n2 = this.noise3D(x, y, z - eps);
        //Average to find approximate derivative
        var b = (n1 - n2) / (2 * eps);
        curl.x = a - b;

        //Find rate of change in XZ plane
        n1 = this.noise3D(x, y, z + eps);
        n2 = this.noise3D(x, y, z - eps);
        a = (n1 - n2) / (2 * eps);
        n1 = this.noise3D(x + eps, y, z);
        n2 = this.noise3D(x - eps, y, z);
        b = (n1 - n2) / (2 * eps);
        curl.y = a - b;

        //Find rate of change in XY plane
        n1 = this.noise3D(x + eps, y, z);
        n2 = this.noise3D(x - eps, y, z);
        a = (n1 - n2) / (2 * eps);
        n1 = this.noise3D(x, y + eps, z);
        n2 = this.noise3D(x, y - eps, z);
        b = (n1 - n2) / (2 * eps);
        curl.z = a - b;

        return curl;
    }

    update(delta, elapesd) {
        this.light1.position.x = Math.sin(elapesd * 1) * 1.;
        this.light1.position.z = Math.cos(elapesd * 1) * 1.;

        this.light2.position.x = Math.sin(elapesd * 1.2 + 0.345) * 0.5;
        this.light2.position.y = Math.cos(elapesd * 0.8 + 0.345) * 0.7;
        this.light2.position.z = Math.cos(elapesd * 1.3 + 0.345) * 0.5;

        this.material.uniforms.uLight1Position.value = this.light1.position.clone();
        this.material.uniforms.uLight2Position.value = this.light2.position.clone();
        this.material.uniforms.uTime.value += delta * 0.001;
    }

}