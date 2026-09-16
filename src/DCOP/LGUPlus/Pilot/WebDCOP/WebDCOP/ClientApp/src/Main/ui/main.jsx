import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import store from '../../Root/store';
import $ from 'jquery';
import NavigationBar from './navigationBar';
import { MainController } from '../services/mainController';
import MainResource from '../resource/id';
import MyPage from '../../Account/ui/myPage';
import Toolbar from './toolbar';
import StatusInfo from './popups/statusInfo';
import RackInfo from './popups/rackInfo';
import RackDetailInfo from './popups/rackDetailInfo';
import Assets3DInfo from './assets3DInfo';
import SignalDeviceInfo from './popups/signalDeviceInfo';
import SignalDeviceDetailInfo from './popups/signalDeviceDetailInfo';
import ConfirmDialog from '../../Common/ui/confirmDialog';
import AlarmInfo from './popups/alarmInfo';
import ViewImg from './popups/viewImg';
import AlarmDetailInfo from './popups/alarmDetailInfo';
import FacilityInfo from './popups/facilityInfo';
import DataCenterInfo from './popups/dataCenterInfo';
import ProjectResource from '../../Root/resource/id';

class Main extends Component {
    static menu = {
        none: null,
        all: '전체',
        statusInfo: MainResource.ID.menu.statusInfo,
        rackInfo: MainResource.ID.menu.rackInfo,
        signalDeviceInfo: MainResource.ID.menu.signalDeviceInfo,
        dataCenterInfo: MainResource.ID.menu.dataCenterInfo
    }

    constructor(props) {
        super(props);

        this.state = {
            visiblePopups: {
                [Main.menu.statusInfo]: true,
                [Main.menu.rackInfo]: false,
                [Main.menu.signalDeviceInfo]: false,
                [Main.menu.dataCenterInfo]: true,
            },
            visibleSensorTypes: this.initVisibleSensorTypes(),
            popupState: {},
            selectedDataCenter: store.getState().selectedDataCenter,

            showMyPagePopup: false,
            showRackDetailPopup: false,
            showItemDetailPopup: false,
            showAssets3DInfoPopup: false,
            showViewImgPopup: false,
            showAlarmDetailPopup: false,
            showFacilityInfoPopup: false, 

            rackGroups: [],
            itemList: [],

            // 현황정보 선택된 Node 정보
            selectedStatusInfo: {
                rackGroup: null,    // Line A
                rack: null,         // Rack1
                item: null,         // SAN 스위치
            },

            selectedRackInfo: null,
            selectedItemInfo: null,
            selectedAlarmInfo: null,

            autoRotation: false,
            
            confirmMessage: {
                visible: false,
                type: null,
                messages: [""],
                buttons: ["확인"],
                onClickButton: null
            },

            personalView: false,    // true : 1인칭 시점, false: 3인칭 시점
            thermalView: false,  // true : 온도 모드 on, false: 온도 모드 off
            facilityImagePath: null
        }

        this.setVisiblePopups = this.setVisiblePopups.bind(this);
        this.setVisiblePoi = this.setVisiblePoi.bind(this);

        this.wsMgr = this.props.getWebSocket();

        if (this.wsMgr) {
            this.wsMgr.setMain(this);
        }
    }

    componentDidMount() {
        MainController.StartWatchTimer(this.state.selectedDataCenter.dataCenterNo);
        this.initRackGroupList(this.state.selectedDataCenter.dataCenterNo);

        this.unsubscribe = store.subscribe(function () {
            let data = store.getState();

            if (data.actionType === 'SENSOR_ALARM') {
                this.changeAlarm(data.sensorAlarm);            
            }
        }.bind(this));
    }

    componentWillUnmount() {
        MainController.stopWatchTimer();
        this.unsubscribe();
    }

    async changeAlarm(sensorAlarms) {
        if (sensorAlarms && sensorAlarms.length > 0) {
            this.setState({ sensorAlarms });
        }
    }

