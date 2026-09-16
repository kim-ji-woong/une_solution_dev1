import React, { Component } from 'react';
import $ from 'jquery';
import Main from '../main';
import PopupDraggable from './popupDraggable';
import { StatusInfoComponent } from '../../styled/mainStyled';
import SDMSResource from '../../resource/id';
import MainResource from '../../resource/id';
import StatusInforackGroup from './statusInfoRackGroup';
import { MainController } from '../../services/mainController';
import ProjectResource from '../../../Root/resource/id';
    
class StatusInfo extends Component {
    static poi_menu = {
        temperature: "temperature",     // 온도
        camera_360: "camera_360",       // 360도 카메라
        electric: "electric",           // 전력
        nameTag: "nameTag",             // 네임택
        wall: "wall",                   // 벽/기둥
        tray: "tray",                   // 트레이
        facility: "facility"            // 설비
    }

    constructor(props) {
        super(props);
        this.state = {
            searchText: '',
            rackItems: {}
        }

        this.props = props;

        this.initPopupState = this.initPopupState.bind(this);

        this.refLayer = React.createRef();
        this.refScrollArea = React.createRef();
        this.refScrollbar = React.createRef();
        this.refTree = React.createRef();

        this.wsMgr = this.props.getWebSocket();
    }

    componentDidMount() {
        this.loadRackItems();

        let cssLeft = null;
        let cssTop = null;
        let cssWidth = null;
        let cssHeight = null;

        const popup = document.getElementById(this.props.popupType);
        const target = document.getElementById("dsBot_" + this.props.popupType);
        const popupState = this.props.popupState;

        if (popup !== null && popup !== undefined &&
            target !== null && target !== undefined &&
            popupState !== null && popupState !== undefined) {
            const clientRect = target.getBoundingClientRect();
            cssLeft = clientRect.left + "px";
            cssTop = clientRect.top + "px";

            popup.style.width = 0;
            popup.style.height = 0;
            popup.style.left = cssLeft;
            popup.style.top = cssTop;

            cssLeft = popupState.x;
            cssTop = popupState.y;
            cssWidth = popupState.width;
            cssHeight = popupState.height;

            $('#' + this.props.popupType).animate({ opacity: 1, width: cssWidth, height: cssHeight, left: cssLeft, top: cssTop }, SDMSResource.PopupAniTime, () => {
                if (document.getElementById(this.props.popupType) !== null && document.getElementById(this.props.popupType) !== undefined) {
                    document.getElementById(this.props.popupType).style.opacity = 1;
                }
            });
        }
        else {
            $('#' + this.props.popupType).animate({ opacity: 1 }, SDMSResource.PopupAniTime, () => {
                if (document.getElementById(this.props.popupType) !== null && document.getElementById(this.props.popupType) !== undefined) {
                    document.getElementById(this.props.popupType).style.opacity = 1;
                }
            });
        }

        // this.initPopupState();

        $('.scrollbar').scrollTop(0);
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.rackGroups !== this.props.rackGroups) {
            this.loadRackItems();
        }

