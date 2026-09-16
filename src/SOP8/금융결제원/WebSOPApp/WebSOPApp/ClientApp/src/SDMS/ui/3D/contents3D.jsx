import React, { Component } from 'react';
import { Contents3DComponent } from '../../styled/contents3DStyled';
import { _3dMaster } from "./utility/_3dMaster";
import SdmsResource from '../../resource/id';
import DoorIcon from './utility/door/doorIcon';
import { DoorPointManager } from './utility/doorPointManager';

class Contents3D extends Component {
    // 아무 입력없이 몇 밀리세컨드가 지나면 카메라를 회전시킬 것인가?
    //static CAMERA_IDLE_TIME = 1000 * 600;
    // 즉시회전 버튼을 Click한 뒤 마우스가 화면을 빠져나가는 동안
    // 즉시회전이 풀리지 않도록 한다.
    static AUTO_ROTATION_IDLE_TIME = 3 * 1000;

    static initAlarmOptions = false;
    static tempAlarms = [];

    constructor(props) {
        super(props);

        this.ref3D = React.createRef();
        this.refBuildingGroupLabels = React.createRef();
        this.refBuildingLabels = React.createRef();
        this.refEquipZoneLabels = React.createRef();
        this.refEditableInput = React.createRef();
        this.refFacilityTooltip = React.createRef();
        this.refFcltyLabels = React.createRef();
        this.refTpsLabels = React.createRef();

        this.state = {
            loading: false,
            prevInstance: this,
            editableInput: false,
            prevProps: props,
            // 각 코드별로 UL 열림/닫힘 상태 보관
            expandedCode: null,
            //idleTime: Contents3D.CAMERA_IDLE_TIME / 60000,         // 기존 CAMERA_IDLE_TIME 값
            //useIdleTime: true,
            popupMenu: null,
            visibleDoorPoint: false,
            camera: null,
            doorPointList: [],
            doorPointFloorCount: null
        };

        this._3dMaster = new _3dMaster(
            Contents3D.timelog,
            this.ref3D,
            this.refBuildingGroupLabels,
            this.refBuildingLabels,
            this.refEquipZoneLabels,
            this.refFacilityTooltip,
            this.refFcltyLabels,
            this.refTpsLabels,
            this._setState,
            this.getState,
            this
        );

        this.doorPointManager = new DoorPointManager(this);

        this.mouseDownPos = { x: null, y: null };
    }

    normalize = (s) => {
        return String(s ?? "")
            .toUpperCase()
            .replace(/\s+/g, "")
            .replace(/–/g, "-")
            .replace(/T0*(\d+)-0*(\d+)/, "T$1-$2")
            .replace(/T0*(\d+)/, "T$1");
    };

    componentDidMount() {
        window.progressbar = this;
        this.props.set3dMaster(this._3dMaster);
        const buildingGroupList = this.getBuildingGroupList();

        // 부모에서 전달한 동일한 EditModeManager 인스턴스를 _3dMaster에 주입
        if (this.props.editModeManager) {
            this._3dMaster.editModeManager = this.props.editModeManager;
        }

        if (buildingGroupList?.model) {
            this._3dMaster.initialize(buildingGroupList);

            this.resizeMethod = () => Contents3D.onWindowResize(this._3dMaster.camera, this._3dMaster.renderer, this._3dMaster);
            this.onKeyDown = (e) => { this._3dMaster.onKeyDown(e); };

            window.addEventListener('resize', this.resizeMethod, false);
            window.addEventListener('keydown', this.onKeyDown, false);
        }

        if (this._3dMaster) {
            this._3dMaster.checkAlarm(this.props.selectedAlarm, this.props.sensorAlarms);
        }
    }

