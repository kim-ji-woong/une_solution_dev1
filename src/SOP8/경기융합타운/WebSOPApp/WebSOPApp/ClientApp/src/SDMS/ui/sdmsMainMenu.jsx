import React, { Component } from 'react';
import { SDMSController } from '../services/sdmsController';
import Contents3D from './3D/contents3D';
import SdmsResource from '../resource/id';

class SDMSMainMenu extends Component {
    static Menu_None = 0;
    static Menu_Save_BuildingGroup_Viewport = 1;
    static Menu_Save_Building_Viewport = 2;
    static Menu_Show_Menu_Area = 3;
    static Menu_Debugging = 4;
    static Menu_Move_BuildingName = 5;
    static Menu_Move_Sensor = 6;
    static Menu_Add_Sensors = 7;
    static Menu_Show_Alarm = 8;
    static Menu_Hide_Alarm = 9;
    static Menu_Add_Alarm = 10;
    static Menu_Remove_Alarm = 11;
    static Menu_MoveTo_BuildingGroup = 12;
    static Menu_MoveTo_Building = 13;
    static Menu_MoveTo_POI = 14;
    static Menu_MoveTo_Floor = 15;
    static Menu_Show_Outdoor = 16;
    static Menu_Show_Indoor = 17;
    static Menu_Move_POI = 18;
    static Menu_Move_EquipZoneName = 19;
    static Menu_Refresh = 20;
    static Menu_FakeWall = 21;
    static Menu_EditMode = 22;
    static Menu_ClearSelection = 23;
    static Menu_MoveTo_Facility = 24;
    static Menu_MoveTo_Site = 25;

    static Admin_Menu_Viewport = SdmsResource.adminMenu.뷰포트_설정;
    static Admin_Menu_MovePOI = SdmsResource.adminMenu.POI_이동;
    static Admin_Menu_FakeWall = SdmsResource.adminMenu.가벽;
    static Admin_Menu_FireSensor = SdmsResource.adminMenu.화재센서_이동;
    static Admin_Menu_PsmSensor = SdmsResource.adminMenu.누출센서_이동;
    static Admin_Menu_EtcSensor = SdmsResource.adminMenu.기타센서_이동;
    static Admin_Menu_CCTV = SdmsResource.adminMenu.CCTV_이동;

    static Fire_Sensor = "fire";                                // 화재
    static CCTV_Sensor = "cctv";                                // CCTV
    static EmergencyBell_Sensor = "emergencyBell";              // 비상벨
    static ParkingLot_Sensor = "parkingLot";                    // 주차장
    static ZoneName_Sensor = "zoneName";                        // 구역명

    
    static Test_Alarm_Level = 0;

    constructor(props) {
        super(props);

        const buildingGroups = this.getBuildingGroups();
        const currentBuildingGroupName = buildingGroups.length === 0 ? "" : buildingGroups[0];
        const buildings = this.getBuildings();
        const building = this.getCurrentBuilding(currentBuildingGroupName, buildings);
        const zones = building ? this.getZones(currentBuildingGroupName, building[0]) : [];
        const currentZone = zones.length > 0 ? zones[0] : null;
        const currentEquipZone = this.getCurrentEquipZone(currentZone);

        this.state = {
            buildingGroups: buildingGroups,
            buildings: buildings,
            zones: zones,
            currentBuildingGroupName: currentBuildingGroupName,
            currentBuildingName: building ? building[0] : "",
            currentZone: currentZone,
            currentEquipZone: currentEquipZone,
            currentAdminMenu: SDMSMainMenu.Admin_Menu_Viewport,
            currentSensor: this.getFirstSensor(currentZone, SDMSMainMenu.Admin_Menu_Viewport),
            posX: building ? building[1] : "",
            posY: building ? building[2] : "",
            posZ: building ? building[3] : "",
            equipZoneVisible: false
        }

        this.refPosX = React.createRef();
        this.refPosY = React.createRef();
        this.refPosZ = React.createRef();
        this.refBG = React.createRef();
        this.refBuilding = React.createRef();
        this.refZone = React.createRef();
        this.refBGBtn = React.createRef();
        this.refBuildingViewportBtn = React.createRef();
        this.refBuildingBtn = React.createRef();
        this.refBuildingNameBtn = React.createRef();
        this.refSensorBtn = React.createRef();
        this.refMovePOI = React.createRef();
        this.refSensorName = React.createRef();
        this.refCheckEquipZone = React.createRef();

        SDMSMainMenu.Test_Alarm_Level = Contents3D.ALARM_2;
    }

    componentDidMount() {
        this.setMenuVisible(this.state.currentAdminMenu);
    }

    static isCCTVType(sensorType) {
        if (sensorType === SDMSMainMenu.CCTV_Type ||
            sensorType === SDMSMainMenu.CCTV_PTZ_Type ||
            sensorType === SDMSMainMenu.CCTV_SafetyI_Type) {
            return true;
        }

        return false;
    }

    static isBuildingGroupText(text) {
        if (text.startsWith(SDMSMainMenu.BuildingGroupNameText)) {
            return true;
        }

        return false;
    }

    static isBuildingText(text) {
        if (text.startsWith(SDMSMainMenu.BuildingNameText)) {
            return true;
        }

        return false;
    }

    static isEquipZoneText(text) {
        if (text?.startsWith(SDMSMainMenu.EquipZoneNameText)) {
            return true;
        }

        return false;
    }

    static isEquipZoneArea(text) {
        if (text?.startsWith(SDMSMainMenu.EquipZoneArea)) {
            return true;
        }

        return false;
    }

    getCurrentEquipZone(currentZone) {
        const zoneID = parseInt(currentZone[0]);

        if (zoneID !== null && zoneID !== undefined) {
            const zone = this.props._3dOptions.zones[zoneID];

            if (zone && zone.equipZones) {
                for (const equipZoneID in zone.equipZones) {
                    const equipZone = zone.equipZones[equipZoneID];

                    if (equipZone) {
                        return equipZone;
                    }
                }
            }
        }

        return null;
    }

