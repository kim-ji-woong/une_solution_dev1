import { EditModeManager } from "./editModeManager";
import * as THREE from "three/build/three.module.js";
import Vertex3D from "../../../../Common/util/Vertex3D";
import Geometry from "../../../../Common/util/Geometry";
import { SDMSController } from "../../../services/sdmsController";

export class FakeWallManager {
    static Mode_None = 0;
    static Mode_Add_NoClick = 1;
    static Mode_Move = 2;
    static Mode_Resize = 3;
    static Mode_Rotate = 4;
    static Mode_Delete = 5;
    static Mode_Add_1Click = 6;

    static UpdateMode = {
        "None": 0,
        "Add": 1,
        "Move": 2,
        "Rotate": 3,
        "Resize": 4,
        "Delete": 5
    };

    static ObjectTag = "fakeWall_";

    static OutdoorScale = 10;

    constructor(editModeManager) {
        this.mode = FakeWallManager.Mode_None;
        this.model = {
            model: null,
            geometry: {
                xSize: null,/*길이*/
                ySize: null,/*높이*/
                zSize: null,/*두께*/
                scale: null
            }
        };

        this.fakeWalls = null;
        this.vFirstClick = null;
        this.vSecond = null;
        this.vOrigin = null;
        this.currentWall = null;
        this.wallCount = 0;
        this.editModeManager = editModeManager;

        this.rotation = {
            fixed: null,
            length: null
        };

        this.zoneNo = 0;

        this.tempWalls = {
            "walls": [],
            "showTime": false
        };

        this.camera = null;

        // editFakeWalls scheme
        /*{
            zoneNo: {
                addedWalls: [],
                changedWalls: [],
                deletedWalls: []
            }
        }*/
        this.editFakeWalls = {};
    }

    changeMode(mode) {
        this.mode = mode;
    }

    onClick(x, y, zoneNo, camera, spatialManager, scene) {
        if (!zoneNo) {
            return;
        }

        this.zoneNo = zoneNo;
        this.camera = camera;
        this.spatialManager = spatialManager;

        if (this.mode === FakeWallManager.Mode_Add_NoClick) {
            if (zoneNo < 0 || !zoneNo) {
                this.editModeManager.showMessageBox(EditModeManager.msg_error, "외부영역에서 가벽을 수정할 수 없습니다.");
                return;
            }

            this.add(x, y, zoneNo, camera, spatialManager, scene);
        }
        else if (this.mode === FakeWallManager.Mode_Add_1Click) {
            this.setPosition(x, y, true, FakeWallManager.UpdateMode.Add);
        }
        else if (this.mode === FakeWallManager.Mode_Move) {
            if (this.currentWall === null) {
                this.pick(x, y, camera, scene);
            }
            else {
                this.updateWall(this.currentWall, FakeWallManager.UpdateMode.Move);
                this.initNoneValue();
            }
        }
        else if (this.mode === FakeWallManager.Mode_Resize) {
            if (this.currentWall === null) {
                const vCurrent = this.pick(x, y, camera, scene);

                if (vCurrent) {
                    this.setFirstPoint(this.currentWall, vCurrent);
                }
            }
            else {
                this.updateWall(this.currentWall, FakeWallManager.UpdateMode.Resize);
                this.initNoneValue();
            }
        }
        else if (this.mode === FakeWallManager.Mode_Rotate) {
            if (this.currentWall === null) {
                const vCurrent = this.pick(x, y, camera, scene);

                if (vCurrent) {
                    this.setRotationPoint(this.currentWall, vCurrent);
                }
            }
            else {
                this.updateWall(this.currentWall, FakeWallManager.UpdateMode.Rotate);
                this.initNoneValue();
            }
        }
        else if (this.mode === FakeWallManager.Mode_Delete) {
            this.pick(x, y, camera, scene);
            const currentWall = this.currentWall;
            this.currentWall = null;

            if (currentWall) {
                this.removeWall(currentWall);
            }
        }
    }

    removeWall(currentWall) {
        if (this.editModeManager) {
            this.editModeManager.addFakeWallData(currentWall, FakeWallManager.UpdateMode.Delete, this.zoneNo, this);
            currentWall.visible = false;

            // save~()가 호출되기 전에는 실제로 삭제하지 않고 안보이게만 한다.
            //this.fakeWalls.remove(currentWall);
        }
    }

