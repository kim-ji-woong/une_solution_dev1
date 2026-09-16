import React, { Component } from 'react';
import { ToolBarComponent, PersonalViewComponent, ThermalViewComponent } from '../styled/mainStyled';
import ProjectResource from '../../Root/resource/id';

class Toolbar extends Component {
    constructor(props) {
        super(props);

        this.wsMgr = this.props.getWebSocket();
    }

    onClickGoHome = () => {
        if (this.wsMgr) {
            this.wsMgr.goOriginViewport();
        }
    }

    onClickZoom = (zoom) => {
        if (this.wsMgr) {
            this.wsMgr.zoom(zoom);
        }
    }

    onClickAutoRotation = () => {
        const autoRotation = this.props.autoRotation;
        this.props.handleAutoRotation();

        if (this.wsMgr) {
            this.wsMgr.autoRotation(!autoRotation);
        }
    }

    onClick360Camera = () => {
        const userInfo = ProjectResource?.getUserInfo();

        if (this.wsMgr && this.props.selectedDataCenter) {
            this.wsMgr.open360Camera(this.props.selectedDataCenter.dataCenterNo, userInfo.options._360Camera);
        }
    }

    getToolbarUI = () => {
        if (this.props.personalView) {
            return (
                <PersonalViewComponent className='UI_Section'>
                    <p>1인칭 모드</p>
                    <button onClick={() => this.props.handlePersonalView(false)}>1인칭 모드 나가기 버튼</button>
                </PersonalViewComponent>
            );
        }
        else if (this.props.thermalView) {
            return (
                <ThermalViewComponent className='UI_Section'>
                    <p>전체온도 가시화</p>
                    <button onClick={() => this.props.handleThermalData(false)}>전체온도 가시화 버튼</button>
                </ThermalViewComponent>
            );
        }
        else {
            return (
                <ToolBarComponent className='UI_Section'>
                    <ul>
                        <li className='goHome'><button onClick={() => this.onClickGoHome()}>초기화면으로 이동</button></li>
                        <li className='zoomIn'><button onClick={() => this.onClickZoom(1)}>확대</button></li>
                        <li className='zoomOut'><button onClick={() => this.onClickZoom(-1)}>축소</button></li>
                        <li className='rotation'><button onClick={() => this.onClickAutoRotation()}>자동회전</button></li>
                        <li className='camera360'><button onClick={() => this.onClick360Camera()}>360도 카메라</button></li>
                        <li className='viewpoint'><button onClick={() => this.props.handlePersonalView(true)}>시점 변경</button></li>
                        <li className='temperature'><button onClick={() => this.props.handleThermalData(true)}>온도 모드</button></li>
                    </ul>
                </ToolBarComponent>
            );
        }
    }

    render() {
        return (
            <>
                {this.getToolbarUI()}
            </>
        );
    }
}

export default Toolbar;