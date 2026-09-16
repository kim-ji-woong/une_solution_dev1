import React, { Component } from 'react';
import dashStyles from '../../Common/css/dash.module.css';
import swiper from '../../Common/css/swiper.module.css';
import $ from 'jquery';
import 'swiper/swiper.scss';
import DashboardResource from '../resource/id';

//import DashCommon from './dashCommon.js';


class DashboardHeader extends Component {
    constructor(props) {
        super(props);

        this.state = {
            buildingList: [],
            zoneList: [],
        }

        this.refBuildingGroup = React.createRef();
        this.refBuilding = React.createRef();
        this.refZone = React.createRef();

        this.props = props;
    }

    componentDidMount() {

        setTimeout(() => {
            document.addEventListener('click', function (e) {
                let $target = e.target;

                /*공통 select*/
                let $selectTarget = $target.closest('.' + dashStyles.selectWrap);
                const $selectWrap = document.querySelectorAll('.' + dashStyles.selectWrap);
                const selectActiveName = ('.' + dashStyles.isOpen);

                //select-wrap인지 체크 
                if ($selectTarget) {
                    e.preventDefault();

                    if ($target.classList.contains('.' + dashStyles.link) && !$selectTarget.classList.contains(selectActiveName)) {
                        //target 이 link 버튼일때. 
                        for (let i = 0; i < $selectWrap.length; i += 1) {
                            $selectWrap[i].classList.remove(selectActiveName);
                        }
                        $selectTarget.classList.add(selectActiveName);

                    } else {
                        //option
                        //target 이 item 버튼이며 is-active 클래스를 가지고 있지 않을 때. 
                        if ($target.classList.contains('.' + dashStyles.item) && !($target.classList.contains('.' + dashStyles.isActive))) {
                            for (let i = 0; i < $selectTarget.children[1].children.length; i += 1) {
                                $selectTarget.children[1].children[i].classList.remove(dashStyles.isActive);
                            }
                            $target.classList.add(dashStyles.isActive);
                            //selet-link text 변경
                            $selectTarget.children[0].children[0].innerText = $target.innerText;
                        }
                        //select 닫기
                        $selectTarget.classList.remove(selectActiveName);
                    }


                } else {
                    //target이 select이 아닌 영역을 클릭했을 때 전체 select 닫기.
                    for (let i = 0; i < $selectWrap.length; i += 1) {
                        $selectWrap[i].classList.remove(selectActiveName);
                    }
                }
            });
        }, 1000);

    }

    onClickBuildingGroup = (id) => {
        // 빌딩 UI 초기화
        $('.buildingName')[0].innerText = "전체";

        let children = $('.buildingList')[0].children;

        for (let i = 0; i < children.length; i++) {
            let building = children[i];
            building.classList.remove(dashStyles.isActive);

            if (i === 0)
                building.classList.add(dashStyles.isActive);
        }

        // 층 초기화
        $('.zoneName')[0].innerText = "전체";

        let zoneChildren = $('.zoneList')[0].children;

        for (let i = 0; i < zoneChildren.length; i++) {
            let zone = zoneChildren[i];
            zone.classList.remove(dashStyles.isActive);

            if (i === 0)
                zone.classList.add(dashStyles.isActive);
        }

        if (this.props.buildingGroupList === null || this.props.buildingGroupList === undefined) 
            return;

        let buildingGroupID = id;
        let buildingList = [];

        if (id !== -1 && id !== null && id !== undefined && id !== DashboardResource.zoneID.outdoor) {
            for (let i = 0; i < this.props.buildingGroupList.length; i++) {
                let buildingGroup = this.props.buildingGroupList[i];

                if (buildingGroupID === buildingGroup.id) {
                    for (let j = 0; j < buildingGroup.buildingDatas.length; j++) {
                        let building = buildingGroup.buildingDatas[j];

                        buildingList.push(<button key={"building_" + building.id} className={dashStyles.item} onClick={() => this.onClickBuilding(building.id)}>{building.displayText}</button>);
                    }

                    break;
                }
            }
        }

        this.setState({ buildingList: buildingList });
        this.refBuildingGroup.current.value = id;

        if (id === DashboardResource.zoneID.outdoor)
            this.props.selectSpatial(id, DashboardResource.zoneID.outdoor, DashboardResource.zoneID.outdoor);
        else
            this.props.selectSpatial(id, -1, -1);
    }

