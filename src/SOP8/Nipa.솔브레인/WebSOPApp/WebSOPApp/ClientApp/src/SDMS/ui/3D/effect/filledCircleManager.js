import * as THREE from 'three';

export class FilledCircleManager {
    static StatusType = {
        normal: 0,
        alarm: 1
    };

    constructor(scene, camera) {
        this.scene = scene;
        this.camera = camera;
        // key : poiName
        // value : { group, circle }
        this.items = new Map();
    }

    // 화면 높이 대비 frac 비율로 보이도록 스케일 산출 (카메라 거리/FOV 보정)
    _fitToScreen(obj, frac = 0.12) {
        const wp = new THREE.Vector3();
        obj.getWorldPosition(wp);
        const dist = wp.distanceTo(this.camera.position);
        const viewH = Math.tan(THREE.MathUtils.degToRad(this.camera.fov * 0.5)) * dist * 2;
        return viewH * frac;
    }

    /**
     * 꽉 찬 원을 생성하고, 사라지지 않도록 유지합니다.
     * @param {THREE.Vector3} worldPos  원의 중심 월드 좌표
     * @param {number|THREE.Color} color  색상 (예: 0x66e0ff)
     * @param {object} opts
     *   - opacity : 반투명도(기본 0.5)
     *   - frac    : 화면 높이 대비 기준 크기(기본 0.12)  ← 기준 크기
     *   - segments: 원 세그먼트(기본 96)
     *   - depthTest : 가려짐 여부(기본 false)
     *   - depthWrite: 깊이 쓰기(기본 false)
     *   - planeNormal: 원의 법선 벡터(기본 null=기본 XY평면). 예) new THREE.Vector3(0,1,0)면 XZ평면으로 놓임
     * @returns {number} id  (remove(id)로 제거)
     */
    spawn(isIndoor, poi, worldPos, color = 0x66e0ff, opts = {}) {
        const {
            opacity = 0.5,
            frac = 0.12,
            segments = 96,
            depthTest = false,
            depthWrite = false,
            planeNormal = new THREE.Vector3(0, 1, 0), // XZ 평면
        } = opts;

        const group = new THREE.Group();
        group.position.copy(worldPos);

        // 반지름 0.5 기준(정규화) → 스케일로 화면 크기 제어
        const circleGeo = new THREE.CircleGeometry(0.5, segments);
        const circleMat = new THREE.MeshBasicMaterial({
            color,
            transparent: true,
            opacity,
            depthWrite,
            depthTest,
            blending: THREE.CustomBlending,
            blendEquation: THREE.AddEquation,
            blendSrc: THREE.SrcAlphaFactor,
            blendDst: THREE.OneMinusSrcAlphaFactor,
            side: THREE.DoubleSide,
        });
        const circle = new THREE.Mesh(circleGeo, circleMat);
        circle.renderOrder = 9999;

        if (planeNormal && planeNormal.isVector3) {
            const from = new THREE.Vector3(0, 0, 1);
            const to = planeNormal.clone().normalize();
            const quat = new THREE.Quaternion().setFromUnitVectors(from, to);
            circle.quaternion.copy(quat);
        }

        group.add(circle);
        this.scene.add(group);

        // 화면 비율 기반 기준 스케일 산출 + 100% 배율(=1.0)
        const base = this._fitToScreen(circle, frac);
        circle.scale.setScalar(base);

        const box = new THREE.Box3().setFromObject(circle);
        const size = new THREE.Vector3();
        box.getSize(size);

        // 반경 7.5m(직경 15m)
        const dia = isIndoor ? 15 : 75;
        const scale = dia / size.x;
        circle.scale.setScalar(base * scale);

        poi.userData.circle = { group, circle };
        this.items.set(poi.name, poi.userData.circle);
        return poi.name;
    }

    /**
     * 생성한 원을 poiName으로 제거
     * @param {string} poiName
     * @returns {boolean} 제거 성공 여부
     */
    remove(poiName) {
        const item = this.items.get(poiName);
        if (!item) return false;
        const { group, circle } = item;
        if (circle.geometry) circle.geometry.dispose();
        if (circle.material) circle.material.dispose();
        this.scene.remove(group);
        this.items.delete(poiName);
        return true;
    }

    /** 모든 원 제거 */
    removeAll() {
        for (const [poiName, item] of this.items) {
            const { group, circle } = item;
            if (circle.geometry) circle.geometry.dispose();
            if (circle.material) circle.material.dispose();
            this.scene.remove(group);
        }
        this.items.clear();
    }

    setAlarmColor(poi) {
        const item = this.items.get(poi.name);

        if (item) {
            item.circle.material.color.set(FilledCircleManager.getColor(FilledCircleManager.StatusType.alarm));
        }
    }

    setNormalColor(poi) {
        const item = this.items.get(poi.name);

        if (item) {
            item.circle.material.color.set(FilledCircleManager.getColor(FilledCircleManager.StatusType.normal));
        }
    }

    static getColor(statusType) {
        if (statusType === FilledCircleManager.StatusType.alarm) {
            return 0xff0000;
        }

        return 0xffff80;
    }
}