    rotate(x, y) {
        const vCurrent = this.to3DPoint(x, y, this.camera);
        const fixed = this.rotation.fixed;
        const vRight = new Vertex3D(fixed.x + 100, fixed.y, fixed.z);
        let angle = Geometry.getAngle(vCurrent, fixed, vRight);

        if (vCurrent.z > fixed.z) {
            angle = Math.PI * 2 - angle;
        }

        const [_x, _y, _z] = Geometry.getLinearVertex3(fixed.x, fixed.y, fixed.z, vCurrent.x, vCurrent.y, vCurrent.z, this.rotation.length);
        this.currentWall.position.set((fixed.x + _x) / 2, (fixed.y + _y) / 2, (fixed.z + _z) / 2);
        this.currentWall.rotation.set(0, angle, 0);
    }

    move(x, y) {
        if (this.mode === FakeWallManager.Mode_Add_1Click) {
            if (this.vFirstClick && this.currentWall) {
                this.setWallPosition(x, y);
            }
        }
        else if (this.mode === FakeWallManager.Mode_Resize) {
            if (this.vFirstClick && this.vSecond && this.currentWall) {
                this.resizeWall(x, y);
            }
        }
        else if (this.mode === FakeWallManager.Mode_Move) {
            if (this.currentWall && this.vFirstClick && this.vOrigin) {
                this.moveCurrentWall(x, y);
            }
        }
        else if (this.mode === FakeWallManager.Mode_Rotate) {
            if (this.currentWall && this.rotation.fixed && this.rotation.length) {
                this.rotate(x, y);
            }
        }
    }

    moveCurrentWall(x, y) {
        const vCurrent = this.to3DPoint(x, y, this.camera);
        const moveX = vCurrent.x - this.vFirstClick.x;
        const moveY = vCurrent.y - this.vFirstClick.y;
        const moveZ = vCurrent.z - this.vFirstClick.z;

        this.currentWall.position.set(this.vOrigin.x + moveX, this.vOrigin.y + moveY, this.vOrigin.z + moveZ);
    }

    setFirstPoint(wall, vPos) {
        if (this.model.geometry.xSize && this.model.geometry.scale) {
            const len = this.model.geometry.xSize * wall.scale.x / this.model.geometry.scale.x;
            const w = len / 2 * Math.cos(wall.rotation.y);
            const h = len / 2 * Math.sin(wall.rotation.y);

            const v2 = new Vertex3D(wall.position.x + w, wall.position.y, wall.position.z - h);
            const v1 = new Vertex3D(wall.position.x * 2 - v2.x, wall.position.y, wall.position.z * 2 - v2.z);

            const len1 = vPos.getDistance(v1);
            const len2 = vPos.getDistance(v2);

            if (len1 < len2) {
                this.vFirstClick = v2;
                this.vSecond = v1;
            }
            else {
                this.vFirstClick = v1;
                this.vSecond = v2;
            }
        }
    }

    setRotationPoint(wall, vPos) {
        if (this.model.geometry.xSize && this.model.geometry.scale) {
            const len = this.model.geometry.xSize * wall.scale.x / this.model.geometry.scale.x;
            const w = len / 2 * Math.cos(wall.rotation.y);
            const h = len / 2 * Math.sin(wall.rotation.y);

            const v2 = new Vertex3D(wall.position.x + w, wall.position.y, wall.position.z - h);
            const v1 = new Vertex3D(wall.position.x * 2 - v2.x, wall.position.y, wall.position.z * 2 - v2.z);

            const len1 = vPos.getDistance(v1);
            const len2 = vPos.getDistance(v2);

            if (len1 < len2) {
                this.rotation.fixed = v2;
                this.rotation.length = v1.getDistance(v2);
            }
            else {
                this.rotation.fixed = v1;
                this.rotation.length = v1.getDistance(v2);
            }
        }
    }

    setPosition(x, y, continuous, updateMode) {
        if (this.mode === FakeWallManager.Mode_Add_1Click) {
            if (this.vFirstClick && this.currentWall) {
                const vCurrent = this.setWallPosition(x, y);

                this.updateWall(this.currentWall, updateMode);

                // 연속 그리기 할 경우
                if (continuous) {
                    if (vCurrent) {
                        this.makeNewWall(vCurrent);
                    }
                }
                // 연속 그리기 안할 경우
                else {
                    this.vFirstClick = null;
                    this.currentWall = null;
                    this.mode = FakeWallManager.Mode_None;
                }
            }
        }
    }