    onClickBuilding = (id) => {
        // 층 초기화
        $('.zoneName')[0].innerText = "전체";

        let children = $('.zoneList')[0].children;

        for (let i = 0; i < children.length; i++) {
            let zone = children[i];
            zone.classList.remove(dashStyles.isActive);

            if (i === 0)
                zone.classList.add(dashStyles.isActive);
        }

        if (this.props.buildingGroupList === null || this.props.buildingGroupList === undefined)
            return;

        let buildingGroupID = this.refBuildingGroup.current.value;
        buildingGroupID = parseInt(buildingGroupID);
        let buildingID = id;
        let zoneList = [];

        if (id !== -1 && id !== null && id !== undefined) {
            for (let i = 0; i < this.props.buildingGroupList.length; i++) {
                let buildingGroup = this.props.buildingGroupList[i];

                if (buildingGroupID === buildingGroup.id) {
                    for (let j = 0; j < buildingGroup.buildingDatas.length; j++) {
                        let building = buildingGroup.buildingDatas[j];

                        if (building.id === id) {
                            for (let y = 0; y < building.zoneDatas.length; y++) {
                                let zone = building.zoneDatas[y];

                                zoneList.push(<button key={"zone_" + zone.id} className={dashStyles.item} onClick={() => this.onClickZone(zone.id)}>{zone.displayText}</button>);
                            }

                            break;
                        }
                    }

                    break;
                }
            }
        }

        this.setState({ zoneList: zoneList });
        this.refBuilding.current.value = id;

        if (buildingGroupID === DashboardResource.zoneID.outdoor)
            this.props.selectSpatial(buildingGroupID, DashboardResource.zoneID.outdoor, DashboardResource.zoneID.outdoor);
        else
            this.props.selectSpatial(buildingGroupID, buildingID, -1);
    }

    onClickZone = (id) => {
        let buildingGroupID = this.refBuildingGroup.current.value;
        buildingGroupID = parseInt(buildingGroupID);

        let buildingID = this.refBuilding.current.value;
        buildingID = parseInt(buildingID);

        if (buildingGroupID === DashboardResource.zoneID.outdoor)
            this.props.selectSpatial(buildingGroupID, DashboardResource.zoneID.outdoor, DashboardResource.zoneID.outdoor);
        else
            this.props.selectSpatial(buildingGroupID, buildingID, id);
    }

    setBuildingGroupUI = () => {
        let buildingGroupUI = [];

        if (this.props.buildingGroupList !== null && this.props.buildingGroupList !== undefined) {
            const buildingGroupList = this.props.buildingGroupList;

            for (let i = 0; i < buildingGroupList.length; i++) {
                let buildingGroup = buildingGroupList[i];

                buildingGroupUI.push(<button key={"buildingGroupUI_" + buildingGroup.id} className={dashStyles.item + " buildingGroup"} onClick={() => this.onClickBuildingGroup(buildingGroup.id)}>{buildingGroup.displayText}</button>);
            }

            if (buildingGroupList.length > 0)
                buildingGroupUI.push(<button key={"buildingGroupUI_" + DashboardResource.zoneID.outdoor} className={dashStyles.item + " buildingGroup"} onClick={() => this.onClickBuildingGroup(DashboardResource.zoneID.outdoor)}>외곽</button>);

        } else {
            buildingGroupUI.push(<></>);
        }

        return buildingGroupUI;
    }

    getBtbCloseUI = () => {
        let btbCloseUI = [];

        let btbClose = this.props.btbClose;
        if (btbClose === true)
            btbCloseUI.push(<button key="dashboardClose" type="button" className={dashStyles.btnDashboardClose} onClick={() => this.props.onClickBtnClose()}></button>);
        else
            btbCloseUI.push(<></>);

        return btbCloseUI;
    }

    render() {
        let buildingGroupUI = this.setBuildingGroupUI();
        let btbCloseUI = this.getBtbCloseUI();
        

        return (
            <header className={dashStyles.dashboardHeader}>
                <figure className={dashStyles.selectContent}>
                    <div className={dashStyles.selectWrap}>
                        <div className={dashStyles.selectLink}>
                        <button ref={this.refBuildingGroup} className={dashStyles.link}>전체</button>
                        </div>
                        <figure className={dashStyles.selectPanel}>
                        <button className={dashStyles.item + " " + dashStyles.isActive} onClick={() => this.onClickBuildingGroup(-1)}>전체</button>
                            { buildingGroupUI }
                        </figure>
                    </div>
                    <div className={dashStyles.selectWrap}>
                        <div className={dashStyles.selectLink}>
                        <button ref={this.refBuilding} className={dashStyles.link + " buildingName"}>전체</button>
                        </div>
                        <figure className={dashStyles.selectPanel + " buildingList"}>
                        <button className={dashStyles.item + " " + dashStyles.isActive} onClick={() => this.onClickBuilding(-1)}>전체</button>
                            {this.state.buildingList}
                        </figure>
                    </div>
                    <div className={dashStyles.selectWrap}>
                        <div className={dashStyles.selectLink}>
                        <button ref={this.refZone} className={dashStyles.link + " zoneName"}>전체</button>
                        </div>
                        <figure className={dashStyles.selectPanel + " zoneList"}>
                        <button className={dashStyles.item + " " + dashStyles.isActive} onClick={() => this.onClickZone(-1)}>전체</button>
                        {this.state.zoneList}
                        </figure>
                    </div>
                </figure>
                {btbCloseUI}
            </header> 

       );
    }
} export default DashboardHeader;