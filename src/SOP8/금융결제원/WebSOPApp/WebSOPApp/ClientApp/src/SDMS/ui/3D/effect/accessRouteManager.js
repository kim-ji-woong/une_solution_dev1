import * as THREE from 'three';
import { SDMSController } from '../../../services/sdmsController';
import Geometry from '../../../../Common/util/Geometry';
import { PoiManager } from '../poi/poiManager';
import SdmsResource from '../../../resource/id';

export class AccessRouteManager {
    static NormalPoint = "/resource/image/icon/route/orangeCircle.png";
    static ImportantPoint = "/resource/image/icon/route/redCircle.png";
    static ElevatorPoint = "/resource/image/icon/route/graySquare.png";

    static PipeColor = 0xFC6B19;
    static GlowColor = 0xFC6B19;

    constructor(scene, _3dMaster) {
        this.scene = scene;
        this._3dMaster = _3dMaster;
        this.elevators = null;

        this.baseLayer = null;
        this.zoneLayers = {};
        this.currentZoneNo = null;
        this.prevAccessRoutes = [];

        this.spriteMaterials = { /*[url: string]: THREE.SpriteMaterial*/ };

        this._initLayers();
        this._initMaterials();

        this.isEditMode = false;
        this.prevSelectedAccessRoute = null;
    }

    drawRoutes(accessRoutes, spatialManager, currentZoneNo) {
        let isSameZone = false;

        if (this.currentZoneNo === currentZoneNo) {
            isSameZone = true;

            if (this._isSameRoutes(accessRoutes)) {
                return;
            }
            else {
                this.deleteRoutes(false);
            }
        }

        if (this.elevators === null) {
            this._makeZoneLayers(spatialManager);
            return this._asyncDrawRoutes(accessRoutes, spatialManager, currentZoneNo, isSameZone);
        }

        return this._syncDrawRoutes(accessRoutes, spatialManager, currentZoneNo, isSameZone);
    }

    deleteRoutes(clearDoorPointList = true) {
        // 기존 데이터 삭제
        for (const zoneNo in this.zoneLayers) {
            const layer = this.zoneLayers[zoneNo];
            const childCount = layer.children.length;

            for (let i = childCount - 1; i >= 0; i--) {
                const child = layer.children[i];
                layer.remove(child);

                if (child.geometry) {
                    child.geometry.dispose();
                    //child.material.dispose();
                }
            }
        }

        this.currentZoneNo = null;
        this.prevAccessRoutes = [];

        if (this._3dMaster.poiManager) {
            if (clearDoorPointList) {
                this._3dMaster.poiManager.resetDoorPois();
                this._3dMaster.contents3D.setDoorPointList([]);
            }
        }
    }

    setEditMode(isEditMode) {
        if (this.isEditMode !== isEditMode) {
            this.isEditMode = isEditMode;
            this.baseLayer.visible = !isEditMode;

            if (this._3dMaster?.poiManager) {
                this._3dMaster.poiManager.showPoint(!isEditMode);
            }
        }
    }

    _isSameRoutes(accessRoutes) {
        const prevCount = this.prevAccessRoutes.length;
        const currentCount = accessRoutes.length;

        if (prevCount !== currentCount) {
            return false;
        }

        for (let i = 0; i < currentCount; i++) {
            const route1 = this.prevAccessRoutes[i];
            const route2 = accessRoutes[i];

            if (route1.sensorNo !== route2.sensorNo) {
                return false;
            }
        }

        if (!this.prevSelectedAccessRoute && !this._3dMaster.props.selectedAccessRoute) {
            return true;
        }
        else if (!this.prevSelectedAccessRoute || !this._3dMaster.props.selectedAccessRoute) {
            return false;
        }

        if (this.prevSelectedAccessRoute.sensorNo !== this._3dMaster.props.selectedAccessRoute.sensorNo) {
            return false;
        }

        return true;
    }

    _initLayers() {
        const baseLayer = new THREE.Object3D();
        baseLayer.matrixAutoUpdate = true;
        baseLayer.name = "route_base";

        this.baseLayer = baseLayer;
        this.scene.add(baseLayer);
    }

    _initMaterials() {
        this.capMaterial = new THREE.MeshStandardMaterial({
            color: AccessRouteManager.PipeColor,
            metalness: 0.2,
            roughness: 0.4,
        });

        this.tubeMaterial = new THREE.MeshStandardMaterial({
            color: AccessRouteManager.PipeColor,
            metalness: 0.2,
            roughness: 0.4,
        });

        this.glowCapMat = new THREE.MeshBasicMaterial({
            color: AccessRouteManager.GlowColor,
            transparent: true,
            opacity: 0.25,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            depthTest: false,
            side: THREE.FrontSide
        });

        this.glowMaterial = new THREE.MeshBasicMaterial({
            color: AccessRouteManager.GlowColor,
            transparent: true,
            opacity: 0.25,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });
    }