    onClickSelectionBox(event, type) {
        let target = null;

        if (event.target.tagName === "BUTTON") {
            target = event.target.parentNode;
        }
        else if (event.target.tagName === "DIV") {
            target = event.target;
        }

        if (target === null) {
            return;
        }

        if (target.classList.contains("isShow")) {
            target.classList.remove("isShow");
        }
        else {
            target.classList.add("isShow");
        }

        if (type === "bg") {
            this.toggleBuildingNZone();
        }
        else if (type === "building") {
            this.toggleZone();
        }
        else if (type === "menu") {
        }
        else if (type === "zone") {
        }
        else if (type === "sensor") {
        }
        else if (type === "equipZone") {
        }
    }

    onClickSensor(event, sensor) {
        let target = null;
        let element = event.target;

        for (let i = 0; i < 5; i++) {
            if (element === null) {
                return;
            }

            if (element.tagName === "DIV") {
                target = element;
                break;
            }

            element = element.parentNode;
        }

        if (target) {
            if (target.classList.contains("isShow")) {
                target.classList.remove("isShow");
            }
        }

        this.setState({ currentSensor: sensor, posX: sensor ? sensor.x.toString() : "", posZ: sensor ? sensor.z.toString() : "" });
    }

    onClickEquipZone(event, equipZone) {
        let target = null;
        let element = event.target;

        for (let i = 0; i < 5; i++) {
            if (element === null) {
                return;
            }

            if (element.tagName === "DIV") {
                target = element;
                break;
            }

            element = element.parentNode;
        }

        if (target) {
            if (target.classList.contains("isShow")) {
                target.classList.remove("isShow");
            }
        }

        this.setState({ currentEquipZone: equipZone, posX: equipZone ? equipZone[2].x.toString() : "", posY: equipZone ? equipZone[2].y.toString() : "", posZ: equipZone ? equipZone[2].z.toString() : "" });
    }

    onClickSelectionItem(event, item, type) {
        let target = null;
        let element = event.target;

        for (let i = 0; i < 5; i++) {
            if (element === null) {
                return;
            }

            if (element.tagName === "DIV") {
                target = element;
                break;
            }

            element = element.parentNode;
        }

        if (target) {
            if (target.classList.contains("isShow")) {
                target.classList.remove("isShow");
            }
        }

        if (type === "bg") {
            this.toggleBuildingNZone();

            const building = this.getCurrentBuilding(item, this.state.buildings);
            const zones = building ? this.getZones(item, building[0]) : [];
            const currentZone = zones.length > 0 ? zones[0] : null;
            const currentEquipZone = this.getCurrentEquipZone(currentZone);
            const currentSensor = this.getFirstSensor(currentZone, this.state.currentAdminMenu);

            if (currentSensor && this.isSensorTypeMenu() && currentZone) {
                const sensorType = this.getSensorType();
                //const sensors = this._getSensors(currentZone, sensorType);
                const sensors = [currentSensor];
                this.props.onSelectMenu(SDMSMainMenu.Menu_Add_Sensors, [sensorType, sensors, currentZone.id]);
            }

            this.setState({ currentBuildingGroupName: item, currentBuildingName: building ? building[0] : "", zones: zones, currentZone: currentZone, currentEquipZone: currentEquipZone, currentSensor: currentSensor, posX: this.getPos(0, building, currentZone, currentEquipZone, currentSensor), posY: this.getPos(1, building, currentZone, currentEquipZone, currentSensor), posZ: this.getPos(2, building, currentZone, currentEquipZone, currentSensor) });
        }
        else if (type === "building") {
            this.toggleZone();

            const building = this.getBuilding(this.state.currentBuildingGroupName, item, this.state.buildings);
            const zones = building ? this.getZones(this.state.currentBuildingGroupName, item) : [];
            const currentZone = zones.length > 0 ? zones[0] : null;
            const currentSensor = this.getFirstSensor(currentZone, this.state.currentAdminMenu);
            const currentEquipZone = this.getCurrentEquipZone(currentZone);

            if (currentSensor && this.isSensorTypeMenu() && currentZone) {
                const sensorType = this.getSensorType();
                //const sensors = this._getSensors(currentZone, sensorType);
                const sensors = [currentSensor];
                this.props.onSelectMenu(SDMSMainMenu.Menu_Add_Sensors, [sensorType, sensors, currentZone.id]);
            }

            this.setState({ currentBuildingName: item, zones: zones, currentZone: currentZone, currentEquipZone: currentEquipZone, currentSensor: currentSensor, posX: this.getPos(0, building, currentZone, currentEquipZone, currentSensor), posY: this.getPos(1, building, currentZone, currentEquipZone, currentSensor), posZ: this.getPos(2, building, currentZone, currentEquipZone, currentSensor) });
        }
        else if (type === "menu") {
            this.setMenuVisible(item);

            if (this._isSensorTypeMenu(item) && this.state.currentZone) {
                const sensorType = this._getSensorType(item);
                const sensors = this._getSensors(this.state.currentZone, sensorType);
                this.props.onSelectMenu(SDMSMainMenu.Menu_Add_Sensors, [sensorType, sensors, this.state.currentZone.id]);

                const currentSensor = this.getFirstSensor(this.state.currentZone, item);

                if (currentSensor) {
                    this.setState({ posX: this._getPos(0, null, this.state.currentZone, null, currentSensor, item), posZ: this._getPos(2, null, this.state.currentZone, null, currentSensor, item) });
                }
            }
            else if (item === SDMSMainMenu.Admin_Menu_MovePOI) {
                this.showElement(this.refBGBtn.current, false);
                this.showElement(this.refBuildingViewportBtn.current, false);
                this.showElement(this.refBuildingNameBtn.current, false);
                this.showElement(this.refBuildingBtn.current, false);
                this.showElement(this.refCheckEquipZone.current, false);
                this.showElement(this.refMovePOI.current, true);
                this.showElement(this.refSensorName.current, true);
                //this.showElement(this.refPosY.current, true);
                this.setSelectedPOIInfo();

                this.props.onSelectMenu(SDMSMainMenu.Menu_Move_POI, null);
                return;
            }
            else if (item === SDMSMainMenu.Admin_Menu_Viewport) {
                this.showElement(this.refMovePOI.current, false);
                this.showElement(this.refSensorName.current, false);
                //this.showElement(this.refPosY.current, false);
                this.props.onSelectMenu(SDMSMainMenu.Menu_Save_BuildingGroup_Viewport, null);
                return;
            }
            else if (item === SDMSMainMenu.Admin_Menu_FakeWall) {
                this.props.onSelectMenu(SDMSMainMenu.Menu_FakeWall, null);
                return;
            }

            this.props.onSelectMenu(SDMSMainMenu.Menu_None, null);
        }
        else if (type === "zone") {
            const building = this.getBuilding(this.state.currentBuildingGroupName, this.currentBuildingName, this.state.buildings);
            const zone = this.getZone(this.state.zones, item);
            const currentEquipZone = this.getCurrentEquipZone(zone);
            const currentSensor = this.getFirstSensor(zone, this.state.currentAdminMenu);

            if (currentSensor && this.isSensorTypeMenu() && zone) {
                const sensorType = this.getSensorType();
                //const sensors = this._getSensors(zone, sensorType);
                const sensors = [currentSensor];
                this.props.onSelectMenu(SDMSMainMenu.Menu_Add_Sensors, [sensorType, sensors, zone.id]);
            }

            this.setState({ currentZone: zone, currentEquipZone: currentEquipZone, currentSensor: currentSensor, posX: this.getPos(0, building, zone, currentEquipZone, currentSensor), posY: this.getPos(1, building, zone, currentEquipZone, currentSensor), posZ: this.getPos(2, building, zone, currentEquipZone, currentSensor) });
        }
    }