    showConfirmDialog = (type, messages, buttons, onClickButton) => {
        const confirmMessage = { ...this.state.confirmMessage };
        confirmMessage.visible = true;
		confirmMessage.type = type;
        confirmMessage.messages = messages;
		confirmMessage.buttons = buttons;
		confirmMessage.onClickButton = onClickButton;

        if (!messages) {
            confirmMessage.messages = [""];
        }
        else if (Array.isArray(messages)) {
            confirmMessage.messages = messages;
        }
        else {
            confirmMessage.messages = [messages];
        }

        this.setState({ confirmMessage });
    }

    onCloseConfirmDialog = () => {
		const confirmMessage = { ...this.state.confirmMessage };
		confirmMessage.visible = false;

		this.setState({ confirmMessage });
	}

    initRackGroupList = async (dataCenterNo) => {
        const [rackGroupsResponse, itemListResponse] = await Promise.all([
            MainController.requestRackGroupList(dataCenterNo),
            MainController.requestDataCenterRackItemList(dataCenterNo)
        ]);
    
        const [rackGroups] = rackGroupsResponse || [];
        const [itemList] = itemListResponse || [];
    
        this.setState({
            ...(rackGroups?.length > 0 && { rackGroups }),
            ...(itemList?.length > 0 && { itemList })
        });
    }

    setVisiblePopups(menu, visible) {
        const menus = this.state.visiblePopups;

        // 1인칭 시점 모드, 온도 가시화 모드일 때에 열려 있는 팝업이 있다면 모두 닫음
        if (menu === Main.menu.all) {
            for (let menu in menus) {
                if (menus[menu]) {
                    menus[menu] = false;
                }
            }
        }
        else {
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
        }


        this.setState({ visiblePopups: menus });

        if (visible === false) {
            this.closePopup();
        }
    }

    setActiveDragPopup(popupType) {
        for (const key in MainResource.popupLayer) {
            const layerName = MainResource.popupLayer[key];

            if (layerName === popupType) {
                $("#" + layerName).css({ "z-index": 2 });
            } else {
                $("#" + layerName).css({ "z-index": 0 });
            }
        }
    }

    handleModalPopup = (type, value) => {
        if (type === 'myPage') {
            this.setState({ showMyPagePopup: value });
        }
        else if (type === 'rackInfo') {
            this.setState({ showRackDetailPopup: value });
        }
        else if (type === 'itemInfo') {
            this.setState({ showItemDetailPopup: value });
        }
        else if (type === 'assetsInfo') {
            this.setState({ showAssets3DInfoPopup: value });
        }
        else if (type === 'viewImg') {
            this.setState({ showViewImgPopup: value });
        }
        else if (type === 'alarmDetail') {
            this.setState({ showAlarmDetailPopup: value });
        }
        else if (type === 'facility') {
            this.setState({ showFacilityInfoPopup: value, facilityImagePath: null });
        }

        if (!value) {
            this.closePopup();
        }
    }

