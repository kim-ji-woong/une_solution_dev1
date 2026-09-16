import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { TitleBarComponent, MainTitleBarComponent } from '../styled/titleBarStyled';
import { AccountController } from '../../Account/services/accountController';
import ProjectResource from '../../Root/resource/id';
import store from '../../Root/store';
import Clock from './clock';
import Weather from './weather';
import { MainController } from '../../Main/services/mainController';

class TitleBar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedDataCenter: store.getState().selectedDataCenter,
            weatherDatas: {}
        }
    }

    componentDidMount() {
        // 로그인 세션 감시 타이머 
        AccountController.StartWatchTimer();

        this.unsubscribe = store.subscribe(function () {
            let data = store.getState();

            this.changeSelectedDataCenter(store.getState());   
            
            if (data.actionType === 'WEATHER_CURRENT') {
                this.changeWeatherDatas(data.weatherDatas);            
            }
        }.bind(this));

        if (Object.keys(this.state.selectedDataCenter).length === 0) {
            this.props.history.push(ProjectResource.path.dashboard);
        }
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    async changeSelectedDataCenter(data) {
        if (data === null || data === undefined) {
            this.props.history.push(ProjectResource.path.dashboard);
        }

        this.setState({ selectedDataCenter: data.selectedDataCenter })
    }

    async changeWeatherDatas(data) {
        if (data !== null || data !== undefined) {
            this.setState({ weatherDatas: data });
        }
    }

    getCoordinate() {
        const dataCenter = this.state.selectedDataCenter;

        if (dataCenter?.dataCenterNo && dataCenter.dataCenterNo ==! ProjectResource.dataCenter.bakdal) {
            return;
        }

        const latitude = dataCenter.latitude;
        const longitude = dataCenter.longitude;

        const latDMS = this.toDMS(latitude, true);
        const lonDMS = this.toDMS(longitude, false);

        return latDMS + " " + lonDMS;
    }

    toDMS = (coordinate, isLatitude) => {
        const absolute = Math.abs(coordinate);
        const degrees = Math.floor(absolute);
        const minutesNotTruncated = (absolute - degrees) * 60;
        const minutes = Math.floor(minutesNotTruncated);
        const seconds = Math.floor((minutesNotTruncated - minutes) * 60);
    
        const direction = isLatitude
            ? (coordinate >= 0 ? "N" : "S")
            : (coordinate >= 0 ? "E" : "W");
    
        return `${degrees}°${minutes}'${seconds}"${direction}`;
    }

    render() {
        const path = window.location.pathname;
    
        return path === ProjectResource.path.dashboard ? (
            <TitleBarComponent>
                <h1>Digital twin Central Office Platform</h1>
            </TitleBarComponent>
        ) : (
            <MainTitleBarComponent>
                <div className='UI_Section titleWrap'>
                    <h1>{this.state.selectedDataCenter.dataCenterName}</h1>
                    <p>{this.getCoordinate()}</p>
                </div>
                <div className='UI_Section sideWrap'>
                    <Clock />
                    <Weather
                        weatherDatas={this.state.weatherDatas}
                        selectedDataCenter={this.state.selectedDataCenter}
                    />
                </div>
            </MainTitleBarComponent>
        );
    }
}

export default withRouter(TitleBar);