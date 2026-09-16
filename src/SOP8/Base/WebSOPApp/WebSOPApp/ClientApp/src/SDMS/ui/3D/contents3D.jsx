import React, { Component } from 'react';
import { Contents3DComponent } from '../../styled/contents3DStyled';
import { _3dMaster } from "./utility/_3dMaster";

class Contents3D extends Component {
    constructor(props) {
        super(props);

        this.ref3D = React.createRef();
        this.refBuildingGroupLabels = React.createRef();
        this.refBuildingLabels = React.createRef();
        this.refEquipZoneLabels = React.createRef();

        this.state = {
            loading: false,
            prevInstance: this,
            prevProps: props
        };

        this._3dMaster = new _3dMaster(
            Contents3D.timelog,
            this.ref3D,
            this.refBuildingGroupLabels,
            this.refBuildingLabels,
            this.refEquipZoneLabels,
            this._setState,
            this.getState,
            this
        );
    }

    componentDidMount() {
        window.progressbar = this;
        this.props.set3dMaster(this._3dMaster);
        const buildingGroupList = this.getBuildingGroupList();

        if (buildingGroupList?.model) {
            this._3dMaster.initialize(buildingGroupList);
            
            this.resizeMethod = () => Contents3D.onWindowResize(this._3dMaster.camera, this._3dMaster.renderer, this._3dMaster);
            window.addEventListener('resize', this.resizeMethod, false);
            window.addEventListener('keydown', this.onKeyDown, false);
        }

        if (this._3dMaster) {
            this._3dMaster.checkAlarm(this.props.selectedAlarm, this.props.sensorAlarms);
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

    componentDidUpdate(prevProps) {
        this._3dMaster.checkVisibleSensorTypes();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.resizeMethod);
        window.removeEventListener('keydown', this.onKeyDown);
        //this._3dMaster.detach3D();
    }

    static getDerivedStateFromProps(props, state) {
        if (props === state.prevProps) {
            return state;
        }

        const _this = state.prevInstance;

        if (state.loading === false) {
            if (props.isEditMode !== state.prevProps.isEditMode) {
                _this._3dMaster.changeCamera(props.isEditMode);
                return Contents3D.getStateFromProps(props, state, _this);
            }
            else {
                _this._3dMaster.checkAlarm(props.selectedAlarm, props.sensorAlarms);

                if (_this._3dMaster.checkCurrentModel(props.currentModel)) {
                    return Contents3D.getStateFromProps(props, state, _this);
                }
            }
        }

        return Contents3D.getStateFromProps(props, state, _this);
    }

    static getStateFromProps(props, state, _this) {
        return {
            loading: state.loading,
            prevInstance: _this,
            prevProps: props
        }
    }

    static onWindowResize(camera, renderer, _3dmaster) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        _3dmaster.correctControls();
    }

    getBuildingGroupList() {
        const siteNo = this.props.currentModel.currentSiteNo;
        const siteBuildingGroupList = this.props.siteBuildingGroupList;

        if (siteNo && siteBuildingGroupList) {
            return siteBuildingGroupList[siteNo];
        }

        return null;
    }

    getState = () => {
        return this.state;
    }

    onClick = (event) => {
        if (this._3dMaster) {
            this._3dMaster.onClick(event);
        }
    }

    onMouseMove = (event) => {
        const e = {
            nativeEvent: {
                offsetX: event.clientX,
                offsetY: event.clientY
            }
        }

        this._3dMaster.onMouseMove(e);
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
                <div ref={this.refBuildingGroupLabels} className={'buildingGroup'}>
                </div>
                <div ref={this.refBuildingLabels} className={'building'}>
                </div>
                <div ref={this.refEquipZoneLabels} className={'equipZone'}>
                </div>
            </Contents3DComponent>
        )
    }
}
export default Contents3D;