import * as THREE from "three/build/three.module.js";
import { Vector3 } from 'three';
import Geometry from "../../../Common/util/Geometry";
import Vertex3D from "../../../Common/util/Vertex3D";
import { SDMSController } from "../../services/sdmsController";

export class FakeWallManager {
    static Mode_None = 0;
    static Mode_Add_NoClick = 1;
    static Mode_Add_1Click = 2;
    static Mode_Move = 3;
    static Mode_Rotate = 4;
    static Mode_Resize = 5;
    static Mode_Delete = 6;

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

    constructor(contents3D) {
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
        this.contents3D = contents3D;
        this.vFirstClick = null;
        this.vOrigin = null;
        this.currentWall = null;
        this.wallCount = 0;
        this.editModeManager = null;

        this.rotation = {
            fixed: null,
            length: null
        };

        this.zoneID = 0;

        this.tempWalls = {
            "walls": [],
            "showTime": false
        };
    }

    setZoneID(zoneID) {
        if (!zoneID) {
            zoneID = this.getOutdoorZoneID();
        }

        if (this.zoneID !== zoneID) {
            this.clear();
            this.zoneID = zoneID;

            this.tempWalls.walls = [];
            this.tempWalls.showTime = false;
            this.readDB(zoneID);
        }
    }

    clear(zoneID) {
        if (this.fakeWalls) {
            const wallCount = this.fakeWalls.children.length;

            for (let i = wallCount-1; i >= 0; i--) {
                this.fakeWalls.remove(this.fakeWalls.children[i]);
            }
        }

        // 편집모드에서 수정 내용 취소할 경우 zoneID 유지가 필요함 - K.D.R
        if (zoneID !== null && zoneID !== undefined)
            this.zoneID = zoneID;
        else {
            //his.zoneID = this.getOutdoorZoneID();
            this.zoneID = -1;
        }
    }

    backToOrigin(originFakeWalls) {
        if (this.fakeWalls) {

            // 편집모드에서 수정 내용 취소할 경우 zoneID 유지가 필요함 - K.D.R
            //this.clear();
            this.clear(this.zoneID);

            if (originFakeWalls) {
                const wallCount = originFakeWalls.length;

                for (let i = 0; i < wallCount; i++) {
                    this.makeNewWallFromObject(originFakeWalls[i]);
                }
            }
        }
    }

    async readDB(zoneID) {
        const result = await SDMSController.requestFakeWalls(zoneID);

        if (result && result.success) {
            const wallCount = result.fakeWalls.length;

            for (let i = 0; i < wallCount; i++) {
                this.tempWalls.walls.push(result.fakeWalls[i]);
            }

            if (this.editModeManager) {
                this.editModeManager.setOriginFakeWalls(zoneID, this.tempWalls.walls);
            }

            // 수정된 가벽이 있다면 적용 - K.D.R
            if (this.editModeManager && this.editModeManager.editFakeWalls[zoneID]) {
                let zoneDatas = this.editModeManager.editFakeWalls[zoneID];
                const dataCount = zoneDatas.length;
                const walls = this.tempWalls.walls;

                for (let i = 0; i < dataCount; i++) {
                    const fakeWallData = zoneDatas[i][0];
                    const mode = zoneDatas[i][1];
                    const oldData = zoneDatas[i][2];

                    if (mode === FakeWallManager.UpdateMode.Add) {
                        const fakeWall = {
                            "id": fakeWallData.id,
                            "rotate": fakeWallData.rotation.y,
                            "scale": fakeWallData.scale.x,
                            "x": fakeWallData.position.x,
                            "y": fakeWallData.position.y,
                            "z": fakeWallData.position.z,
                            "zoneID": zoneID,
                        };

                        walls.push(fakeWall);
                    } else if (mode === FakeWallManager.UpdateMode.Delete || mode === FakeWallManager.UpdateMode.Move ||
                        mode === FakeWallManager.UpdateMode.Rotate || mode === FakeWallManager.UpdateMode.Resize) {

                        let fakeWallID = null;

                        if (oldData !== null && oldData !== undefined) {
                            fakeWallID = oldData.id;
                        } else {
                            fakeWallID = FakeWallManager.getWallID(fakeWallData);
                        }

                        if (fakeWallID === null) {
                            continue;
                        } else if (fakeWallID === -1 && mode !== FakeWallManager.UpdateMode.Delete) {
                            const fakeWall = {
                                "id": fakeWallData.id,
                                "rotate": fakeWallData.rotation.y,
                                "scale": fakeWallData.scale.x,
                                "x": fakeWallData.position.x,
                                "y": fakeWallData.position.y,
                                "z": fakeWallData.position.z,
                                "zoneID": zoneID,
                            };

                            walls.push(fakeWall);
                        } else if (fakeWallID !== null) {
                            for (let j = 0; j < walls.length; j++) {
                                let fakeWall = walls[j];

                                if (fakeWall.id === fakeWallID) {
                                    if (mode === FakeWallManager.UpdateMode.Delete) {
                                        walls.splice(j, 1);
                                    } else {
                                        fakeWall.rotate = fakeWallData.rotation.y;
                                        fakeWall.scale = fakeWallData.scale.x;
                                        fakeWall.x = fakeWallData.position.x;
                                        //fakeWall.y = fakeWallData.position.y;
                                        fakeWall.z = fakeWallData.position.z;
                                    }

                                    break;
                                }
                            }
                        }
                    } 
                }
            }

            // showTime이 될때까지 기다린다.
            setTimeout(FakeWallManager.showFakeWalls2, 1000, [this, 1]);
        }
    }