    setSelectedPOIInfo() {
        if (this.props.selectedPOI) {
            const poi = this.props.selectedPOI[0];
            const updateDB = this.props.selectedPOI[1];

            this.setState({ posX: poi.object.position.x, posY: poi.object.position.y, posZ: poi.object.position.z });
        }
        else {
            this.setState({ posX: '', posY: '', posZ: '' });
        }
    }

    showElement(element, visible) {
        if (visible === false) {
            if (element.classList.contains("hidden") === false) {
                element.classList.add("hidden");
            }
        }
        else {
            if (element.classList.contains("hidden")) {
                element.classList.remove("hidden");
            }
        }
    }

    isSensorTypeMenu() {
        return this._isSensorTypeMenu(this.state.currentAdminMenu);
    }

    _isSensorTypeMenu(menuName) {
        if (menuName === SDMSMainMenu.Admin_Menu_FireSensor ||
            menuName === SDMSMainMenu.Admin_Menu_PsmSensor ||
            menuName === SDMSMainMenu.Admin_Menu_EtcSensor ||
            menuName === SDMSMainMenu.Admin_Menu_CCTV) {
            return true;
        }

        return false;
    }

    // vNum : 0(x), 1(y), 2(z)
    getPos(vNum, building, zone, equipZone, sensor) {
        return this._getPos(vNum, building, zone, equipZone, sensor, this.state.currentAdminMenu);
    }

    _getPos(vNum, building, zone, equipZone, sensor, menuName) {
        if (menuName === SDMSMainMenu.Admin_Menu_Viewport) {
            if (this.state.equipZoneVisible) {
                if (vNum === 0) {
                    return equipZone ? equipZone[2].x : "";
                }
                else if (vNum === 1) {
                    return equipZone ? equipZone[2].y : "";
                }
                else {
                    return equipZone ? equipZone[2].z : "";
                }
            }
            else {
                if (vNum === 0) {
                    return building ? building[1] : "";
                }
                else if (vNum === 1) {
                    return building ? building[2] : "";
                }
                else {
                    return building ? building[3] : "";
                }
            }
        }
        else if (menuName === SDMSMainMenu.Admin_Menu_FireSensor ||
            menuName === SDMSMainMenu.Admin_Menu_PsmSensor ||
            menuName === SDMSMainMenu.Admin_Menu_EtcSensor ||
            menuName === SDMSMainMenu.Admin_Menu_CCTV) {
            if (sensor) {
                if (vNum === 0) {
                    return sensor.x;
                }
                else if (vNum === 1) {
                    return sensor.y;
                }
                else {
                    return sensor.z;
                }
            }
        }

        return "";
    }

    toggleBuildingNZone() {
        if (this.refBG.current.classList.contains("isShow")) {
            if (this.refBuilding.current.classList.contains("hidden") === false) {
                this.refBuilding.current.classList.add("hidden");
            }

            if (this.refZone.current.classList.contains("hidden") === false) {
                this.refZone.current.classList.add("hidden");
            }
        }
        else {
            if (this.refBuilding.current.classList.contains("hidden")) {
                this.refBuilding.current.classList.remove("hidden");
            }

            if (this.refZone.current.classList.contains("hidden")) {
                this.refZone.current.classList.remove("hidden");
            }
        }
    }

    toggleZone() {
        if (this.refBuilding.current.classList.contains("isShow")) {
            if (this.refZone.current.classList.contains("hidden") === false) {
                this.refZone.current.classList.add("hidden");
            }
        }
        else {
            if (this.refZone.current.classList.contains("hidden")) {
                this.refZone.current.classList.remove("hidden");
            }
        }
    }