    _makeZoneLayers(spatialManager) {
        for (const zoneNo in spatialManager.zones) {
            const zoneLayer = new THREE.Object3D();
            zoneLayer.matrixAutoUpdate = true;
            zoneLayer.name = "zoneLayer_" + zoneNo;

            this.baseLayer.add(zoneLayer);
            this.zoneLayers[zoneNo] = zoneLayer;
        }
    }

    async _asyncDrawRoutes(accessRoutes, spatialManager, currentZoneNo, isSameZone) {
        const [elevators, message] = await SDMSController.requestElevators();

        if (elevators === null) {
            return;
        }

        const _elevators = {};

        for (const elevator of elevators) {
            _elevators[elevator.zone_sn] = elevator;
        }

        this.elevators = _elevators;
        this._syncDrawRoutes(accessRoutes, spatialManager, currentZoneNo, isSameZone);
    }

    addPointNo(pointNos, no) {
        if (pointNos.includes(no) === false) {
            pointNos.push(no);
        }
    }

    _syncDrawRoutes(accessRoutes, spatialManager, currentZoneNo, isSameZone) {
        const accessPoints = [];
        const accessPointMaps = {};
        const sensorPointNos = {};

        const routeCount = accessRoutes.length;
        let routeIndex = 1;
        let prevZoneNo = undefined;

        for (let i = 0; i < routeCount; i++/*const route of accessRoutes*/) {
            const route = accessRoutes[i];

            if (prevZoneNo !== undefined && route.zoneNo !== prevZoneNo) {
                routeIndex = this._addElevatorRoute(prevZoneNo, accessPoints, accessPointMaps, routeIndex);
                routeIndex = this._addElevatorRoute(route.zoneNo, accessPoints, accessPointMaps, routeIndex);
            }

            let pointNos = sensorPointNos[route.sensorNo];

            if (!pointNos) {
                pointNos = [];
                sensorPointNos[route.sensorNo] = pointNos;
            }

            let added = false;

            if (this._3dMaster.props.selectedAccessRoute) {
                if (this._3dMaster.props.selectedAccessRoute.key === route.key) {
                    // 선택된 데이터
                    this.addPointNo(pointNos, (i + 1) * 10000);
                    //pointNos.push((i + 1) * 10000);
                    added = true;

                    const sensor = this._3dMaster.props.spatialManager.getZoneSensor(route.zoneNo, route.sensorNo, SdmsResource.facilityType.DOOR);

                    if (sensor) {
                        const poi = this._3dMaster.poiManager.getSensorPOI(route.zoneNo, route.sensorNo, sensor.sensor_ty_code, sensor.subTypeNo);

                        if (poi) {
                            // scale 변경 문제가 있기 때문에 selectPoi(...)를 호출하면 안된다.
                            this._3dMaster.poiManager.selectPoi(null);
                            this._3dMaster.poiManager.selectedPoi = poi;
                            //this._3dMaster.poiManager.selectPoi(poi);
                        }
                    }
                }
            }

            if (added === false) {
                if (i < routeCount - 1) {
                    // 일반 데이터
                    this.addPointNo(pointNos, i + 1);
                    //pointNos.push(i + 1);
                }
                else {
                    // 마지막 데이터
                    this.addPointNo(pointNos, -(i + 1));
                    //pointNos.push(-(i + 1));
                }
            }

            /*if (this._3dMaster.props.selectedAccessRoute) {
                if (this._3dMaster.props.selectedAccessRoute.key === route.key) {
                    this.addPointNo(pointNos, (i + 1) * 10000);
                    //pointNos.push((i + 1) * 10000);
                }
            }*/

            prevZoneNo = route.zoneNo;
            const sensor = spatialManager.getSensor(route.sensorNo);

            if (sensor) {
                const accessPoint = this._makeAccessPoint(route, sensor);

                accessPoints.push(new THREE.Vector3(sensor.x, sensor.y, sensor.z));
                accessPointMaps[routeIndex] = accessPoint;
            }

            routeIndex++;
        }

        this._drawRoutes(accessPoints, accessPointMaps, currentZoneNo, sensorPointNos);
        this.currentZoneNo = currentZoneNo;
        this.prevAccessRoutes = accessRoutes;

        if (this._3dMaster.props.selectedAccessRoute) {
            this.prevSelectedAccessRoute = { ...this._3dMaster.props.selectedAccessRoute };
        }
        else {
            this.prevSelectedAccessRoute = null;
        }

        if (isSameZone) {
            const selectedPoi = this._3dMaster.poiManager.selectedPoi;
            this._3dMaster.poiManager.selectedPoi = null;
            this._3dMaster.poiManager.selectPoi(selectedPoi);
        }
    }

