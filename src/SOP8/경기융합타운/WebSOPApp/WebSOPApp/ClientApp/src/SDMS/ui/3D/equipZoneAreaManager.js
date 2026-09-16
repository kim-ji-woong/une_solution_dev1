import * as THREE from "three/build/three.module.js";
import { Vector3 } from 'three';
import Geometry from "../../../Common/util/Geometry";
import Vertex3D from "../../../Common/util/Vertex3D";
import SDMS from '../sdms';
import SDMSMainMenu from "../sdmsMainMenu";
import { SDMSController } from "../../services/sdmsController";
import { AssessmentController } from '../../services/assessmentController';
import ProjectResource from "../../../Root/resource/id";
import SDMSResource from '../../resource/id';

export class EquipZoneAreaManager {
    static Mode_None = 0;
    static Mode_Add_NoClick = 1;
    static Mode_Add_OneClick = 2;
    static Mode_Delete = 3;

    static SNAP = 0.5;

    static UpdateMode = {
        "None": 0,
        "Add": 1,
        "Move": 2,
        "Rotate": 3,
        "Resize": 4,
        "Delete": 5
    };

    static AreaType = {
        "Normal": 0,
        "ClassA": 1,
        "ClassB": 2,
        "ClassC": 3,
        "ClassD": 4,
        "ClassE": 5,
        "Alarm": 6
    }

    static Color_Normal = 0xE0E0E0;
    static Color_Alarm = 0xF40000;

    static Color_ClassA = 0x5398FF;
    static Color_ClassB = 0x00B56C;
    static Color_ClassC = 0xFFD153;
    static Color_ClassD = 0xFF8253;
    static Color_ClassE = 0xFF5353;

    // 구역 평가 관련 옵션
    useEquipZoneAssess = false;

    constructor() {
        this.mode = EquipZoneAreaManager.Mode_None;

        this.zoneID = 0;
        this.editModeManager = null;

        this.vFirstClick = null;

        // 수정 중인 line 정보
        this.start = null;
        this.end = null;
        this.line = null;
        this.lineGeometry = null;
        this.linePoints = [];

        this.currentEquipZone = null;       // 선택된 EquipZone POI 정보

        this.lines = null;      // line Object 리스트
        this.areas = null;      // area Object 리스트

        this.tempAreas = [];    // area 데이터 리스트
        this.isLoad = false;    // area 불러오기 여부 

        this.alarmAreaInfo = {  // 알람 관련 정보
            equipZoneID: null,
            loadAreaCount: 0,
        };

        this.isVisible = true;  // 영역 Show/Hide

        this.accessInfo = {         // 구역평가 관련 정보
            isLoad: false,          // 구역평가 불러오기 여부
            scores: null,           // 평가 데이터
            isComplete: false,      // 영역에 평가 적용 여부
            visibleAssess: null,    // 영역평가 Show/Hide 여부
        }
    }

    // 구역평가 관련 옵션
    setUseEquipZoneAssess(useEquipZoneAssess) {
        this.useEquipZoneAssess = useEquipZoneAssess;
    }

    setContents3D(contents3D) {
        this.contents3D = contents3D;

        const lines = new THREE.Object3D();
        lines.name = "lines";
        this.lines = lines;

        const areas = new THREE.Object3D();
        areas.name = "areas";
        this.areas = areas;

        this.contents3D.scene.add(lines);
        this.contents3D.scene.add(areas);
    }

    cancleEquipZoneArea() {
        this.mode = EquipZoneAreaManager.Mode_None;

        this.clearLines();

        //this.isLoad = false;
    }
    
    changeMode(mode) {
        this.mode = mode;
    }

    pickEquipZone(equipZone) {
        this.currentEquipZone = equipZone;
    }

    onClick(event, zoneID) {
        if (!zoneID) {
            return;
        }

        if (this.mode === EquipZoneAreaManager.Mode_Add_NoClick) {
            this.add(event, zoneID);
        } else if (this.mode === EquipZoneAreaManager.Mode_Add_OneClick) {
            this.setPosition(event);
        } else if (this.mode === EquipZoneAreaManager.Mode_Delete) {
            
        }
    }

