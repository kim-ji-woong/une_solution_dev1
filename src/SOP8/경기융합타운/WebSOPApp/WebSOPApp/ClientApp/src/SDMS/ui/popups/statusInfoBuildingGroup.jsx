//import { ui } from 'jquery';
import React, { Component } from 'react';
//import $ from 'jquery';
import content from '../../../Common/css/content.module.css';
import StatusInfoBuilding from './statusInfoBuilding';
import SDMSMainMenu from '../sdmsMainMenu';
import SDMS from '../sdms';
import ProjectResource from '../../../Root/resource/id';

class StatusInfoBuildingGroup extends Component {
    constructor(props) {
        super(props);

        this.prevSelectedSensor = [null, null, null];
        this.moveToX = this.moveToX.bind(this);
        this.refBuildingGroupName = React.createRef();
        this.refBuildingList = React.createRef();
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
        if (this.refBuildingGroupName.current) {
            if (this.showChildResult) {
                if (this.refBuildingGroupName.current.dataset.show_child !== 'true') {
                    this.refBuildingGroupName.current.dataset.show_child = 'true';
                }

                if (this.refBuildingList.current.classList.contains('on') === false) {
                    this.refBuildingList.current.classList.add('on');
                }
            }
            else {
                if (this.refBuildingGroupName.current.dataset.show_child !== 'false') {
                    this.refBuildingGroupName.current.dataset.show_child = 'false';
                }

                if (this.refBuildingList.current.classList.contains('on')) {
                    this.refBuildingList.current.classList.remove('on'); 
                }
            }
        }
    }

    moveToX() {
        this.props.moveToX(SDMSMainMenu.Menu_MoveTo_BuildingGroup, this.props.buildingGroup);
    }

    getBuildingUI() {
        let ui = [];

        if (!this.props.selectedInfo || this.props.selectedInfo.buildingGroup === null || this.props.selectedInfo.buildingGroup.id !== this.props.buildingGroup.id) {
            if (this.props.isOutdoor) {
                const outdoorZones = this.props.buildingGroup;

                for (const outdoorZoneID in outdoorZones) {
                    
                    if (outdoorZones[outdoorZoneID] && this.props.selectedInfo.buildingGroup &&
                        this.props.selectedInfo.buildingGroup.id === outdoorZones[outdoorZoneID].id) {
                        continue;
                    }
                }
            }
            else {
                return ui;
            }
        }

        if (this.props.buildingGroup.buildingDatas) {
            const buildingDatas = this.props.buildingGroup.buildingDatas;
            if (buildingDatas === undefined || buildingDatas === null || buildingDatas.length === 0)
                return ui;

            for (var i = 0; i < buildingDatas.length; i++) {
                const building = buildingDatas[i];
                if (building.visible === false && this.props.searchText.length > 0)
                    continue;

                ui.push(
                    <StatusInfoBuilding
                        key={'building_' + building.id}
                        id={'building_' + building.id}
                        building={building}
                        buildingIDs={this.props.buildingIDs}
                        indoorModels={this.props.indoorModels}
                        sensorList={this.props.sensorList}
                        moveToX={this.props.moveToX}
                        onSelectSensor={this.props.onSelectSensor}
                        selectedSensor={this.props.selectedSensor}
                        selectedInfo={this.props.selectedInfo}
                        selectedFacility={this.props.selectedFacility}
                        sensorAlarms={this.props.sensorAlarms}
                        showChild={this.showChild}
                        searchText={this.props.searchText}
                        facilityInfos={this.props.facilityInfos}
                        isEditMode={this.props.isEditMode}
                        onChangeBuildingGroup={this.props.onChangeBuildingGroup}
                        useSensorTypes={this.props.useSensorTypes}
                        multiSite={this.props.multiSite}
                        site3dOptions={this.props.site3dOptions}
                    />
                );
            }
        }
        else {
            const outdoorZones = this.props.buildingGroup;
            ui.push(
                <StatusInfoBuilding
                    key={'building_outdoor'}
                    id={'building_outdoor'}
                    building={outdoorZones}
                    buildingIDs={this.props.buildingIDs}
                    indoorModels={this.props.indoorModels}
                    sensorList={this.props.sensorList}
                    moveToX={this.props.moveToX}
                    onSelectSensor={this.props.onSelectSensor}
                    selectedSensor={this.props.selectedSensor}
                    selectedInfo={this.props.selectedInfo}
                    selectedFacility={this.props.selectedFacility}
                    sensorAlarms={this.props.sensorAlarms}
                    showChild={this.showChild}
                    searchText={this.props.searchText}
                    facilityInfos={this.props.facilityInfos}
                    isEditMode={this.props.isEditMode}
                    onChangeBuildingGroup={this.props.onChangeBuildingGroup}
                    useSensorTypes={this.props.useSensorTypes}
                    multiSite={this.props.multiSite}
                    site3dOptions={this.props.site3dOptions}
                />
            );
        }
        
        return ui;
    }