    async reloadFakeWalls() {
        // 편집모드에서 저장한 뒤, 가벽 데이터 다시 불러와 OriginFakeWalls 넣기 
        const zoneID = this.zoneID;

        if (zoneID === null || zoneID === undefined)
            return;

        const result = await SDMSController.requestFakeWalls(zoneID);
        this.tempWalls.walls = [];

        if (result && result.success) {
            const wallCount = result.fakeWalls.length;

            for (let i = 0; i < wallCount; i++) {
                this.tempWalls.walls.push(result.fakeWalls[i]);
            }

            if (this.editModeManager) {
                this.editModeManager.setOriginFakeWalls(zoneID, this.tempWalls.walls);

                // 다시 가벽을 불러왔을때, 3D 가벽 정보 또한 다시 불러온 가벽 정보로 새로고침 - K.D.R 
                this.backToOrigin(this.tempWalls.walls);
            }
        }
    }

    static showFakeWalls2(params) {
        const _this = params[0];
        const count = params[1];

        if (_this.tempWalls.showTime) {
            if (_this.contents3D && _this.contents3D.scene && _this.model.model) {
                if (!_this.fakeWalls) {
                    const fakeWalls = new THREE.Object3D();
                    fakeWalls.name = "fakeWalls";
                    _this.fakeWalls = fakeWalls;

                    _this.contents3D.scene.add(fakeWalls);
                }

                const wallCount = _this.tempWalls.walls.length;

                for (let i = 0; i < wallCount; i++) {
                    const wall = _this.tempWalls.walls[i];
                    _this.makeNewWallFromObject(wall);
                }
            }

            _this.tempWalls.showTime = false;
            _this.tempWalls.walls = [];
        }
        else {
            // 5초 이상은 대기하지 않는다.
            if (count <= 5) {
                // showTime이 될때까지 기다린다.
                setTimeout(FakeWallManager.showFakeWalls2, 1000, [_this, count + 1]);
            }
        }
    }

    showFakeWalls() {
        this.tempWalls.showTime = true;
    }

    changeMode(mode) {
        this.mode = mode;
    }

    onClick(event, zoneID) {
        if (!zoneID) {
            zoneID = this.getOutdoorZoneID();
        }

        // 숨겨진 기능
        // 가벽편집 UI가 없기 때문에 임시로 만든 기능
        // Alt & Shift Key를 누른 상태에서 Mouse Click 하면 편집 모드가 바뀐다.
        /*if (event.altKey && event.shiftKey) {
            this.rotateMode();
        }
        else */if (this.mode === FakeWallManager.Mode_Add_NoClick) {
            // 외부영역에서 가벽 수정 불가 - K.D.R
            if (this.zoneID === -1 && zoneID === null) {
                if (this.contents3D)
                    this.contents3D.props.showConfirmDialog("오류", "외부영역에서 가벽을 수정할 수 없습니다.", null, null);

                return;
            }

            this.add(event, zoneID);
        }
        else if (this.mode === FakeWallManager.Mode_Add_1Click) {
            this.setPosition(event, true, FakeWallManager.UpdateMode.Add);
        }
        else if (this.mode === FakeWallManager.Mode_Move) {
            if (this.currentWall === null) {
                this.pick(event);
            }
            else {
                this.updateWall(this.currentWall, FakeWallManager.UpdateMode.Move);
                //this.updateDB(this.currentWall, FakeWallManager.UpdateMode.Move);

                // Mode는 유지되도록 수정 - K.D.R
                //this.setNoneMode();
                this.initNoneValue();
            }
        }
        else if (this.mode === FakeWallManager.Mode_Rotate) {
            if (this.currentWall === null) {
                const vCurrent = this.pick(event);

                if (vCurrent) {
                    this.setRotationPoint(this.currentWall, vCurrent);
                }
            }
            else {
                this.updateWall(this.currentWall, FakeWallManager.UpdateMode.Rotate);
                //this.updateDB(this.currentWall, FakeWallManager.UpdateMode.Rotate);

                // Mode는 유지되도록 수정 - K.D.R
                //this.setNoneMode();
                this.initNoneValue();
            }
        }
        else if (this.mode === FakeWallManager.Mode_Resize) {
            if (this.currentWall === null) {
                const vCurrent = this.pick(event);

                if (vCurrent) {
                    this.setFirstPoint(this.currentWall, vCurrent);
                }
            }
            else {
                //this.setPosition(event, false, FakeWallManager.UpdateMode.Resize);
                this.updateWall(this.currentWall, FakeWallManager.UpdateMode.Resize);

                // Mode는 유지되도록 수정 - K.D.R
                //this.setNoneMode();
                this.initNoneValue();
            }
        }
        else if (this.mode === FakeWallManager.Mode_Delete) {
            this.pick(event);
            const currentWall = this.currentWall;
            this.currentWall = null;

            if (currentWall) {
                // 임시 저장소에 저장한 다음 한꺼번에 처리하도록 한다.
                this.removeWall(currentWall);
                // DB에 바로 저장한다.
                //this.remove(currentWall);
            }
        }
    }