    updateWall(fakeWall, updateMode) {
        if (this.editModeManager) {
            this.editModeManager.addFakeWallData(fakeWall, updateMode, this.zoneNo, this);
        }
    }

    // 길이와 방향을 모두 바꾼다.
    setWallPosition(x, y) {
        const vCurrent = this.to3DPoint(x, y, this.camera);
        return this._setWallPosition(vCurrent);
    }

    _setWallPosition(vCurrent) {
        if (!vCurrent || !this.model.geometry.xSize || !this.model.geometry.scale) {
            return null;
        }

        const vRight = new Vertex3D(this.vFirstClick.x + 100, this.vFirstClick.y, this.vFirstClick.z);
        let angle = Geometry.getAngle(vCurrent, this.vFirstClick, vRight);

        if (vCurrent.z > vRight.z) {
            angle = Math.PI * 2 - angle;
        }

        const length = vCurrent.getDistance(this.vFirstClick);
        const scaleX = this.model.geometry.scale.x * length / this.model.geometry.xSize;

        this.currentWall.rotation.set(0, angle, 0);
        this.currentWall.position.set((this.vFirstClick.x + vCurrent.x) / 2, (this.vFirstClick.y + vCurrent.y) / 2, (this.vFirstClick.z + vCurrent.z) / 2);
        this.currentWall.scale.set(scaleX, this.currentWall.scale.y, this.currentWall.scale.z);

        return vCurrent;
    }

    // 길이만 바꾼다.
    resizeWall(x, y) {
        const vCurrent = this.to3DPoint(x, y, this.camera);

        if (!vCurrent || !this.model.geometry.xSize || !this.model.geometry.scale) {
            return null;
        }

        const len = Geometry.getDistanceFromLine3(vCurrent.x, vCurrent.y, vCurrent.z, this.vFirstClick.x, this.vFirstClick.y, this.vFirstClick.z, this.vSecond.x, this.vSecond.y, this.vSecond.z, true);

        const a = Geometry.getDistance3(vCurrent.x, vCurrent.y, vCurrent.z, this.vSecond.x, this.vSecond.y, this.vSecond.z);
        const b = Math.sqrt(a * a - len * len);

        const v1 = Geometry.getLinearVertex3(this.vSecond.x, this.vSecond.y, this.vSecond.z, this.vFirstClick.x, this.vFirstClick.y, this.vFirstClick.z, b);
        const v2 = Geometry.getLinearVertex3(this.vSecond.x, this.vSecond.y, this.vSecond.z, this.vFirstClick.x, this.vFirstClick.y, this.vFirstClick.z, -b);

        const len1 = Geometry.getDistance3(v1[0], v1[1], v1[2], vCurrent.x, vCurrent.y, vCurrent.z);
        const len2 = Geometry.getDistance3(v2[0], v2[1], v2[2], vCurrent.x, vCurrent.y, vCurrent.z);

        if (len1 < len2) {
            return this._setWallPosition(new Vertex3D(v1[0], v1[1], v1[2]));
        }
        else {
            return this._setWallPosition(new Vertex3D(v2[0], v2[1], v2[2]));
        }
    }

    to3DPoint(x, y, camera) {
        const raycaster = this.getRayCaster(x, y, camera);

        if (!raycaster) {
            return null;
        }
        return new Vertex3D(raycaster.ray.origin.x, this.vFirstClick.y, raycaster.ray.origin.z);
    }

    add(x, y, zoneNo, camera, spatialManager, scene) {
        const raycaster = this.getRayCaster(x, y, camera);

        if (!raycaster) {
            return;
        }

        const zone = spatialManager.getZone(zoneNo);

        if (!zone) {
            return;
        }

        const wallHeight = zone.datas?.fakeWallElevation;

        if (wallHeight !== 0 && !wallHeight) {
            return;
        }

        const pos = new THREE.Vector3(raycaster.ray.origin.x, wallHeight, raycaster.ray.origin.z);
        this.makeNewWall(pos);

        /*const intersects = raycaster.intersectObjects(scene.children, true);
        const intersectCount = intersects.length;
        let bottom = null;

        for (let i = 0; i < intersectCount; i++) {
            const intersect = intersects[i];

            if (intersect.object.visible === false) {
                continue;
            }

            if (bottom === null) {
                bottom = new THREE.Vector3(intersect.point.x, intersect.point.y, intersect.point.z);
            }
            else if (bottom.y > intersect.point.y) {
                bottom.set(intersect.point.x, intersect.point.y, intersect.point.z);
            }
        }

        if (bottom !== null) {
            this.makeNewWall(bottom);
        }*/
    }