    componentDidUpdate(prevProps) {
        // editModeManager prop이 바뀌면 _3dMaster에 다시 주입
        if (prevProps.editModeManager !== this.props.editModeManager) {
            this._3dMaster.editModeManager = this.props.editModeManager || null;
        }

        this._3dMaster.checkVisibleSensorTypes();
        this._3dMaster.onPostUpdate(prevProps);
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
                _this._3dMaster.checkRoutes(props.accessRoutes);
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

    onMouseDoubleClick = (event) => {
        if (this._3dMaster && this.props.isEditMode && this.props.editMenu === SdmsResource.ID.menu.editMode_areaName) {
            this._3dMaster.onDoubleClick(event);
        }
    }

    onClick = (event) => {
        if (this._3dMaster) {
            this._3dMaster.onClick(event);
        }
    }

    onMouseDown = (event) => {
        this.mouseDownPos = {
            x: event.clientX,
            y: event.clientY
        };

        this.setState({ visibleDoorPoint: false });
    }

    onMouseUp = (event) => {
        const diffX = this.mouseDownPos.x - event.clientX;
        const diffY = this.mouseDownPos.y - event.clientY;

        if (diffX === 0 && diffY === 0) {
            // MouseDown 위치와 MouseUp 위치가 일치할 때에만 onClick()이 동작하도록 한다.
            this.onClick(event);
        }

        this.setState({ visibleDoorPoint: true });
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

    onWheel = (event) => {
        // 기본 스크롤 방지
        event.preventDefault();

        this.showDoorPoint(false);

        clearTimeout(this.zoomEndTimer);
        this.zoomEndTimer = setTimeout(() => {
            this.showDoorPoint(true);
        }, 300);
    }

    onDeletePoi() {
        this._3dMaster.deletePoi();
        this.setState({ popupMenu: null });
    }

    _setState = (obj) => {
        this.setState(obj);
    }

    static timelog(log) {
        const now = new Date();
        const time = now.getMinutes() + ":" + now.getSeconds();
        // console.log(time + " : " + log);
    }

    togglePanel = (code) => {
        this.setState(prev => ({
            expandedPanel: {
                ...prev.expandedPanel,
                [code]: !prev.expandedPanel?.[code],
            }
        }));
    };

    setDoorPointList(doorPointList, doorPointFloorCount = null, visible = null) {
        if (this.doorPointManager.isSamePointList(doorPointList) === false) {
            if (visible === null) {
                this.setState({ doorPointList, doorPointFloorCount });
            }
            else {
                this.setState({ doorPointList, doorPointFloorCount, visibleDoorPoint: visible });
            }
        }
    }

    showDoorPoint(visible, absolute = false) {
        if (absolute || this.state.visibleDoorPoint !== visible) {
            this.setState({ visibleDoorPoint: visible });
        }
    }

    render() {
        this._3dMaster.checkWorkerType();

        const editInputID = this.state.editableInput ? 'areaInput' : 'areaInputHidden';
        
        const popupMenu = this.state.popupMenu;

        /*const doorState = {
            type: 'default',      // default | alarm | disabled
            opened: true,         // true | false
            level: 'point',       // point | important
            isSelected: false     // true | false
        };*/

        return (
            <Contents3DComponent>
                {
                    /*<div
                        className='door'
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%'
                        }}
                    >
                        <DoorIcon
                            type={doorState.type}
                            opened={doorState.opened}
                            level={doorState.level}
                            selected={doorState.isSelected}
                        />
                    </div>*/
                }
                {
                    this.doorPointManager.getDoorPointList()
                    /*<ul
                        className='doorList'
                        style={{
                            position: 'absolute',
                            top: '60%',
                            left: '60%'
                        }}
                    >
                        <li><span>3</span></li>
                        <li className='blue'><span>5</span></li>
                        <li className='orange'><span>5</span></li>
                    </ul>*/
                }

                {
                    this.doorPointManager.getDoorPointFloorCount()
                    /*<div className='elevator'>
                        <span>00개 층 경유</span>
                    </div>*/
                }
                {
                    popupMenu &&
                        <div
                            className='deletePoiBtn'
                            style={{ position: 'absolute', top: popupMenu[1] + 'px', left: popupMenu[0] + 'px' }}
                        >
                        <button onClick={() => this.onDeletePoi()}>
                                삭제
                            </button>
                        </div>
                }

                <div ref={this.ref3D} /*onClick={this.onClick}*/ onMouseDown={this.onMouseDown} onMouseUp={this.onMouseUp} onMouseMove={this.onMouseMove} onDoubleClick={this.onMouseDoubleClick} onWheel={this.onWheel}>
                </div>
                <div ref={this.refBuildingGroupLabels} className={'buildingGroup'} hidden>
                </div>
                <div ref={this.refBuildingLabels} className={'building'} hidden>
                </div>
                <div ref={this.refEquipZoneLabels} className={'equipZone'} hidden>
                </div>
                <div ref={this.refFcltyLabels} className={'fclty'} hidden>
                </div>

                <div ref={this.refTpsLabels} className={'tps'} style={{ top: '50%', left: '50%', zIndex: 1 }} hidden>
                </div>

                <input
                    ref={this.refEditableInput}
                    type="text"
                    id={editInputID}
                />
            </Contents3DComponent>
        );
    }
}

export default Contents3D;