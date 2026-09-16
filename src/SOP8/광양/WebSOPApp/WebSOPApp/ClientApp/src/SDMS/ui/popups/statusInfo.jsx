import React, {useEffect, useRef, useState} from 'react';

import PopupDraggable from './popupDraggable';
import { StatusInfoComponent } from '../../styled/sdmsPopupsStyled';

import alarm_off from '../../images/alarm_off.svg';
import alarm_on from '../../images/alarm_on.svg';
import alarm_disable from '../../images/alarm_disable.svg';
import SdmsResource from '../../resource/id';
import IconButton from '../../../Common/components/iconButton';
import Icon from '../../../Common/components/Icon/Icon';
import InputBox from '../../../Common/components/inputBox';

    
function StatusInfo(props) {
    const [opacity, setOpacity] = useState(1); 
    const [searchText, setSearchText] = useState(''); 
    
    const refSearchText = useRef();
    
    const scrollRefs = useRef({});
    const [prevCCTVList, setPrevCCTVList] = useState([]);
    const [prevSelectedNodeID, setPrevSelectedNodeID] = useState(null);
    
    const [selectedSensorType, setSelectedSensorType] = useState(null);
    
    useEffect(() => {
        const nodeId = props.selectedSensor?.sensor?.sensorLink?.node_id;
        if (nodeId && scrollRefs.current[nodeId] && nodeId !== prevSelectedNodeID) { // 선택된 센서만 판별
            scrollRefs.current[nodeId].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            setPrevSelectedNodeID(nodeId);
            setSelectedSensorType(props.selectedSensor.sensor.sensorLink.sensor_type_idx);
        }
    }, [props.selectedSensor]);
    
    useEffect(() => {
        // 추가된 CCTV가 있는지 확인 스크롤 이동
        if (props.selectedCCTV && props.selectedCCTV.length > 0) {
            const newCCTVList = props.selectedCCTV.filter(cctv => !prevCCTVList.includes(cctv));
            let nodeID = null;
            if (newCCTVList.length > 0) {
                const newCCTV = newCCTVList[0];
                const cctvElement = scrollRefs.current[newCCTV];
                if (cctvElement) {
                    cctvElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
                nodeID = newCCTV;
            }
            setPrevCCTVList(props.selectedCCTV);
            setPrevSelectedNodeID(nodeID);
            setSelectedSensorType(props.getSelectedSensorTypeFromCCTVNodeID(nodeID));
        }
        
    }, [props.selectedCCTV]);
    
    const changePopupOpacity = (value) => {
        setOpacity(value);
    }

    const handleSubmit = (value) => {
        setSearchText((value ?? "").trim());
    };

    const getSensorDatas = () => {
        let ui = [];
        const { sensorCategories, sensorTypes, sensorList, selectedSensor } = props;
    
        if (sensorCategories && sensorTypes) {
            
            for (let i = 0; i < sensorCategories.length; i++) {
                // 해당 카테고리에 속한 센서 타입 필터링
                const sensorCategory = sensorCategories[i];
                const filteredSensorTypes = sensorTypes.filter(sensorType =>
                    sensorType.sensor_category_idx === sensorCategory.sensor_category_idx &&
                    (searchText === '' ||
                        sensorType.sensor_type_name.includes(searchText) ||
                        hasMatchingSensors(sensorType.sensor_type_idx, sensorList))
                );

                // 부모 카테고리 또는 하위 센서 타입이 검색어와 일치하면 전체 표시
                const shouldShowAllSensorTypes = searchText !== '' &&
                    (sensorCategory.sensor_category_name.includes(searchText) || filteredSensorTypes.length > 0);

                if (searchText === '' || shouldShowAllSensorTypes) {
                    ui.push(
                        <li key={'sensorCategory_' + sensorCategory.sensor_category_idx}>
                            <div
                                className={selectedSensor.dataGroup === sensorCategory.sensor_category_idx ? 'building on' : 'building'}
                                onClick={() => props.setSelectedSensorInfo(1, sensorCategory.sensor_category_idx)}
                            >
                                <p>{sensorCategory.sensor_category_name}</p>
                            </div>
                            <ul
                                className={selectedSensor.dataGroup === sensorCategory.sensor_category_idx ? 'tree-1depth on' : 'tree-1depth'}
                            >
                                {getSensorTypes(sensorCategory.sensor_category_idx, sensorTypes, sensorList, selectedSensor, shouldShowAllSensorTypes)}
                            </ul>
                        </li>
                    );
                }
            }
            
        }
        return ui;
    }
    
    const getSensorTypes = (index, sensorTypes, sensorList, selectedSensor, shouldShowAllSensorTypes) => {
        let ui = [];
        const filteredSensorTypes = sensorTypes.filter(sensorType =>
            sensorType.sensor_category_idx === index &&
            (shouldShowAllSensorTypes || searchText === '' || sensorType.sensor_type_name.includes(searchText) || hasMatchingSensors(sensorType.sensor_type_idx, sensorList))
        );

        const tempShouldShowTypes = [1, 2, 3, 4, 5, 6];
        
        if (filteredSensorTypes.length > 0) {
            for (const sensorType of filteredSensorTypes) {
                if (!tempShouldShowTypes.includes(sensorType.sensor_type_idx))
                    continue;
                // 부모 카테고리가 검색어와 일치하면 하위 센서 타입을 모두 표시
                const shouldShowAllSensors = (searchText !== '' && (sensorType.sensor_type_name.includes(searchText)));

                const sensors = sensorList.find(x => x.sensorType.sensor_type_idx === sensorType.sensor_type_idx);
                const displaySensors = sensors?.zones?.length
                    ? (shouldShowAllSensors || searchText === '' ? sensors.zones : sensors.zones.filter(sensor => sensor.sensorLink.sensor_name.includes(searchText)))
                    : [];
                
                displaySensors.sort((a, b) => { return a.sensorLink.node_id - b.sensorLink.node_id })
    
                ui.push(
                    <li key={'sensorType_' + sensorType.sensor_type_idx}>
                        <div
                            className={selectedSensor.sensorGroup === sensorType.sensor_type_idx ? 'on' : ''} 
                            onClick={() => props.setSelectedSensorInfo(2, sensorType.sensor_type_idx)}
                        > 
                            <p>{sensorType.sensor_type_name}</p>
                            <p>{displaySensors.length}</p>
                        </div>
                        <ul
                            className={selectedSensor.sensorGroup === sensorType.sensor_type_idx ? 'tree-2depth on' : 'tree-2depth'}
                        >
                            {getSensor(displaySensors)}
                        </ul>
                    </li>
                );
            }
        }
    
        return ui;
    };
    
    const getSensor = (displaySensors) => {
        
        return displaySensors.map(sensor => {
            const sensorClassName = getSensorClassName(sensor);
            
            return (
                <li 
                    key={sensor.sensorLink.node_id}
                    className={sensorClassName}
                    ref={el => { scrollRefs.current[sensor.sensorLink.node_id] = el}}
                    onClick={() => props.setSelectedSensorInfo(3, sensor)}
                >
                    <div>
                        <img src={sensorClassName?.includes('alarmOn') ? alarm_on : sensorClassName?.includes('off') ? alarm_disable : alarm_off} alt='알람 아이콘' />
                        <p className='sensorText'>{sensor.sensorLink.sensor_name}</p>
                    </div>
                    <button>센서 바로가기</button>
                </li>
            );
        });
    };
    
    // 하위 센서가 검색어를 포함하는지 체크하는 함수
    const hasMatchingSensors = (sensorTypeIdx, sensorList) => {
        const sensors = sensorList.find(x => x.sensorType.sensor_type_idx === sensorTypeIdx);
        if (!sensors || !sensors.zones) return false;
        
        return sensors.zones.some(sensor => sensor.sensorLink.sensor_name.includes(searchText));
    };

    const getSensorClassName = (sensor) => {
        let isAlarm = false;
        let isDisable = false;
        let className = null;
        
        const sensorLink = sensor.sensorLink;
        const selectedCCTV = props.selectedCCTV;

        // CCTV List에서 node_id 일치시 선택 효과
        if(SdmsResource.isCCTVType(sensorLink.sensor_type_idx)) {
            const isOff = !sensor.sensors?.length || sensor.sensors.every(value => !value.sensor.enab);
            if (selectedCCTV.find((node_id) => node_id === sensor.sensorLink.node_id)) {
                return isOff ? 'off selected' : 'selected';
            }

            return isOff ? 'off' : null;
        }

        // if (sensor.sensors?.some(value => value.sensorZoneData.sensorZone.alarm_yn)) {
        //     className = 'alarmOn';
        //     isAlarm = true;
        // }
        
        if (props.sensorAlarms.some(value => (value.zoneNo === sensor.sensorLink.zone_sn) && value.isAlarm)) {
            className = 'alarmOn';
            isAlarm = true;
        }

        // sensors가 빈 배열이거나, sensor.enab이 전부 false면 disable 센서 연결 불량 처리
        if (!sensor.sensors?.length || sensor.sensors.every(value => !value.sensor.enab)) {
            className = 'off';
            isDisable = true;
        }

        if (sensor.sensorLink.node_id === props.selectedSensor?.sensor?.sensorLink?.node_id) {
            className = 'selected';

            if (isAlarm) {
                className = 'alarmOn selected';
            }
            else if (isDisable) {
                className = 'off selected';
            }
        }

        return className;
    }

    return (
        <StatusInfoComponent id={props.popupType} className='UI_Section statusInfo' $opacity={opacity} $resize={true}>
            <PopupDraggable
                id={props.popupType}
                popupMinWidth={340}
                popupMinHeight={596}
                topSize={40}
                popupState={props.popupState}
                setActiveDragPopup={props.setActiveDragPopup}
                setPopupState={props.setPopupState}
            >
                <div className='dslTop'>
                    <h5 className='dslTitle'>
                        <Icon.IconInspection size='xs' />
                        {SdmsResource.ID.menu.statusInfo}
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
                        onClick={() => props.setVisiblePopups(SdmsResource.ID.menu.statusInfo, false)}
                    >
                        닫기
                    </IconButton>
                </div>

                <div className='content'>
                    <div className='searchWrap'>
                        <p className='contentName'>센서정보</p>
                        <InputBox
                            size="sm"
                            value={searchText}
                            onChange={setSearchText}
                            placeholder={"검색"}
                            onSubmit={handleSubmit}
                            onClear={() => setSearchText("")}
                            fullWidth={true}
                            leftIcon={<Icon.Search size={"xxs"} />}
                        />
                    </div>

                    <div className={'treeWrap scrollbar'}>
                        <ul className={'tree'}>
                            {getSensorDatas()}
                        </ul>
                    </div>
                </div>
            </PopupDraggable> 
        </StatusInfoComponent>
    );
}

export default StatusInfo;