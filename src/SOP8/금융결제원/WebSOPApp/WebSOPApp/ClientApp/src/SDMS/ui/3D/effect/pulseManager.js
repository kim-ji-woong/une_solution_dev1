import * as THREE from 'three';
import { PoiManager } from '../poi/poiManager';

export class PulseManager {
    constructor(scene, camera) {
        this.scene = scene;
        this.camera = camera;
        // {group, t, dur}
        this.effects = [];

        this.poiEffects = null;
        // Key : poi.id
        this.pulsePois = {};
        this.pulsePoiCount = 0;

        this.prevDoorAnimation = true;
    }

    // 사각형 내부가 그라데이션으로 채워진 CanvasTexture
    static makeSquareGradientTexture(size = 256) {
        const cvs = document.createElement('canvas');
        cvs.width = cvs.height = size;
        const ctx = cvs.getContext('2d');

        //const half = size / 2;

        const img = ctx.createImageData(size, size);
        const data = img.data;

        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                /*const dx = Math.abs(x - half) / half;
                const dy = Math.abs(y - half) / half;

                const d = Math.max(dx, dy);*/

                let alpha = 0.8;
                /*if (d < 0.3) {
                    alpha = 1.0;
                } else if (d < 1.0) {
                    alpha = 0.9 * (1.0 - (d - 0.3) / 0.7);
                } else {
                    alpha = 0.0;
                }*/

                const i = (y * size + x) * 4;
                data[i + 0] = 255; // R
                data[i + 1] = 255; // G
                data[i + 2] = 255; // B
                data[i + 3] = Math.floor(alpha * 255);
            }
        }

        ctx.putImageData(img, 0, 0);

        const tex = new THREE.CanvasTexture(cvs);
        tex.needsUpdate = true;
        tex.generateMipmaps = false;
        tex.minFilter = THREE.LinearFilter;
        tex.magFilter = THREE.LinearFilter;
        return tex;
    }

    // 클릭 지점(worldPos)에 이펙트 스폰
    spawnSquare(isIndoor, poi, worldPos, color = 0x0099ff/*0x66e0ff*/, duration = 1.0) {
        const group = new THREE.Group();
        group.userData.poi = poi;
        group.userData.time = 0;

        group.position.copy(worldPos);

        // 사각형 그라데이션 텍스처
        const tex = PulseManager.makeSquareGradientTexture(256);

        const mat = new THREE.SpriteMaterial({
            map: tex,
            color,                  // tint
            transparent: true,
            opacity: 0.0,
            depthWrite: false,
            depthTest: false,
            blending: THREE.NormalBlending
        });

        const square = new THREE.Sprite(mat);
        square.renderOrder = 9999;

        const camera = this.camera;

        // 카메라 billboard 유지
        square.onBeforeRender = () => {
            square.quaternion.copy(camera.quaternion);
        };

        // 화면 비율 기준 스케일 계산 (기존 그대로 사용)
        const fitToScreen = (obj, frac = 0.12) => {
            const dist = obj.getWorldPosition(new THREE.Vector3())
                .distanceTo(camera.position);
            const viewH =
                Math.tan(THREE.MathUtils.degToRad(camera.fov * 0.5)) *
                dist * 2;
            return viewH * frac;
        };

        //const scale = isIndoor ? 0.06 : 0.08;
        const base = 1.6;
        // Zoom Scale의 영향을 받지 않음
        //const base = fitToScreen(square, scale);

        // 작게 시작
        square.scale.set(base * 0.2, base * 0.2, 1);

        // 사각형 효과는 POI보다 먼저 그려지게 한다.
        // 즉, POI 뒤에서 나타나게 한다.
        square.renderOrder = poi.userData.pulseIndex;
        square.material.depthTest = false;
        square.material.depthWrite = false;

        poi.renderOrder = this.pulsePoiCount + poi.userData.pulseIndex;
        poi.material.depthTest = false;
        poi.material.depthWrite = false;

        group.add(square);
        this.scene.add(group);

        this.effects.push({
            group,
            square,
            baseScale: base,
            t: 0,
            dur: duration
        });
    }

    static isPulsePoi(poiInfo) {
        if (poiInfo[0] === null) {
            return [false, PoiManager.PoiStatus.normal];
        }

        const isClosed = poiInfo[0];

        if (isClosed) {
            return [false, PoiManager.PoiStatus.normal]
        }

        const hover = poiInfo[1];
        const isSelected = poiInfo[2];
        const isAlarm = poiInfo[3];
        const isDisabled = poiInfo[4];

        if (isAlarm || isDisabled) {
            return [false, PoiManager.PoiStatus.normal]
        }

        let status = PoiManager.PoiStatus.normal;

        if (hover) {
            status = PoiManager.PoiStatus.hover;
        }
        else if (isSelected) {
            status = PoiManager.PoiStatus.selected;
        }

        return [true, status];
    }

    getPulsePoiCount() {
        let count = 0;
        const pulsePois = { ...this.pulsePois };

        for (const id in pulsePois) {
            count++;
        }

        this.pulsePoiCount = count;
        return count;
    }

    addPoi(poi) {
        this.pulsePois[poi.id] = poi;
        poi.userData.pulseIndex = this.getPulsePoiCount();
        this.spawnSquare(true, poi, poi.position);
    }

    removePois() {
        const pulsePois = { ...this.pulsePois };

        for (const id in pulsePois) {
            const poi = pulsePois[id];
            poi.scale.set(poi.userData.origin.scale.x, poi.userData.origin.scale.y, poi.userData.origin.scale.z);
        }

        this.pulsePois = {};
        this.pulsePoiCount = 0;
    }

    removePoi(poi) {
        delete this.pulsePois[poi.id];
    }

    // 매 프레임 호출
    update(delta, useDoorAnimation) {
        if (useDoorAnimation) {
            this.updateFrame(delta);
        }
        else if (this.prevDoorAnimation !== useDoorAnimation) {
            this.updateFrame(delta, true);
        }

        this.prevDoorAnimation = useDoorAnimation;
    }

    updateFrame(delta, hideEffect = false) {
        if (this.poiEffects !== null) {
            const poiEffects = { ...this.poiEffects };

            for (const poiName in poiEffects) {
                const effects = poiEffects[poiName];
                const isFinish = this.updateSquare(delta, effects, hideEffect);

                if (isFinish) {
                    delete this.poiEffects[poiName];
                }
            }
        }
        else {
            this.updateSquare(delta, this.effects, hideEffect);
        }
    }

    updateSquare(delta, effects, hideEffect) {
        for (let i = effects.length - 1; i >= 0; i--) {
            const e = effects[i];
            e.t += delta;

            const u = hideEffect ? 0 : THREE.MathUtils.clamp(e.t / e.dur, 0, 1);
            const easeOut = 1 - Math.pow(1 - u, 3);

            // 크기: 작게 → 크게
            const scaleMul = 0.2 + easeOut * 1.8;
            const s = e.baseScale * scaleMul;
            e.square.scale.set(s, s, 1);

            // 초반엔 거의 불투명, 후반부에서만 빠르게 사라짐
            const fadeIn = Math.min(1, e.t / 0.05);

            // 페이드아웃을 뒤로 미룸
            const fadeOut = 1.0 - Math.pow(easeOut, 2.5);

            // 최대 투명도 자체를 크게
            const alpha = 1.8 * fadeIn * fadeOut;

            e.square.material.opacity = Math.min(alpha, 1.0);

            e.group.userData.time += delta * 2.0;

            // 0.8 ~ 1.2
            const t = Math.sin(e.group.userData.time) * 0.2 + 1;

            const poi = e.group.userData.poi;

            if (PoiManager.isPointMaterial(poi.material)) {
                poi.scale.set(poi.userData.origin.scale.x * PoiManager.PointScaleX * t, poi.userData.origin.scale.y * PoiManager.PointScaleY * t, poi.userData.origin.scale.z * PoiManager.PointScaleY * t);
            }
            else {
                poi.scale.set(poi.userData.origin.scale.x * t, poi.userData.origin.scale.y * t, poi.userData.origin.scale.z);
            }

            if (u >= 1.0) {
                e.square.material.map.dispose();
                e.square.material.dispose();
                this.scene.remove(e.group);
                effects.splice(i, 1);

                if (poi && this.pulsePois[poi.id]) {
                    this.spawnSquare(true, poi, poi.position);
                }
                else {
                    if (PoiManager.isPointMaterial(poi.material)) {
                        poi.scale.set(poi.userData.origin.scale.x * PoiManager.PointScaleX, poi.userData.origin.scale.y * PoiManager.PointScaleY, poi.userData.origin.scale.z * PoiManager.PointScaleY);
                    }
                    else {
                        poi.scale.set(poi.userData.origin.scale.x, poi.userData.origin.scale.y, poi.userData.origin.scale.z);
                    }
                }

                return true;
            }
        }

        return false;
    }
}