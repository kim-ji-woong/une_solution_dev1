import React, { Component } from 'react';
import { Contents3DComponent } from '../../styled/contents3DStyled';
import { MovingManager } from "./utility/_3dMaster";

class Contents3D extends Component {
    constructor(props) {
        super(props);

        this.ref3D = React.createRef();

        this.state = {
            loading: false,
        };

        //this._3dMaster = new _3dMaster(Contents3D.timelog, this._setState, this.getState);
    }

    componentDidMount() {
        window.progressbar = this;
        const _3dOptions = this.props._3dOptions;

        if (_3dOptions?.outdoorModel) {
            //this._3dMaster.initialize(_3dOptions, this.props);
            
            this.resizeMethod = () => Contents3D.onWindowResize(this._3dMaster.camera, this._3dMaster.renderer);
            window.addEventListener('resize', this.resizeMethod, false);
            window.addEventListener('keydown', this.onKeyDown, false);
        }

        // 하단 메뉴 버튼 관련
        /*this.popupBtm();

        this.fakeWallManager.setEditModeManager(this.props.editModeManager);
        
        if (this.props.editModeManager) {
            this.props.editModeManager.setContents3D(this);
        }

        if (this.textPOIManager && this.props.site3dOptions && this.props.currentSiteID) {
            this.textPOIManager.updateWorker(this.props.site3dOptions[this.props.currentSiteID]);
        }

        this.equipZoneAreaManager.setEditModeManager(this.props.editModeManager);*/
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.resizeMethod);
        window.removeEventListener('keydown', this.onKeyDown);
        //this._3dMaster.detach3D();
    }

    getState = () => {
        return this.state;
    }

    onClick = (event) => {
    }

    onMouseMove = (event) => {
    }

    _setState = (obj) => {
        this.setState(obj);
    }

    static timelog(log) {
        const now = new Date();
        const time = now.getMinutes() + ":" + now.getSeconds();
        console.log(time + " : " + log);
    }

    render() {
        return(
            <Contents3DComponent>
                <div ref={this.ref3D} onClick={this.onClick} onMouseMove={this.onMouseMove}>
                </div>
            </Contents3DComponent>
        )
    }
}
export default Contents3D;