    setPopupUI(visiblePopups) {
        let popups = [];

        if (visiblePopups[Main.menu.statusInfo] && !this.state.personalView) {
            popups.push(
                <StatusInfo
                    key='popup_statusInfo'
                    setVisiblePopups={this.setVisiblePopups}
                    setActiveDragPopup={this.setActiveDragPopup}
                    visibleSensorTypes={this.state.visibleSensorTypes}
                    setVisiblePoi={this.setVisiblePoi}
                    popupType={MainResource.popupLayer.statusInfo}
                    rackGroups={this.state.rackGroups}
                    selectedStatusInfo={this.state.selectedStatusInfo}
                    setSelectedRackGroup={this.setSelectedRackGroup}
                    setSelectedRack={this.setSelectedRack}
                    setSelectedRackItem={this.setSelectedRackItem}
                    getWebSocket={this.props.getWebSocket}
                    showConfirmDialog={this.showConfirmDialog}
                    sensorAlarms={this.state.sensorAlarms}
                    selectedDataCenter={this.state.selectedDataCenter}
                />
            );
        }

        if (visiblePopups[Main.menu.rackInfo]) {
            popups.push(
                <RackInfo
                    key='popup_rackInfo'
                    setVisiblePopups={this.setVisiblePopups}
                    setActiveDragPopup={this.setActiveDragPopup}
                    visibleSensorTypes={this.state.visibleSensorTypes}
                    setVisiblePoi={this.setVisiblePoi}
                    popupType={MainResource.popupLayer.rackInfo}
                    selectedRackInfo={this.state.selectedRackInfo}
                    handleModalPopup={this.handleModalPopup}
                />
            );
        }

        if (visiblePopups[Main.menu.signalDeviceInfo]) {
            popups.push(
                <SignalDeviceInfo
                    key='popup_signalDeviceInfo'
                    setVisiblePopups={this.setVisiblePopups}
                    setActiveDragPopup={this.setActiveDragPopup}
                    visibleSensorTypes={this.state.visibleSensorTypes}
                    setVisiblePoi={this.setVisiblePoi}
                    popupType={MainResource.popupLayer.signalDeviceInfo}
                    selectedItemInfo={this.state.selectedItemInfo}
                    handleModalPopup={this.handleModalPopup}
                />
            );
        }

        if (visiblePopups[Main.menu.dataCenterInfo] && this.state.selectedDataCenter?.dataCenterNo === ProjectResource.dataCenter.bakdal) {
            popups.push(
                <DataCenterInfo
                    key='popup_dataCenterInfo'
                    setVisiblePopups={this.setVisiblePopups}
                    setActiveDragPopup={this.setActiveDragPopup}
                    popupType={MainResource.popupLayer.dataCenterInfo}
                />
            );
        }

        return popups;
    }

    initVisibleSensorTypes() {
        const visibleSensorTypes = {};

        visibleSensorTypes[StatusInfo.poi_menu.temperature] = true;
        visibleSensorTypes[StatusInfo.poi_menu.tray] = true;
        visibleSensorTypes[StatusInfo.poi_menu.facility] = true;
        visibleSensorTypes[StatusInfo.poi_menu.wall] = true;
        visibleSensorTypes[StatusInfo.poi_menu.nameTag] = true;

        return visibleSensorTypes;
    }

    setVisiblePoi(typeName, visible) {
        let types = {...this.state.visibleSensorTypes};

        types[typeName] = visible;
        
        this.setState({ visibleSensorTypes: types });

        if (this.wsMgr) {
            this.wsMgr.setLayerState(types);
        }
    }

    setSelectedRackGroup = (rackGroupNo) => {
        const selectedStatusInfo = { ...this.state.selectedStatusInfo };

        if (rackGroupNo === this.state.selectedStatusInfo.rackGroup) {
            selectedStatusInfo.rackGroup = null;
            selectedStatusInfo.rack = null;
            selectedStatusInfo.item = null;
        }
        else {
            selectedStatusInfo.rackGroup = rackGroupNo;
            selectedStatusInfo.rack = null;
            selectedStatusInfo.item = null;
        }

        this.setState({ selectedStatusInfo });
    }

    getRackInfoByRackNo = (rackNo) => {
        const rackGroups = this.state.rackGroups;
    
        for (let rackGroup of rackGroups) {
            if (rackGroup.racks.length > 0) {
                for (const rack of rackGroup.racks) {
                    if (rack.rackNo === rackNo) {
                        return rack;
                    }
                }
            }
        }
    
        return null;
    }

    getItemInfoByItemNo = (itemNo) => {
        const itemList = this.state.itemList;

        for (let item of itemList) {
            if (item.itemNo === itemNo) {
                return item;
            }
        }

        return null;
    }

    selectRackFromApp = (rackNo) => {
        if (this.state.thermalView) {
            return;
        }

        const rack = this.getRackInfoByRackNo(rackNo);

        if (rack !== null) {
            const selectedStatusInfo = { ...this.state.selectedStatusInfo };

            selectedStatusInfo.rackGroup = rack.rackGroupNo;
            selectedStatusInfo.rack = rack;
            selectedStatusInfo.item = null;
            this.setVisiblePopups(Main.menu.signalDeviceInfo, false);
            this.setVisiblePopups(Main.menu.rackInfo, true);

            this.setState({ selectedStatusInfo, selectedRackInfo: rack });
        }
    }