    add(event, zoneID) {
        const raycaster = this.getRayCaster(event);

        if (!raycaster) {
            return;
        }

        let areaHeight = this.contents3D.props._3dOptions.zones[zoneID]?.datas?.fakeWallElevation;
        if (!areaHeight && this.zoneID >= 20000)
            areaHeight = this.contents3D.props._3dOptions.outdoorZones[this.zoneID]?.datas?.fakeWallElevation;

        if (areaHeight === null || areaHeight === undefined) {
            areaHeight = 0;
        } else {
            areaHeight += 5;
        }

        const pos = new THREE.Vector3(raycaster.ray.origin.x, areaHeight, raycaster.ray.origin.z);
        this.makeNewLine(pos);

        this.editModeManager.setEquipZoneAreaManager(this);
    }

    getRayCaster(event) {
        if (!this.contents3D || !this.contents3D.camera || !this.contents3D.scene) {
            return null;
        }

        const x = event.nativeEvent.offsetX;
        const y = event.nativeEvent.offsetY;
        const mouse = new THREE.Vector2((x / window.innerWidth) * 2 - 1, -(y / window.innerHeight) * 2 + 1);

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, this.contents3D.camera);
        return raycaster;
    }

    makeNewLine(vPos) {

        // 클릭 포인트가 시작 포인트
        this.start = new THREE.Vector3(vPos.x, vPos.y, vPos.z);
        // 시작은 끝 포인트 동일
        this.end = new THREE.Vector3(vPos.x, vPos.y, vPos.z);        
        const points = [this.start, this.end];

        // y 값 저장
        this.vFirstClick = new Vertex3D(vPos.x, vPos.y, vPos.z);

        this.lineGeometry = new THREE.BufferGeometry().setFromPoints(points);

        const material = new THREE.LineBasicMaterial( { color: 0x0000ff } );

        this.line = new THREE.Line( this.lineGeometry, material );
        
        this.lines.add(this.line);

        this.mode = EquipZoneAreaManager.Mode_Add_OneClick;

        // 첫 시작 라인 포인트 저장
        if (this.linePoints?.length === 0)
            this.linePoints.push(new THREE.Vector3(vPos.x, vPos.y, vPos.z));
    }

    makeNewArea(linePoints, currentEquipZone) {
        if (linePoints?.length < 3) {
            return;
        } 

        const lines = [];
        const firstPoint = {};

        for (let i = 0; i < linePoints.length; i++) {
            const linePoint = linePoints[i];

            const line = {};

            line.x = Math.floor(linePoint?.x * 100) / 100;
            //line.y = Math.floor(linePoint?.y * 100) / 100;
            line.z = Math.floor(linePoint?.z * 100) / 100;

            if (i === 0) {
                firstPoint.x = line.x;
                firstPoint.z = line.z;

                firstPoint.y = Math.floor(linePoint?.y * 100) / 100;
            }

            lines.push(line);
        }

        const [sensorType, zoneID, equipZoneID] = SDMS.getSensorInfo(currentEquipZone);
        
        let equipZoneName = "-";
        if (currentEquipZone?.object?.userData?.text) {
            equipZoneName = currentEquipZone.object.userData.text;
        }
        
        const shape = new THREE.Shape();
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const xPoint = line.x - firstPoint.x;
            const zPoint = line.z - firstPoint.z;

            if (i === 0)
                shape.moveTo(xPoint, zPoint);
            else 
                shape.lineTo(xPoint, zPoint);
        }
        
        const extrudeSettings = {
	        steps: 1,
	        depth: 5,
	        bevelEnabled: false
        };

        const geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
        const material = new THREE.MeshBasicMaterial({ 
            color: EquipZoneAreaManager.Color_Normal,        //mesh의 색상
            transparent: true,      //불투명도를 지정하는 값인 opacity 사용 여부
            opacity: 0.8            // 0 ~ 1 사이로 0은 완전히 투명
        });
        const mesh = new THREE.Mesh(geometry, material);

        if (mesh) {
            this.areas.add(mesh);
       
            // 각도 조정
            mesh.rotation.x = Math.PI / 2;
            // 위치 이동
            mesh.position.x = firstPoint.x;
            mesh.position.y = firstPoint.y;
            mesh.position.z = firstPoint.z;

            mesh.name = SDMSMainMenu.EquipZoneArea + "_" + zoneID + "_" + equipZoneID;
            mesh.userData.equipZoneName = equipZoneName;
            mesh.userData.lines = lines;
            mesh.userData.areaType = EquipZoneAreaManager.AreaType.Normal;

            // 영역 SHOW/HIDE
            mesh.visible = this.isVisible;

            // .TODO: editModeManager 신규 데이터 추가
            const area = {equipZoneID: equipZoneID, lines: lines, equipZoneName: equipZoneName, zoneID: zoneID};
            this.updateEquipZoneArea(area, EquipZoneAreaManager.UpdateMode.Add);

            // 로딩된 Area Count
            this.alarmAreaInfo.loadAreaCount++;
        }

        // line 정보 초기화
        this.clearLineData();
    }

    onMouseMove(event) {
        if (this.mode === EquipZoneAreaManager.Mode_Add_OneClick) {
            if (this.line) {
                this.setLinePosition(event);
            }
        }
    }

    setLinePosition(event) {
        let vCurrent = this.to3DPoint(event);

        if (!vCurrent || !this.line || !this.lineGeometry) {
            return null;
        }

        // 스냅 기능
        //console.log("setLinePosition x:" + vCurrent.x + ", y:" + vCurrent.y + ", z:" + vCurrent.z);
        const lines = this.lines;
        for (let i = 0; i < this.linePoints?.length; i++) {
            const line = this.linePoints[i];

            if ((line.x + EquipZoneAreaManager.SNAP) > vCurrent.x && (line.x - EquipZoneAreaManager.SNAP) < vCurrent.x &&
                (line.z + EquipZoneAreaManager.SNAP) > vCurrent.z && (line.z - EquipZoneAreaManager.SNAP) < vCurrent.z) {
                vCurrent.x = line.x;
                vCurrent.z = line.z;
            }
        }

        this.end.x = vCurrent.x;
        this.end.z = vCurrent.z;

        const points = [this.start, this.end];
        this.lineGeometry.setFromPoints(points);
        this.line.geometry = this.lineGeometry;
    }

    to3DPoint(event) {
        const raycaster = this.getRayCaster(event);

        if (!raycaster) {
            return null;
        }
        return new Vertex3D(raycaster.ray.origin.x, this.vFirstClick.y, raycaster.ray.origin.z);
    }

    setPosition(event) {
        // 현재 시작 포인트, 끝 포인트로 라인 생성
        const points = [this.start, this.end];
        this.lineGeometry.setFromPoints(points);
        this.line.geometry = this.lineGeometry;

        // 포인트 저장
        this.linePoints.push(new THREE.Vector3(this.end.x, this.end.y, this.end.z));
        
        // 공간을 형성하기 위해서는 3개의 포인트 필요
        if (this.linePoints?.length > 2) {
            const start = this.linePoints[0];
            const end = this.linePoints[this.linePoints.length - 1];

            if (start.x === end.x && start.z === end.z) {
                // 시작과 끝이 같기 때문에 공간 형성
                this.mode = EquipZoneAreaManager.Mode_Add_NoClick;

                // 영역 생성
                this.makeNewArea(this.linePoints, this.currentEquipZone);
                return;
            }
        }

        // 신규 라인 생성
        const pos = new THREE.Vector3(this.end.x, this.end.y, this.end.z);
        this.makeNewLine(pos);
    }

    setZoneID(zoneID, siteID) {
        if (this.zoneID === zoneID) {
            return;
        }

        this.clearLines();
        this.clearAreas();

        this.tempAreas = [];
        this.isLoad = false;

        // 구역 평가 관련 초기화
        this.accessInfo.isLoad = false;
        this.accessInfo.scores = null;
        this.accessInfo.isComplete = false;

        this.zoneID = zoneID;

        this.readDB(zoneID, siteID);
    }

    async readDB(zoneID, siteID) {
        const result = await SDMSController.requestEquipZoneAreas(zoneID);

        if (result && result.success) {
            const areaCount = result.areas.length;

            for (let i = 0; i < areaCount; i++) {
                this.tempAreas.push(result.areas[i]);
            }

            if (this.editModeManager) {
                this.editModeManager.setOriginEquipZoneAreas(zoneID, this.tempAreas);
            }

            // 수정된 영역이 있다면 적용 - K.D.R
            if (this.editModeManager?.editEquipZoneAreas[zoneID]) {
                let areaDatas = this.editModeManager.editEquipZoneAreas[zoneID];
                const dataCount = areaDatas.length;
                const areas = this.tempAreas;

                for (let i = 0; i < dataCount; i++) {
                    const areaData = areaDatas[i][0];
                    const mode = areaDatas[i][1];

                    if (mode === EquipZoneAreaManager.UpdateMode.Add) {
                        const area = {
                            "equipZoneID": areaData.equipZoneID,
                            "equipZoneName": areaData.equipZoneName,
                            "zoneID": areaData.zoneID,
                            "lines": areaData.lines
                        };

                        areas.push(area);
                    } else if (mode === EquipZoneAreaManager.UpdateMode.Delete) {
                        const equipZoneID = areaData.equipZoneID;
                        if (equipZoneID !== null) {

                            for (let j = 0; j < areas?.length; j++) {
                                let area = areas[j];

                                if (area.equipZoneID === equipZoneID) {
                                    areas.splice(j, 1);

                                    break;
                                }
                            }
                        }
                    } 
                }
            }

            this.isLoad = true;

            // 로딩된 Area Count
            this.alarmAreaInfo.loadAreaCount = this.tempAreas.length;

            //if (siteID >= ProjectResource.Site.Wonik && siteID <= ProjectResource.Site.Wonik_S) {
            if (this.useEquipZoneAssess === true) {
                // 해당 층 구역 평가 불러오기 
                siteID = parseInt(siteID);
                if (siteID === NaN)
                    siteID = null;

                const [scores, message] = await AssessmentController.LoadScoreByZone(this.zoneID, siteID);
                if (scores) {
                    this.accessInfo.scores = scores;
                }

                this.accessInfo.isLoad = true;
            }
        }
    }

    showEquipZoneAreas(isReload = false) {
        if (this.isLoad === true) {
            const areas = this.tempAreas;

            for (let i = 0; i < areas?.length; i++) {
                const area = areas[i];
                
                if (area.equipZoneID && area.lines) 
                    this.makeArea(area);
            }

        }
        else if (this.isLoad === false && isReload === false) {
            setTimeout(() => this.showEquipZoneAreas(true), 500);
        }
    }

    makeArea(area, areaType = EquipZoneAreaManager.AreaType.Normal) {
        if (area?.lines?.length < 3) {
            return;
        }

        // 이미 만들어진 영역이라면 
        if (this.checkDoubleArea(area.equipZoneID))
            return;

        const linePoints = area.lines;

        const firstPoint = linePoints[0];        
        const shape = new THREE.Shape();

        let areaHeight = this.contents3D.props._3dOptions.zones[this.zoneID]?.datas?.fakeWallElevation;
        if (!areaHeight && this.zoneID >= 20000)
            areaHeight = this.contents3D.props._3dOptions.outdoorZones[this.zoneID]?.datas?.fakeWallElevation;

        if (areaHeight === null || areaHeight === undefined) {
            areaHeight = 0;
        } else {
            areaHeight += 5;
        }
        
        for (let i = 0; i < linePoints.length; i++) {
            const line = linePoints[i];
            const xPoint = line.x - firstPoint.x;
            const zPoint = line.z - firstPoint.z;

            if (i === 0)
                shape.moveTo(xPoint, zPoint);
            else 
                shape.lineTo(xPoint, zPoint);
        }
        
        const extrudeSettings = {
	        steps: 1,
	        depth: 5,
	        bevelEnabled: false
        };

        const geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );

        // 알람 포커스에 따른 색상
        let colorData = EquipZoneAreaManager.Color_Normal;
        if (areaType === EquipZoneAreaManager.AreaType.Alarm) {
            colorData = EquipZoneAreaManager.Color_Alarm;
        } else if (areaType === EquipZoneAreaManager.AreaType.ClassA) {
            colorData = EquipZoneAreaManager.Color_ClassA;
        } else if (areaType === EquipZoneAreaManager.AreaType.ClassB) {
            colorData = EquipZoneAreaManager.Color_ClassB;
            if (ProjectResource.SiteNo === ProjectResource.Site.Wonik) 
                colorData = EquipZoneAreaManager.Color_ClassC;            
        } else if (areaType === EquipZoneAreaManager.AreaType.ClassC) {
            colorData = EquipZoneAreaManager.Color_ClassC;
            if (ProjectResource.SiteNo === ProjectResource.Site.Wonik) 
                colorData = EquipZoneAreaManager.Color_ClassE            
        } else if (areaType === EquipZoneAreaManager.AreaType.ClassD) {
            colorData = EquipZoneAreaManager.Color_ClassD;
        } else if (areaType === EquipZoneAreaManager.AreaType.ClassE) {
            colorData = EquipZoneAreaManager.Color_ClassE;
        }

        const material = new THREE.MeshBasicMaterial({ 
            color: colorData,        //mesh의 색상
            transparent: true,      //불투명도를 지정하는 값인 opacity 사용 여부
            opacity: 0.6            // 0 ~ 1 사이로 0은 완전히 투명
        });

        const mesh = new THREE.Mesh(geometry, material);

        if (mesh) {
            this.areas.add(mesh);
       
            // 각도 조정
            mesh.rotation.x = Math.PI / 2;
            // 위치 이동
            mesh.position.x = firstPoint.x;
            mesh.position.y = areaHeight;
            mesh.position.z = firstPoint.z;

            mesh.name = SDMSMainMenu.EquipZoneArea + "_" + area.zoneID + "_" + area.equipZoneID;
            mesh.userData.equipZoneName = area.equipZoneName;
            mesh.userData.lines = area.lines;
            mesh.userData.areaType = areaType;

            // 영역 SHOW/HIDE
            if (areaType === EquipZoneAreaManager.AreaType.Normal)
                mesh.visible = this.isVisible;
            else {
                // .TODO: 알람 하이라이트 효과는 다른 옵션 처리
                mesh.visible = true;
            }
        }
    }

    onKeyDown(event) {
        if (event.key === "Escape") {
            if (this.mode === EquipZoneAreaManager.Mode_Add_NoClick ||
                this.mode === EquipZoneAreaManager.Mode_Add_OneClick) {
                // 수정 중인 line 정보 초기화
                this.clearLineData();
            }
        }
    }

    clearLineData() {
        this.clearLines();  // Line Object 초기화
                
        this.vFirstClick = null;
        this.start = null;
        this.end = null;
        this.line = null;
        this.lineGeometry = null;
        this.linePoints = [];

        this.mode = EquipZoneAreaManager.Mode_None;     // 모드 초기화

        this.contents3D.clearSelectEquipZonePOI();      // 선택된 EquipZonePOI 초기화
    }

    clearLines() {
        if (this.lines?.children?.length > 0) {
            const lineCount = this.lines.children.length;

            for (let i = lineCount - 1; i >= 0; i--) {
                this.lines.remove(this.lines.children[i]);
            }
        }
    }

    clearAreas() {
        if (this.areas?.children?.length > 0) {
            const lineCount = this.areas.children.length;

            for (let i = lineCount - 1; i >= 0; i--) {
                this.areas.remove(this.areas.children[i]);
            }
        }
    }

    addAreaMode() {
        if (this.mode === EquipZoneAreaManager.Mode_Add_NoClick ||
            this.mode === EquipZoneAreaManager.Mode_Add_OneClick)
            return true;

        return false;
    }

    updateEquipZoneArea(area, updateMode) {
        if (this.editModeManager) {
            this.editModeManager.addEquipZoneAreaData(area, updateMode, this.zoneID, this);
        }
    }

    removeEquipZoneArea(areaPoi) {
        if (!areaPoi)
            return;

        const [sensorType, zoneID, equipZoneID] = SDMS.getSensorInfo(areaPoi);

        if (zoneID && equipZoneID) {
            const area = {equipZoneID: equipZoneID, lines: areaPoi.userData.lines, equipZoneName: areaPoi.userData.equipZoneName, zoneID: zoneID};

            if (this.editModeManager) {
                this.editModeManager.addEquipZoneAreaData(area, EquipZoneAreaManager.UpdateMode.Delete, this.zoneID, this);
                this.areas.remove(areaPoi);

                // 로딩된 Area Count
                this.alarmAreaInfo.loadAreaCount--;
            }
        }        
    }

    async reloadEquipZoneAreas() {
        // 편집모드에서 저장한 뒤, 가벽 데이터 다시 불러와 OriginFakeWalls 넣기 
        const zoneID = this.zoneID;

        if (zoneID === null || zoneID === undefined)
            return;

        const result = await SDMSController.requestEquipZoneAreas(zoneID);
        this.tempAreas = [];

        if (result && result.success) {
            const areaCount = result.areas.length;

            for (let i = 0; i < areaCount; i++) {
                this.tempAreas.push(result.areas[i]);
            }

            if (this.editModeManager)
                this.editModeManager.setOriginEquipZoneAreas(zoneID, this.tempAreas);

            // 다시 영역을 불러왔을때, 3D 영역 정보 또한 다시 불러온 영역 정보로 새로고침
            this.backToOrigin(this.tempAreas);
        }
    }

    backToOrigin(originEquipZoneAreas) {
        this.clearLines();
        this.clearAreas();

        this.tempAreas = [];
        //this.isLoad = false;

        for (let i = 0; i < originEquipZoneAreas?.length; i++) {
            const area = originEquipZoneAreas[i];

            if (area.equipZoneID && area.lines)
                this.makeArea(area);
        }

        // 로딩된 Area Count
        this.alarmAreaInfo.loadAreaCount = (originEquipZoneAreas?.length > 0 ? originEquipZoneAreas.length : 0);

    }

    setEditModeManager(editModeManager) {
        this.editModeManager = editModeManager;
    }

    checkDoubleArea(_equipZoneID) {
        let ret = false;

        for (let i = 0; i < this.areas?.children?.length; i++) {
            const area = this.areas.children[i];

            const [sensorType, zoneID, equipZoneID] = SDMS.getSensorInfo(area);

            if (_equipZoneID === equipZoneID)
                ret = true;
        }
                
        return ret;
    }

    showAlarmArea(alarmData, useAlarmArea, visibleAssess) {
        // .TODO: selectedAlarm 알람이 아닌 발생중인 모든 알람(sensorAlarms) 대상으로 조회 필요

        let alarmEquipZoneID = null;

        if (alarmData?.zoneID && alarmData?.equipZoneID && this.zoneID === alarmData?.zoneID && useAlarmArea) {
            alarmEquipZoneID = alarmData.equipZoneID;
        }

        







        const areaCount = (this.areas?.children?.length > 0 ? this.areas.children.length : 0);

        // 생성된 영역 한정하여, 로딩된 Area 갯수 맞는지 체크
        if (this.isLoad === true && this.accessInfo.isLoad === true &&
            this.alarmAreaInfo.loadAreaCount === areaCount) {

            if (this.alarmAreaInfo.equipZoneID === alarmEquipZoneID && this.accessInfo.isComplete === true && this.accessInfo.visibleAssess === visibleAssess)
                return;

            // .TODO: 알람 및 등급 판단하여 변경 유무에 따라 교체
            this.accessInfo.isComplete = true;
            this.alarmAreaInfo.equipZoneID = alarmEquipZoneID;
            this.accessInfo.visibleAssess = visibleAssess;


            // 영역을 삭제하고 다시 생성하는 과정에 순서가 꼬임 발생 방지하기 위한 리스트
            let uuids = [];
           
            for (let i = 0; i < this.areas?.children?.length; i++) {
                let area = this.areas.children[i];
                uuids.push(area?.uuid);
            }



            for (let i = 0; i < uuids.length; i++) {
                const uuid = uuids[i];

                let area = this.areas.children?.find(x => x.uuid === uuid);
                if (!area)
                    continue;

                const [sensorType, zoneID, equipZoneID] = SDMS.getSensorInfo(area);


                

                const data = this.accessInfo.scores?.find(x => x.equipmentZoneID === equipZoneID);
                const score = data?.score;

                let areaType = null;

                if (!score || visibleAssess !== true) {
                    areaType = EquipZoneAreaManager.AreaType.Normal;
                } else if (score === SDMSResource.AssessmentClass.E) {
                    areaType = EquipZoneAreaManager.AreaType.ClassE;
                } else if (score === SDMSResource.AssessmentClass.D) {
                    areaType = EquipZoneAreaManager.AreaType.ClassD;
                } else if (score === SDMSResource.AssessmentClass.C) {
                    areaType = EquipZoneAreaManager.AreaType.ClassC;
                } else if (score === SDMSResource.AssessmentClass.B) {
                    areaType = EquipZoneAreaManager.AreaType.ClassB;
                } else if (score === SDMSResource.AssessmentClass.A) {
                    areaType = EquipZoneAreaManager.AreaType.ClassA;
                } else {
                    areaType = EquipZoneAreaManager.AreaType.Normal;
                }






                // 알람 구역에 해당한다면 
                if (equipZoneID === alarmEquipZoneID && area.userData.areaType !== EquipZoneAreaManager.AreaType.Alarm) {
                    // 알람 영역으로 교체
                    this.changeArea(EquipZoneAreaManager.AreaType.Alarm, area);
                }
                else if ((equipZoneID !== alarmEquipZoneID && area.userData.areaType === EquipZoneAreaManager.AreaType.Alarm) ||
                    area.userData.areaType !== areaType) {
                    // 평상시 영역으로 교체
                    this.changeArea(areaType, area);
                }




            }
        }
    }

    changeArea(areaType, area) {
        if (!area)
            return;

        const [sensorType, zoneID, equipZoneID] = SDMS.getSensorInfo(area);

        const areaData = {};
        areaData.lines = area.userData.lines;
        areaData.equipZoneName = area.userData.equipZoneName;
        areaData.zoneID = zoneID;
        areaData.equipZoneID = equipZoneID;

        // 기존 공간 삭제
        this.areas.remove(area);
        // 알람 관련 색상으로 다시 영역 생성
        this.makeArea(areaData, areaType);
    }

    setVisibleArea(visibleArea, visibleAssess) {
        if (visibleArea === this.isVisible)
            return;

        this.isVisible = visibleArea;

        // 현재 this.areas visible 처리
        for (let i = 0; i < this.areas?.children?.length; i++) {
            let area = this.areas.children[i];



            // .TODO: 알람 및 평가영역을 제외한 영역만 적용



            // 알람 하이라이트 영역이 아닌 것만 적용  
            if (area.visible !== visibleArea && area.userData.areaType === EquipZoneAreaManager.AreaType.Normal)
                area.visible = visibleArea;
        }
    }
}
