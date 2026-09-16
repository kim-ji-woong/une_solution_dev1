import React, { Component } from 'react';
import { Contents3DComponent } from '../../styled/contents3DStyled';
import { _3dMaster } from "./utility/_3dMaster";
import SdmsResource from '../../resource/id';
import Icon from '../../../Common/components/Icon/Icon';

class Contents3D extends Component {
    // 아무 입력없이 몇 밀리세컨드가 지나면 카메라를 회전시킬 것인가?
    static CAMERA_IDLE_TIME = 1000 * 600;
    // 즉시회전 버튼을 Click한 뒤 마우스가 화면을 빠져나가는 동안
    // 즉시회전이 풀리지 않도록 한다.
    static AUTO_ROTATION_IDLE_TIME = 3 * 1000;

    constructor(props) {
        super(props);

        this.ref3D = React.createRef();
        this.refBuildingGroupLabels = React.createRef();
        this.refBuildingLabels = React.createRef();
        this.refEquipZoneLabels = React.createRef();
        this.refEditableInput = React.createRef();
        this.refFacilityTooltip = React.createRef();
        this.refFcltyLabels = React.createRef();

        this.state = {
            loading: false,
            prevInstance: this,
            editableInput: false,
            prevProps: props,
            // 각 코드별로 UL 열림/닫힘 상태 보관
            expandedCode: null,
            idleTime: Contents3D.CAMERA_IDLE_TIME / 60000,         // 기존 CAMERA_IDLE_TIME 값
            useIdleTime: true,
        };

        this._3dMaster = new _3dMaster(
            Contents3D.timelog,
            this.ref3D,
            this.refBuildingGroupLabels,
            this.refBuildingLabels,
            this.refEquipZoneLabels,
            this.refFacilityTooltip,
            this.refFcltyLabels,
            this._setState,
            this.getState,
            this
        );

        this.allowedCodes = ["T5-1", "T6-2", "T6-3", "T10-1"];
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

    getBuildingGroupOptions = () => {
        const props = this.props;
        const directDatas = Array.isArray(props.spatialManager?.buildingDatas)
            ? props.spatialManager.buildingDatas
            : null;

        const groups = props.spatialManager?.buildingGroups;
        const fromGroups = groups
            ? Object.values(groups).flatMap(g => Array.isArray(g?.buildingDatas) ? g.buildingDatas : [])
            : [];

        const datas = directDatas ?? fromGroups;
        if (!datas || datas.length === 0) {
            return [{ value: "", label: "공장동 선택", disabled: true }];
        }

        const allowedNorm = new Set(this.allowedCodes.map(this.normalize));

        const hit = (item) => {
            const candidates = [
                String(item.buildingCode ?? ""),
                String(item.displayText ?? ""),
                String(item.name ?? "")
            ].map(this.normalize);

            return candidates.some(c =>
                allowedNorm.has(c) || [...allowedNorm].some(a => c.includes(a))
            );
        };

        const filtered = datas
            .filter(hit)
            .map(item => ({
                value: item.buildingNo,
                label: item.displayText || String(item.buildingCode || item.name || item.buildingNo),
            }));

        return [
            { value: "", label: "공장동 선택", disabled: true },
            ...filtered,
        ];
    };

    // code("T6-2")로 해당 옵션({value, label}) 찾기
    findOptionByCode = (code) => {
        const options = this.getBuildingGroupOptions().slice(1); // placeholder 제외
        const target = this.normalize(code);
        return options.find(o => this.normalize(o.label).includes(target)) || null;
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

        if (this._3dMaster.textPoiManager) {
            this._3dMaster.textPoiManager.updateWorker();
        }

        this._3dMaster.checkVisibleSensorTypes();

        if (prevProps.controlMode !== this.props.controlMode) {
            if (this.props.isEditMode === false && this.props.spatialManager) {
                if (this.props.controlMode === SdmsResource.controlMode.simulation && this.props.spatialManager.isIndoor(this.props.currentModel?.currentZoneNo, this.props.currentModel?.currentSiteNo) === false) {
                    this._3dMaster.setSimulationMode(true);
                }
                else if (prevProps.controlMode == SdmsResource.controlMode.simulation && this.props.spatialManager.isIndoor(this.props.currentModel?.currentZoneNo, this.props.currentModel?.currentSiteNo) === false) {
                    this._3dMaster.setSimulationMode(false);
                }
                
                // 설비모드 경우
                if (this.props.controlMode === SdmsResource.controlMode.equipment) {
                    this._3dMaster.checkCurrentModel(this.props.currentModel);
                }
            }
        }
        else if (prevProps.refreshFcltyInfo !== this.props.refreshFcltyInfo) {
            // 설비모드 정보 업데이트
            this._3dMaster.facilityManager.setFcltyModel(this.props.selFcltyInfo);
        }
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
    }

    onMouseUp = (event) => {
        const diffX = this.mouseDownPos.x - event.clientX;
        const diffY = this.mouseDownPos.y - event.clientY;

        if (diffX === 0 && diffY === 0) {
            // MouseDown 위치와 MouseUp 위치가 일치할 때에만 onClick()이 동작하도록 한다.
            this.onClick(event);
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

    // 빌딩 버튼 클릭: 값 전달 + 패널 단일 토글
    handleSelectBuilding = (code) => {
        const options = this.getBuildingGroupOptions();
        const opt = this.findOptionByCode(code);
        if (!opt) return;

        // 부모로 값 + 옵션 전달
        this.props.handleChangeBuildingGroup(opt.value, options);

        // 하나만 열리도록: 같은 코드면 닫고, 다르면 그 코드로 교체
        this.setState(prev => ({
            expandedCode: prev.expandedCode === code ? null : code
        }));
    };

    // li 선택: 부모에 area 전달 + 패널 닫기
    handleSelectArea = (area) => {
        this.props.handleChangeArea(area);
        this.setState({ expandedCode: null });
    };

    render() {
        this._3dMaster.checkWorkerType();

        const editInputID = this.state.editableInput ? 'areaInput' : 'areaInputHidden';
        const info = this.props.selectedSimulationInfo || {};

        // 4개의 시뮬레이션 버튼 블록 (T5-1, T6-2, T6-3, T10-1)
        const simBlocks = this.allowedCodes.map((code) => {
            const opt = this.findOptionByCode(code);
            const label = opt?.label || code;
            const buildingNo = opt?.value;
            const isSelected = String(info.buildingGroup) === String(opt?.value);
            const materialName = this.normalize(code).includes(this.normalize("T6-2")) ? "암모니아" : "무수불산";
            const isOpen = this.state.expandedCode === code;

            return (
                <div
                    key={code}
                    id={buildingNo != null ? String(buildingNo) : undefined}
                    className={`simulationBtn${isOpen ? ' open' : ''}`}
                >
                    <p><Icon.SimulationPanelIcon />{materialName}</p>
                    <button
                        className={isSelected ? 'selected' : ''}
                        onClick={() => this.handleSelectBuilding(code)}
                        disabled={!opt}
                        title={opt ? label : `${code} (데이터 없음)`}
                        aria-expanded={isOpen}
                        aria-controls={`sim-ul-${code}`}
                    >
                        {code}
                        <Icon.Arrow size={9} direction={"right"} fill={"grayscale.g500"} />
                    </button>
                    {/* <ul
                        id={`sim-ul-${code}`}
                        style={{ display: isOpen ? 'block' : 'none' }}
                    >
                        <li
                            className={info.area === "ISO 체결" && isSelected ? "selected" : ""}
                            onClick={() => this.handleSelectArea("ISO 체결")}
                        >
                            ISO 체결
                        </li>
                        <li
                            className={info.area === "저장 탱크" && isSelected ? "selected" : ""}
                            onClick={() => this.handleSelectArea("저장 탱크")}
                        >
                            저장 탱크
                        </li>
                    </ul> */}
                </div>
            );
        });

        return (
            <Contents3DComponent>
                <div ref={this.ref3D} /*onClick={this.onClick}*/ onMouseDown={this.onMouseDown} onMouseUp={this.onMouseUp} onMouseMove={this.onMouseMove} onDoubleClick={this.onMouseDoubleClick}>
                </div>
                <div ref={this.refBuildingGroupLabels} className={'buildingGroup'} hidden>
                </div>
                <div ref={this.refBuildingLabels} className={'building'} hidden>
                </div>
                <div ref={this.refEquipZoneLabels} className={'equipZone'} hidden>
                </div>
                <div ref={this.refFcltyLabels} className={'fclty'} hidden>
                </div>

                <input
                    ref={this.refEditableInput}
                    type="text"
                    id={editInputID}
                />

                {
                    this.props.controlMode === SdmsResource.controlMode.simulation &&
                        simBlocks
                }

                <div ref={this.refFacilityTooltip} className='equipmentBtn' hidden>
                    <Icon.EquipmentPOIIcon />
                    <div>
                        <p>AI 설비 예지보전</p>
                        <p>초순수 전처리</p>
                    </div>
                </div>
            </Contents3DComponent>
        );
    }
}

export default Contents3D;