import { ui } from 'jquery';
import React, { Component } from 'react';
import content from '../../../Common/css/content.module.css';
import StatusInfoZone from './statusInfoZone';
import SDMSMainMenu from '../sdmsMainMenu';
import SDMS from '../sdms';
import ProjectResource from '../../../Root/resource/id';

class StatusInfoBuilding extends Component {
    constructor(props) {
        super(props);

        this.refBuildingName = React.createRef();
        this.refZoneList = React.createRef();
        this.moveToX = this.moveToX.bind(this);
        this.prevSelectedSensor = [null, null, null];

        // 사용자가 마우스로 조작하였는가?
        // true : 접혔다.
        // false : 펼쳐졌다.
        this.manualExpand = null;
        this.showChildResult = false;
    }

    componentDidMount() {
        this.checkChildVisible();
    }

    componentDidUpdate(prevProps, prevState) {
        this.checkChildVisible();
    }

    checkChildVisible() {
        if (this.refBuildingName.current) {
            if (this.showChildResult) {
                if (this.refBuildingName.current.dataset.show_child !== 'true') {
                    this.refBuildingName.current.dataset.show_child = 'true';
                }

                if (this.refZoneList.current.classList.contains('on') === false) {
                    this.refZoneList.current.classList.add('on');
                }
            }
            else {
                if (this.refBuildingName.current.dataset.show_child !== 'false') {
                    this.refBuildingName.current.dataset.show_child = 'false';
                }

                if (this.refZoneList.current.classList.contains('on')) {
                    this.refZoneList.current.classList.remove('on');
                }
            }
        }
    }

    moveToX() {
        this.props.moveToX(SDMSMainMenu.Menu_MoveTo_Building, [this.props.building.buildingName]);
    }

    getZoneUI() {
        let ui = [];

        if (this.props.building.zoneDatas) {
            const zoneDatas = this.props.building.zoneDatas;
            if (zoneDatas === undefined || zoneDatas === null || zoneDatas.length === 0)
                return ui;

            this.setZoneUI(zoneDatas, ui);
            /*zoneDatas.sort(function (a, b) { return (a.floorIndex + a.addFloor) - (b.floorIndex + b.addFloor) });
            for (var i = 0; i < zoneDatas.length; i++) {
                const zone = zoneDatas[i];

                if (zone.visible === false && this.props.searchText.length > 0)
                    continue;

                let fireSensors = null, psmSensors = null, etcSensors = null, cctvs = null, facilityInfos = null;

                if (this.props.sensorList) {
                    fireSensors = this.props.sensorList['fireSensors'].filter(x => x.zoneID === zone.id && (x.visible === true || this.props.searchText === ''));
                    psmSensors = this.props.sensorList['psmSensors'];//.filter(x => x.zoneID === zone.id);
                    etcSensors = this.props.sensorList['etcSensors'].filter(x => x.zoneID === zone.id && (x.visible === true || this.props.searchText === ''));
                    cctvs = this.props.sensorList['cctvs'].filter(x => x.zoneID === zone.id && (x.visible === true || this.props.searchText === ''));

                    if (this.props.facilityInfos) {
                        facilityInfos = this.props.facilityInfos.filter(x => x.zoneID === zone.id && (x.visible === true || this.props.searchText === ''));
                    }
                }
                //ui.push(<StatusInfoZone key={'zone_' + zone.id} zone={zone} sensorList={this.props.sensorList} moveToX={this.props.moveToX} sensorAlarms={this.props.sensorAlarms} />);
                ui.push(<StatusInfoZone key={'zone_' + zone.id} zone={zone} sensorList={this.props.sensorList} fireSensors={fireSensors} psmSensors={psmSensors} etcSensors={etcSensors} cctvs={cctvs} facilityInfos={facilityInfos} moveToX={this.props.moveToX} onSelectSensor={this.props.onSelectSensor} selectedSensor={this.props.selectedSensor} sensorAlarms={this.props.sensorAlarms} showChild={this.props.showChild} searchText={this.props.searchText} isEditMode={this.props.isEditMode} />);
            }*/
        }
        else {
            const outdoorZones = this.props.building;
            const zoneDatas = [];

            for (const zoneID in outdoorZones) {
                const zoneData = outdoorZones[zoneID];
                zoneDatas.push(zoneData);
            }

            if (zoneDatas === undefined || zoneDatas === null || zoneDatas.length === 0)
                return ui;

            this.setZoneUI(zoneDatas, ui);
        }
        
        return ui;
    }