    //각 트리 단계별 show / hide
    showChild = (e) => {
        // show / hide 여부, dataset은 항상 string으로 적용된다.
        let flag = e.target.dataset.show_child;
        //this.showChildElement(e.target, flag === 'false');
        //닫을 메뉴들
        let hideDepths = [];
        let targetClass = e.target.dataset.target_class;
        let heads = [];

        if (targetClass === 'viewListHead') {
            hideDepths = ['viewListConts', 'viewList1Depth', 'viewList2Depth', 'viewList3Depth', 'viewList4Depth', 'viewList5Depth'];
            heads = ['viewListHead', 'viewList1Depth', 'viewList2DepthSpen', 'viewList3DepthHead', 'viewList4DepthHead', 'viewList5DepthHead'];
        } else if (targetClass === 'viewList1Depth') {
            hideDepths = ['viewList1Depth', 'viewList2Depth', 'viewList3Depth', 'viewList4Depth', 'viewList5Depth'];
            heads = ['viewList1Depth', 'viewList2DepthSpen', 'viewList3DepthHead', 'viewList4DepthHead', 'viewList5DepthHead'];
        } else if (targetClass === 'viewList2Depth') {
            hideDepths = ['viewList3Depth', 'viewList4Depth', 'viewList5Depth'];
            heads = ['viewList2DepthSpen', 'viewList3DepthHead', 'viewList4DepthHead', 'viewList5DepthHead'];
        } else if (targetClass === 'viewList3Depth') {
            hideDepths = ['viewList4Depth', 'viewList5Depth'];
            heads = ['viewList3DepthHead', 'viewList4DepthHead', 'viewList5DepthHead'];
        } else if (targetClass === 'viewList4Depth') {
            hideDepths = ['viewList5Depth']; 
            heads = ['viewList4DepthHead'];
        }

        // 다른 트리 비활성화
        for (let depth of hideDepths) {
            let nodes = document.getElementsByClassName(depth);
            for (let node of nodes) {
                node.classList.remove('on');
            }
        }

        //플래그 초기화
        for (let head of heads) {
            let tags = document.getElementsByClassName(head);
            for (let tag of tags) {
                tag.dataset.show_child = 'false';
            }
        }

        let expand = false;

         // child tree show
        if (flag === 'false') {
            e.target.dataset.show_child = 'true';

            if (targetClass === 'viewListHead') {
                e.target.parentElement.nextElementSibling.classList.add('on');
            } else if (targetClass === 'viewList_4Depth') {
                let viewList5Depth = e.target.getElementsByClassName('viewList5Depth');
                for (let depth of viewList5Depth) {
                    depth.classList.add('on');
                }
            } else if (targetClass === 'viewList2Depth') {
                if (e.target.parentElement && e.target.parentElement.nextElementSibling) {
                    e.target.parentElement.nextElementSibling.classList.add('on');
                }
            } else {//1, 3 뎁스 공통
                if (e.target.nextElementSibling) {
                    e.target.nextElementSibling.classList.add('on');
                }
            }

            expand = true;
        } else {
            // child tree hide
            e.target.dataset.show_child = 'false';

            if (targetClass === 'viewListHead') {
                // e.target.parentElement.parentElement.classList.remove('on');
                e.target.parentElement.nextElementSibling.classList.remove('on');
            } else if (targetClass === 'viewList4Depth') {
                let viewList5Depth = e.target.getElementsByClassName('viewList5Depth');
                for (let depth of viewList5Depth) {
                    depth.classList.remove('on'); 
                }
            } else if (targetClass === 'viewList2Depth') {
                if (e.target.parentElement && e.target.parentElement.nextElementSibling) {
                    e.target.parentElement.nextElementSibling.classList.remove('on');
                }
            } else {//1, 3 뎁스 공통
                if (e.target.nextElementSibling) {
                    e.target.nextElementSibling.classList.remove('on');
                }
            }

            expand = false;
        }

        return expand;
    }

