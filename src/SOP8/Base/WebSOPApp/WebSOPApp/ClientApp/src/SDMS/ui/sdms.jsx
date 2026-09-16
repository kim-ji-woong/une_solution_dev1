import React, { useEffect, useState, useRef } from 'react';
import $ from 'jquery';
import { withRouter } from 'react-router-dom';
import SDMSResource from '../resource/id';
import ProjectResource from '../../Root/resource/id';

import NavigationBar from './popups/navigationBar';

import { SDMSController } from '../services/sdmsController';
import Contents3D from './3D/contents3D';

import Loader from '../../Common/ui/loader';
import { SpatialManager } from '../services/spatialManager';
import { PoiManager } from './3D/poi/poiManager';
import { AccountController } from '../../Account/services/accountController';
import store from '../../Root/store';

function SDMS(props) {
    const menu = {
        none: null,
        statusInfo: SDMSResource.ID.menu.statusInfo,        // 센서현황
        weatherInfo: SDMSResource.ID.menu.weatherInfo,      // 기상센서 상세정보
        miniMap: SDMSResource.ID.menu.miniMap,              // 미니맵
        cctvInfo: SDMSResource.ID.menu.cctvInfo,            // CCTV 영상정보
        event: SDMSResource.ID.menu.event,                  // 이벤트 현황
        simulation: SDMSResource.ID.menu.simulation,        // 시뮬레이션
        statusPsmSensorInfo: SDMSResource.ID.menu.statusPsmSensorInfo,        // 대기센서 상세정보
    }

    const [showPopups, setShowPopups] = useState({});
    const [popupStateValue, setPopupStateValue] = useState({});
    const [visibleSensorTypes, setVisibleSensorTypes] = useState(PoiManager.getOriginVisibleSensorTypes());
    const [cctvList, setCctvList] = useState([]);
    const [cctvIds, setCctvIds] = useState('');
    const [showEventDashboard, setShowEventDashboard] = useState(true); // 이벤트 대시보드 팝업

    const [sensorAlarm, _setSensorAlarms] = useState({ alarms: [], selectedAlarm: null });
    //const [selectedAlarm, setSelectedAlarm] = useState(null);

    //const [site3dOptions, setSite3dOptions] = useState({});
    //const [currentSiteNo, setCurrentSiteNo] = useState(null);
    const [spatialManager, setSpatialManager] = useState(new SpatialManager());
    const [models, setModels] = useState({ siteBuildingGroupList: null, currentSiteNo: null, currentBuildingGroupNo: null, currentBuildingNo: null, currentZoneNo: null, backToOrigin: false, gltfOptions: {} });
    const [editMode, setEditMode] = useState({ editMode: false, parameter: null });
    /*const [sensorList, setSensorList] = useState({});
    const [sensorTypes, setSensorTypes] = useState({});
    const [sensorTypeInverse, setSensorTypeInverse] = useState({});
    const [facilityInfos, setFacilityInfos] = useState(null);*/
    //const [gltfOptions, setGltfOptions] = useState({});

    //const buildingGroupModels = {};
    //const buildingModels = {};
    //const zoneModels = {};
    //const siteOutdoorModels = {};
    //let currentSiteNo = null;
    //let gltfOptions = {};

    const _3dMasterRef = useRef(null);

    const set3dMaster = (__3dMaster) => {
        _3dMasterRef.current = __3dMaster;
    }

    useEffect(() => {
        SDMSController.StartWatchAlarmTimer();

        props.menuEvent.onClickLogo = onClickLogo;
        
        // 처음부터 뜰 메뉴
        let showPopupInfo = {};
        showPopupInfo[menu.statusInfo] = true;
        showPopupInfo[menu.weatherInfo] = true;
        showPopupInfo[menu.miniMap] = true;
        showPopupInfo[menu.cctvInfo] = true;
        showPopupInfo[menu.event] = true;
        showPopupInfo[menu.simulation] = true;
        showPopupInfo[menu.statusPsmSensorInfo] = true;
        setShowPopups(showPopupInfo);

        request3DOptions();

        // SDMS 컴포넌트 마운트 시, 저장된 위치 값 호출
        getPopupState();

        const unsubscribe = store.subscribe(() => {
            const data = store.getState();

            if (data.actionType === 'SENSOR_ALARM') {
                changeAlarm(data.sensorAlarm);
            }
        });

        return () => {
            unsubscribe();
        }
    }, []);

    const setSensorAlarms = (alarms, selectedAlarm) => {
        if (selectedAlarm) {
            selectedAlarm.movedAlarm = false;
        }

        _setSensorAlarms({ alarms, selectedAlarm });
    }

    const makeSensorAlarms = (alarms, selectedAlarm) => {
        if (selectedAlarm) {
            // 알람 선택에 의하여 해당 공간으로 이동한 상태인가?
            if (selectedAlarm.movedAlarm === undefined) {
                selectedAlarm.movedAlarm = false;
            }
        }

        return {
            alarms,
            selectedAlarm
        };
    }

    const changeAlarm = async (data) => {
        if (data) {
            // data.dtTime을 내림차순으로 정렬
            data.sort((a, b) => new Date(b.dtTime) - new Date(a.dtTime));

            const selectedAlarm = checkSelectedAlarm(data);
            _setSensorAlarms(makeSensorAlarms(data, selectedAlarm));
        }
    };

    const checkSelectedAlarm = (alarms) => {
        let selectedAlarm = null;

        if (alarms && alarms.length > 0) {
            const sensorZoneHistoryNo = selectedAlarm?.sensorZoneHistoryNo;
            let findAlarm = null;

            if (sensorZoneHistoryNo) {
                // 기존에 선택된 알람이 있고 새로운 알람 리스트에 선택된 알람이 있다면 유지
                findAlarm = alarms.find(x => x.sensorZoneHistoryNo === sensorZoneHistoryNo && x.isAlarm === true);
            }

            if (findAlarm) {
                selectedAlarm = findAlarm;
            }
            else {
                // 없다면 알람 리스트 중 첫번째 알람 선택
                for (const alarm of alarms) {
                    if (alarm.isAlarm) {
                        selectedAlarm = alarm;
                        break;
                    }
                }
            }
        }
        else {
            selectedAlarm = null;
        }

        return selectedAlarm;
    }

    const request3DOptions = async () => {
        const sensorList = await requestSensorList();

        if (sensorList) {
            const [buildingGroups, outdoorZones, message] = await SDMSController.requestBuildingGroupList();

            if (buildingGroups) {
                const siteBuildingGroupList = SpatialManager.setBuildingGroupList(buildingGroups, outdoorZones);

                const userInfo = ProjectResource.getUserInfo();
                const [siteModels, gltfOptions, message2] = await SDMSController.requestGltfModelList(userInfo.user_sn, [userInfo.site_sn]);

                if (siteModels) {
                    // siteModels와 siteBuildingGroupList 통합
                    const [firstSiteNo, _siteBuildingGroupList] = spatialManager.make3dModels(siteBuildingGroupList, siteModels, sensorList);
                    setModels({
                        siteBuildingGroupList: _siteBuildingGroupList,
                        currentSiteNo: firstSiteNo,
                        currentBuildingGroupNo: null,
                        currentBuildingNo: null,
                        currentZoneNo: null,
                        backToOrigin: false,
                        gltfOptions
                    });
                }
                else {
                    console.log(message2);
                }
            }
            else {
                console.log(message);
            }
        }
    }

    const requestSensorList = async () => {
        const [sensorTypes, totalCount, message] = await SDMSController.requestSensorList();

        if (!sensorTypes) {
            return null;
        }

        const sensorList = {};
        //const _sensorTypes = {};
        //const _sensorTypeInverse = {};

        for (const sensorType of sensorTypes) {
            sensorList[sensorType.sensorTypeName] = sensorType.sensors;
            //_sensorTypes[sensorType.sensorTypeCode] = sensorType.sensorTypeName;
            //_sensorTypeInverse[sensorType.sensorTypeName] = sensorType.sensorTypeCode;
        }

        //setSensorList(sensorList);
        //setSensorTypes(_sensorTypes);
        //setSensorTypeInverse(_sensorTypeInverse);

        return sensorList;
    }

    const onCompleteOutdoorModelLoading = (siteNo) => {
        if (models.siteBuildingGroupList) {
            const siteBuildingGroupList = { ...models.siteBuildingGroupList };
            const buildingGroupList = siteBuildingGroupList[siteNo];

            if (buildingGroupList?.buildingGroups) {
                for (const buildingGroup of buildingGroupList.buildingGroups) {
                    buildingGroup.completeLoading = true;
                }

                setModels(models);
            }
        }
    }

    const setVisiblePopups = (menu, visible) => {

        const menus = showPopups;
        const menus_old = Object.assign({}, showPopups);

        if (visible === undefined) {
            if (menu instanceof Array) {
                const menuCount = menu.length;

                for (let i = 0; i < menuCount; i++) {
                    const menuItem = menu[i];
                    menus[menuItem] = !menus[menuItem];
                }
            }
            else {
                menus[menu] = !menus[menu];
            }
        }
        else {
            if (menu instanceof Array) {
                const menuCount = menu.length;

                for (let i = 0; i < menuCount; i++) {
                    const menuItem = menu[i];
                    menus[menuItem] = visible;
                }
            }
            else {
                menus[menu] = visible;
            }
        }

        setShowPopups(menus);
        
        // 팝업 닫히는 애니메이션 효과
        hideAnimatePopup(menus, menus_old, () => {
            setShowPopups(menus);
        });
    }

    // 팝업 닫히는 애니메이션 효과
    const hideAnimatePopup = (menus, menus_old, callback) => {

        let hideIDs = "";

        if (menus !== null && menus !== undefined &&
            menus_old !== null && menus_old !== undefined) {
            let target = null;
            let cssLeft = null;
            let cssTop = null;

            for (let key in menus) {
                const visibleOld = menus_old[key];
                const visibleNew = menus[key];
                let hideID = null;

                if (visibleNew === false && (visibleOld === undefined || visibleOld !== visibleNew)) {
                    // 기존에 존재하지 않는 팝업 또는 상태 변화가 생긴 팝업
                    if (key === menu.event && sensorAlarm.alarms !== null && sensorAlarm.alarms?.length > 0) {
                        hideID = "#" + SDMSResource.popupLayer.event;
                        target = document.getElementById("dsBot_" + SDMSResource.popupLayer.event);
                    }
                    else if (key === menu.statusInfo) {
                        hideID = "#" + SDMSResource.popupLayer.statusInfo;
                        target = document.getElementById("dsBot_" + SDMSResource.popupLayer.statusInfo);
                    }
                }

                if (hideID !== null) {
                    if (hideIDs === "") {
                        hideIDs = hideID;
                    } else if (hideIDs !== "") {
                        hideIDs = hideIDs + ", " + hideID;
                    }

                    if (target !== null && target !== undefined) {
                        const clientRect = target.getBoundingClientRect();
                        cssLeft = clientRect.left;
                        cssTop = clientRect.top;
                    }

                    //break;
                }
            }

            if (hideIDs === "") {
                callback();
            } else if (hideIDs !== "") {
                // 창이 서서히 사라지는 효과
                if (cssLeft !== null && cssTop !== null) {
                    cssLeft = cssLeft + "px";
                    cssTop = cssTop + "px";

                    let hideValue = "80px";

                    $(hideIDs).animate({ opacity: 0, width: hideValue, height: hideValue, left: cssLeft, top: cssTop }, SDMSResource.PopupAniTime, () => {
                        $(hideIDs).css("opacity", "0");
                        callback();
                    });
                }
                else {
                    $(hideIDs).animate({ opacity: 0 }, SDMSResource.PopupAniTime, () => {
                        $(hideIDs).css("opacity", "0");
                        callback();
                    });
                }
            }
        }
        else {
            callback();
        }
    }

    // 드래그로 선택된 팝업과 나머지 팝업의 z-index를 조절한다. (선택된 팝업이 앞으로 나오도록)
    const setActiveDragPopup = (popupType) => {
        // CCTV 팝업창이 제대로 동작하지 않아 제이쿼리 방식으로 수정 - K.D.R
        for (const key in SDMSResource.popupLayer) {
            const layerName = SDMSResource.popupLayer[key];

            if (layerName === popupType) {
                $("#" + layerName).css({ "z-index": 2 });
            } else {
                $("#" + layerName).css({ "z-index": 0 });
            }

        }
    }

    const getPopupState = async () => {
        let userInfo = await ProjectResource.initUserInfo();
        if (userInfo === null || userInfo === undefined)
            return;

        const [options, message] = await AccountController.requestOptions(userInfo.user_sn, 'popup');

        if (!options) {
            showConfirmDialog(ProjectResource.dialogTypes.ERROR, [message], null, null);
            return;
        }
        
        if (options.length > 0) {
            let popupState = {}
            for (const option of options) {
                popupState[option.subCategory] = {
                    x: option.values[0],
                    y: option.values[1],
                    height: option.values[2],
                    width: option.values[3]
                };
            }

            setPopupStateValue(popupState);
        }
    }

    // 팝업 크기, 위치값 저장
    const setPopupState = async (popup, state) => {
        var popupState = popupStateValue;
        popupState[popup] = state;

        let userInfo = ProjectResource.getUserInfo();
        if (!userInfo)
            return;

        const options = [{ 
            category: 'popup', 
            subCategory: popup, 
            values: [state.x, state.y, state.height, state.width] 
        }];

        //DB 전달
        const [result, message] = await AccountController.requestSaveOptions(
            userInfo.user_sn,
            options
        );

        if (!result) {
            showConfirmDialog(ProjectResource.dialogTypes.ERROR, [message], null, null);
        }
        else {
            setPopupStateValue(popupState);
        }
    }

    const setVisiblePoi = (typeName, visible) => {
        let types = { ...visibleSensorTypes };

        types[typeName] = visible;
        
        setVisibleSensorTypes(types);
    }

    const handlePopups = (type, value) => {
        if(type === 'eventDashboard') {
            setShowEventDashboard(value);
        }
    }

    const onClickLogo = () => {
        for (const siteNo in spatialManager.sites) {
            moveToSite(siteNo, true);
            return;
        }
    }

    const moveToSite = (siteNo, backToOrigin = false) => {
        const site = spatialManager.getSite(siteNo);

        if (site) {
            const siteBuildingGroupList = models.siteBuildingGroupList ? models.siteBuildingGroupList : spatialManager.sites;

            setModels({
                siteBuildingGroupList: siteBuildingGroupList,
                currentSiteNo: siteNo,
                currentBuildingGroupNo: null,
                currentBuildingNo: null,
                currentZoneNo: null,
                backToOrigin: backToOrigin, 
                gltfOptions: models.gltfOptions
            });
        }
    }

    const moveToBuildingGroup = (buildingGroupNo) => {
        const buildingGroup = spatialManager.getBuildingGroup(buildingGroupNo);

        if (buildingGroup) {
            setModels({
                siteBuildingGroupList: models.siteBuildingGroupList,
                currentSiteNo: buildingGroup.siteNo,
                currentBuildingGroupNo: buildingGroup.buildingGroupNo,
                currentBuildingNo: null,
                currentZoneNo: null,
                backToOrigin: false,
                gltfOptions: models.gltfOptions
            });
        }
    }

    const moveToBuilding = (buildingNo) => {
        const building = spatialManager.getBuilding(buildingNo);

        if (building) {
            setModels({
                siteBuildingGroupList: models.siteBuildingGroupList,
                currentSiteNo: building.siteNo,
                currentBuildingGroupNo: building.buildingGroupNo,
                currentBuildingNo: building.buildingNo,
                currentZoneNo: null,
                backToOrigin: false,
                gltfOptions: models.gltfOptions
            });
        }
    }

    const moveToZone = (zoneNo, backToOrigin = false, postMethod = null, params = null) => {
        const zone = spatialManager.getZone(zoneNo);

        if (zone) {
            setModels({
                siteBuildingGroupList: models.siteBuildingGroupList,
                currentSiteNo: zone.siteNo,
                currentBuildingGroupNo: zone.buildingGroupNo,
                currentBuildingNo: zone.buildingNo,
                currentZoneNo: zone.zoneNo,
                backToOrigin: backToOrigin,
                gltfOptions: models.gltfOptions,
                postMethod,
                params
            });
        }
    }

    const addModelNode = (modelNode, file) => {
        spatialManager.setModelNode(modelNode, file);
    }

    const changeEditMode = (isEditMode) => {
        setEditMode({
            editMode: isEditMode,
            parameter: editMode.parameter
        });
    }

    if (!models.siteBuildingGroupList) {
        return <></>
    }

    return (
        <div>
            <Contents3D
                siteBuildingGroupList={models.siteBuildingGroupList}
                currentModel={models}
                gltfOptions={models.gltfOptions}
                visibleSensorTypes={visibleSensorTypes}
                spatialManager={spatialManager}
                onCompleteOutdoorModelLoading={onCompleteOutdoorModelLoading}
                addModelNode={addModelNode}
                isEditMode={editMode.editMode}
                changeEditMode={changeEditMode}
                sensorAlarms={sensorAlarm.alarms}
                selectedAlarm={sensorAlarm.selectedAlarm}
                moveToZone={moveToZone}
                set3dMaster={set3dMaster}
            />
            {/* <Loader /> */}
            <NavigationBar 
                setVisiblePopups={setVisiblePopups}
                visiblePopups={showPopups}
            />
        </div>
    );
}

export default withRouter(SDMS);