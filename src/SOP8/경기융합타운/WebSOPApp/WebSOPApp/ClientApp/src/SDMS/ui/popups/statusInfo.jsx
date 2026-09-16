import React, { useRef, useState } from 'react';

import PopupDraggable from './popupDraggable';
import { StatusInfoComponent } from '../../styled/sdmsPopupsStyled';
import tooltip_icon from '../../images/tooltip_icon.svg';
import SDMSMainMenu from '../sdmsMainMenu';

import alarm_off from '../../images/alarm_off.svg';
import alarm_on from '../../images/alarm_on.svg';
import SdmsResource from '../../resource/id';
import StatusInfoBuildingGroup from './statusInfoBuildingGroup';
    
function StatusInfo(props) {
    const [searchText, setSearchText] = useState(''); 

    const refTree = useRef();

    const onChangeVisible = (sensorType) => {
        props.setVisiblePoi(sensorType, !props.visibleSensorTypes[sensorType]);
    }

    const searchEnterKey = () => {
        if (window.event && window.event.keyCode === 13) {    
            search();
        }
    }

    const search = () => {
        const text = document.getElementById('txtSearch').value;
        setSearchText(text);
    }

    const getBuildingGroupUI = () => {
        let ui = [];
        let buildingGroupList = props.buildingGroupList;
        if (buildingGroupList === undefined || buildingGroupList === null || buildingGroupList.length === 0)
            return ui;

        if (searchText.length > 0) {
            setVisibleBuildingGroupList(buildingGroupList);
        }

        for (var i = 0; i < buildingGroupList.length; i++) {
            const buildingGroup = buildingGroupList[i];
            if (buildingGroup.visible === false && searchText.length > 0)
                continue;

            // ui.push(<StatusInfoBuildingGroup
            //     id={'buildingGroup_' + buildingGroup.id}
            //     key={buildingGroup.id}
            //     buildingGroup={buildingGroup}
            //     zoneList={props.zoneList}
            //     buildingIDs={props.buildingIDs}
            //     indoorModels={props.indoorModels}
            //     sensorList={props.sensorList}
            //     moveToX={props.moveToX}
            //     onSelectSensor={props.onSelectSensor}
            //     selectedSensor={props.selectedSensor}
            //     selectedFacility={props.selectedFacility}
            //     getFacilityID={props.getFacilityID}
            //     sensorAlarms={props.sensorAlarms}
            //     searchText={searchText}
            //     facilityInfos={props.facilityInfos}
            //     isEditMode={false}
            //     multiSite={props.multiSite}
            //     selectedInfo={props.selectedInfo}
            //     onChangeBuildingGroup={props.onChangeBuildingGroup}
            //     useSensorTypes={props.useSensorTypes}
            //     site3dOptions={props.site3dOptions}
            // />);
        }

        if (props.outdoorZones) {
            // 외부영역도 검색 필터기능 추가 - K.D.R
            // if (setVisibleOutdoor(props.outdoorZones)) {
            //     ui.push(<StatusInfoBuildingGroup
            //         id={'buildingGroup_outdoor'}
            //         key={"bg_outdoor"}
            //         isOutdoor={true}
            //         buildingGroup={props.outdoorZones}
            //         zoneList={props.zoneList}
            //         buildingIDs={props.buildingIDs}
            //         indoorModels={props.indoorModels}
            //         sensorList={props.sensorList}
            //         moveToX={props.moveToX}
            //         onSelectSensor={props.onSelectSensor}
            //         selectedSensor={props.selectedSensor}
            //         selectedFacility={props.selectedFacility}
            //         getFacilityID={props.getFacilityID}
            //         sensorAlarms={props.sensorAlarms}
            //         searchText={searchText}
            //         facilityInfos={props.facilityInfos}
            //         isEditMode={false}
            //         multiSite={props.multiSite}
            //         selectedInfo={props.selectedInfo}
            //         onChangeBuildingGroup={onChangeBuildingGroup}
            //         useSensorTypes={props.useSensorTypes}
            //         site3dOptions={props.site3dOptions}
            //     />);
            // }
        }

        return ui;
    }

    let visibleFirePOI = props.visibleSensorTypes[SDMSMainMenu.Fire_Sensor] ? true : false; 
    let visibleCCTVPOI = props.visibleSensorTypes[SDMSMainMenu.CCTV_Sensor] ? true : false; 
    let visibleEmergencyBellPOI = props.visibleSensorTypes[SDMSMainMenu.EmergencyBell_Sensor] ? true : false; 
    let visibleParkingLotPOI = props.visibleSensorTypes[SDMSMainMenu.ParkingLot_Sensor] ? true : false; 
    let visibleZoneNamePOI = props.visibleSensorTypes[SDMSMainMenu.ZoneName_Sensor] ? true : false; 

    let visibleFireClassName = (visibleFirePOI) ? 'visibleFire' : 'disableFire';
    let visibleCCTVClassName = (visibleCCTVPOI) ? 'visibleCCTV' : 'disableCCTV';
    let visibleEmergencyBellClassName = (visibleEmergencyBellPOI) ? 'visibleEmergencyBell' : 'disableEmergencyBell';
    let visibleParkingLotClassName = (visibleParkingLotPOI) ? 'visibleParkingLot' : 'disableParkingLot';
    let visibleZoneNameClassName = (visibleZoneNamePOI) ? 'visibleZoneName' : 'disableZoneName';

    return (
        <StatusInfoComponent id={props.popupType} className='UI_Section statusInfo'>
            <PopupDraggable
                id={props.popupType}
                popupMinWidth={300}
                popupMinHeight={600}
                topSize={40}
                popupState={props.popupState}
                setActiveDragPopup={props.setActiveDragPopup}
                setPopupState={props.setPopupState}
            >
                <div className='dslTop'>
                    <h5 className='dslTitle'>
                        {SdmsResource.ID.menu.statusInfo}
                    </h5>
                    <button className='dslX'>닫기</button>
                </div>

                <div className={'content'}>
                    <div className="contentBox flex">
                        <ul>
                            <li><label className={visibleFireClassName} data-title="화재" ><input type="checkbox" checked={visibleFirePOI} onChange={() => onChangeVisible(SDMSMainMenu.Fire_Sensor)} /></label></li>
                            <li><label className={visibleCCTVClassName} data-title="CCTV" ><input type="checkbox" checked={visibleCCTVPOI} onChange={() => onChangeVisible(SDMSMainMenu.CCTV_Sensor)} /></label></li>
                            <li><label className={visibleEmergencyBellClassName} data-title="비상벨" ><input type="checkbox" checked={visibleEmergencyBellClassName} onChange={() => onChangeVisible(SDMSMainMenu.EmergencyBell_Sensor)} /></label></li>
                            <li><label className={visibleParkingLotClassName} data-title="주차장" ><input type="checkbox" checked={visibleParkingLotPOI} onChange={() => onChangeVisible(SDMSMainMenu.ParkingLot_Sensor)} /></label></li>
                            <li><label className={visibleZoneNameClassName} data-title="구역명" ><input type="checkbox" checked={visibleZoneNamePOI} onChange={() => onChangeVisible(SDMSMainMenu.ZoneName_Sensor)} /></label></li>
                        </ul>
                    </div>

                    <div className='contentBox sensor'>
                        <div className={'searchWrap'}>
                            <input type="text" id="txtSearch" onKeyUp={searchEnterKey} placeholder='검색어를 입력해주세요.'/>
                            <button onClick={search}>검색</button>
                        </div>

                        <div className={'treeWrap scrollbar'}>
                            <ul ref={refTree} className={'dsiTree'}>
                                {getBuildingGroupUI()}
                            </ul>
                        </div>
                    </div>
                </div>
            </PopupDraggable> 
        </StatusInfoComponent>
    );
}

export default StatusInfo;