    showChildElement = (e) => {
        this.manualExpand = this.showChild(e);

        if (this.props.onChangeBuildingGroup) {
            if (!this.manualExpand) {
                this.props.onChangeBuildingGroup(this.props.buildingGroup, SDMS.SelectedStatusInfoType.none);
            }
            else {
                this.props.onChangeBuildingGroup(this.props.buildingGroup, SDMS.SelectedStatusInfoType.buildingGroup);
            }   
        }
    }

    isSelected() {
        if (this.props.selectedInfo) {
            if (this.props.selectedInfo.buildingGroup === this.props.buildingGroup) {
                return true;
            }
        }

        const [sensorType, zoneID, sensorID] = this.props.selectedSensor;

        if (this.prevSelectedSensor[0] !== sensorType ||
            this.prevSelectedSensor[1] !== zoneID ||
            this.prevSelectedSensor[2] !== sensorID) {
            this.manualExpand = null;
        }

        this.prevSelectedSensor = [sensorType, zoneID, sensorID];

        // 빌딩그룹 트리가 열려있는 상태로 다른 빌딩그룹 트리를 클릭하여 열었다가 다시 전에 열려있었던 빌딩그룹 트리를 클릭하면 열린 상태값을 리턴하여 오류발생 수정 - K.D.R
        //if (this.manualExpand !== null) {
        if (this.manualExpand === false) {
            return this.manualExpand;
        }

        if (sensorType !== null && zoneID !== null && sensorID !== null) {
            const zoneList = this.props.zoneList;

            if (!zoneList) {
                return false;
            }

            if (this.props.buildingGroup.buildingDatas) {
                const zoneData = zoneList[zoneID];

                if (!zoneData) {
                    return false;
                }

                const buildingID = zoneData[1];

                if (buildingID === undefined || buildingID === null) {
                    return false;
                }

                const buildingGroupData = this.props.buildingGroup;

                if (!buildingGroupData || !buildingGroupData.buildingDatas) {
                    return false;
                }

                const buildingCount = buildingGroupData.buildingDatas.length;

                for (let i = 0; i < buildingCount; i++) {
                    const buildingData = buildingGroupData.buildingDatas[i];

                    if (buildingData.id === buildingID) {
                        return true;
                    }
                }
            }
            else {
                const outdoorZones = this.props.buildingGroup;
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

    isMovable() {
        if (this.props.buildingGroup.completeLoading) {
            // 경기융합타운은 빌딩그룹으로 이동하지않음
            if (ProjectResource.SiteNo >= ProjectResource.Site.GG_A && ProjectResource.SiteNo <= ProjectResource.Site.GG_D) {
                return false;
            }

            if (this.props.multiSite) {
                return true;
            }
            else {
                return this.props.buildingGroup.textCenter !== null;
            }
        }

        return false;
    }

    render() {
        let buildingUI = this.getBuildingUI();
        let listClassName = 'viewListConts';
        let showChild = 'false';
        this.showChildResult = false;

        if (this.isSelected()) {
            listClassName += " " + 'on';
            showChild = 'true';
            this.showChildResult = true;
        }

        const buildingGroupName = this.props.buildingGroup.displayText ? this.props.buildingGroup.displayText : '외부 영역';
        const movable = this.isMovable();//this.props.buildingGroup.textCenter !== null;

        return (
            <li>
                <div className={'viewListHeadWrap'} id={this.props.id}>
                    <span ref={this.refBuildingGroupName} className={'viewListHead'} data-show_child={showChild} data-target_class='viewListHead' onClick={(e) => { this.showChildElement(e) }}>{buildingGroupName}</span>
                    {
                        !this.props.isEditMode && movable &&
                        <span className={'goLink'} onClick={this.moveToX} style={{ cursor: 'pointer' }}><a>이동</a></span>
                    }
                </div>
                <div id={'buildingGroupArea_' + this.props.buildingGroup.id} ref={this.refBuildingList} className={listClassName} data-id={this.props.buildingGroup.id }>
                    <ul>
                        {buildingUI}
                    </ul>
                </div>
            </li>
        );
    }
}

export default StatusInfoBuildingGroup;