    _addElevatorRoute(zoneNo, accessPoints, accessPointMaps, routeIndex) {
        if (zoneNo !== null) {
            const elevator = this.elevators[zoneNo];

            if (elevator) {
                accessPoints.push(new THREE.Vector3(elevator.x, elevator.y, elevator.z));
                accessPointMaps[routeIndex++] = this._makeElevatorPoint(elevator, zoneNo);
            }
        }

        return routeIndex;
    }

    _getFloorCount(accessPointMaps) {
        const floors = {};

        for (const index in accessPointMaps) {
            const route = accessPointMaps[index];

            if (route.sensor) {
                floors[route.sensor.zone_sn] = route.sensor.zone_sn;
            }
        }

        let count = 0;

        for (const zoneNo in floors) {
            count++;
        }

        return count;
    }

    _drawRoutes(points, accessPointMaps, currentZoneNo, sensorPointNos) {
        const pointCount = points.length;
        const doorPointList = [];
        const floorCount = this._getFloorCount(accessPointMaps);
        const doorPointFloorCount = { floorCount: floorCount - 1, poi: null };

        if (pointCount < 2) {
            if (pointCount === 1) {
                // 지점이 하나만 있을 경우 지점 POI만 표시한다.
                this._addEndPoint(points[0], null, this.zoneLayers[accessPointMaps[1].zoneNo], accessPointMaps[1], null, null, sensorPointNos, doorPointList);
            }

            // 지점이 하나만 있으면 엘리베이터를 신경쓸 필요가 없다.
            this._3dMaster.contents3D.setDoorPointList(doorPointList, null, true);
            return;
        }

        // Key : SensorNo
        const endCaps = {};
        const endGlowCaps = {};
        const endPois = {};

        const radius = 0.05;
        //const color = 0xFC6B19;

        const capGeometry = new THREE.SphereGeometry(radius, 16, 16);
        /*const capMaterial = new THREE.MeshStandardMaterial({
            color,
            metalness: 0.2,
            roughness: 0.4,
        });*/

        const shrink = 0.3;

        // 같은 경로에 하나 이상의 Curve를 만드는 중복을 피하기 위한 Map
        const curveMaps = {};

        for (let i = 1; i < pointCount; i++) {
            const ptBegin = points[i - 1];
            const ptEnd = points[i];

            // POI의 반경만큼 짧게 만든다.
            const [beginX, beginY, beginZ] = Geometry.getLinearVertex3(ptBegin.x, ptBegin.y, ptBegin.z, ptEnd.x, ptEnd.y, ptEnd.z, shrink);
            const [endX, endY, endZ] = Geometry.getLinearVertex3(ptEnd.x, ptEnd.y, ptEnd.z, ptBegin.x, ptBegin.y, ptBegin.z, shrink);
            const vBegin = new THREE.Vector3(beginX, beginY, beginZ);
            const vEnd = new THREE.Vector3(endX, endY, endZ);

            const beginAccessPoint = accessPointMaps[i];
            const endAccessPoint = accessPointMaps[i + 1];

            if (beginAccessPoint.zoneNo !== endAccessPoint.zoneNo || beginAccessPoint.zoneNo !== currentZoneNo) {
                // Elevator간 경로는 만들지 않는다.
                continue;
            }

            const key = this._makeKey(beginAccessPoint, endAccessPoint);

            if (curveMaps[key]) {
                continue;
            }
            else {
                curveMaps[key] = true;
            }

            const layer = this.zoneLayers[beginAccessPoint.zoneNo];
            const curve = new THREE.LineCurve3(vBegin, vEnd);
            
            const tubeGeometry = new THREE.TubeGeometry(
                curve,      // 경로
                100,        // 세그먼트 수 (부드러움)
                radius,     // 반지름 (두께)
                16,         // 원형 세그먼트
                false       // 닫힘 여부
            );

            /*const tubeMaterial = new THREE.MeshStandardMaterial({
                color: color,
                //color: 0x00aaff,
                metalness: 0.2,
                roughness: 0.4,
            });*/

            const tubeMesh = new THREE.Mesh(tubeGeometry, this.tubeMaterial);
            layer.add(tubeMesh);

            this._addEndPoint(ptBegin, ptEnd, layer, beginAccessPoint, endAccessPoint, endPois, sensorPointNos, doorPointList, doorPointFloorCount);

            const beginSensorNo = beginAccessPoint.sensor?.sensor_sn;
            const endSensorNo = endAccessPoint.sensor?.sensor_sn;

            this._addEndCaps(vBegin, vEnd, capGeometry, this.capMaterial, layer, beginSensorNo, endSensorNo, endCaps);
            this._addGlow(curve, layer, beginSensorNo, endSensorNo, endGlowCaps);
        }

        this._3dMaster.contents3D.setDoorPointList(doorPointList, doorPointFloorCount, true);
    }