    setMenuVisible(menuName) {
        const currentSensor = this.getFirstSensor(this.state.currentZone, menuName);

        if (menuName === SDMSMainMenu.Admin_Menu_Viewport) {
            //this.setVisible(this.refBG, false);
            //this.setVisible(this.refBuilding, false);
            this.setVisible(this.refBGBtn, true);
            this.setVisible(this.refBuildingViewportBtn, true);
            this.setVisible(this.refBuildingBtn, true);
            this.setVisible(this.refBuildingNameBtn, true);
            this.setVisible(this.refCheckEquipZone, true);
            this.setVisible(this.refZone, false);
            this.setVisible(this.refSensorBtn, false);
            //this.setVisible(this.refPosX, false);
            //this.setVisible(this.refPosZ, false);
        }
        else if (menuName === SDMSMainMenu.Admin_Menu_FireSensor ||
            menuName === SDMSMainMenu.Admin_Menu_PsmSensor ||
            menuName === SDMSMainMenu.Admin_Menu_EtcSensor ||
            menuName === SDMSMainMenu.Admin_Menu_CCTV) {
            //this.setVisible(this.refBG, true);
            //this.setVisible(this.refBuilding, true);
            this.setVisible(this.refBGBtn, false);
            this.setVisible(this.refBuildingViewportBtn, false);
            this.setVisible(this.refBuildingBtn, false);
            this.setVisible(this.refBuildingNameBtn, false);
            this.setVisible(this.refCheckEquipZone, false);
            this.setVisible(this.refZone, true);
            this.setVisible(this.refSensorBtn, true);
            //this.setVisible(this.refPosX.current, true);
            //this.setVisible(this.refPosZ.current, true);

            if (currentSensor && this.state.currentZone) {
                const sensors = [currentSensor];
                this.props.onSelectMenu(SDMSMainMenu.Menu_Add_Sensors, [SDMSMainMenu.Fire_Sensor, sensors, this.state.currentZone.id]);
            }
        }

        this.setState({ currentAdminMenu: menuName, currentSensor: currentSensor });
    }

