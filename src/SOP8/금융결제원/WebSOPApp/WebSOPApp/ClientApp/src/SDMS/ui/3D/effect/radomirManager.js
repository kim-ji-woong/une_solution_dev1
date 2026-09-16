import * as THREE from 'three';

export class RadomirManager {
    static EffectStyles = {
        gradient: 0,
        circle: 1
    }

    constructor(scene, camera, poiEffects = null, owner = null) {
        this.scene = scene;
        this.camera = camera;
        // {group, t, dur}
        this.effects = [];

        this.effectStyle = RadomirManager.EffectStyles.circle;

        this.poiEffects = poiEffects;
        this.owner = owner;
    }

    // 캔버스 기반의 라디얼 그라디언트 텍스처 (투명)
    static makeRadialTexture(size = 256, inner = 0, outer = 1) {
        this.effectStyle = RadomirManager.EffectStyles.gradient;

        const cvs = document.createElement('canvas');
        cvs.width = cvs.height = size;
        const g = cvs.getContext('2d');

        const cx = size / 2, cy = size / 2, r = size / 2;
        const grad = g.createRadialGradient(cx, cy, r * inner, cx, cy, r * outer);
        // 가장자리 투명, 중앙 밝음(프리멀티 알파처럼 살짝 감쇄)
        grad.addColorStop(0.0, 'rgba(255,255,255,0.9)');
        grad.addColorStop(0.6, 'rgba(255,255,255,0.25)');
        grad.addColorStop(1.0, 'rgba(255,255,255,0.0)');

        g.clearRect(0, 0, size, size);
        g.fillStyle = grad;
        g.beginPath();
        g.arc(cx, cy, r, 0, Math.PI * 2);
        g.fill();

        const tex = new THREE.CanvasTexture(cvs);
        tex.needsUpdate = true;
        tex.generateMipmaps = false;
        tex.minFilter = THREE.LinearFilter;
        tex.magFilter = THREE.LinearFilter;
        return tex;
    }

    // 작은원이 커져나가는 효과
    static makeCircleStrokeTexture(size = 256, strokePx = 6) {
        this.effectStyle = RadomirManager.EffectStyles.circle;

        const cvs = document.createElement('canvas');
        cvs.width = cvs.height = size;
        const g = cvs.getContext('2d');

        // 투명 바탕
        g.clearRect(0, 0, size, size);

        // 안티앨리어싱 되는 캔버스 라인
        g.beginPath();
        g.arc(size / 2, size / 2, (size / 2) - strokePx, 0, Math.PI * 2);
        g.lineWidth = strokePx;
        g.strokeStyle = 'rgba(255,255,255,1)'; // 흰색(뒤에서 Sprite color로 틴트)
        g.stroke();

        const tex = new THREE.CanvasTexture(cvs);
        tex.needsUpdate = true;
        tex.generateMipmaps = false;
        tex.minFilter = THREE.LinearFilter;
        tex.magFilter = THREE.LinearFilter;
        return tex;
    }

