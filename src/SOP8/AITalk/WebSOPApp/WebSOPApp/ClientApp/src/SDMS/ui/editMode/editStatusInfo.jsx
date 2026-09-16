import React, { useEffect, useState, useMemo } from 'react';
import { EditStatusInfoComponent } from '../../styled/sdmsPopupsStyled';
import SearchInputBox from '../../../Common/components/searchInputBox';
import SelectBox from '../../../Common/components/selectBox';
import Icon from '../../../Common/components/Icon/Icon';

function EditStatusInfo(props) {
    const [buildings, setBuildings] = useState(null);
    const [searchText, setSearchText] = useState("");
    const [selectedValue, setSelectedValue] = useState({
        buildingGroupNo: null,
        buildingNo: null,
        zoneNo: null,
        showSensorTypes: false,
        sensorTypeCode: null,
        sensorNo: null
    });
    
    const buildingGroupOptions = useMemo(() => {
        const groups = props.spatialManager?.buildingGroups;
        if (!groups) return [];

        return Object.entries(groups).map(([key, value]) => ({
            value: key,
            label: value.displayText,
        }));
    }, [props.spatialManager]);

    useEffect(() => {
        if (!selectedValue.buildingGroupNo && buildingGroupOptions.length > 0) {
            setSelectedValue({
                buildingGroupNo: buildingGroupOptions[0].value,
                buildingNo: null,
                zoneNo: null,
                showSensorTypes: false,
                sensorTypeCode: null,
                sensorNo: null
            });
        }
    }, [buildingGroupOptions, selectedValue.buildingGroupNo]);

    useEffect(() => {
        if (!props.spatialManager?.buildings) return;

        let buildings = [];

        for (const building in props.spatialManager.buildings) {
            const selectedGroupNo = props.spatialManager?.buildingGroups?.[selectedValue.buildingGroupNo]?.buildingGroupNo ?? null;

            if (selectedGroupNo !== null && props.spatialManager.buildings[building].buildingGroupNo === selectedGroupNo) {
                buildings.push(props.spatialManager.buildings[building]);
            }
        }

        if (buildings.length > 0) setBuildings(buildings);
    }, [selectedValue.buildingGroupNo]);

    const handleSubmit = (value) => {
        console.log(value);
    };

    const handleChangeBuildingGroup = (value) => {
        setSelectedValue({
            buildingGroupNo: value,
            buildingNo: null,
            zoneNo: null,
            showSensorTypes: false,
            sensorTypeCode: null,
            sensorNo: null
        });
    }

    const setSelectedValueInfo = (e, type, item) => {
        e.stopPropagation();

        if (type === 'building') {
            setSelectedValue(prev => ({
                ...prev,
                buildingNo: prev.buildingNo === item.buildingNo ? null : item.buildingNo,
                zoneNo: null,
                showSensorTypes: false,
                sensorTypeCode: null,
                sensorNo: null
            }));
        }
        else if (type === 'zone') {
            setSelectedValue(prev => ({
                ...prev,
                zoneNo: prev.zoneNo === item.zoneNo ? null : item.zoneNo,
                showSensorTypes: false,
                sensorTypeCode: null,
                sensorNo: null
            }));
        }
        else if (type === 'sensorTypes') {
            setSelectedValue(prev => ({
                ...prev,
                showSensorTypes: !prev.showSensorTypes,
                sensorTypeCode: null,
                sensorNo: null
            }));
        }
        else if (type === 'sensorType') {
            setSelectedValue(prev => ({
                ...prev,
                sensorTypeCode: prev.sensorTypeCode === item.sensorTypeCode ? null : item.sensorTypeCode,
                sensorNo: null
            }));
        }
        else if (type === 'sensor') {
            setSelectedValue(prev => ({
                ...prev,
                sensorNo: prev.sensorNo === item.sensor.sensor_sn ? null : item.sensor.sensor_sn
            }));
        }
    }

    const getBuildingGroups = () => buildingGroupOptions;

    const getBuildings = () => {
        if (!buildings) return null;

        return buildings.map((item) => 
            <li key={`building_${item.buildingNo}`}>
                <div
                    className={item.buildingNo === selectedValue.buildingNo ? 'building on' : 'building'}
                    onClick={(e) => setSelectedValueInfo(e, 'building', item)}
                >
                    <Icon.Arrow size="xxxxxs" direction={item.buildingNo === selectedValue.buildingNo ? "bottom" : "right"} />
                    <p>{item.displayText}</p>
                </div>
                <ul className={item.buildingNo === selectedValue.buildingNo ? 'tree depth1 on' : 'tree depth1'}>
                    {getZones(item.zoneDatas)}
                </ul>
            </li>
        );
    }

    const getZones = (zones) => {
        if (!zones || zones.length === 0) return null;

        return zones.map((item) => 
            <li key={`zone_${item.zoneNo}`}>
                <div
                    className={item.zoneNo === selectedValue.zoneNo ? 'zone on' : 'zone'}
                    onClick={(e) => setSelectedValueInfo(e, 'zone', item)}
                >
                    <Icon.Arrow size="xxxxxs" direction={item.zoneNo === selectedValue.zoneNo ? "bottom" : "right"} />
                    <p>{item.displayText}</p>
                    <button className='moveBtn' onClick={(e) => moveToZone(e, item.zoneNo)}>이동</button>
                </div>
                <ul className={item.zoneNo === selectedValue.zoneNo ? 'tree depth2 on' : 'tree depth2'}>
                    <li onClick={(e) => setSelectedValueInfo(e, 'sensorTypes')}>
                        <div className={selectedValue.showSensorTypes ? 'sensorType on' : 'sensorType'}>
                            <Icon.Arrow size="xxxxxs" direction={selectedValue.showSensorTypes ? "bottom" : "right"} />
                            <p className='sensorText'>센서</p>
                        </div>
                        <ul className={selectedValue.showSensorTypes ? 'tree depth3 on' : 'tree depth3'}>
                            {getSensorGroups(item.zoneNo)}
                        </ul>
                    </li>
                </ul>
            </li>
        );
    }

    const getSensorGroups = (zoneNo) => {
        if (!props.sensorTypes || props.sensorTypes.length === 0) return null;

        return props.sensorTypes.map((item) => 
            <li 
                key={`sensorType_${item.sensorTypeCode}`}
                onClick={(e) => setSelectedValueInfo(e, 'sensorType', item)}
            >
                <div className={selectedValue.sensorTypeCode === item.sensorTypeCode ? 'sensor on' : 'sensor'}>
                    <Icon.Arrow size="xxxxxs" direction={selectedValue.sensorTypeCode === item.sensorTypeCode ? "bottom" : "right"} />
                    <p className='sensorText'>{item.sensorTypeName}</p>
                </div>
                <ul className={selectedValue.sensorTypeCode === item.sensorTypeCode ? 'tree depth4 on' : 'tree depth4'}>
                    {getSensors(item.sensors, zoneNo)}
                </ul>
            </li>
        );
    }

    const getSensors = (sensors, zoneNo) => {
        const filteredSensors = sensors.filter(x => x.sensor.zone_sn === zoneNo);

        if (filteredSensors.length === 0) return null;

        return filteredSensors.map((item) => 
            <li
                key={`sensor_${item.sensor.sensor_sn}`}
                onClick={(e) => setSelectedValueInfo(e, 'sensor', item)}
            >
                <div className={selectedValue.sensorNo === item.sensor.sensor_sn ? 'on' : null}>
                    <div className={'sensorInfo'}>
                        <Icon.MinusIcon size="xxxxxs" />
                        <p className='sensorText'>{item.sensor.sensor_name}</p>
                    </div>
                    <div className={'sensorStatus'}>
                        {item.sensor.enab ? <Icon.ClipIcon size="xxxxxs" /> : <Icon.ClipOffIcon size="xxxxxs" />}
                        {getIsAlarmIcon(item.sensor.sensor_sn)}
                    </div>
                </div>
            </li>
        );
    }

    const getIsAlarmIcon = (sensorNo) => {
        const activeAlarms = props.sensorAlarms?.filter(a => a.isAlarm);
        if (!activeAlarms || activeAlarms.length === 0) {
            return <Icon.AlarmOffIcon size="xxxxxs" />;
        }

        for (const alarm of activeAlarms) {
            if (String(alarm.sensorNo) === String(sensorNo)) {
                return <Icon.AlarmOnIcon size="xxxxxs" />;
            }
        }
        return <Icon.AlarmOffIcon size="xxxxxs" />;
    };

    const moveToZone = (e, zoneNo) => {
        e.stopPropagation();
        props.moveToZone(zoneNo);
    }

    return (
        <EditStatusInfoComponent>
            <div className='buildingGroupWrap'>
                <SelectBox
                    value={selectedValue.buildingGroupNo || ""}
                    onChange={handleChangeBuildingGroup}
                    options={getBuildingGroups()}
                />
                <button className='moveBtn'>이동</button>
            </div>
            <div className='searchWrap'>
                <SearchInputBox
                    value={searchText}
                    onChange={setSearchText}
                    placeholder={"검색하세요"}
                    onSubmit={handleSubmit}
                    onClear={() => console.log("clear")}
                    fullWidth={true}
                />
            </div>
            <ul className='buildingWrap'>
                {getBuildings()}
            </ul>
        </EditStatusInfoComponent>
    );
}

export default EditStatusInfo;