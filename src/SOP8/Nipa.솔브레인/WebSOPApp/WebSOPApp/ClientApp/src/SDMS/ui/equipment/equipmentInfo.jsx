import React, { useState, useEffect } from 'react';
import { EquipmentInfoComponent, EquipmentToggleSwitchComponent, EquipmentButtonComponent } from '../../styled/sdmsPopupsStyled';
import Icon from '../../../Common/components/Icon/Icon';
import ToggleSwitch from '../../../Common/ui/toggleSwitch';
import { PoiManager } from '../3D/poi/poiManager';
import SdmsResource from '../../resource/id';
import { getProjectTypeState } from '../../../Root/resource/projectType';

function EquipmentInfo(props) {
    const T8_1 = 116;
    const Mode_Equipment = "equipment";
    const Mode_Electric = "electric";

    const Code_Pre = 300701;
    const Code_Post = 300702;
    const Code_Power = 300703;
    const projectTypeState = getProjectTypeState();
    const isFacilityProject = projectTypeState.isFacilityProject;
    const defaultMenuType = projectTypeState.isPower ? Mode_Electric : Mode_Equipment;

    const [menuType, setMenuType] = useState(defaultMenuType);
    const [isChecked, setIsChecked] = useState(true);    

    const [selectedZoneID, setSelectedZoneID] = useState(null);

    const [selectedFcltyID, setSelectedFcltyID] = useState(null);

    const isFaModelMatchedMenu = (faModel, targetMenuType) => {
        if (!faModel) {
            return false;
        }

        if (targetMenuType === Mode_Equipment) {
            return faModel.fclty_type_code === Code_Pre || faModel.fclty_type_code === Code_Post;
        }

        if (targetMenuType === Mode_Electric) {
            return faModel.fclty_type_code === Code_Power;
        }

        return false;
    };

    const getDefaultZoneNo = (faModel) => {
        if (!faModel || faModel.buld_sn !== T8_1) {
            return null;
        }

        const zone = faModel.zoneData?.[0];
        return zone?.zone_sn ?? null;
    };


    useEffect(() => {
        setMenuType(defaultMenuType);
    }, [defaultMenuType]);

    useEffect(() => {
        const faModels = props.faModel ?? [];
        if (faModels.length === 0) {
            return;
        }

        const selectedFaModel = faModels.find(x => x.gltf_fclty_zone_model_sn === props.selFcltyInfo.fcltyNo);
        if (isFaModelMatchedMenu(selectedFaModel, menuType)) {
            return;
        }

        const nextFaModel = faModels.find(x => isFaModelMatchedMenu(x, menuType));
        if (!nextFaModel) {
            return;
        }

        onClickFclty(nextFaModel.gltf_fclty_zone_model_sn, getDefaultZoneNo(nextFaModel));
    }, [menuType, props.faModel, props.selFcltyInfo.fcltyNo]);

    useEffect(() => {

        // 외부 모델링 선택으로 인한 리스트 UI 변경
        setSelectedFcltyID(props.selFcltyInfo.presvNo);

    }, [props.selFcltyInfo.presvNo]);

    const getFcltyListUI = () => {
        const fcltyListUI = [];

        const faModels = props.faModel;
        const selFcltyInfo = props.selFcltyInfo;

        if (faModels?.length > 0) {
            for (const faModel of faModels) {

                // 메뉴에 따른 설비 목록 표시
                if ((menuType === Mode_Equipment && faModel.fclty_type_code === Code_Power) ||
                    (menuType === Mode_Electric && (faModel.fclty_type_code === Code_Pre || faModel.fclty_type_code === Code_Post))) {
                    continue;
                }

                let className = "";
                // 선택 여부
                if (faModel.gltf_fclty_zone_model_sn === selFcltyInfo.fcltyNo) {
                    className = "selected";
                }

                let zoneNo = null;

                // T8-1 전체 뷰 없음 >> 1층으로 이동
                if (faModel.buld_sn === T8_1)
                {
                    const zoneData = faModel.zoneData;
                    if (zoneData?.length > 0) {
                        const zone = zoneData[0];
                        zoneNo = zone.zone_sn;
                    }
                }

                fcltyListUI.push(
                    <button
                        key={`fclty-btn-${faModel.gltf_fclty_zone_model_sn}`}
                        className={className}
                        onClick={() => onClickFclty(faModel.gltf_fclty_zone_model_sn, zoneNo)}
                    >
                        {faModel.buildingDisplayName} ({faModel.typeName})
                    </button>
                );
            }
        }

        return fcltyListUI;
    }

    const onClickFclty = (fcltyNo, zoneNo) => {
        const value = {};
        value.fcltyNo = fcltyNo;
        value.zoneNo = zoneNo;

        props.setFcltyInfo(value);
    }

    const onClickFcltyZone = (zoneNo) => {
        props.setFcltyZone(zoneNo);
    }

    const onSelectFcltyItem = (fcltyNo) => {
        if (selectedFcltyID !== fcltyNo)
            // 목록 클릭 효과
            setSelectedFcltyID(fcltyNo);
        else {
            // 목록 클릭 효과 해제
            setSelectedFcltyID(null);
            // POI 선택 해제
            props.onSelectFcltyItem(null);
            return;
        }

        // 부모 전달 >> 3D 관련 클릭 효과 전달
        props.onSelectFcltyItem(fcltyNo);
    }

    const getZoneListUI = () => {
        const zoneListUI = [];

        const faModels = props.faModel;
        const selFcltyInfo = props.selFcltyInfo;

        if (faModels?.length > 0 /*&& selFcltyInfo.fcltyNo !== null*/) {
            const faModel = faModels.find(x => x.gltf_fclty_zone_model_sn === selFcltyInfo.fcltyNo);
            if (faModel) {
                for (const zone of faModel.zoneData) {
                    const isOpen = selectedZoneID === zone.zone_sn;
                    let fcltyCount = 0;

                    const treeClass = `tree${isOpen ? ' on' : ''}`;
                    const direction = isOpen ? 'bottom' : 'right';

                    const alarmSensorNoMaps = props._3dMaster?.poiManager?.getAlarmSensorNos(zone.zone_sn);

                    const fcltyList = [];
                    if (props.fcltyInfos?.length > 0) {
                        for (const fclty of props.fcltyInfos) {
                            if (zone.zone_sn !== fclty.zone_sn ||
                                (menuType === Mode_Equipment && fclty.fclty_ty_code === Code_Power) ||
                                (menuType === Mode_Electric && (fclty.fclty_ty_code === Code_Pre || fclty.fclty_ty_code === Code_Post))) {
                                continue;
                            }

                            fcltyCount++;
                            const selectClass = selectedFcltyID === fclty.fclty_presv_sn ? "on" : "";

                            let alarmIcon = null;

                            if (alarmSensorNoMaps && fclty.sensor_sn !== null) {
                                const alarmSensor = alarmSensorNoMaps[fclty.sensor_sn];
                                if (alarmSensor) {
                                    alarmIcon = (<Icon.AlarmOnIcon />);
                                }
                                else {
                                    alarmIcon = (<Icon.AlarmOffIcon />);
                                }
                            }

                            fcltyList.push(
                                <li key={`fclty-${fclty.fclty_presv_sn}`} onClick={() => onSelectFcltyItem(fclty.fclty_presv_sn)}>
                                    <div className={selectClass}>
                                        <div>
                                            <Icon.MinusIcon size="xxxxxs" />
                                            <p>{fclty.fclty_presv_name}</p>
                                        </div>
                                        <span>
                                            {alarmIcon}
                                        </span>
                                    </div>
                                </li>
                            );
                        }
                    }

                    zoneListUI.push(
                        <li key={`zone-${zone.zone_sn}`}>
                            <div
                                className={`zoneHeader${isOpen ? ' on' : ''}`}
                                onClick={() => setSelectedZoneID(isOpen ? null : zone.zone_sn)}
                            >
                                <Icon.Arrow size="xxxxxs" direction={direction} />
                                <p>{zone.zoneDisplayName} ({fcltyCount})</p>
                                <button
                                    className="moveBtn"
                                    onClick={(e) => { e.stopPropagation(); onClickFcltyZone(zone.zone_sn); }}
                                >
                                    이동
                                </button>
                            </div>

                            <ul id={`zoneItem_${zone.zone_sn}`} className={treeClass}>
                                {fcltyList}
                            </ul>
                        </li>
                    );
                }
            }
        }

        return zoneListUI;
    }

    const getZoneBtnUI = () => {
        const zoneBtnUI = [];

        const faModels = props.faModel;
        const selFcltyInfo = props.selFcltyInfo;

        if (faModels?.length > 0 && selFcltyInfo.fcltyNo !== null) {

            const faModel = faModels.find(x => x.gltf_fclty_zone_model_sn === selFcltyInfo.fcltyNo);
            if (faModel) {
                let className = '';
                if (selFcltyInfo.zoneNo === null)
                    className = 'selected';

                // T8-1 전체 뷰 없음
                if (faModel.buld_sn !== T8_1) {
                    zoneBtnUI.push(
                        <button
                            key={`zone-btn-all-${faModel.gltf_fclty_zone_model_sn}`}
                            className={className}
                            onClick={() => onClickFcltyZone(null)}
                        >
                            전체
                        </button>
                    );
                }             

                if (faModel.zoneData?.length > 0) {
                    for (const zone of faModel.zoneData) {
                        className = '';
                        if (zone.zone_sn === selFcltyInfo.zoneNo)
                            className = 'selected';

                        zoneBtnUI.push(
                            <button
                                key={`zone-btn-${zone.zone_sn}`}
                                className={className}
                                onClick={() => onClickFcltyZone(zone.zone_sn)}
                            >
                                {zone.zoneDisplayName}
                            </button>
                        );
                    }
                }
            }
        }

        return zoneBtnUI;
    }

    const onCheckedFlow = (value) => {
        setIsChecked(value);

        props.setFcltyFlow(value);
    }

    const onClickMenuType = (menu) => {
        if (menu === menuType) {
            return;
        }

        const faModels = props.faModel;
        if (faModels?.length > 0) {
            for (const faModel of faModels) {

                if ((menu === Mode_Equipment && (faModel.fclty_type_code === Code_Pre || faModel.fclty_type_code === Code_Post)) ||
                    (menu === Mode_Electric && faModel.fclty_type_code === Code_Power)) {
                    let zoneNo = null;

                    if (faModel.buld_sn === T8_1) {
                        const zoneData = faModel.zoneData;
                        if (zoneData?.length > 0) {
                            const zone = zoneData[0];
                            zoneNo = zone.zone_sn;
                        }
                    }

                    onClickFclty(faModel.gltf_fclty_zone_model_sn, zoneNo);
                    break;
                }
            }
        }

        setMenuType(menu);

        props.setVisiblePopups(SdmsResource.ID.menu.equipmentChartInfo, false);
        props.setVisiblePopups(SdmsResource.ID.menu.electricChartInfo, false);
    }

    const getFlowSwitchUI = () => {
        let flowSwitchUI = null;

        const faModels = props.faModel;
        const selFcltyInfo = props.selFcltyInfo;

        if (faModels?.length > 0 && selFcltyInfo.fcltyNo !== null) {
            const faModel = faModels.find(x => x.gltf_fclty_zone_model_sn === selFcltyInfo.fcltyNo);

            if (faModel?.modelNode?.userData?.animationModels?.length > 0) {
                flowSwitchUI = (<EquipmentToggleSwitchComponent>
                    <p>공정 흐름도</p>
                    <ToggleSwitch
                        leftcolor="#878787"
                        rightcolor="#ffffff"
                        leftbgcolor="#787C87"
                        rightbgcolor="#E5ECFF"
                        circleColor="#0C2CCA"
                        type="normal"
                        setChecked={onCheckedFlow}
                        isChecked={isChecked}
                        isDisabled={false}
                    />
                </EquipmentToggleSwitchComponent>);
            }
        }

        return flowSwitchUI;
    }

    const setVisiblePoi = (sensorType) => {
        if (sensorType === PoiManager.Equipment_Predict) {
            // AI 설비 예지보전과 AI 전력분석 POI는 함께 Visible
            props.visibleSensorTypes[PoiManager.Equipment_Power] = !props.visibleSensorTypes[sensorType];
        }

        props.setVisiblePoi(sensorType, !props.visibleSensorTypes[sensorType]);
    };

    return (
        <>
            <EquipmentInfoComponent>
                {!isFacilityProject &&
                    <ul className='menuTypeWrap'>
                        <li className={menuType === Mode_Equipment ? 'on' : null} onClick={() => onClickMenuType(Mode_Equipment)}>
                            AI 설비 예지보전
                        </li>
                        <li className={menuType === Mode_Electric ? 'on' : null} onClick={() => onClickMenuType(Mode_Electric)}>
                            AI 전력 분석
                        </li>
                    </ul>
                }
                {
                    <div className='content'>
                        <div className='titleWrap'>
                            <h2>POI 뷰어</h2>
                            <div className='buttonWrap'>
                                <button
                                    className={props.visibleSensorTypes[PoiManager.Equipment_Predict] ? 'on' : null}
                                    onClick={() => setVisiblePoi(PoiManager.Equipment_Predict)}
                                    data-tooltip="AI 예측분석"
                                >
                                    <Icon.StatusInfoFacility size={"xxs"} />
                                </button>
                                <button 
                                    className={props.visibleSensorTypes[PoiManager.EquipZoneName] ? 'on' : null} 
                                    onClick={() => setVisiblePoi(PoiManager.EquipZoneName)}
                                    data-tooltip="구역명"
                                >
                                    <Icon.StatusInfoEquipZoneName size={"xxxs"} />
                                </button>
                            </div>
                        </div>
                    <div className='scrollWrap'>                            
                        <div className='btnWrap'>
                            {/*
                                <button
                                    className="selected"
                                >
                                    T2-13 (초순수 전처리) 
                                    <Icon.AlarmOffIcon2 />
                                </button>
                                <button
                                    className=""
                                >
                                    T8-1 (초순수 후처리)
                                </button>
                            */}
                            {getFcltyListUI()}
                            </div>
                            <div className='treeWrap'>
                            <ul>
                                    {/*
                                        <div>
                                            <Icon.Arrow size="xxxxxs" direction={"right"} />
                                            <p>T2-13 1층 (00)</p>
                                            <button className='moveBtn'>이동</button>
                                        </div>

                                        <ul className='tree on'>
                                            <li>
                                                <div>
                                                    <Icon.MinusIcon size="xxxxxs" />
                                                    <p>설비 명</p>
                                                </div>
                                            </li>
                                            <li>
                                                <div className='on'>
                                                    <Icon.MinusIcon size="xxxxxs" />
                                                    <p>설비 명</p>
                                                </div>
                                            </li>
                                        </ul>
                                    */}
                                    {getZoneListUI()}
                                </ul>
                            </div>
                        </div>
                    </div>
                }
            </EquipmentInfoComponent>
            {
                getFlowSwitchUI()
            }
            <EquipmentButtonComponent>
                {/*
                <button>전체</button>
                <button>1층</button>
                <button className='selected'>2층</button>
                */}
                {getZoneBtnUI()}
            </EquipmentButtonComponent>
        </>
    );
}

export default EquipmentInfo;