    // 클릭 지점(worldPos)에 이펙트 스폰
    spawnCircle(isIndoor, poi, worldPos, color = 0x66e0ff, duration = 1.0) {
        const group = new THREE.Group();
        group.position.copy(worldPos);

        // 고리형 메시
        const ringGeo = new THREE.RingGeometry(0.1, 0.5, 64); // 기본 두께 0.4
        const ringMat = new THREE.MeshBasicMaterial({
            color,
            transparent: true,
            opacity: 0.0,
            side: THREE.DoubleSide,
            depthWrite: false,
            depthTest: false,
            blending: THREE.CustomBlending,
            blendEquation: THREE.AddEquation,
            blendSrc: THREE.SrcAlphaFactor,
            blendDst: THREE.OneMinusSrcAlphaFactor,
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.renderOrder = 9999;

        // 카메라 빌보드 유지
        ring.onBeforeRender = () => ring.quaternion.copy(this.camera.quaternion);

        // frac : 화면 대비 원의 크기 비율
        const fitToScreen = (obj, frac = 0.12) => {
            return 333.33 * frac;
            /*const dist = obj.getWorldPosition(new THREE.Vector3()).distanceTo(this.camera.position);
            const viewH = Math.tan(THREE.MathUtils.degToRad(this.camera.fov * 0.5)) * dist * 2;
            return viewH * frac;*/
        };

        const scale = isIndoor ? 0.05 : 0.06;
        const base = fitToScreen(ring, scale);
        ring.scale.setScalar(base * 0.05); // 작게 시작

        group.add(ring);
        this.scene.add(group);

        if (this.poiEffects !== null && poi) {
            const effects = [];
            this.poiEffects[poi.name] = effects;

            effects.push({
                group,
                ring,
                baseScale: base,
                t: 0,
                dur: duration,
            });
        }
        else {
            this.effects.push({
                group,
                ring,
                baseScale: base,
                t: 0,
                dur: duration,
            });
        }
    }

    // 클릭 지점(worldPos)에 이펙트 스폰
    spawnRadial(worldPos, color = 0x66e0ff, duration = 1) {
        const group = new THREE.Group();
        group.position.copy(worldPos);

        // 1) 부드러운 광륜 스프라이트 (캔버스 텍스처)
        const tex = RadomirManager.makeRadialTexture(256, 0.0, 1.0);
        const sprMat = new THREE.SpriteMaterial({
            map: tex,
            color,                  // 색 틴트
            transparent: true,
            depthWrite: false,
            depthTest: false,
            blending: THREE.AdditiveBlending,
            opacity: 0.0,           // 초기 0으로 시작 (번쩍임 방지)
        });
        const halo = new THREE.Sprite(sprMat);
        halo.renderOrder = 9999;

        // 화면 비율 기반 베이스 스케일 계산
        const fitToScreen = (obj, frac = 0.12) => {
            const dist = obj.getWorldPosition(new THREE.Vector3()).distanceTo(this.camera.position);
            const viewH = Math.tan(THREE.MathUtils.degToRad(this.camera.fov * 0.5)) * dist * 2;
            const s = viewH * frac;
            return s;
        };
        const base = fitToScreen(halo, 0.12); // 원하는 기본 화면 비율
        halo.scale.set(base * 0.4, base * 0.4, 1); // 작게 시작

        group.add(halo);
        this.scene.add(group);

        // 이펙트 등록 (링 제거: ring 없음)
        this.effects.push({
            group,
            halo,
            baseScale: base,
            t: 0,
            dur: duration
        });
    }

    // 매 프레임 호출
    update(delta) {
        if (this.effectStyle === RadomirManager.EffectStyles.gradient) {
            this.updateGradient(delta);
        }
        else if (this.effectStyle === RadomirManager.EffectStyles.circle) {
            if (this.poiEffects !== null) {
                const poiEffects = { ...this.poiEffects };

                for (const poiName in poiEffects) {
                    const effects = poiEffects[poiName];
                    const isFinish = this.updateCircle(delta, effects);

                    if (isFinish) {
                        delete this.poiEffects[poiName];

                        if (this.owner) {
                            this.owner.onFinishAlarmEffect(poiName);
                        }
                    }
                }
            }
            else {
                this.updateCircle(delta, this.effects);
            }
        }
    }

    updateCircle(delta, effects) {
        for (let i = effects.length - 1; i >= 0; i--) {
            const e = effects[i];
            e.t += delta;
            const u = THREE.MathUtils.clamp(e.t / e.dur, 0, 1);
            const easeOut = 1 - Math.pow(1 - u, 3);

            // 크기: 0.2배 → 1.0배 >> 0.6배 수정 
            const scaleMul = 0.2 + easeOut * 0.4;
            const s = e.baseScale * scaleMul;
            e.ring.scale.setScalar(s);

            // 두께: 초반엔 두껍게, 후반엔 얇게
            const startInner = 0.3;   // 내부 반지름 (두께 조절용)
            const endInner = 0.48;    // 끝날 때 거의 얇게
            const inner = THREE.MathUtils.lerp(startInner, endInner, easeOut);
            e.ring.geometry.dispose();
            e.ring.geometry = new THREE.RingGeometry(inner, 0.5, 64);

            // 투명도: 페이드인 → 페이드아웃
            const fadeIn = Math.min(1, e.t / 0.06);
            const fadeOut = 1.0 - easeOut;
            e.ring.material.opacity = 0.95 * fadeIn * Math.max(0.4, fadeOut);

            if (u >= 1.0) {
                e.ring.geometry.dispose();
                e.ring.material.dispose();
                this.scene.remove(e.group);
                effects.splice(i, 1);
                return true;
            }
        }

        return false;
    }

    updateGradient(delta) {
        for (let i = this.effects.length - 1; i >= 0; i--) {
            const e = this.effects[i];
            e.t += delta;
            const u = THREE.MathUtils.clamp(e.t / e.dur, 0, 1);
            const easeOut = 1 - Math.pow(1 - u, 3);

            // 스프라이트 스케일: (작게 시작 → 커지기)
            // 시작 0.4배 → 최종 2.2배 (원하시면 계수 조정)
            const scaleMul = 0.4 + easeOut * 1.8;
            const s = e.baseScale * scaleMul;
            e.halo.scale.set(s, s, 1);

            // 불투명도: 초반 페이드인, 후반 페이드아웃
            // 0~0.08초 정도만 빠르게 페이드인 → 번쩍임 방지
            const fadeIn = Math.min(1, e.t / 0.08);
            const alpha = 0.9 * fadeIn * (1.0 - easeOut);
            e.halo.material.opacity = alpha;

            // 수명 종료 → 정리
            if (u >= 1.0) {
                e.halo.material.map.dispose();
                e.halo.material.dispose();
                this.scene.remove(e.group);
                this.effects.splice(i, 1);
            }
        }
    }

    checkPoi(poi) {
        if (!this.poiEffects) {
            return false;
        }

        const effects = this.poiEffects[poi.name];

        if (effects === undefined) {
            return false;
        }

        return true;
    }
}