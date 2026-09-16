import * as THREE from "three/build/three.module.js";
import { CfdController } from "../../../services/cfdController";

export class CfdLoader {
    constructor(scene) {
        this.scene = scene;

        this.modelLayer = new THREE.Object3D();
        this.modelLayer.matrixAutoUpdate = false;
        this.modelLayer.name = "modelLayer_cfd";

        this.scene.add(this.modelLayer);

        this.minColors = [];
        this.maxColors = [];
        this.minValue = null;
        this.maxValue = null;
        this.frameSeconds = [];

        this.materialColorRanges = {};
    }

    async loadScenario(_3dMaster, materialName, buildingNo, targetLocation, windDir = null, windSpeed = null) {
        const [success, message, result] = await CfdController.requestScenarioCase(materialName, targetLocation, buildingNo, windDir, windSpeed);

        if (result?.material && result?.scenarioCases) {
            this.frameSeconds = [];

            if (result.material) {
                this.clearCfd();

                if (result.materialRanges.length > 0) {
                    this.setMaterialRangeColor(result.materialRanges);
                }
                else {
                    this.setMaterialColor(result.material);
                }

                this.loadingCount = 0;

                for (const scenarioCase of result.scenarioCases) {
                    this.frameSeconds.push(scenarioCase.frme_secnd);
                }

                for (const scenarioCase of result.scenarioCases) {
                    this.loadCsv(scenarioCase.file_url, scenarioCase.frme_secnd, buildingNo, _3dMaster);
                    //this.loadBinary(scenarioCase.file_url, scenarioCase.frme_secnd, buildingNo, _3dMaster);
                }

                this.frameSeconds.sort();
            }

            _3dMaster.cfdTextPoiManager.showCfdText(false);
            return [success, result];
        }
        else {
            console.log(message);
            return [success, null];
        }
    }

    setMaterialColor(material) {
        this.materialColorRanges = {};

        this.minColors = [material.min_color_red, material.min_color_green, material.min_color_blue];
        this.maxColors = [material.max_color_red, material.max_color_green, material.max_color_blue];
        this.minValue = material.min_value;
        this.maxValue = material.max_value;
    }

    setMaterialRangeColor(materialRanges) {
        const materialColorRanges = {};

        for (const range of materialRanges) {
            // 최대값만 기억시킨다.
            materialColorRanges[range.max_value] = ((range.color_red << 16) | (range.color_green) | range.color_blue);
        }

        this.materialColorRanges = materialColorRanges;
    }

    async loadBinary(contents, frameSecond, buildingNo, _3dMaster) {
        const index = contents.lastIndexOf('.');

        if (index < 0) {
            return;
        }

        const url = contents.substring(0, index) + ".dat";
        const response = await fetch(url, {
            cache: 'no-store',
            headers: {
                'Cache-Control': 'no-transform',
                'Accept': 'application/octet-stream',
            },
        });

        if (!response.ok) {
            return;
        }

        const arrayBuffer = await response.arrayBuffer();
        const floats = new Float32Array(arrayBuffer);

        // 투명
        const points = [];
        const colors = [];
        // 불투명
        const points2 = [];
        const colors2 = [];

        const materialColorRanges = { ...this.materialColorRanges };
        const isEmptyRange = this.isEmptyMaterialColorRanges(materialColorRanges);

        const len = floats.length;

        for (let i = 0; i < len; i += 4) {
            const concentration = floats[i];
            const x = floats[i + 1];
            const z = -floats[i + 2];
            const y = floats[i + 3];

            if (!isNaN(x) && !isNaN(y) && !isNaN(z) && !isNaN(concentration)) {
                const color = isEmptyRange ? this.getMaterialColor(concentration) : this.getMaterialRangeColor(concentration, materialColorRanges);
                points.push(x, y, z);
                colors.push(color.r, color.g, color.b);
            }
        }

        // 투명
        this.addParticles(points, colors, 0.1, frameSecond);
        // 불투명
        this.addParticles(points2, colors2, 0.5, frameSecond);

        this.loadingCount = this.loadingCount + 1;

        if (this.loadingCount >= this.frameSeconds.length) {
            _3dMaster.onCompleteLoadingCfd(this.frameSeconds, buildingNo, this);
        }
    }

    async loadCsv(contents, frameSecond, buildingNo, _3dMaster) {
        const url = contents;
        const response = await fetch(url);

        if (!response.ok) {
            return;
        }

        const text = await response.text();

        // 투명
        const points = [];
        const colors = [];
        // 불투명
        const points2 = [];
        const colors2 = [];

        // skip header
        const lines = text.split('\n').slice(1);

        const materialColorRanges = { ...this.materialColorRanges };
        const isEmptyRange = this.isEmptyMaterialColorRanges(materialColorRanges);

        lines.forEach(line => {
            const arr = line.trim().split(',');

            if (arr.length >= 4) {
                const x = Number(arr[1]);
                const z = -Number(arr[2]);
                const y = Number(arr[3]);
                const concentration = Number(arr[0]);

                if (!isNaN(x) && !isNaN(y) && !isNaN(z) && !isNaN(concentration)) {
                    const color = isEmptyRange ? this.getMaterialColor(concentration) : this.getMaterialRangeColor(concentration, materialColorRanges);

                    /*if (z <= -300) {
                        points2.push(x, y, z);
                        colors2.push(color.r, color.g, color.b);
                    }
                    else*/ {
                        points.push(x, y, z);
                        colors.push(color.r, color.g, color.b);
                    }
                }
            }
        });

        // 투명
        this.addParticles(points, colors, 0.1, frameSecond);
        // 불투명
        this.addParticles(points2, colors2, 0.5, frameSecond);

        this.loadingCount = this.loadingCount + 1;

        if (this.loadingCount >= this.frameSeconds.length) {
            _3dMaster.onCompleteLoadingCfd(this.frameSeconds, buildingNo, this);
        }
    }