    selectItemFromApp = (itemNo, type) => {
        if (this.state.thermalView) {
            return;
        }

        const item = this.getItemInfoByItemNo(itemNo);
        const rack = this.getRackInfoByRackNo(item.rackNo);

        if (item !== null) {
            const selectedStatusInfo = { ...this.state.selectedStatusInfo };

            selectedStatusInfo.rackGroup = rack.rackGroupNo;
            selectedStatusInfo.rack = rack;
            selectedStatusInfo.item = item;
            this.setVisiblePopups(Main.menu.rackInfo, false);
            this.setVisiblePopups(Main.menu.signalDeviceInfo, true);

            if (!this.state.visiblePopups[Main.menu.statusInfo]) {
                this.setVisiblePopups(Main.menu.statusInfo, true);
            }

            if (this.wsMgr) {
                if (type === 'alarm') {
                    this.wsMgr.showAlarm(rack.rackNo, itemNo);
                }
                else {
                    this.wsMgr.selectItem(itemNo);
                }
            }

            this.setState({ selectedStatusInfo, selectedItemInfo: item });
        }
    }

    setSelectedRack = (rack) => {
        const selectedStatusInfo = { ...this.state.selectedStatusInfo };

        if (rack.rackNo === this.state.selectedStatusInfo.rack?.rackNo) {
            selectedStatusInfo.rack = null;
            selectedStatusInfo.item = null;
        }
        else {
            selectedStatusInfo.rack = rack;
            selectedStatusInfo.item = null;
            this.setVisiblePopups(Main.menu.signalDeviceInfo, false);
            this.setVisiblePopups(Main.menu.rackInfo, true);

            if (this.wsMgr) {
                this.wsMgr.selectRack(rack.rackNo);
            }
        }

        this.setState({ selectedStatusInfo, selectedRackInfo: rack });
    }

    setSelectedRackItem = (item, e) => {
        e.stopPropagation();
        const selectedStatusInfo = { ...this.state.selectedStatusInfo };

        if (item.itemNo === this.state.selectedStatusInfo.item?.itemNo) {
            selectedStatusInfo.item = null;
        }
        else {
            selectedStatusInfo.item = item;
            this.setVisiblePopups(Main.menu.rackInfo, false);
            this.setVisiblePopups(Main.menu.signalDeviceInfo, true);

            if (this.wsMgr) {
                this.wsMgr.selectItem(item.itemNo);
            }
        }

        this.setState({ selectedStatusInfo, selectedItemInfo: item });
    }

    setSelectedAlarm = (alarm) => {
        this.selectItemFromApp(alarm.itemNo, 'alarm');
        this.setState({ selectedAlarmInfo: alarm });
    }

    handleAutoRotation = () => {
        this.setState({ autoRotation: !this.state.autoRotation });
    }

    handlePersonalView = (personalView) => {
        this.setVisiblePopups(Main.menu.all, false);
        this.setState({ personalView: personalView });

        if (this.wsMgr) {
            this.wsMgr.setViewMode(personalView);
        }
    }

    handleThermalData = (isShow) => {
        this.setVisiblePopups(Main.menu.all, false);
        this.setState({ thermalView: isShow });

        if (this.wsMgr) {
            this.wsMgr.showThermalData(this.state.selectedDataCenter.dataCenterNo, isShow);
        }
    }

    closePopup() {
        if (this.wsMgr) {
            this.wsMgr.closePopup();
        }
    }

    showFacilityInfo = async (facilityNo) => {
        const [imagePath, message] = await MainController.requestFacilityInfo(facilityNo);

        if (imagePath === null) {
            // 설비 정보 없음
            this.setState({ facilityImagePath: null, showFacilityInfoPopup: true });
        }
        else {
            this.setState({ facilityImagePath: imagePath, showFacilityInfoPopup: true });
        }
    }
    