    setZoneUI(zoneDatas, ui) {
        const hasIndoorModel = this.hasFloorModel(this.props.building.id);
        for (var i = 0; i < zoneDatas.length; i++) {
            const zone = zoneDatas[i];

            if (zone.visible === false && this.props.searchText.length > 0 || zone.floorIndex === null)
                continue;

            let fireSensors = null, psmSensors = null, etcSensors = null, cctvs = null, facilityInfos = null, earthquakeSensors = null, strongWindSensors = null, environmentSensors = null, manufactureSensors = null, emergencyBellSensors = null;

            if (this.props.sensorList) {
                const _fireSensors = this.props.sensorList['fireSensors'];
                const _psmSensors = this.props.sensorList['psmSensors'];
                const _etcSensors = this.props.sensorList['etcSensors'];
                const _cctvs = this.props.sensorList['cctvs'];
                const _earthquakeSensors = this.props.sensorList['earthquakeSensors'];
                const _strongWindSensors = this.props.sensorList['strongWindSensors'];

                const _environmentSensors = this.props.sensorList['environmentSensors'];
                const _manufactureSensors = this.props.sensorList['manufactureSensors'];
                const _emergencyBellSensors = this.props.sensorList['emergencyBellSensors'];

                if (_fireSensors) {
                    fireSensors = _fireSensors.filter(x => x.zoneID === zone.id && (x.visible === true || this.props.searchText === ''));
                }
                if (_psmSensors) {
                    // 복합센서로 위치값이 있는 경우만 표시
                    if (ProjectResource.SiteNo === ProjectResource.Site.Soulbrain ||
                        ProjectResource.SiteNo === ProjectResource.Site.Wonik)
                        psmSensors = _psmSensors.filter(x => x.zoneID === zone.id && x.x !== null && x.y !== null && x.z !== null && (x.visible === true || this.props.searchText === ''));
                    else
                        psmSensors = _psmSensors.filter(x => x.zoneID === zone.id && (x.visible === true || this.props.searchText === ''));
                }
                if (_etcSensors) {
                    // 복합센서로 위치값이 있는 경우만 표시
                    if (ProjectResource.SiteNo === ProjectResource.Site.Soulbrain)
                        etcSensors = _etcSensors.filter(x => x.zoneID === zone.id && x.x !== null && x.y !== null && x.z !== null && (x.visible === true || this.props.searchText === ''));
                    else
                        etcSensors = _etcSensors.filter(x => x.zoneID === zone.id && (x.visible === true || this.props.searchText === ''));
                }
                if (_cctvs) {
                    cctvs = _cctvs.filter(x => x.zoneID === zone.id && (x.visible === true || this.props.searchText === ''));
                }
                if (_earthquakeSensors) {
                    earthquakeSensors = _earthquakeSensors.filter(x => x.zoneID === zone.id && (x.visible === true || this.props.searchText === ''));
                }
                if (_strongWindSensors) {
                    strongWindSensors = _strongWindSensors.filter(x => x.zoneID === zone.id && (x.visible === true || this.props.searchText === ''));
                }
                if (_environmentSensors) {
                    // 복합센서로 위치값이 있는 경우만 표시
                    if (ProjectResource.SiteNo === ProjectResource.Site.Wonik)
                        environmentSensors = _environmentSensors.filter(x => x.zoneID === zone.id && x.x !== null && x.y !== null && x.z !== null && (x.visible === true || this.props.searchText === ''));
                    else
                        environmentSensors = _environmentSensors.filter(x => x.zoneID === zone.id && (x.visible === true || this.props.searchText === ''));
                }
                if (_manufactureSensors) {
                    // 복합센서로 위치값이 있는 경우만 표시
                    if (ProjectResource.SiteNo === ProjectResource.Site.Wonik)
                        manufactureSensors = _manufactureSensors.filter(x => x.zoneID === zone.id && x.x !== null && x.y !== null && x.z !== null && (x.visible === true || this.props.searchText === ''));
                    else
                        manufactureSensors = _manufactureSensors.filter(x => x.zoneID === zone.id && (x.visible === true || this.props.searchText === ''));
                }
                if (_emergencyBellSensors) {                    
                    emergencyBellSensors = _emergencyBellSensors.filter(x => x.zoneID === zone.id && (x.visible === true || this.props.searchText === ''));
                }
                
                if (this.props.facilityInfos) {
                    facilityInfos = this.props.facilityInfos.filter(x => x.zoneID === zone.id && (x.visible === true || this.props.searchText === ''));
                }
            }

            ui.push(
                <StatusInfoZone
                    key={'zone_' + zone.id}
                    id={'zone_' + zone.id}
                    zone={zone}
                    sensorList={this.props.sensorList}
                    fireSensors={fireSensors}
                    psmSensors={psmSensors}
                    etcSensors={etcSensors}
                    cctvs={cctvs}
                    earthquakeSensors={earthquakeSensors}
                    strongWindSensors={strongWindSensors}
                    environmentSensors={environmentSensors}
                    manufactureSensors={manufactureSensors}
                    emergencyBellSensors={emergencyBellSensors}
                    facilityInfos={facilityInfos}
                    moveToX={this.props.moveToX}
                    onSelectSensor={this.props.onSelectSensor}
                    selectedSensor={this.props.selectedSensor}
                    selectedInfo={this.props.selectedInfo}
                    selectedFacility={this.props.selectedFacility}
                    sensorAlarms={this.props.sensorAlarms}
                    showChild={this.props.showChild}
                    searchText={this.props.searchText}
                    isEditMode={this.props.isEditMode}
                    hasIndoorModel={hasIndoorModel}
                    onChangeBuildingGroup={this.props.onChangeBuildingGroup}
                    useSensorTypes={this.props.useSensorTypes}
                />
            );
        }
    }

