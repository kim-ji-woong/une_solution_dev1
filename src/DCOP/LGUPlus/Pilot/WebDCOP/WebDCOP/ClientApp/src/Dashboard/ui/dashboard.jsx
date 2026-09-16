import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { DashboardComponent } from '../styled/dashboardStyled';
import { DashboardController } from '../services/dashboardController';
import DataCenterInfo from './dataCenterInfo';
import AlarmStatus from './alarmStatus';
import Map from './map';
import PowerSituation from './powerSituation';
import ChangeManagement from './changeManagement';
import DashboardResource from '../resource/id';
import store from '../../Root/store';
import ProjectResource from '../../Root/resource/id';
import wsManager from '../../Root/services/wsManager';
import ConfirmDialog from '../../Common/ui/confirmDialog';

class Dashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dataCenterList: [],
            selectedRegionNo: -1,  // 선택된 지역
            selectedCenterNo: -1,  // 선택된 국사
            targetPolygons: [],    // 국사가 존재하는 지역코드

            confirmMessage: {
                visible: false,
                type: null,
                messages: [""],
                buttons: ["확인"],
                onClickButton: null
            },
        }
    }

    componentDidMount() {
        this.initDataCenterList();
        this.initWebSocket();
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

    setSelectedRegion = (data) => {
        if (data === this.state.selectedRegionNo) {
            this.setState({ selectedRegionNo: -1, selectedCenterNo: -1 });
        }
        else {
            this.setState({ selectedRegionNo: data });
        }
    }

    setSelectedCenter = (data, e) => {
        e.stopPropagation();
        
        store.dispatch({ type: 'SELECTED_DATA_CENTER', selectedDataCenter: data });

        if (this.wsManager) {
            this.wsManager.loadDataCenter(data.dataCenterNo);
        }

        this.props.history.push(ProjectResource.path.main);
    }

    getMapCodeByRegionNo = (regionNo) => {
        const coordinates = DashboardResource.coordinates;

        for (let data in coordinates) {
            if (coordinates[data].id === regionNo) {
                return coordinates[data].name;
            }
        }
    }

    initDataCenterList = async () => {
        const [result, message] = await DashboardController.requestDataCenterList();

        if (result) {
            let targetPolygons = [];
            for (let data of result) {
                if (data.dataCenters.length > 0) {
                    const target = this.getMapCodeByRegionNo(data.region.regionNo);
                    targetPolygons.push(target);
                }
            }

            this.setState({ dataCenterList: result, targetPolygons: targetPolygons });
        }
        else {
            this.showConfirmDialog(ProjectResource.dialogTypes.ERROR, [message], null, null);
        }
    }

    async initWebSocket() {
        const userInfo = await ProjectResource.initUserInfo();

        if (userInfo?.options?.webSocketPort) {
            this.wsManager = new wsManager(userInfo.options.webSocketPort);
            this.props.setWebSocket(this.wsManager);
        }
    }

    render() {
        return (
            <>
            <DashboardComponent>
                <section>
                    <DataCenterInfo
                        dataCenterList={this.state.dataCenterList}
                        selectedRegionNo={this.state.selectedRegionNo}
                        selectedCenterNo={this.state.selectedCenterNo}
                        setSelectedRegion={this.setSelectedRegion}
                        setSelectedCenter={this.setSelectedCenter}
                    />
                </section>
                <section>
                    <AlarmStatus /> 
                    <PowerSituation />
                    <ChangeManagement />
                </section>
                <Map
                    dataCenterList={this.state.dataCenterList}
                    selectedRegionNo={this.state.selectedRegionNo}
                    targetPolygons={this.state.targetPolygons}
                />
            </DashboardComponent>
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

export default withRouter(Dashboard);