    _makeKey(beginAccessPoint, endAccessPoint) {
        const sensor1 = beginAccessPoint.sensor;
        const sensor2 = endAccessPoint.sensor;

        if (sensor1 === null) {
            if (sensor2 === null) {
                return "null_null";
            }
            else {
                return sensor2.sensor_sn.toString() + "_null";
            }
        }

        if (sensor2 === null) {
            return sensor1.sensor_sn.toString() + "_null";
        }

        return sensor1.sensor_sn.toString() + "_" + sensor2.sensor_sn.toString();
    }

    _addEndCaps(begin, end, capGeometry, capMaterial, layer, beginSensorNo, endSensorNo, endCaps) {
        if (!endCaps[beginSensorNo]) {
            const beginCap = new THREE.Mesh(capGeometry, capMaterial);
            beginCap.position.copy(begin);

            layer.add(beginCap);
            endCaps[beginSensorNo] = beginCap;
        }

        if (!endCaps[endSensorNo]) {
            const endCap = new THREE.Mesh(capGeometry, capMaterial);
            endCap.position.copy(end);

            layer.add(endCap);
            endCaps[endSensorNo] = endCap;
        }
    }

    _addGlowCaps(begin, end, radius, glowCapMat, layer, beginSensorNo, endSensorNo, endGlowCaps) {
        const createHemi = (pos, dir) => {
            const geo = new THREE.SphereGeometry(
                radius,
                16,
                16,
                0,
                Math.PI * 2,
                0,
                Math.PI / 2
            );

            const mesh = new THREE.Mesh(geo, glowCapMat);
            mesh.position.copy(pos);

            const up = new THREE.Vector3(0, 1, 0);
            const quat = new THREE.Quaternion().setFromUnitVectors(up, dir);
            mesh.quaternion.copy(quat);

            return mesh;
        };

        if (!endGlowCaps[beginSensorNo]) {
            const dir = new THREE.Vector3().subVectors(begin, end).normalize();
            const beginCap = createHemi(begin, dir);

            layer.add(beginCap);
            endGlowCaps[beginSensorNo] = beginCap;
        }

        if (!endGlowCaps[endSensorNo]) {
            const dir = new THREE.Vector3().subVectors(end, begin).normalize();
            const endCap = createHemi(end, dir);

            layer.add(endCap);
            endGlowCaps[endSensorNo] = endCap;
        }
    }

    _addGlow(curve, layer, beginSensorNo, endSensorNo, endGlowCaps) {
        const radius = 0.2;
        //const glowColor = 0xFC6B19;

        /*const glowCapMat = new THREE.MeshBasicMaterial({
            color: glowColor,
            transparent: true,
            opacity: 0.25,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            depthTest: false,
            side: THREE.FrontSide
        });*/

        const glowGeometry = new THREE.TubeGeometry(
            curve,
            100,
            radius,
            16,
            false
        );

        /*const glowMaterial = new THREE.MeshBasicMaterial({
            color: glowColor,
            //color: 0x00aaff,
            transparent: true,
            opacity: 0.25,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });*/

        const glowMesh = new THREE.Mesh(glowGeometry, this.glowMaterial);
        layer.add(glowMesh);

        this._addGlowCaps(curve.v1, curve.v2, radius, this.glowCapMat, layer, beginSensorNo, endSensorNo, endGlowCaps);
    }

    _makeAccessPoint(route, sensor) {
        return {
            name: route.doorName,
            isImportant: route.isImportant,
            zoneNo: route.zoneNo,
            sensor: sensor
        };
    }

    _makeElevatorPoint(elevator, zoneNo) {
        return {
            name: "elevator",
            isImportant: false,
            zoneNo: zoneNo,
            sensor: null
        };
    }