    getOutdoorZoneID() {
        const outdoorZones = this.contents3D.props?._3dOptions?.outdoorZones;

        if (outdoorZones) {
            for (const zoneID in outdoorZones) {
                return parseInt(zoneID);
            }
        }

        return -1;
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
            }
            else {
                this.vFirstClick = v1;
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

    setNoneMode() {
        this.mode = FakeWallManager.Mode_None;

        this.vFirstClick = null;
        this.vCurrentWall = null;
        this.vOrigin = null;

        this.rotation.fixed = null;
        this.rotation.length = null;
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

    pick(event) {
        if (!this.contents3D || !this.contents3D.camera || !this.model.model || !this.contents3D.scene) {
            return null;
        }

        const x = event.nativeEvent.offsetX;
        const y = event.nativeEvent.offsetY;
        const mouse = new THREE.Vector2((x / window.innerWidth) * 2 - 1, -(y / window.innerHeight) * 2 + 1);

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, this.contents3D.camera);

        const intersects = raycaster.intersectObjects(this.contents3D.scene.children, true);
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

    onKeyDown(event) {
        if (event.key === "Escape") {
            if (this.mode === FakeWallManager.Mode_Add_1Click && this.currentWall) {
                if (this.fakeWalls) {
                    this.fakeWalls.remove(this.currentWall);
                }

                this.vFirstClick = null;
                this.currentWall = null;
            }

            this.mode = FakeWallManager.Mode_Add_NoClick;
            //this.mode = FakeWallManager.Mode_None;
        }
    }

    cancleFakeWall() {
        // 가벽 추가 중 취소했다면 생성 중인 가벽 삭제
        if (this.mode === FakeWallManager.Mode_Add_1Click && this.currentWall) {
            if (this.fakeWalls) {
                this.fakeWalls.remove(this.currentWall);
            }

            this.vFirstClick = null;
            this.currentWall = null;

            this.mode = FakeWallManager.Mode_Add_NoClick;
        }
    }

    onMouseMove(event) {
        if (this.mode === FakeWallManager.Mode_Add_1Click ||
            this.mode === FakeWallManager.Mode_Resize) {
            if (this.vFirstClick && this.currentWall) {
                this.setWallPosition(event);
            }
        }
        else if (this.mode === FakeWallManager.Mode_Move) {
            if (this.currentWall && this.vFirstClick && this.vOrigin) {
                this.move(event);
            }
        }
        else if (this.mode === FakeWallManager.Mode_Rotate) {
            if (this.currentWall && this.rotation.fixed && this.rotation.length) {
                this.rotate(event);
            }
        }
    }

    removeWall(currentWall) {
        if (this.editModeManager) {
            this.editModeManager.addFakeWallData(currentWall, FakeWallManager.UpdateMode.Delete, this.zoneID, this);
            this.fakeWalls.remove(currentWall);
        }
    }

    async remove(currentWall) {
        this.fakeWalls.remove(currentWall);
        await SDMSController.requestUpdateFakeWall(currentWall, FakeWallManager.getWallID(currentWall), this.zoneID, FakeWallManager.UpdateMode.Delete);
    }

    rotate(event) {
        const vCurrent = this.to3DPoint(event);
        const fixed = this.rotation.fixed;
        const vRight = new Vertex3D(fixed.x + 100, fixed.y, fixed.z);
        let angle = Geometry.getAngle(vCurrent, fixed, vRight);

        if (vCurrent.z > fixed.z) {
            angle = Math.PI * 2 - angle;
        }

        const [x, y, z] = Geometry.getLinearVertex3(fixed.x, fixed.y, fixed.z, vCurrent.x, vCurrent.y, vCurrent.z, this.rotation.length);
        this.currentWall.position.set((fixed.x + x) / 2, (fixed.y + y) / 2, (fixed.z + z) / 2);
        this.currentWall.rotation.set(0, angle, 0);
    }

    move(event) {
        const vCurrent = this.to3DPoint(event);
        const moveX = vCurrent.x - this.vFirstClick.x;
        const moveY = vCurrent.y - this.vFirstClick.y;
        const moveZ = vCurrent.z - this.vFirstClick.z;

        this.currentWall.position.set(this.vOrigin.x + moveX, this.vOrigin.y + moveY, this.vOrigin.z + moveZ);
    }

    getRayCaster(event) {
        if (!this.contents3D || !this.contents3D.camera || !this.model.model || !this.contents3D.scene) {
            return null;
        }

        const x = event.nativeEvent.offsetX;
        const y = event.nativeEvent.offsetY;
        const mouse = new THREE.Vector2((x / window.innerWidth) * 2 - 1, -(y / window.innerHeight) * 2 + 1);

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, this.contents3D.camera);
        return raycaster;
    }

    setPosition(event, continuous, updateMode) {
        if (this.mode === FakeWallManager.Mode_Add_1Click) {
            if (this.vFirstClick && this.currentWall) {
                const vCurrent = this.setWallPosition(event);

                this.updateWall(this.currentWall, updateMode);
                //this.updateDB(this.currentWall, updateMode);

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
            this.editModeManager.addFakeWallData(fakeWall, updateMode, this.zoneID, this);
        }
    }

    async updateDB(fakeWall, updateMode) {
        const result = await SDMSController.requestUpdateFakeWall(fakeWall, FakeWallManager.getWallID(fakeWall), this.zoneID, updateMode);

        if (result && result.success) {
            const id = FakeWallManager.getWallID(fakeWall);

            if (id === null || id === undefined || id < 0) {
                this.updateWallName(fakeWall, result.id);
            }
        }
    }

    setWallPosition(event) {
        const vCurrent = this.to3DPoint(event);

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

    to3DPoint(event) {
        const raycaster = this.getRayCaster(event);

        if (!raycaster) {
            return null;
        }
        return new Vertex3D(raycaster.ray.origin.x, this.vFirstClick.y, raycaster.ray.origin.z);
    }

    setContents3D(model, contents3D) {
        this.model.model = model;
        this.contents3D = contents3D;

        const box = new THREE.Box3().setFromObject(model);

        this.model.geometry.xSize = box.max.x - box.min.x;
        this.model.geometry.ySize = box.max.y - box.min.y;
        this.model.geometry.zSize = box.max.z - box.min.z;
        this.model.geometry.scale = model.scale;

        const fakeWalls = new THREE.Object3D();
        fakeWalls.name = "fakeWalls";
        this.fakeWalls = fakeWalls;

        this.contents3D.scene.add(fakeWalls);
    }

    setMode(mode) {
        this.mode = mode;
        this.vFirstClick = null;
        this.currentWall = null;
    }

    // 임시 함수.
    // 편집 UI가 생성되면 삭제해야 함
    /*rotateMode() {
        let modeName = "";

        if (this.mode === FakeWallManager.Mode_None) {
            this.mode = FakeWallManager.Mode_Add_NoClick;
            modeName = "가벽 추가";
        }
        else if (this.mode === FakeWallManager.Mode_Add_NoClick) {
            this.mode = FakeWallManager.Mode_Move;
            modeName = "가벽 이동";
        }
        else if (this.mode === FakeWallManager.Mode_Move) {
            this.mode = FakeWallManager.Mode_Rotate;
            modeName = "가벽 회전";
        }
        else if (this.mode === FakeWallManager.Mode_Rotate) {
            this.mode = FakeWallManager.Mode_Resize;
            modeName = "가벽 크기 조절";
        }
        else if (this.mode === FakeWallManager.Mode_Resize) {
            this.mode = FakeWallManager.Mode_Delete;
            modeName = "가벽 삭제";
        }
        else if (this.mode === FakeWallManager.Mode_Delete) {
            this.mode = FakeWallManager.Mode_None;
            modeName = "가벽 편집안함";
        }
        else {
            this.mode = FakeWallManager.Mode_None;
            modeName = "가벽 편집안함";
        }

        this.vFirstClick = null;
        this.currentWall = null;
        console.log("change mode : " + modeName);
    }*/

    add(event, zoneID) {
        const raycaster = this.getRayCaster(event);

        if (!raycaster) {
            return;
        }

        let wallHeight = this.contents3D.props._3dOptions.zones[zoneID]?.datas?.fakeWallElevation;

        if (wallHeight !== 0 && !wallHeight) {
            wallHeight = this.contents3D.props._3dOptions.outdoorZones[zoneID]?.datas?.fakeWallElevation;
        }

        if (wallHeight !== null && wallHeight !== undefined) {
            const pos = new THREE.Vector3(raycaster.ray.origin.x, wallHeight, raycaster.ray.origin.z);
            this.makeNewWall(pos);
        }
        else {
            const intersects = raycaster.intersectObjects(this.contents3D.scene.children, true);
            const intersectCount = intersects.length;
            let bottom = null;

            for (let i = 0; i < intersectCount; i++) {
                const intersect = intersects[i];

                if (intersect.object.visible === false) {
                    continue;
                }

                if (bottom === null) {
                    bottom = new Vector3(intersect.point.x, intersect.point.y, intersect.point.z);
                }
                else if (bottom.y > intersect.point.y) {
                    bottom.set(intersect.point.x, intersect.point.y, intersect.point.z);
                }
            }

            if (bottom !== null) {
                this.makeNewWall(bottom);
            }
        }
    }

    makeNewWallFromObject(obj/*id, x, y, z, rotate, scale*/) {
        const fakeWall = this.model.model.clone();
        this.setWallName(fakeWall, obj.id);

        let scale = 1.0;

        if (this.contents3D && this.contents3D.isIndoor() === false) {
            scale = FakeWallManager.OutdoorScale;
        }

        fakeWall.position.set(obj.x, obj.y, obj.z);
        fakeWall.rotation.set(0, obj.rotate, 0);
        fakeWall.scale.set(obj.scale, fakeWall.scale.y, fakeWall.scale.z * scale);

        this.fakeWalls.add(fakeWall);
    }

    makeNewWall(vPos) {
        const fakeWall = this.model.model.clone();
        this.setWallName(fakeWall, -1);
        fakeWall.position.set(vPos.x + this.model.geometry.xSize / 2, vPos.y, vPos.z);

        let scale = 1.0;

        if (this.contents3D && this.contents3D.isIndoor() === false) {
            scale = FakeWallManager.OutdoorScale;
        }

        // 마우스 Click한 지점이 시작점이자 끝점이므로 가벽의 길이는 0이 되어야 한다.
        fakeWall.scale.set(0, fakeWall.scale.y, fakeWall.scale.z * scale);

        this.fakeWalls.add(fakeWall);

        this.currentWall = fakeWall;
        this.vFirstClick = new Vertex3D(vPos.x, vPos.y, vPos.z);
        this.mode = FakeWallManager.Mode_Add_1Click;

        // 생성 중인 벽체가 있는 상태에서 취소버튼을 클릭 시 초기화를 위한 - K.D.R
        this.editModeManager.setFakeWallManager(this);
    }

    setWallName(wall, id) {
        this.wallCount++;

        if (this.wallCount < 10) {
            wall.name = FakeWallManager.ObjectTag + id + "_00" + this.wallCount;
        }
        else if (this.wallCount < 100) {
            wall.name = FakeWallManager.ObjectTag + id + "_0" + this.wallCount;
        }
        else {
            wall.name = FakeWallManager.ObjectTag + id + "_" + this.wallCount;
        }
    }

    static changeWallName(wall, id) {
        const index1 = wall.name.indexOf('_');
        const index2 = wall.name.indexOf('_', index1 + 1);

        if (index1 < 0 || index2 <= index1) {
            return -1;
        }

        const strFirst = wall.name.substring(0, index1 + 1);
        const strLast = wall.name.substring(index2);
        wall.name = strFirst + id + strLast;
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

    updateWallName(wall, id) {
        const index1 = wall.name.indexOf('_');
        const index2 = wall.name.indexOf('_', index1 + 1);

        if (index1 < 0 || index2 <= index1) {
            this.setWallName(wall, id);
        }
        else {
            const str1 = wall.name.substring(0, index1);
            const str2 = wall.name.substring(index2 + 1);
            wall.name = str1 + "_" + id + "_" + str2;
        }
    }

    setEditModeManager(editModeManager) {
        this.editModeManager = editModeManager;
    }
}