    setVisible(refElement, visible) {
        if (visible) {
            if (refElement.current.classList.contains("hidden")) {
                refElement.current.classList.remove("hidden");
            }
        }
        else {
            if (refElement.current.classList.contains("hidden") === false) {
                refElement.current.classList.add("hidden");
            }
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const [posX, posY, posZ] = this.getCurrentPos();

        this.refPosX.current.value = posX;
        this.refPosY.current.value = posY;
        this.refPosZ.current.value = posZ;

        const selectedPOI = this.props.selectedPOI;

        if (selectedPOI && selectedPOI[1]) {
            this.savePOIPosition(selectedPOI);
        }
    }

    async savePOIPosition(selectedPOI) {
        selectedPOI[1] = false;

        const poi = selectedPOI[0];
        const [sensorType, zoneID, sensorID] = SDMSMainMenu.parseSensorInfo(poi);

        if (sensorType && sensorType.length > 0 && zoneID && sensorID) {
            const [result, message] = await SDMSController.requestUpdatePOIPosition(sensorType, zoneID, sensorID, poi.object.position.x, poi.object.position.y, poi.object.position.z);

            if (result === false) {
                alert(message);
            }
            else {
            }
        }
    }

    getBuildingGroups() {
        const buildingGroups = [];

        if (this.props._3dOptions && this.props._3dOptions.buildingGroups) {
            const buildingGroupCount = this.props._3dOptions.buildingGroups.length;

            for (let i = 0; i < buildingGroupCount; i++) {
                const buildingGroup = this.props._3dOptions.buildingGroups[i];
                buildingGroups.push(buildingGroup[0]);
            }
        }

        return buildingGroups;
    }

    getBuildings() {
        const buildings = {};

        if (this.props._3dOptions && this.props._3dOptions.buildings) {
            for (const buildingGroupName in this.props._3dOptions.buildings) {
                const buildingGroup = this.props._3dOptions.buildings[buildingGroupName];
                const buildingDatas = [];

                for (const buildingName in buildingGroup) {
                    const building = buildingGroup[buildingName];
                    buildingDatas.push([buildingName, building[3], building[4], building[5]]);
                }

                buildings[buildingGroupName] = buildingDatas;
            }
        }

        return buildings;
    }

    getBuilding(buildingGroupName, buildingName, buildings) {
        const buildingDatas = buildings[buildingGroupName];

        if (buildingDatas) {
            const buildingCount = buildingDatas.length;

            for (let i = 0; i < buildingCount; i++) {
                const building = buildingDatas[i];

                if (building[0] === buildingName) {
                    return building;
                }
            }
        }

        return null;
    }

    getCurrentBuilding(currentBuildingGroupName, buildings) {
        const buildingDatas = buildings[currentBuildingGroupName];

        if (buildingDatas && buildingDatas.length > 0) {
            return buildingDatas[0];
        }

        return null;
    }

    getZones(buildingGroupName, buildingName) {
        const buildings = this.props._3dOptions.buildings[buildingGroupName];

        for (const _buildingName in buildings) {
            if (_buildingName === buildingName) {
                const buildingData = buildings[buildingName];
                const zones = buildingData[6];
                const zoneArray = [];

                for (const zoneID in zones) {
                    const zone = zones[zoneID];
                    zoneArray.push([zoneID, zone[0], zone[1], zone[2]]);
                }

                return zoneArray;
            }
        }

        return [];
        //this.props._3dOptions.buildings[buildingGroupName];
    }

    getZone(zones, zoneName) {
        const zoneCount = zones.length;

        for (let i = 0; i < zoneCount; i++) {
            const zone = zones[i];

            if (zone[3] === zoneName) {
                return zone;
            }
        }

        return null;
    }

    getBuildingGroupElements(buildingGroups) {
        const menus = [];

        for (let i = 0; i < buildingGroups.length; i++) {
            const buildingGroupName = buildingGroups[i];
            menus.push(<li key={"key_" + i} data-val={buildingGroupName}><button type="button" className="value" onClick={(e) => this.onClickSelectionItem(e, buildingGroupName, "bg")}>{buildingGroupName}</button></li>);
        }

        return (
            <div ref={this.refBG} className={"selectionBox"} onClick={(e) => this.onClickSelectionBox(e, "bg")}>
                <button type="button" className={"selectionTxt"}>{this.state.currentBuildingGroupName}</button>
                <ul>
                    {menus}
                </ul>
            </div>
        );
    }

    getBuildingElements() {
        const buildings = this.state.buildings[this.state.currentBuildingGroupName];

        if (buildings) {
            const menus = [];
            const buildingCount = buildings.length;

            for (let i = 0; i < buildingCount; i++) {
                const building = buildings[i];
                menus.push(<li key={"building_" + i} data-val={building[0]}><button type="button" className="value" onClick={(e) => this.onClickSelectionItem(e, building[0], "building")}>{building[0]}</button></li>);
            }

            return (
                <div ref={this.refBuilding} className={"selectionBox"} onClick={(e) => this.onClickSelectionBox(e, "building")}>
                    <button type="button" className={"selectionTxt"}>{this.state.currentBuildingName}</button>
                    <ul>
                        {menus}
                    </ul>
                </div>
            );
        }

        return <></>
    }

    getEquipZones() {
        if (this.props._3dOptions && this.state.currentZone) {
            const zone = this.props._3dOptions.zones[this.state.currentZone[0]];

            if (zone) {
                if (zone.equipZones) {
                    const menus = [];
                    let firstEquipZoneName = "";

                    for (const equipZoneID in zone.equipZones) {
                        const equipZone = zone.equipZones[equipZoneID];
                        // equipZone[0] : id
                        // equipZone[1] : equipZone displayText
                        // equipZone[2] : vertex(x, y, z)
                        if (equipZone[2]) {
                            menus.push(<li key={"equipZone_" + equipZoneID} data-val={equipZoneID}><button type="button" className="value" onClick={(e) => this.onClickEquipZone(e, equipZone)}>{equipZone[1]}</button></li>);
                        }

                        if (firstEquipZoneName.length === 0) {
                            firstEquipZoneName = equipZone[1];
                        }
                    }

                    const equipZoneName = this.state.currentEquipZone ? this.state.currentEquipZone[1] : firstEquipZoneName;

                    return (
                        <div className={"selectionBox"} onClick={(e) => this.onClickSelectionBox(e, "equipZone")}>
                            <button type="button" className={"selectionTxt"}>{equipZoneName}</button>
                            <ul>
                                {menus}
                            </ul>
                        </div>
                    );
                }
            }
        }

        return <></>
    }

    getEquipZoneElements() {
        if (this.state.equipZoneVisible) {
            return (
                <div>
                    {
                        this.getZoneElements()
                    }
                    {
                        this.getEquipZones()
                    }
                </div>
            );
        }

        return <></>
    }

    getSensorElements() {
        const className = this.state.currentAdminMenu !== SDMSMainMenu.Admin_Menu_Viewport ? "horzAreaSensor" : "horzAreaSensor" + " " + "hidden";

        return (
            <div className={className}>
                {
                    this.getZoneElements()
                }
                {
                    this.getSensors()
                }
            </div>
       );
    }

    getZoneElements() {
        const zones = this.state.zones;

        if (zones) {
            const menus = [];
            const zoneCount = zones.length;

            for (let i = 0; i < zoneCount; i++) {
                const zone = zones[i];
                menus.push(<li key={"zone_" + i} data-val={zone[0]}><button type="button" className="value" onClick={(e) => this.onClickSelectionItem(e, zone[3], "zone")}>{zone[3]}</button></li>);
            }

            const currentZoneName = this.state.currentZone ? this.state.currentZone[3] : "";

            return (
                <div ref={this.refZone} className={"selectionBox"} onClick={(e) => this.onClickSelectionBox(e, "zone")}>
                    <button type="button" className={'selectionTxt'}>{currentZoneName}</button>
                    <ul>
                        {menus}
                    </ul>
                </div>
            );
        }

        return <></>
    }

    getFirstSensor(zone, menuName) {
        if (menuName === SDMSMainMenu.Admin_Menu_FireSensor ||
            menuName === SDMSMainMenu.Admin_Menu_PsmSensor ||
            menuName === SDMSMainMenu.Admin_Menu_EtcSensor ||
            menuName === SDMSMainMenu.Admin_Menu_CCTV) {
            const sensors = this._getSensors(zone, this._getSensorType(menuName));

            if (sensors && sensors.length > 0) {
                return sensors[0];
            }
        }

        return null;
    }

    getSensors() {
        if (this.state.currentAdminMenu === SDMSMainMenu.Admin_Menu_FireSensor) {
            const sensors = this._getSensors(this.state.currentZone, SDMSMainMenu.Fire_Sensor);
            return this._getSensorElements(sensors)
        }
        else if(this.state.currentAdminMenu === SDMSMainMenu.Admin_Menu_PsmSensor) {
            const sensors = this._getSensors(this.state.currentZone, SDMSMainMenu.Psm_Sensor);
            return this._getSensorElements(sensors)
        }
        else if (this.state.currentAdminMenu === SDMSMainMenu.Admin_Menu_EtcSensor) {
            const sensors = this._getSensors(this.state.currentZone, SDMSMainMenu.Etc_Sensor);
            return this._getSensorElements(sensors)
        }
        else if (this.state.currentAdminMenu === SDMSMainMenu.Admin_Menu_CCTV) {
            const sensors = this._getSensors(this.state.currentZone, SDMSMainMenu.CCTV_Type);
            return this._getCCTVElements(sensors)
        }

        return <></>
    }

    _getSensors(zone, sensorType) {
        if (!zone) {
            return [];
        }

        const zoneID = parseInt(zone[0]);

        if (isNaN(zoneID)) {
            return [];
        }

        const _zone = this.props._3dOptions.zones[zoneID];

        if (!_zone) {
            return [];
        }

        return _zone.sensors[sensorType];
    }

    getSensor(zone, sensorID) {
        if (!zone) {
            return null;
        }

        if (this.state.currentAdminMenu === SDMSMainMenu.Admin_Menu_FireSensor) {
            return this._getSensor(zone.sensors.fire, sensorID);
        }
        else if (this.state.currentAdminMenu === SDMSMainMenu.Admin_Menu_PsmSensor) {
            return this._getSensor(zone.sensors.psm, sensorID);
        }
        else if (this.state.currentAdminMenu === SDMSMainMenu.Admin_Menu_EtcSensor) {
            return this._getSensor(zone.sensors.etc, sensorID);
        }
        else if (this.state.currentAdminMenu === SDMSMainMenu.Admin_Menu_CCTV) {
            return this._getSensor(zone.sensors.cctv, sensorID);
        }

        return null;
    }

    _getSensor(sensors, sensorID) {
        if (sensors) {
            const sensorCount = sensors.length;

            for (let i = 0; i < sensorCount; i++) {
                const sensor = sensors[i];

                if (sensor.id === sensorID) {
                    return sensor;
                }
            }
        }

        return null;
    }

    _getSensorElements(sensors) {
        if (!sensors) {
            return <></>
        }

        const menus = [];
        const sensorCount = sensors.length;

        for (let i = 0; i < sensorCount; i++) {
            const sensor = sensors[i];
            menus.push(<li key={"sensor_" + i} data-val={sensor.id}><button type="button" className="value" onClick={(e) => this.onClickSensor(e, sensor)}>{sensor.name}</button></li>);
        }

        const sensorName = this.state.currentSensor ? this.state.currentSensor.name : "";

        return (
            <div className={'selectionBox'} onClick={(e) => this.onClickSelectionBox(e, "sensor")}>
                <button type="button" className={'selectionTxt'}>{sensorName}</button>
                <ul>
                    {menus}
                </ul>
            </div>
        );
    }

    _getCCTVElements(cctvs) {
        if (!cctvs) {
            return <></>
        }

        const menus = [];
        const sensorCount = cctvs.length;

        for (let i = 0; i < sensorCount; i++) {
            const cctv = cctvs[i];
            menus.push(<li key={"cctv_" + i} data-val={cctv.id}><button type="button" className="value" onClick={(e) => this.onClickSensor(e, cctv)}>{cctv.cameraName}</button></li>);
        }

        const sensorName = this.state.currentSensor ? this.state.currentSensor.cameraName : "";

        return (
            <div className={'selectionBox'} onClick={(e) => this.onClickSelectionBox(e, "sensor")}>
                <button type="button" className={'selectionTxt'}>{sensorName}</button>
                <ul>
                    {menus}
                </ul>
            </div>
        );
    }

    getMenuTypes() {
        const menus = [];
        menus.push(<li key={"admin_menu_0"} data-val={SDMSMainMenu.Admin_Menu_Viewport}><button type="button" className="value" onClick={(e) => this.onClickSelectionItem(e, SDMSMainMenu.Admin_Menu_Viewport, "menu")}>{SDMSMainMenu.Admin_Menu_Viewport}</button></li>);
        /*menus.push(<li key={"admin_menu_1"} data-val={SDMSMainMenu.Admin_Menu_FireSensor}><button type="button" className="value" onClick={(e) => this.onClickSelectionItem(e, SDMSMainMenu.Admin_Menu_FireSensor, "menu")}>{SDMSMainMenu.Admin_Menu_FireSensor}</button></li>);
        menus.push(<li key={"admin_menu_2"} data-val={SDMSMainMenu.Admin_Menu_PsmSensor}><button type="button" className="value" onClick={(e) => this.onClickSelectionItem(e, SDMSMainMenu.Admin_Menu_PsmSensor, "menu")}>{SDMSMainMenu.Admin_Menu_PsmSensor}</button></li>);
        menus.push(<li key={"admin_menu_3"} data-val={SDMSMainMenu.Admin_Menu_EtcSensor}><button type="button" className="value" onClick={(e) => this.onClickSelectionItem(e, SDMSMainMenu.Admin_Menu_EtcSensor, "menu")}>{SDMSMainMenu.Admin_Menu_EtcSensor}</button></li>);
        menus.push(<li key={"admin_menu_4"} data-val={SDMSMainMenu.Admin_Menu_CCTV}><button type="button" className="value" onClick={(e) => this.onClickSelectionItem(e, SDMSMainMenu.Admin_Menu_CCTV, "menu")}>{SDMSMainMenu.Admin_Menu_CCTV}</button></li>);*/
        menus.push(<li key={"admin_menu_2"} data-val={SDMSMainMenu.Admin_Menu_MovePOI}><button type="button" className="value" onClick={(e) => this.onClickSelectionItem(e, SDMSMainMenu.Admin_Menu_MovePOI, "menu")}>{SDMSMainMenu.Admin_Menu_MovePOI}</button></li>);
        menus.push(<li key={"admin_menu_3"} data-val={SDMSMainMenu.Admin_Menu_FakeWall}><button type="button" className="value" onClick={(e) => this.onClickSelectionItem(e, SDMSMainMenu.Admin_Menu_FakeWall, "menu")}>{SDMSMainMenu.Admin_Menu_FakeWall}</button></li>);

        return (
            <div className={'selectionBox'} onClick={(e) => this.onClickSelectionBox(e, "menu")}>
                <button type="button" className={'selectionTxt'}>{this.state.currentAdminMenu}</button>
                <ul>
                    {menus}
                </ul>
            </div>
        );
    }

    saveViewport(menu, param) {
        this.props.onSelectMenu(menu, param);
    }

    moveBuildingName() {
        const strX = this.refPosX.current.value.trim();
        const strY = this.refPosY.current.value.trim();
        const strZ = this.refPosZ.current.value.trim();
        const x = parseFloat(strX);
        const y = parseFloat(strY);
        const z = parseFloat(strZ);

        if (x !== null && x !== undefined && y !== null && y !== undefined && z !== null && z !== undefined) {
            if (this.state.equipZoneVisible) {
                const zone = this.state.currentZone;
                const equipZone = this.state.currentEquipZone;

                if (equipZone && zone) {
                    const zoneID = parseInt(zone[0]);

                    if (zoneID !== undefined && zoneID !== null) {
                        this.props.onSelectMenu(SDMSMainMenu.Menu_Move_EquipZoneName, [zoneID, equipZone[0], equipZone[1], x, y, z]);
                    }
                }
            }
            else {
                const building = this.getBuilding(this.state.currentBuildingGroupName, this.state.currentBuildingName, this.state.buildings);

                if (building) {
                    building[1] = x;
                    building[2] = y;
                    building[3] = z;
                    this.props.onSelectMenu(SDMSMainMenu.Menu_Move_BuildingName, [this.state.currentBuildingGroupName, this.state.currentBuildingName, x, y, z]);
                    this.setState({ posX: strX, posY: strY, posZ: strZ });
                }
            }
        }
        else {
            alert('숫자만 입력 가능합니다');
        }
    }

    moveBuilding(buildingName) {
        this.props.onSelectMenu(SDMSMainMenu.Menu_MoveTo_Building, buildingName);
    }

    moveSensor() {
        const strX = this.refPosX.current.value.trim();
        const strZ = this.refPosZ.current.value.trim();
        const x = parseFloat(strX);
        const z = parseFloat(strZ);
        const sensor = this.state.currentSensor;

        if (isNaN(x) === false && isNaN(z) === false && sensor) {
            sensor.x = x;
            sensor.z = z;
            const sensorType = this.getSensorType();

            // sensor.zoneID
            this.props.onSelectMenu(SDMSMainMenu.Menu_Move_Sensor, [sensorType, sensor.id, sensor.zoneID, x, sensor.y, z]);
            this.setState({ posX: strX, posZ: strZ });
        }
        else {
            if (!sensor) {
                alert('센서가 선택되지 않았습니다');
            }
            else {
                alert('숫자만 입력 가능합니다');
            }
        }
    }

    movePOI() {
        //const sensor = this.props.selectedPOI;

        const strX = this.refPosX.current.value.trim();
        const strY = this.refPosY.current.value.trim();
        const strZ = this.refPosZ.current.value.trim();
        const x = parseFloat(strX);
        const y = parseFloat(strY);
        const z = parseFloat(strZ);

        if (isNaN(x) === false && isNaN(y) === false && isNaN(z) === false && this.props.selectedPOI) {
            const sensor = this.props.selectedPOI[0];

            sensor.object.position.set(x, y, z);
            const [sensorType, zoneID, sensorID] = SDMSMainMenu.parseSensorInfo(sensor);

            this.props.onSelectMenu(SDMSMainMenu.Menu_Move_Sensor, [sensorType, sensorID, zoneID, x, y, z]);
            this.setState({ posX: strX, posZ: strZ });
        }
        else {
            if (!this.props.selectedPOI) {
                alert('POI가 선택되지 않았습니다');
            }
            else {
                alert('숫자만 입력 가능합니다');
            }
        }
    }

    static parseSensorInfo(sensor) {
        const index1 = sensor.object.name.indexOf('_');

        if (index1 < 0) {
            return [null, null, null];
        }

        const index2 = sensor.object.name.indexOf('_', index1 + 1);

        if (index2 < index1) {
            return [null, null, null];
        }

        const sensorType = sensor.object.name.substring(0, index1).trim();
        const zoneID = parseInt(sensor.object.name.substring(index1 + 1, index2).trim());
        const sensorID = parseInt(sensor.object.name.substring(index2 + 1).trim());
        return [sensorType, zoneID, sensorID];
    }

    getSensorType() {
        return this._getSensorType(this.state.currentAdminMenu);
    }

    _getSensorType(menuName) {
        if (menuName === SDMSMainMenu.Admin_Menu_FireSensor) {
            return SDMSMainMenu.Fire_Sensor;
        }
        else if (menuName === SDMSMainMenu.Admin_Menu_PsmSensor) {
            return SDMSMainMenu.Psm_Sensor;
        }
        else if (menuName === SDMSMainMenu.Admin_Menu_EtcSensor) {
            return SDMSMainMenu.Etc_Sensor;
        }
        else if (menuName === SDMSMainMenu.Admin_Menu_CCTV) {
            return SDMSMainMenu.CCTV_Type;
        }

        return "";
    }

    onChangeText = (event) => {
    }

    getCurrentSensors() {
        if (this.state.currentAdminMenu === SDMSMainMenu.Admin_Menu_FireSensor ||
            this.state.currentAdminMenu === SDMSMainMenu.Admin_Menu_PsmSensor ||
            this.state.currentAdminMenu === SDMSMainMenu.Admin_Menu_EtcSensor ||
            this.state.currentAdminMenu === SDMSMainMenu.Admin_Menu_CCTV) {
            return this._getSensors(this.state.currentZone, this.getSensorType());
        }

        return [];
    }

    getPrevNextClassName(sensors) {
        const hiddenClass = "menuBtnSensor" + " " + "hidden";

        if (!sensors) {
            return [hiddenClass, hiddenClass, hiddenClass];
        }

        const sensorCount = sensors.length;

        if (sensorCount === 0 || !this.state.currentSensor) {
            return [hiddenClass, hiddenClass, hiddenClass];
        }

        const index = sensors.indexOf(this.state.currentSensor);
        const prevClass = index === 0 ? hiddenClass : "menuBtnSensor";
        const nextClass = index === sensorCount - 1 ? hiddenClass : "menuBtnSensor";
        let alarmClass = this.state.currentAdminMenu === SDMSMainMenu.Admin_Menu_CCTV ? hiddenClass : "menuBtnSensor";

        return [prevClass, nextClass, alarmClass];
    }

    showNextSensor(sensors, addIndex) {
        const index = sensors.indexOf(this.state.currentSensor);

        if (index < 0) {
            return;
        }

        const nextIndex = index + addIndex;

        if (nextIndex < 0 || nextIndex >= sensors.length) {
            return;
        }

        const sensor = sensors[nextIndex];
        this.setState({ currentSensor: sensor, posX: sensor.x, posZ: sensor.z });

        if (this.state.currentZone) {
            const _sensors = [sensor];
            this.props.onSelectMenu(SDMSMainMenu.Menu_Add_Sensors, [this.getSensorType(), _sensors, this.state.currentZone.id]);
        }
    }

    showAlarm() {
        if (!this.state.currentSensor) {
            return;
        }

        this.props.onSelectMenu(SDMSMainMenu.Menu_Show_Alarm, [this.state.currentSensor.zoneID, this.getSensorType(), this.state.currentSensor.id, SDMSMainMenu.Test_Alarm_Level++])

        if (SDMSMainMenu.Test_Alarm_Level > Contents3D.ALARM_4) {
            SDMSMainMenu.Test_Alarm_Level = Contents3D.ALARM_2;
        }
    }

    getCurrentPos() {
        if (this.state.currentAdminMenu === SDMSMainMenu.Admin_Menu_MovePOI) {
            if (this.props.selectedPOI) {
                const sensor = this.props.selectedPOI[0];
                return [sensor.object.position.x, sensor.object.position.y, sensor.object.position.z];
            }
            else {
                return ['', '', ''];
            }
        }
        else if (this.state.currentAdminMenu === SDMSMainMenu.Admin_Menu_Viewport) {
            if (this.state.equipZoneVisible) {
                const equipZone = this.state.currentEquipZone;

                if (equipZone) {
                    return [equipZone[2].x, equipZone[2].y, equipZone[2].z];
                }
                else {
                    return ['', '', ''];
                }
            }
        }

        return [this.state.posX, this.state.posY, this.state.posZ];
    }

    onChangeEquipZone = (event) => {
        this.setState({ equipZoneVisible: event.target.checked });
    }

    render() {
        if (this.state.buildingGroups.length === 0) {
            return <></>
        }

        const [posX, posY, posZ] = this.getCurrentPos();

        const className = this.props.showMenuArea ? "menuArea" + " " + "visible" : "menuArea";
        const sensorClassName = this.state.currentAdminMenu !== SDMSMainMenu.Admin_Menu_Viewport ? "horzAreaSensor" : "horzAreaSensor" + " " + "hidden";

        const currentSensors = this.getCurrentSensors();
        const [prevClassName, nextClassName, alarmClassName] = this.getPrevNextClassName(currentSensors);

        const selectedPOIName = this.props.selectedPOI ? this.props.selectedPOI[0].object.name : '선택된 POI 없음';
        const btnMoveBuildingNameText = this.state.equipZoneVisible ? '설비영역 이동' : '건물이름 이동';

        return (
            <div className={className}>
                <h2 className={'menuTitle'}>
                    관리자를 위한 기능
                </h2>

                <div className={'horzArea'}>
                    {
                        this.getBuildingGroupElements(this.state.buildingGroups)
                    }
                    {
                        this.getMenuTypes()
                    }
                </div>

                <div className={'horzArea'}>
                    <button ref={this.refBGBtn} className={'menuBtnViewport'} onClick={() => this.saveViewport(SDMSMainMenu.Menu_Save_BuildingGroup_Viewport, this.state.currentBuildingGroupName)}>뷰포트 저장</button>
                    <button ref={this.refBuildingViewportBtn} className={'menuBtnViewport'} onClick={() => this.saveViewport(SDMSMainMenu.Menu_Save_Building_Viewport, this.state.currentBuildingName)}>건물 뷰포트 저장</button>
                </div>

                {
                    this.getBuildingElements()
                }

                {
                    this.getEquipZoneElements()
                }

                {
                    this.getSensorElements()
                }

                <input ref={this.refPosX} className={'inputText'} type="text" placeholder="X" defaultValue={posX} onChange={this.onChangeText} />
                <input ref={this.refPosZ} className={'inputText'} type="text" placeholder="Y" defaultValue={posZ} onChange={this.onChangeText} />
                <input ref={this.refPosY} className={'inputText'} type="text" placeholder={'높이'} defaultValue={posY} onChange={this.onChangeText} />
                <div ref={this.refSensorName} className={'sensorName' + " " + 'hidden'}>{selectedPOIName}</div>
                <button ref={this.refMovePOI} className={'menuBtnSensor' + " " + 'hidden'} onClick={() => this.movePOI()}>적용</button>
                <div className={'horzArea'}>
                    <button ref={this.refBuildingNameBtn} className={'menuBtnBuildingName'} onClick={() => this.moveBuildingName()}>{btnMoveBuildingNameText}</button>
                    <button ref={this.refBuildingBtn} className={'menuBtnBuildingName'} onClick={() => this.moveBuilding(this.state.currentBuildingName)}>건물 이동</button>
                </div>
                <label ref={this.refCheckEquipZone} className={'clickable'}>
                    <input type="checkbox" className={'labelInput'} checked={this.state.equipZoneVisible} onChange={this.onChangeEquipZone} />
                    설비 영역 보기
					</label>
                <div className={sensorClassName}>
                    <button ref={this.refSensorBtn} className={'menuBtnSensor'} onClick={() => this.moveSensor()}>센서 이동</button>
                    <button className={prevClassName} onClick={() => this.showNextSensor(currentSensors, -1)}>이전 센서</button>
                    <button className={nextClassName} onClick={() => this.showNextSensor(currentSensors, 1)}>다음 센서</button>
                    <button className={alarmClassName} onClick={() => this.showAlarm()}>알람 발생</button>
                </div>
            </div>
        );
    }
}

export default SDMSMainMenu;