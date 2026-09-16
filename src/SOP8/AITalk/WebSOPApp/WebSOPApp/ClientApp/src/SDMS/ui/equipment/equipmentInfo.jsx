import React, { useState } from 'react';
import { EquipmentInfoComponent, EquipmentToggleSwitchComponent, EquipmentButtonComponent } from '../../styled/sdmsPopupsStyled';
import Icon from '../../../Common/components/Icon/Icon';
import ToggleSwitch from '../../../Common/ui/toggleSwitch';

function EquipmentInfo(props) {
    const [menuType, setMenuType] = useState('equipment');
    const [isChecked, setIsChecked] = useState(true);

    const getFcltyListUI = () => {
        const fcltyListUI = [];

        const faModels = props.faModel;
        const selFcltyInfo = props.selFcltyInfo;

        if (faModels?.length > 0) {
            for (const faModel of faModels) {

                let className = "";
                // 선택 여부
                if (faModel.gltf_fclty_zone_model_sn === selFcltyInfo.fcltyNo) {
                    className = "selected";
                }

                // 알람 여부 파악 필요
                // <Icon.AlarmOffIcon2 />

                fcltyListUI.push(
                    <button className={className}>
                        {faModel.buildingDisplayName} ({faModel.typeName})
                    </button>
                );
            }
        }

        return fcltyListUI;
    }

    const onClickFcltyZone = (zoneNo) => {
        props.setFcltyZone(zoneNo);
    }

    const getZoneListUI = () => {
        const zoneListUI = [];

        const faModels = props.faModel;
        const selFcltyInfo = props.selFcltyInfo;

        if (faModels?.length > 0 && selFcltyInfo.fcltyNo !== null) {
            const faModel = faModels.find(x => x.gltf_fclty_zone_model_sn === selFcltyInfo.fcltyNo);
            if (faModel) {
                for (const zone of faModel.zoneData) {
                    // 선택 여부 확인
                    let direction = 'right';
                    if (zone.zone_sn === selFcltyInfo.zoneNo)
                        direction = 'bottom';

                    const fcltyCount = (zone.fcltys?.length > 0 ? zone.fcltys?.length : 0);

                    // 선택에 따른 설비 리스트, 카운트 값도 확인 필요

                    // 설비 선택 여부 확인
                    const fcltyList = [];
                    let fcltyUI = null;

                    if (zone.fcltys?.length > 0 && zone.zone_sn === selFcltyInfo.zoneNo) {
                        for (const fclty of zone.fcltys) {
                            fcltyList.push(
                                <li>
                                    <div>
                                        <Icon.MinusIcon size="xxxxxs" />
                                        <p>{fclty.displayText}</p>
                                    </div>
                                </li>
                            );
                        }

                        const treeClass = "tree" + (zone.zone_sn === selFcltyInfo.zoneNo ? " on" : "");

                        fcltyUI = (
                            <ul className={treeClass}>
                                {fcltyList}
                            </ul>                            
                        );
                    }



                    zoneListUI.push(
                            <div>
                                {/* 화살표 모양은 트리 열리고 닫힘에 따라 "bottom" : "right" */}
                                <Icon.Arrow size="xxxxxs" direction={direction} />
                                <p>{zone.zoneDisplayName} ({fcltyCount})</p>
                                <button className='moveBtn' onClick={() => onClickFcltyZone(zone.zone_sn)}>이동</button>
                            </div>                            
                    );

                    zoneListUI.push(fcltyUI);
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

                zoneBtnUI.push(<button className={className} onClick={() => onClickFcltyZone(null)}>전체</button>);

                if (faModel.zoneData?.length > 1) {
                    for (const zone of faModel.zoneData) {
                        className = '';
                        if (zone.zone_sn === selFcltyInfo.zoneNo)
                            className = 'selected';

                        zoneBtnUI.push(<button className={className} onClick={() => onClickFcltyZone(zone.zone_sn)}>{zone.zoneDisplayName}</button>);
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

    return (
        <>
            <EquipmentInfoComponent>
                <ul className='menuTypeWrap'>
                    <li className={menuType === 'equipment' ? 'on' : null} onClick={() => setMenuType('equipment')}>
                        AI 설비 예지보전
                    </li>
                    <li className={menuType ==='electric' ? 'on' : null} onClick={() => setMenuType('electric')}>
                        AI 전력 분석
                    </li>
                </ul>
                {
                    menuType === 'equipment' &&
                        <div className='content'>
                            <div className='titleWrap'>
                                <h2>POI 뷰어</h2>
                                <button 
                                    className={'on'} 
                                    data-tooltip="구역명"
                                >
                                    <Icon.StatusInfoEquipZoneName size={"xxxs"} />
                                </button>
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
                                    <li>
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
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                }
            </EquipmentInfoComponent>
            <EquipmentToggleSwitchComponent>
                <p>공정 흐름도</p>
                <ToggleSwitch
                    left="" 
                    right="" 
                    leftcolor="#878787" 
                    rightcolor="#ffffff"
                    leftbgcolor="#787C87"
                    rightbgcolor="#E5ECFF"
                    circleColor="#0C2CCA"
                    sopType="equipment"
                    setChecked={onCheckedFlow}
                    isChecked={isChecked}
                    isDisabled={false}
                />
            </EquipmentToggleSwitchComponent>
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