    render() {
        const visiblePopups = { ...this.state.visiblePopups };
        const popupUI = this.setPopupUI(visiblePopups);

        return (
            <>
            <div style={{ width: '100vw', height: '100vh', background: 'transparent' }}>
                <NavigationBar
                    setVisiblePopups={this.setVisiblePopups}
                    visiblePopups={this.state.visiblePopups}
                    handleModalPopup={this.handleModalPopup}
                    showMyPagePopup={this.state.showMyPagePopup}
                    showAssets3DInfoPopup={this.state.showAssets3DInfoPopup}
                    personalView={this.state.personalView}
                    thermalView={this.state.thermalView}
                    selectedDataCenter={this.state.selectedDataCenter}
                />
                <Toolbar
                    getWebSocket={this.props.getWebSocket}
                    autoRotation={this.state.autoRotation}
                    handleAutoRotation={this.handleAutoRotation}
                    selectedDataCenter={this.state.selectedDataCenter}
                    personalView={this.state.personalView}
                    handlePersonalView={this.handlePersonalView}
                    thermalView={this.state.thermalView}
                    handleThermalData={this.handleThermalData}
                />
                {
                    // (임시)현재 박달국사에만 데이터가 있으므로
                    this.state.selectedDataCenter.dataCenterNo === 1 &&
                        <AlarmInfo
                            sensorAlarms={this.state.sensorAlarms}
                            itemList={this.state.itemList}
                            rackGroups={this.state.rackGroups}
                            selectedStatusInfo={this.state.selectedStatusInfo}
                            selectItem={this.selectItemFromApp}
                            handleModalPopup={this.handleModalPopup}
                            showAlarmDetailPopup={this.state.showAlarmDetailPopup}
                            setSelectedAlarm={this.setSelectedAlarm}
                        />
                }
                {popupUI}
            </div>
            {
                this.state.showMyPagePopup &&
                    <MyPage
                        handleModalPopup={this.handleModalPopup}
                        getWebSocket={this.props.getWebSocket}
                    />
            }
            {
                this.state.showRackDetailPopup &&
                    <RackDetailInfo
                        handleModalPopup={this.handleModalPopup}
                        selectedRackInfo={this.state.selectedRackInfo}
                    />
            }
            {
                this.state.showItemDetailPopup &&
                    <SignalDeviceDetailInfo
                        handleModalPopup={this.handleModalPopup}
                        selectedItemInfo={this.state.selectedItemInfo}
                        showConfirmDialog={this.showConfirmDialog}
                    />
            }
            {
                this.state.showAssets3DInfoPopup &&
                    <Assets3DInfo
                        handleModalPopup={this.handleModalPopup}
                        selectedDataCenter={this.state.selectedDataCenter}
                        showConfirmDialog={this.showConfirmDialog}
                    />
            }
            {
                this.state.showViewImgPopup &&
                    <ViewImg
                        handleModalPopup={this.handleModalPopup}
                        showConfirmDialog={this.showConfirmDialog}
                    />
            }
            {
                this.state.showAlarmDetailPopup &&
                    <AlarmDetailInfo
                        handleModalPopup={this.handleModalPopup}
                        selectedItemInfo={this.state.selectedItemInfo}
                        selectedAlarmInfo={this.state.selectedAlarmInfo}
                        selectedDataCenter={this.state.selectedDataCenter}
                        getRackInfoByRackNo={this.getRackInfoByRackNo}
                        getItemInfoByItemNo={this.getItemInfoByItemNo}
                    />
            }
            {
                this.state.showFacilityInfoPopup &&
                    <FacilityInfo
                        handleModalPopup={this.handleModalPopup}
                        facilityImagePath={this.state.facilityImagePath}
                    />
            }
            {
                /* alert창 대신 사용 */
                this.state.confirmMessage.visible &&
                    <ConfirmDialog 
                        type={this.state.confirmMessage.type}
                        messages={this.state.confirmMessage.messages} 
                        buttons={this.state.confirmMessage.buttons} 
                        onClickButton={this.state.confirmMessage.onClickButton}
                        onCloseConfirmDialog={this.onCloseConfirmDialog}
                    />
            } 
            </>
        );
    }
}

export default withRouter(Main);