    initNoneValue() {
        // 클릭된 벽체는 초기화
        this.currentWall = null;

        this.vFirstClick = null;
        this.vCurrentWall = null;
        this.vOrigin = null;

        this.rotation.fixed = null;
        this.rotation.length = null;
    }

    pick(x, y, camera, scene) {
        const mouse = new THREE.Vector2((x / window.innerWidth) * 2 - 1, -(y / window.innerHeight) * 2 + 1);

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);

        const intersects = raycaster.intersectObjects(scene.children, true);
        const fakeWall = this.pickFakeWall(intersects, raycaster.ray.origin);

        if (fakeWall) {
            this.currentWall = fakeWall;
            return new Vertex3D(raycaster.ray.origin.x, fakeWall.position.y, raycaster.ray.origin.z);
        }

        return null;
    }

    pickFakeWall(intersects, vMouse) {
        const intersectCount = intersects.length;

        for (let i = 0; i < intersectCount; i++) {
            const intersect = intersects[i];

            if (!intersect.object.visible) {
                continue;
            }

            const parent = intersect.object.parent;

            if (parent && parent.name.startsWith(FakeWallManager.ObjectTag)) {
                this.vFirstClick = new Vertex3D(vMouse.x, parent.position.y, vMouse.z);
                this.vOrigin = new Vertex3D(parent.position.x, parent.position.y, parent.position.z);
                return parent;
            }
        }

        return null;
    }

    makeNewWall(vPos) {
        const fakeWall = this.model.model.clone();
        this.setWallName(fakeWall, -1);
        fakeWall.position.set(vPos.x + this.model.geometry.xSize / 2, vPos.y, vPos.z);

        let scale = 1.0;

        // 마우스 Click한 지점이 시작점이자 끝점이므로 가벽의 길이는 0이 되어야 한다.
        fakeWall.scale.set(0, fakeWall.scale.y, fakeWall.scale.z * scale);

        this.fakeWalls.add(fakeWall);

        this.currentWall = fakeWall;
        this.vFirstClick = new THREE.Vector3(vPos.x, vPos.y, vPos.z);
        this.mode = FakeWallManager.Mode_Add_1Click;

        // 생성 중인 벽체가 있는 상태에서 취소버튼을 클릭 시 초기화를 위한 - K.D.R
        //this.editModeManager.setFakeWallManager(this);
    }

    makeNewWallFromObject(obj, zoneNo) {
        const fakeWall = this.model.model.clone();
        this.setWallName(fakeWall, obj.fake_wall_sn);

        let scale = 1.0;

        fakeWall.position.set(obj.x, obj.y, obj.z);
        fakeWall.rotation.set(0, obj.rtate, 0);
        fakeWall.scale.set(obj.scale, fakeWall.scale.y, fakeWall.scale.z * scale);

        fakeWall.userData.origin = this.makeOrigin(obj, obj.rtate, obj.scale, fakeWall.scale.y, fakeWall.scale.z * scale);
        fakeWall.userData.zoneNo = zoneNo;
        this.fakeWalls.add(fakeWall);
    }

    makeOrigin(position, rotationY, scaleX, scaleY, scaleZ) {
        return {
            "position": new THREE.Vector3(position.x, position.y, position.z),
            "rotation": new THREE.Vector3(0, rotationY, 0),
            "scale": new THREE.Vector3(scaleX, scaleY, scaleZ)
        }
    }

    setWallName(wall, wallNo) {
        this.wallCount++;

        wall.userData.zoneNo = this.zoneNo;
        wall.userData.fakeWallNo = wallNo;

        if (this.wallCount < 10) {
            wall.name = FakeWallManager.ObjectTag + wallNo + "_00" + this.wallCount;
        }
        else if (this.wallCount < 100) {
            wall.name = FakeWallManager.ObjectTag + wallNo + "_0" + this.wallCount;
        }
        else {
            wall.name = FakeWallManager.ObjectTag + wallNo + "_" + this.wallCount;
        }
    }

    setModel(model, scene) {
        this.model.model = model;

        const box = new THREE.Box3().setFromObject(model);

        this.model.geometry.xSize = box.max.x - box.min.x;
        this.model.geometry.ySize = box.max.y - box.min.y;
        this.model.geometry.zSize = box.max.z - box.min.z;
        this.model.geometry.scale = model.scale;

        const fakeWalls = new THREE.Object3D();
        fakeWalls.name = "fakeWalls";
        this.fakeWalls = fakeWalls;

        scene.add(fakeWalls);
    }

    clear() {
        if (this.fakeWalls) {
            const childCount = this.fakeWalls.children.length;

            for (let i = childCount - 1; i >= 0; i--) {
                const child = this.fakeWalls.children[i];
                this.fakeWalls.remove(child);
            }
        }
    }

    stop() {
        if (this.mode === FakeWallManager.Mode_Add_1Click && this.currentWall) {
            if (this.fakeWalls) {
                this.fakeWalls.remove(this.currentWall);
            }

            this.vFirstClick = null;
            this.currentWall = null;
        }

        this.mode = FakeWallManager.Mode_Add_NoClick;
    }

    getRayCaster(x, y, camera) {
        const mouse = new THREE.Vector2((x / window.innerWidth) * 2 - 1, -(y / window.innerHeight) * 2 + 1);
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);
        return raycaster;
    }

    static getWallID(wall) {
        const index1 = wall.name.indexOf('_');
        const index2 = wall.name.indexOf('_', index1 + 1);

        if (index1 < 0 || index2 <= index1) {
            return -1;
        }

        const strID = wall.name.substring(index1 + 1, index2);
        return parseInt(strID);
    }

    async loadFakeWalls(zoneNo, scene) {
        this.clear();

        if (!zoneNo) {
            return;
        }

        const result = await SDMSController.requestFakeWalls(zoneNo);

        if (result?.success && result?.fakeWalls) {
            for (const fakeWall of result.fakeWalls) {
                this.makeNewWallFromObject(fakeWall, zoneNo);
            }
        }
    }

    reset() {
        const editFakeWalls = { ...this.editFakeWalls };

        for (const zoneNo in editFakeWalls) {
            const zoneDatas = editFakeWalls[zoneNo];

            for (const fakeWall of zoneDatas.changedWalls) {
                if (fakeWall.userData?.origin?.position) {
                    fakeWall.position.set(fakeWall.userData.origin.position.x, fakeWall.userData.origin.position.y, fakeWall.userData.origin.position.z);
                    fakeWall.rotation.set(fakeWall.userData.origin.rotation.x, fakeWall.userData.origin.rotation.y, fakeWall.userData.origin.rotation.z);
                    fakeWall.scale.set(fakeWall.userData.origin.scale.x, fakeWall.userData.origin.scale.y, fakeWall.userData.origin.scale.z);
                }
            }

            for (const fakeWall of zoneDatas.addedWalls) {
                fakeWall.parent.remove(fakeWall);
            }

            for (const fakeWall of zoneDatas.deletedWalls) {
                if (fakeWall.userData?.origin?.position) {
                    fakeWall.position.set(fakeWall.userData.origin.position.x, fakeWall.userData.origin.position.y, fakeWall.userData.origin.position.z);
                    fakeWall.rotation.set(fakeWall.userData.origin.rotation.x, fakeWall.userData.origin.rotation.y, fakeWall.userData.origin.rotation.z);
                    fakeWall.scale.set(fakeWall.userData.origin.scale.x, fakeWall.userData.origin.scale.y, fakeWall.userData.origin.scale.z);
                }

                fakeWall.visible = true;
            }
        }

        this.editFakeWalls = {};
    }

    async saveFakeWalls(userNo) {
        const editFakeWalls = { ...this.editFakeWalls };
        const updateDatas = [];

        for (const zoneNo in editFakeWalls) {
            const zoneDatas = editFakeWalls[zoneNo];

            for (const fakeWall of zoneDatas.addedWalls) {
                const data = this.makeFakeWallSaveData(fakeWall, zoneNo, FakeWallManager.UpdateMode.Add);
                updateDatas.push(data);
            }

            for (const fakeWall of zoneDatas.changedWalls) {
                const data = this.makeFakeWallSaveData(fakeWall, zoneNo, fakeWall.userData.mode);
                updateDatas.push(data);
            }

            for (const fakeWall of zoneDatas.deletedWalls) {
                const data = this.makeFakeWallSaveData(fakeWall, zoneNo, FakeWallManager.UpdateMode.Delete);
                updateDatas.push(data);
            }
        }

        if (updateDatas.length > 0) {
            const [success, message] = await SDMSController.updateFakeWallDatas(userNo, updateDatas);

            if (success) {
                this.onSave(editFakeWalls);
            }

            return [success, message];
        }

        return [true, "update할 가벽이 지정되지 않았습니다."];
    }

    onSave(editFakeWalls) {
        if (!this.spatialManager) {
            return;
        }

        for (const zoneNo in editFakeWalls) {
            const zoneDatas = editFakeWalls[zoneNo];

            for (const fakeWall of zoneDatas.addedWalls) {
                fakeWall.userData.origin = this.makeOrigin(fakeWall.position, fakeWall.rotation.y, fakeWall.scale.x, fakeWall.scale.y, fakeWall.scale.z);
                fakeWall.userData.zoneNo = zoneNo;
            }

            for (const fakeWall of zoneDatas.changedWalls) {
                fakeWall.userData.origin = this.makeOrigin(fakeWall.position, fakeWall.rotation.y, fakeWall.scale.x, fakeWall.scale.y, fakeWall.scale.z);
                fakeWall.userData.zoneNo = zoneNo;
            }

            for (const fakeWall of zoneDatas.deletedWalls) {
                fakeWall.parent.remove(fakeWall);
            }
        }

        this.editFakeWalls = {};
    }

    isEmptyFakeWallData() {
        const editFakeWalls = { ...this.editFakeWalls };

        for (const zoneNo in editFakeWalls) {
            const zoneDatas = editFakeWalls[zoneNo];

            if (zoneDatas.addedWalls.length > 0) {
                return false;
            }

            if (zoneDatas.changedWalls.length > 0) {
                return false;
            }

            if (zoneDatas.deletedWalls.length > 0) {
                return false;
            }
        }

        return true;
    }

    addFakeWallData(fakeWall, mode, zoneNo) {
        let zoneDatas = this.editFakeWalls[zoneNo];

        if (!zoneDatas) {
            zoneDatas = this.makeZoneFakeWalls();
            this.editFakeWalls[zoneNo] = zoneDatas;
        }

        if (mode === FakeWallManager.UpdateMode.Add) {
            this.addFakeWall(fakeWall, zoneDatas);
        }
        else if (mode === FakeWallManager.UpdateMode.Move ||
            mode === FakeWallManager.UpdateMode.Rotate ||
            mode === FakeWallManager.UpdateMode.Resize) {
            this.updateFakeWall(fakeWall, zoneDatas, mode);
        }
        else if (mode === FakeWallManager.UpdateMode.Delete) {
            this.deleteFakeWall(fakeWall, zoneDatas);
        }
    }

    addFakeWall(fakeWall, zoneDatas) {
        zoneDatas.addedWalls.push(fakeWall);
    }

    updateFakeWall(fakeWall, zoneDatas, mode) {
        if (zoneDatas.addedWalls.includes(fakeWall)) {
            // 새로 추가된 가벽은 위치가 바뀐것을 신경쓰지 않는다.
            return;
        }
        else if (zoneDatas.changedWalls.includes(fakeWall)) {
            return;
        }
        else {
            fakeWall.userData.mode = mode;
            zoneDatas.changedWalls.push(fakeWall);
        }
    }

    deleteFakeWall(fakeWall, zoneDatas) {
        let index = zoneDatas.addedWalls.indexOf(fakeWall);

        if (index >= 0) {
            zoneDatas.addedWalls.splice(index, 1);
        }
        else {
            index = zoneDatas.changedWalls.indexOf(fakeWall);

            if (index >= 0) {
                zoneDatas.changedWalls.splice(index, 1);
            }

            zoneDatas.deletedWalls.push(fakeWall);
        }
    }

    makeZoneFakeWalls() {
        return {
            addedWalls: [],
            changedWalls: [],
            deletedWalls: []
        };
    }

    makeFakeWallSaveData(fakeWall, zoneNo, mode) {
        return {
            fakeWallNo: fakeWall.userData.fakeWallNo,
            zoneNo: zoneNo,
            x: fakeWall.position.x,
            y: fakeWall.position.y,
            z: fakeWall.position.z,
            rotate: fakeWall.rotation.y,
            scale: fakeWall.scale.x,
            mode: mode
        };
    }
}