    hasFloorModel = (buildingID, floorIndex) => {
        if (!buildingID) {
            return false;
        }

        const _3dOptions = this.getMutiSite3dOptions(this.props.site3dOptions, buildingID.toString());
        
        let building = this.props.buildingIDs[buildingID.toString()];
        // 멀티사이트 관련
        if (!building && this.props.multiSite) {
            building = _3dOptions?.buildingIDs[buildingID.toString()];
        }

        if (building) {
            //const buildingGroupName = building[1];
            const buildingName = building[2];
            const buildingGroupID = this.props.building?.buildingGroupID;
            
            let indoorModels = this.props.indoorModels;
            // 멀티사이트 관련
            if (this.props.multiSite) {
                indoorModels = _3dOptions?.indoorModels;
            }

            for (let modelName in indoorModels) {
                const buildingGroup = indoorModels[modelName];

                if (buildingGroup.buildingGroupID !== buildingGroupID) {
                    continue;
                }

                //const buildingGroup = this.getBuildingGroupModel(buildingGroupID, this.props.indoorModels);
                
                if (buildingGroup) {
                    let buildingData = buildingGroup[buildingName];

                    if (!buildingData) {
                        buildingData = this.getBuildingDataFromDisplayText(buildingName, buildingGroup);
                    }

                    if (buildingData && buildingData.floors) {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    getMutiSite3dOptions = (site3dOptions, buildingID) => {
        let options = null;

        for (const siteID in site3dOptions) {
            const _3dOptions = site3dOptions[siteID];
            const building = _3dOptions.buildingIDs[buildingID];

            if (building) {
                options = _3dOptions;
                break;
            }
        }

        return options;
    }

    getBuildingGroupModel(buildingGroupID, indoorModels) {
        for (const modelName in indoorModels) {
            const model = indoorModels[modelName];

            if (model.buildingGroupID === buildingGroupID) {
                return model;
            }
        }

        return null;
    }

    getBuildingDataFromDisplayText(displayText, buildingGroup) {
        for (const buildingName in buildingGroup) {
            const buildingData = buildingGroup[buildingName];

            if (buildingData && buildingData.modelDisplayText && buildingData.modelDisplayText === displayText) {
                return buildingData;
            }
        }

        return null;
    }

    showChild(e) {
        this.manualExpand = this.props.showChild(e);
        if (this.manualExpand && this.props.onChangeBuildingGroup) {
            this.props.onChangeBuildingGroup(this.props.building, SDMS.SelectedStatusInfoType.building);
        }
    }

    isSelected() {
        if (this.props.selectedInfo) {
            if (this.props.selectedInfo.building === this.props.building) {
                return true;
            }
            else {
                this.manualExpand = false;
                return false;
            }
        }

        const [sensorType, zoneID, sensorID] = this.props.selectedSensor;

        if (this.prevSelectedSensor[0] !== sensorType ||
            this.prevSelectedSensor[1] !== zoneID ||
            this.prevSelectedSensor[2] !== sensorID) {
            this.manualExpand = null;
        }

        this.prevSelectedSensor = [sensorType, zoneID, sensorID];

        if (this.manualExpand !== null) {
            return this.manualExpand;
        }

        if (sensorType !== null && zoneID !== null && sensorID !== null) {
            if (this.props.building.zoneDatas) {
                const buildingData = this.props.building;

                /*if (!buildingData || !buildingData.zoneDatas) {
                    return false;
                }*/

                const zoneCount = buildingData.zoneDatas.length;

                for (let i = 0; i < zoneCount; i++) {
                    const zoneData = buildingData.zoneDatas[i];

                    if (zoneData.id === zoneID) {
                        return true;
                    }
                }
            }
            else {
                const outdoorZones = this.props.building;
                const zoneIDString = zoneID.toString();
                
                for (const outdoorZoneID in outdoorZones) {
                    if (outdoorZoneID === zoneIDString) {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    render() {
        let zoneUI = this.getZoneUI();
        let listClassName = 'viewList2Depth';
        let showChild = 'false';
        this.showChildResult = false;

        if (this.isSelected()) {
            listClassName += " " + 'on';
            showChild = 'true';
            this.showChildResult = true;
        }

        const buildingName = this.props.building.displayText ? this.props.building.displayText : '외부 영역';

        return (
            <li>
                <div 
                    id={this.props.id} 
                    ref={this.refBuildingName}
                    className={'viewList1Depth'}
                >
                    <span 
                        className={'viewList1DepthSP'} 
                        data-show_child={showChild}
                        data-target_class='viewList1Depth'
                        onClick={(e) => { this.showChild(e) }}
                    >
                        {buildingName}
                    </span>
                    {
                        //<span className={content.goLink} onClick={this.moveToX}><a>이동</a></span>
                    }
                </div>
                <ul ref={this.refZoneList} id={'buildingArea_' + this.props.building.id} className={listClassName}>
                    {zoneUI}
                </ul>
            </li>
        );
    }
}

export default StatusInfoBuilding;