    _addEndPoint(ptBegin, ptEnd, layer, beginAccessPoint, endAccessPoint, endCaps, sensorPointNos, doorPointList, doorPointFloorCount) {
        const beginSensorNo = beginAccessPoint?.sensor?.sensor_sn;
        const endSensorNo = endAccessPoint?.sensor?.sensor_sn;

        if ((!endCaps && beginAccessPoint) || (endCaps && !endCaps[beginSensorNo])) {
            const sprite = this._addEndPointPoi(beginAccessPoint, ptBegin, layer, sensorPointNos, doorPointList, doorPointFloorCount);

            if (endCaps) {
                endCaps[beginSensorNo] = sprite;
            }
        }

        if ((!endCaps && endAccessPoint) || (endCaps && !endCaps[endSensorNo])) {
            const sprite = this._addEndPointPoi(endAccessPoint, ptEnd, layer, sensorPointNos, doorPointList, doorPointFloorCount);

            if (endCaps) {
                endCaps[endSensorNo] = sprite;
            }
        }
    }

    _addEndPointPoi(accessPoint, point, layer, sensorPointNos, doorPointList, doorPointFloorCount) {
        const poiManager = this._3dMaster.poiManager;
        const sensor = accessPoint.sensor;

        if (poiManager && sensor) {
            const poi = poiManager.getSensorPOI(sensor.zone_sn, sensor.sensor_sn, sensor.sensor_ty_code, sensor.subTypeNo);

            if (poi) {
                const doorPoint = {};
                const pointType = accessPoint.isImportant ? PoiManager.DoorPointType.important : PoiManager.DoorPointType.point;
                poiManager.changeDoorPoi(poi, poi.material.userData.isOpened, pointType);

                const numbers = this.makeNumbers(sensorPointNos, sensor.sensor_sn);

                doorPoint.poi = poi;
                doorPoint.numbers = numbers;
                doorPointList.push(doorPoint);
                //this._3dMaster.contents3D.setDoorPointList(numbers, true);
            }
        }
        else if (poiManager && sensor === null) {
            // 엘리베이터
            const imageUrl = this._getImageUrl(accessPoint);
            const poi = this._addPoi(imageUrl, point.x, point.y, point.z, layer);

            doorPointFloorCount.poi = poi;
        }

        //const imageUrl = this._getImageUrl(accessPoint);
        //return this._addPoi(imageUrl, point.x, point.y, point.z, layer);
    }

    makeNumbers(sensorPointNos, sensorNo) {
        const numbers = [];
        const pointNos = sensorPointNos[sensorNo];

        if (pointNos) {
            for (const pointNo of pointNos) {
                const [no, color] = this.getNumber(pointNo);
                const number = { no, color };
                numbers.push(number);
            }
        }

        return numbers;
    }

    getNumber(pointNo) {
        if (pointNo >= 10000) {
            return [pointNo / 10000, "blue"];
        }
        else if (pointNo < 0) {
            return [-pointNo, "orange"];
        }

        return [pointNo, null];
    }

    _getImageUrl(accessPoint) {
        if (accessPoint.sensor === null) {
            return AccessRouteManager.ElevatorPoint;
        }

        return accessPoint.isImportant ? AccessRouteManager.ImportantPoint : AccessRouteManager.NormalPoint;
    }

    _addPoi(imgUrl, x, y, z, layer) {
        let spriteMaterial = this.spriteMaterials[imgUrl];

        if (!spriteMaterial) {
            const spriteMap = new THREE.TextureLoader().load(imgUrl);
            spriteMaterial = new THREE.SpriteMaterial({ map: spriteMap, color: 0xffffff });
            spriteMaterial.name = this._getMaterialName(imgUrl);
            this.spriteMaterials[imgUrl] = spriteMaterial;
        }

        const scale = 1;
        const sprite = new THREE.Sprite(spriteMaterial);

        sprite.scale.x *= 1.4 * scale;
        sprite.scale.y *= 1.4 * scale;
        sprite.scale.z *= 1.4 * scale;

        sprite.position.x = x;
        sprite.position.y = y;
        sprite.position.z = z;

        layer.add(sprite);
        return sprite;
    }

    _getMaterialName(imgUrl) {
        if (imgUrl === AccessRouteManager.NormalPoint) {
            return "normal";
        }
        else if (imgUrl === AccessRouteManager.ImportantPoint) {
            return "important";
        }
        else if (imgUrl === AccessRouteManager.ElevatorPoint) {
            return "elevator";
        }

        return "";
    }
}