    addParticles(points, colors, opacity, frameSecond) {
        if (points.length === 0 || colors.length === 0) {
            return;
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));
        geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: 5,
            vertexColors: true,
            transparent: true,
            opacity: opacity,
            depthWrite: false, // 모델과의 z-fighting을 줄이기 위해
            depthTest: false,
            blending: THREE.NormalBlending
        });

        const particleSystem = new THREE.Points(geometry, material);
        particleSystem.name = "particle_" + frameSecond + "_" + opacity;
        particleSystem.userData.frame = frameSecond;
        this.modelLayer.add(particleSystem);

        particleSystem.visible = false;
    }

    getMaterialRangeColor(value, materialColorRanges) {
        let lastValue = null;

        for (const maxValue in materialColorRanges) {
            if (value <= maxValue) {
                return this.getRangeColor(maxValue, materialColorRanges);
            }
            else {
                lastValue = maxValue;
            }
        }

        return this.getRangeColor(lastValue, materialColorRanges);
    }

    getRangeColor(maxValue, materialColorRanges) {
        const color = materialColorRanges[maxValue];

        const r = (color >> 16) / 255.0;
        const g = ((color & 0x00ff00) >> 8) / 255.0;
        const b = (color & 0x0000ff) / 255.0;

        return this.getHSLColor(r, g, b);
    }

    isEmptyMaterialColorRanges(materialColorRanges) {
        for (const maxValue in materialColorRanges) {
            return false;
        }

        return true;
    }

    getMaterialColor(value) {
        if (value <= this.minValue) {
            return this.getColor(0);
        }
        else if (value >= this.maxValue) {
            return this.getColor(100);
        }

        const ratio = (value - this.minValue) * 100.0 / (this.maxValue - this.minValue);
        return this.getColor(ratio);
    }

    // ratio : 0 ~ 100
    getColor(ratio) {
        const r = this.getColorValue(0, ratio);
        const g = this.getColorValue(1, ratio);
        const b = this.getColorValue(2, ratio);

        this.getHSLColor(r, g, b);
    }

    // r, g, b : 0 ~ 1
    getHSLColor(r, g, b) {
        const color = new THREE.Color(r, g, b);

        const hsl = { h: 0, s: 0, l: 0 };
        color.getHSL(hsl);
        color.setHSL(hsl.h, hsl.s, hsl.l);

        return color;
    }

    getColorValue(index, ratio) {
        // 0 ~ 255
        const value = this.minColors[index] + (this.maxColors[index] - this.minColors[index]) * ratio / 100;
        // 0 ~ 1
        return value / 255.0;
    }

    showCfd(frame) {
        const modelCount = this.modelLayer.children.length;

        let maxValue = null;
        let maxModel = null;

        for (let i = 0; i < modelCount; i++) {
            const model = this.modelLayer.children[i];
            model.visible = false;

            if (frame >= model.userData.frame) {
                // frame 보다 작거나 같은값 중에서 가장 큰 값을 찾는다.
                if (maxValue === null || maxValue < model.userData.frame) {
                    maxValue = model.userData.frame;
                    maxModel = model;
                }
            }
        }

        if (maxModel) {
            maxModel.visible = true;
        }

        /*for (let i = 0; i < modelCount; i++) {
            const model = this.modelLayer.children[i];

            if (model.visible) {
                if (model.name.includes(frame)) {
                    return;
                }
                else {
                    model.visible = false;
                    break;
                }
            }
        }

        for (let i = 0; i < modelCount; i++) {
            const model = this.modelLayer.children[i];

            if (model.name.includes(frame)) {
                model.visible = true;
                return;
            }
        }*/
    }

    hideCfd(_3dMaster) {
        for (const model of this.modelLayer.children) {
            model.visible = false;
        }

        _3dMaster.cfdTextPoiManager.showCfdText(true);
    }

    clearCfd() {
        const modelCount = this.modelLayer.children.length;

        for (let i = modelCount - 1; i >= 0; i--) {
            const model = this.modelLayer.children[i];
            this.modelLayer.remove(model);

            if (model.geometry) {
                model.geometry.dispose();
            }

            if (model.material) {
                if (Array.isArray(model.material)) {
                    model.material.forEach(m => m.dispose());
                }
                else {
                    model.material.dispose();
                }
            }
        }
    }
}
