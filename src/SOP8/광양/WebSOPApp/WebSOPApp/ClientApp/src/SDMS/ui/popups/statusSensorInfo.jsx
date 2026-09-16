import React, { useState } from 'react';

import PopupDraggable from './popupDraggable';
import { StatusSensorInfoComponent } from '../../styled/sdmsPopupsStyled';
import SdmsResource from '../../resource/id';

import tooltip_icon from '../../images/tooltip_icon.svg';
import IconButton from '../../../Common/components/iconButton';
import Icon from '../../../Common/components/Icon/Icon';

function StatusSensorInfo(props) {
    const [opacity, setOpacity] = useState(1); 
    const [sensorIsNull, setSensorIsNull] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);
    const sensorTypeIdx = props.selectedSensor?.sensorLink?.sensor_type_idx;

    const changePopupOpacity = (value) => {
        setOpacity(value);
    }

    const getCriticalMass = () => {
        const criticalMassContent = [];
        
        let thresholdGrid = [];
        
        for (let i = 0; i < props.selectedSensor?.sensors.length; i++) {
            const sensor = props.selectedSensor.sensors[i];
            const sensorZone = sensor.sensorZoneData.sensorZone;
            const uniqueKey = sensorZone.unq_key;
            
            const arrUnqKey = uniqueKey.split('_');
            const unqId = arrUnqKey[arrUnqKey.length - 1];
            
            const materialLink = props.materialLinks.find((item) => item.sensor_unique_id === parseInt(unqId));
            
            if (!materialLink) continue;
            
            const formatValue = (value) => {
                const num = parseFloat(value);
                return num % 1 === 0 ? num.toString() : num.toFixed(2);
            };

            const notice = formatValue(materialLink.limit_notice);
            const attention = formatValue(materialLink.limit_attention);
            const warning = formatValue(materialLink.limit_warning);

            const element = (
                <li className='toolTipBody' key={materialLink.sensor_name_kor}>
                    <div><span>{materialLink.sensor_name_kor}</span></div>
                    <div><span>0-{notice}</span></div>
                    <div><span>{notice}-{attention}</span></div>
                    <div><span>{attention}-{warning}</span></div>
                    <div><span>{warning}-</span></div>
                </li>
            )
            
            thresholdGrid.push(element);
            
        }

        criticalMassContent.push(
            <div id='toolTipContent' key="toolTipContent">
                <ul>
                    <li className='toolTipHead'>
                        <div><span>측정항목</span></div>
                        <div><span className='greenTxt'>좋음</span></div>
                        <div><span className='blueTxt'>보통</span></div>
                        <div><span className='yellowTxt'>나쁨</span></div>
                        <div><span className='redTxt'>매우나쁨</span></div>
                    </li>
                    {thresholdGrid}
                </ul>
            </div>
        );

        return criticalMassContent;
    }

    const getSensorDatas = () => {
        const datas = props.selectedSensor?.sensors;
        if (!datas) {
            props.setVisiblePopups(SdmsResource.ID.menu.statusSensorInfo, false);
            return;
        }

        if (datas && datas.length < 1) {
            return <li className='noData'>
                        <p><span>데이터 값이 없습니다.</span></p>
                    </li>
        }

        const chart_back = Array(8).fill().map((_, index) => (
            <span key={index} className={'chartStickNormal'}></span>
        ));
        const chart_stick = Array(7).fill().map((_, index) => (
            <span key={index} className={'chartStickBlack'}></span>
        ));

        let ui = [];
        for (const data of datas) {
            const sensorTypeName = getSensorTypeName(data.sensorZoneData.sensorZone.sensor_sub_ty_no);
            
            if (isNoneMaterial(data.sensorZoneData.sensorZone.sensor_sub_ty_no)) {
                const status = getThreshold(data);

                ui.push(
                    <li className={status === 4 ? 'warning' : null} key={data.sensorZoneData.sensorZone.sensor_sub_ty_no}>
                        <div><span className={!data.sensorZoneData.sensorMaterial.cur_data ? 'noData' : undefined}>{sensorTypeName}</span></div>
                        <div><span className={!data.sensorZoneData.sensorMaterial.cur_data ? 'noData' : undefined}>{data.sensorZoneData.sensorMaterial.cur_data ? data.sensorZoneData.sensorMaterial.cur_data : '-'}</span></div>
                        <div>
                            <div className={'chartArea'}>
                                <div className={'blackStickBox'}>
                                    {chart_stick}
                                </div>
                                <div className={'chartStickBox'}>
                                    {chart_back}
                                </div>
                                {status > 0 && <div className={'chartAnimate' + status}></div>}
                            </div>
                        </div>
                    </li>
                );
            }
        }
    
        return ui;
    }

    const getThreshold = (sensor) => {
        if (sensor === null || undefined)
            return 1;
        
        const sensorZone = sensor.sensorZoneData.sensorZone;
        const sensorMaterial = sensor.sensorZoneData.sensorMaterial;
        
        const sensorUnqKey = parseInt(sensorZone.unq_key.split("_")[3]);
        
        const targetMaterialLink = props.materialLinks.find(x => x.sensor_unique_id === sensorUnqKey);
        
        if ((targetMaterialLink === null || undefined) || (sensorMaterial === null || undefined))
            return 0;

        if (!sensorMaterial.cur_data)
            return 0;

        const value = parseFloat(sensorMaterial.cur_data).toFixed(2);
        
        if (targetMaterialLink.limit_notice === 0 && targetMaterialLink.limit_attention === 0 && targetMaterialLink.limit_warning === 0)
            return 1;
        
        if (value > targetMaterialLink.limit_notice) {
            if (value > targetMaterialLink.limit_attention) {
                if (value > targetMaterialLink.limit_warning)
                    return 4;
                return 3;
            }
            return 2;
        }
            
        return 1;
    }
    
    const isNoneMaterial = (sensorSubTyNo) => {
        const targetSubType = props.sensorSubTypes.find((item) => item.sensor_sub_ty_no === sensorSubTyNo)
        
        if (targetSubType) {
            const targetSubTypeName = targetSubType.sensor_sub_ty_name;
            return !(targetSubTypeName === "Temp" || targetSubTypeName === "Humi" || targetSubTypeName === "WD" || targetSubTypeName === "WS" || targetSubTypeName === "EC");
        }
        
        return false;
    }

    const getWeatherDatas = () => {
        
        if (!props.selectedSensor?.sensors) {
            props.setVisiblePopups(SdmsResource.ID.menu.statusSensorInfo, false);
            return;
        }
        
        let datas = [ ...props.selectedSensor?.sensors ];
        let ui = [];
        
        datas = datas.sort((a, b) => {
            return a.sensor?.subTypeNo - b.sensor?.subTypeNo;
        });
        
        Object.seal(datas);
        
        for (const data of datas) {
            const subType = data.sensorZoneData.sensorZone.unq_key.split('_')[2];
            if (["Temp", "Humi", "WD", "WS"].includes(subType)) {
                let displayValue = data.sensorZoneData.sensorMaterial.cur_data ? data.sensorZoneData.sensorMaterial.cur_data : '-';
                if (subType === 'WD' && data.sensorZoneData.sensorMaterial.cur_data) {
                    displayValue = SdmsResource.getWindDirectionString(parseFloat(data.sensorZoneData.sensorMaterial.cur_data));
                }
                ui.push(<p key={data.sensorZoneData.sensorZone.sensor_sub_ty_no}>{displayValue}</p>);
            }
        }

        if (ui.length === 0) {
            return <p className='noData'>데이터 값이 없습니다.</p>;
        }

        return ui;
    }

    const getECData = () => {

        if (!props.selectedSensor?.sensors) {
            return;
        }

        let datas = [ ...props.selectedSensor?.sensors ];
        let ui = [];

        for (const data of datas) {
            if (data.sensorZoneData.sensorZone.unq_key.split('_')[2] === 'EC') {
                const sensorTypeName = getSensorTypeName(data.sensorZoneData.sensorZone.sensor_sub_ty_no);
                ui.push(
                    <React.Fragment key={data.sensorZoneData.sensorZone.sensor_sub_ty_no}>
                        <p>{sensorTypeName ? sensorTypeName : 'EC'}</p>
                        <p>{data.sensorZoneData.sensorMaterial.cur_data ? data.sensorZoneData.sensorMaterial.cur_data : '-'}</p>
                    </React.Fragment>
                );
            }
        }

        if (ui.length === 0) {
            return <p className='noData'>데이터 값이 없습니다.</p>;
        }

        return ui;
    }

    const getSensorTypeName = (sensorTypeNo) => {
        
        const targetSensorTypeNo = sensorTypeNo;
        
        const targetSubType = props.sensorSubTypes.find((item) => item.sensor_sub_ty_no === targetSensorTypeNo)
        
        const strArray = targetSubType ? targetSubType.descp.split('_') : [];
        
        let targetSubTypeName = '';
        
        if (strArray.length > 0) {
            targetSubTypeName = strArray[0];    
        }
        
        return targetSubTypeName;
        // switch (sensorTypeNo) {
        //     case 1: { return '온도'; }
        //     case 2: { return '습도'; }
        //     case 3: { return '풍향'; }
        //     case 4: { return '풍속'; }
        //     case 5: { return 'PM2.5'; }
        //     case 6: { return 'PM10'; }
        //     case 7: { return '복합악취'; }
        //     case 8: { return '황화수소'; }
        //     case 9: { return '암모니아'; }
        //     case 10: { return 'TVOC'; }
        //     case 11: { return '염화수소'; }
        //     case 12: { return '이산화질소'; }
        //     case 13: { return '이산화황'; }
        //     case 14: { return '기압'; }
        //     case 15: { return '일사량'; }
        //     default: return '-';
        // }
    } 
    
    const onClickClosePopup = (type, value) => {
        // 팝업이 닫히는 경우 SelectedSensor를 null로 초기화 해야한다.
        // 이미 선택된 센서를 한번더 선택되게 하면 SelectedSensor는 null이 되며 소켓신호도 전송 된다.
        props.setSelectedSensorInfo(3, props.selectedSensor);
        props.setVisiblePopups(type, value); // value: 팝업 On/Off
    }

    return (
        <StatusSensorInfoComponent id={props.popupType} className='UI_Section statusSensorInfo' $opacity={opacity} $resize={true}>
            <PopupDraggable
                id={props.popupType}
                popupMinWidth={340}
                popupMinHeight={369}
                topSize={40}
                popupState={props.popupState}
                setActiveDragPopup={props.setActiveDragPopup}
                setPopupState={props.setPopupState}
            >
                <div className='dslTop'>
                    <h5 className='dslTitle'>
                        <Icon.InfoCircleIcon size='xs' />
                        {SdmsResource.getExternalSensorTypeTitle(sensorTypeIdx)}
                        상세정보
                    </h5>
                    <input
                        type="range"
                        className="rangeInput"
                        min={0.1}
                        max={1}
                        color="gray"
                        step={0.1}
                        defaultValue={opacity}
                        onChange={(e) => {changePopupOpacity(e.target.valueAsNumber)}}
                    />
                    <IconButton
                        variant="unfill"
                        size="xxs"
                        icon={<Icon.Closer />}
                        onClick={() => onClickClosePopup(SdmsResource.ID.menu.statusSensorInfo, false)}
                    >
                        닫기
                    </IconButton>
                </div>

                <div className="content chart">
                    <div className="header">
                        <p className='contentName'>
                            {props.selectedSensor?.sensorLink?.sensor_name}
                        </p>
                        {!sensorIsNull &&
                            <div
                                id="tooltip"
                                onMouseEnter={() => setShowTooltip(true)}
                                onMouseLeave={() => setShowTooltip(false)}
                            >
                                <span className="tooltipIcon">
                                    <Icon.QuestionCircleIcon size="xxs" />
                                </span>

                                {showTooltip && getCriticalMass()}
                            </div>
                        }
                    </div>
                    <ul className='head'>
                        <li>
                            <p>항목</p>
                            <p>수치(ppb)</p>
                            <p>위험도</p>
                        </li>
                    </ul>
                    <ul className='body scrollbar'>
                        {
                            getSensorDatas()
                        }

                        {/* 대기센서 (기상 데이터 표출) */}
                        {props.selectedSensor?.sensorLink?.sensor_type_idx === 1 &&
                            <>
                                <li className='weather head'>
                                    <p>습도</p>
                                    <p>온도</p>
                                    <p>풍향</p>
                                    <p>풍속</p>
                                </li>
                                <li className='weather body'>
                                    {
                                        getWeatherDatas()
                                    }
                                </li>
                            </>
                        }

                        {/* 수질센서 (전기전도도 데이터 표출) */}
                        {props.selectedSensor?.sensorLink?.sensor_type_idx === 3 &&
                            <>
                                <li className='weather head'>
                                    <p>항목명</p>
                                    <p>수치</p>
                                </li>
                                <li className='weather body'>
                                    {
                                        getECData()
                                    }
                                </li>
                            </>
                        }
                    </ul>
                </div>
            </PopupDraggable>
        </StatusSensorInfoComponent>
    );
}

export default StatusSensorInfo;