        // 팝업이 선택 됐을 때(Drag 될때) 맨 앞에 팝업 위치
        if (this.props.zIndex !== prevProps.zIndex) {
            this.state.popup.style.zIndex = this.props.zIndex;
        }
    }

    loadRackItems = async () => {
        const rackItems = {};

        for (const rackGroup of this.props.rackGroups) {
            for (const rack of rackGroup.racks) {
                const [items, totalCount, message] = await MainController.requestRackItemList(rack.rackNo);
                if (items) {
                    rackItems[rack.rackNo] = items;
                } else {
                    this.props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, [message], null, null);
                }
            }
        }

        this.setState({ rackItems });
    }

    // node가 보이는 범위내에 있는지 체크한다
    checkRange(titleID, areaID, targetRect) {
        const titleEle = document.getElementById(titleID);
        const areaEle = document.getElementById(areaID);
        if (!titleEle || !areaEle) {
            return false;
        }

        const titleRect = titleEle.getBoundingClientRect();
        const areaRect = areaEle.getBoundingClientRect();

        const beginY = targetRect.y;
        const endY = targetRect.y + targetRect.height;
        if (titleRect.top >= beginY && areaRect.bottom <= endY) {
            // 범위내에 있음
            return false;
        }

        return true;
    }

    initPopupState() {
        var popup = document.getElementsByClassName('statusInfo')[0];

        //DB에 값이 있을 경우에만
        if (typeof this.props.popupState !== 'undefined') {
            popup.style.left = this.props.popupState.x;
            popup.style.top = this.props.popupState.y;
            popup.style.width = this.props.popupState.width;
            popup.style.height = this.props.popupState.height;
        } else {
            // DB에 값이 따로 없을 경우
            let data = SDMSResource.popupResetLocation[this.props.popupType];

            popup.style.left = data.x;
            popup.style.top = data.y;
            popup.style.width = data.width;
            popup.style.height = data.height;
        }

        this.setState({ popup: popup });
    }

    onChangeVisible(sensorType) {
        this.props.setVisiblePoi(sensorType, !this.props.visibleSensorTypes[sensorType]);
    }

    onClickLayer = (event) => {
        const on = 'on';

        if (event.target.classList.contains(on)) {
            event.target.classList.remove(on);
            this.refLayer.current.classList.remove(on);
        }
        else {
            event.target.classList.add(on);
            this.refLayer.current.classList.add(on);
        }
    }

    searchEnterKey = () => {
        if (window.event && window.event.keyCode === 13) {    
            this.search();
        }
    }

    search = () => {
        const text = document.getElementById('txtSearch').value;

        this.setState(() => {
            const searchPattern = /랙\s/i;
        
            if (searchPattern.test(text)) {
                // 문자열에 '랙 '이 포함된 경우 '랙 '을 제거
                const updatedString = text.replace(searchPattern, '');
        
                return { searchText: updatedString };
            }
        
            return { searchText: text };
        });
    }

    onClickShowHide = (rackGroupNo) => {
        this.props.setSelectedRackGroup(rackGroupNo);
    }

    getRackGroupUI() {
        let ui = [];
        let rackGroups = this.props.rackGroups;
        
        if (rackGroups === undefined || rackGroups === null || rackGroups.length === 0)
            return ui;

        let rackGroupClass = '';
        let rackGroupChildClass = '';
            
        if (this.state.searchText.length > 0) {
            this.setVisibleRackGroups(rackGroups);
        }

        for (let i = 0; i < rackGroups?.length; i++) {
            const rackGroup = rackGroups[i];

            if (rackGroup.visible === false && this.state.searchText.length > 0)
                continue;

            if (this.props.selectedStatusInfo.rackGroup !== rackGroup.rackGroupNo) {
                rackGroupClass = '';
                rackGroupChildClass = 'tree-1depth';
            }
            else {
                rackGroupClass = 'on';
                rackGroupChildClass = 'tree-1depth on';
            }

            ui.push(
                <li key={'RackGroup_' + rackGroup.rackGroupNo}>
                    <p className={rackGroupClass} onClick={() => this.onClickShowHide(rackGroup.rackGroupNo)}>
                        {rackGroup.groupName}
                    </p>
                    <ul className={rackGroupChildClass} id={'RackGroup_' + rackGroup.rackGroupNo}>
                        <StatusInforackGroup
                            id={'RackGroup_' + rackGroup.rackGroupNo}
                            key={rackGroup.rackGroupNo}
                            rackGroup={rackGroup}
                            rackItems={this.state.rackItems}
                            searchText={this.state.searchText}
                            setVisiblePopups={this.props.setVisiblePopups}
                            selectedStatusInfo={this.props.selectedStatusInfo}
                            setSelectedRack={this.props.setSelectedRack}
                            setSelectedRackItem={this.props.setSelectedRackItem}
                            sensorAlarms={this.props.sensorAlarms}
                        />
                    </ul>
                </li>
            );
        }
        
        return ui;
    }

    escapeRegExp(text) {
        return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    
    setVisibleRackGroups = (rackGroups) => {
        const { searchText } = this.state;
        const escapedSearchText = this.escapeRegExp(searchText);
        const searchPattern = new RegExp(escapedSearchText, 'i'); // 대소문자 무시하고 패턴 매칭
    
        rackGroups.forEach(rackGroup => {
            let groupVisible = searchPattern.test(rackGroup.groupName);
    
            let hasVisibleRack = false;
            rackGroup.racks.forEach(rack => {
                const isRackVisible = this.setVisibleRacks(rack, searchPattern);
                if (isRackVisible) {
                    hasVisibleRack = true;
                }
            });
    
            rackGroup.visible = groupVisible || hasVisibleRack;
        });
    };
    
    setVisibleRacks = (rack, searchPattern) => {
        let rackVisible = searchPattern.test(rack.rackName);
    
        const hasVisibleItem = this.setVisibleItems(rack.rackNo, searchPattern);
    
        rack.visible = rackVisible || hasVisibleItem;
    
        return rack.visible;
    };
    
    setVisibleItems = (rackNo, searchPattern) => {
        const { rackItems } = this.state;
        const items = rackItems[rackNo] || [];
    
        let hasVisibleItem = false;
        items.forEach(item => {
            const itemVisible = searchPattern.test(item.itemName) ||
                                searchPattern.test(item.equipmentTypeName) ||
                                searchPattern.test(String(item.uPos)) ||
                                searchPattern.test(String(item.itemType.unit));
    
            item.visible = itemVisible;
    
            if (itemVisible) {
                hasVisibleItem = true;
            }
        });
    
        return hasVisibleItem;
    };

    render() {
        const getRackGroupUI = this.getRackGroupUI();

        let visibleTemperaturePOI = this.props.visibleSensorTypes[StatusInfo.poi_menu.temperature] ? true : false;   
        let visible360CameraPOI = this.props.visibleSensorTypes[StatusInfo.poi_menu.camera_360] ? true : false;   
        let visibleNameTagPOI = this.props.visibleSensorTypes[StatusInfo.poi_menu.nameTag] ? true : false;   
        let visibleWallPOI = this.props.visibleSensorTypes[StatusInfo.poi_menu.wall] ? true : false;   
        let visibleTrayPOI = this.props.visibleSensorTypes[StatusInfo.poi_menu.tray] ? true : false;   
        let visibleFacilityPOI = this.props.visibleSensorTypes[StatusInfo.poi_menu.facility] ? true : false;   

        let visibleTemperatureClassName = (visibleTemperaturePOI) ? 'visibleTemperature' : 'disableTemperature';
        let visible360CameraClassName = (visible360CameraPOI) ? 'visible360Camera' : 'disable360Camera';
        let visibleNameTagClassName = (visibleNameTagPOI) ? 'visibleNameTag' : 'disableNameTag';
        let visibleWallClassName = (visibleWallPOI) ? 'visibleWall' : 'disableWall';
        let visibleTrayClassName = (visibleTrayPOI) ? 'visibleTray' : 'disableTray';
        let visibleFacilityClassName = (visibleFacilityPOI) ? 'visibleFacility' : 'disableFacility';

        return (
            <StatusInfoComponent id={this.props.popupType} className='UI_Section statusInfo'>
                <PopupDraggable
                    id={this.props.popupType}
                    popupMinWidth={340}
                    popupMinHeight={560}
                    topSize={68}
                    popupState={this.props.popupState}
                    setActiveDragPopup={this.props.setActiveDragPopup}
                >
                    <div className={'head'}>
                        <h5 className={'title'} >
                            {`${this.props.selectedDataCenter.dataCenterName} ${MainResource.ID.menu.statusInfo}`}
                        </h5>
                        <div className={'close'} onClick={() => this.props.setVisiblePopups(Main.menu.statusInfo, false)}>
                            <button>닫기버튼</button>
                        </div>
                    </div>

                    <div className={'body'}>
                        <div className={'poiBtnWrap'}>
                            <div onClick={this.onClickLayer}>
                                <ul ref={this.refLayer}>
                                    <li><label className={visibleTemperatureClassName} data-title="온도" ><input type="checkbox" checked={visibleTemperaturePOI} onChange={() => this.onChangeVisible(StatusInfo.poi_menu.temperature)} /></label></li>
                                    {/* <li><label className={visible360CameraClassName} data-title="360도 카메라" ><input type="checkbox" checked={visible360CameraPOI} onChange={() => this.onChangeVisible(StatusInfo.poi_menu.camera_360)} /></label></li> */}
                                    <li><label className={visibleTrayClassName} data-title="트레이" ><input type="checkbox" checked={visibleTrayPOI} onChange={() => this.onChangeVisible(StatusInfo.poi_menu.tray)} /></label></li>
                                    <li><label className={visibleFacilityClassName} data-title="설비" ><input type="checkbox" checked={visibleFacilityPOI} onChange={() => this.onChangeVisible(StatusInfo.poi_menu.facility)} /></label></li>
                                    <li><label className={visibleWallClassName} data-title="벽/기둥" ><input type="checkbox" checked={visibleWallPOI} onChange={() => this.onChangeVisible(StatusInfo.poi_menu.wall)} /></label></li>
                                    <li><label className={visibleNameTagClassName} data-title="네임택" ><input type="checkbox" checked={visibleNameTagPOI} onChange={() => this.onChangeVisible(StatusInfo.poi_menu.nameTag)} /></label></li>
                                </ul> 
                            </div>
                        </div>

                        <div className={'searchWrap'}>
                            <input type="text" id="txtSearch" onKeyUp={this.searchEnterKey} placeholder='검색어를 입력해주세요.'/>
                            <button onClick={this.search}>검색</button>
                        </div>

                        <div ref={this.refScrollArea} className={'dsiScr'}>
                            <ul ref={this.refTree} className={'dsiTree scrollbar'}>
                                {getRackGroupUI}
                            </ul>
                        </div>
                    </div>
                </PopupDraggable>
            </StatusInfoComponent>
        );
    }
}

export default StatusInfo;