import React, { useEffect, useState, useMemo } from 'react';
import { EditStatusInfoComponent } from '../../styled/sdmsPopupsStyled';
import SearchInputBox from '../../../Common/components/searchInputBox';
import SelectBox from '../../../Common/components/selectBox';
import Icon from '../../../Common/components/Icon/Icon';

const ALL_BUILDING_GROUP_VALUE = '__all__';
const OUTDOOR_BUILDING_GROUP_VALUE = 'OUTDOOR';

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
        const sites = props.spatialManager?.sites;
        const options = [];

        if (groups) {
            Object.entries(groups).forEach(([key, value]) => {
                options.push({
                    value: key,
                    label: value.displayText,
                });
            });
        }

        const hasOutdoor = !!Object.values(sites ?? {}).find(
            (site) => Array.isArray(site?.outdoorZones) && site.outdoorZones.length > 0
        );

        if (hasOutdoor) {
            options.push({
                value: OUTDOOR_BUILDING_GROUP_VALUE,
                label: '외부영역',
            });
        }

        if (options.length === 0) return [];

        return [
            {
                value: ALL_BUILDING_GROUP_VALUE,
                label: '전체',
            },
            ...options,
        ];
    }, [props.spatialManager]);

    const outdoorZones = useMemo(() => {
        const sites = props.spatialManager?.sites ?? {};
        const zones = [];

        for (const site of Object.values(sites)) {
            if (Array.isArray(site?.outdoorZones) && site.outdoorZones.length > 0) {
                zones.push(...site.outdoorZones);
            }
        }

        return zones;
    }, [props.spatialManager]);

    const outdoorPseudoBuilding = useMemo(() => {
        if (!outdoorZones.length) return null;

        return {
            buildingNo: OUTDOOR_BUILDING_GROUP_VALUE,
            displayText: '외부영역',
            zoneDatas: outdoorZones.map((zone) => ({
                ...zone,
                displayText: zone.displayText ?? zone.name,
            })),
        };
    }, [outdoorZones]);

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
        if (selectedValue.buildingGroupNo === ALL_BUILDING_GROUP_VALUE) {
            const allBuildings = Object.values(props.spatialManager?.buildings ?? {});
            const nextBuildings = outdoorPseudoBuilding
                ? [...allBuildings, outdoorPseudoBuilding]
                : allBuildings;

            setBuildings(nextBuildings);
            return;
        }

        if (selectedValue.buildingGroupNo === OUTDOOR_BUILDING_GROUP_VALUE) {
            setBuildings(outdoorPseudoBuilding ? [outdoorPseudoBuilding] : []);
            return;
        }

        if (!props.spatialManager?.buildings) {
            setBuildings([]);
            return;
        }

        let buildings = [];

        for (const building in props.spatialManager.buildings) {
            const selectedGroupNo = props.spatialManager?.buildingGroups?.[selectedValue.buildingGroupNo]?.buildingGroupNo ?? null;

            if (selectedGroupNo !== null && props.spatialManager.buildings[building].buildingGroupNo === selectedGroupNo) {
                buildings.push(props.spatialManager.buildings[building]);
            }
        }

        setBuildings(buildings);
    }, [selectedValue.buildingGroupNo, props.spatialManager, outdoorPseudoBuilding]);

    useEffect(() => {
        if (!searchText) return;

        setSelectedValue(prev => ({
            ...prev,
            buildingNo: null,
            zoneNo: null,
            sensorTypeCode: null
        }));
    }, [searchText]);

    const filteredBuildings = useMemo(() => {
        if (!buildings) return [];

        const keyword = searchText.trim().toLowerCase();
        if (!keyword) return buildings;

        return buildings
            .map(building => {
                const buildingMatch =
                    building.displayText?.toLowerCase().includes(keyword);

                const filteredZones = building.zoneDatas
                    ?.map(zone => {
                        const zoneMatch =
                            zone.displayText?.toLowerCase().includes(keyword);

                        // 해당 zone의 모든 sensor 모으기
                        const allSensors = props.sensorTypes?.flatMap(type =>
                            type.sensors.filter(s => s.sensor.zone_sn === zone.zoneNo)
                        ) || [];

                        const filteredSensors = allSensors.filter(s =>
                            s.sensor.sensor_name?.toLowerCase().includes(keyword)
                        );

                        // 🔹 building 매칭 → 전체 유지
                        if (buildingMatch) {
                            return {
                                ...zone,
                                __allSensors: allSensors
                            };
                        }

                        // 🔹 zone 매칭 → 해당 zone의 모든 sensor 유지
                        if (zoneMatch) {
                            return {
                                ...zone,
                                __allSensors: allSensors
                            };
                        }

                        // 🔹 sensor 매칭 → 매칭된 sensor만 유지
                        if (filteredSensors.length > 0) {
                            return {
                                ...zone,
                                __allSensors: filteredSensors
                            };
                        }

                        return null;
                    })
                    .filter(Boolean);

                if (buildingMatch || filteredZones.length > 0) {
                    return {
                        ...building,
                        zoneDatas: filteredZones
                    };
                }

                return null;
            })
            .filter(Boolean);

    }, [buildings, searchText, props.sensorTypes]);

    const handleSubmit = (value) => {
        setSearchText((value ?? "").trim());
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
        if (!filteredBuildings) return null;

        return filteredBuildings.map((item) => 
            <li key={`building_${item.buildingNo}`}>
                <div
                    className={item.buildingNo === selectedValue.buildingNo ? 'building on' : 'building'}
                    onClick={(e) => setSelectedValueInfo(e, 'building', item)}
                >
                    <Icon.Arrow size="xxxxxs" direction={item.buildingNo === selectedValue.buildingNo ? "bottom" : "right"} />
                    <p>{item.displayText}</p>
                </div>
                <ul className={
                    item.buildingNo === selectedValue.buildingNo
                        ? 'tree depth1 on'
                        : 'tree depth1'
                }>
                    {getZones(item.zoneDatas)}
                </ul>
            </li>
        );
    }

    const getZones = (zones) => {
        if (!zones || zones.length === 0) return null;

        return zones.map((item) => {

            return (
                <li key={`zone_${item.zoneNo}`}>
                    <div
                        className={item.zoneNo === selectedValue.zoneNo ? 'zone on' : 'zone'}
                        onClick={(e) => setSelectedValueInfo(e, 'zone', item)}
                    >
                        <Icon.Arrow size="xxxxxs" direction={item.zoneNo === selectedValue.zoneNo ? "bottom" : "right"} />
                        <p>{item.displayText}</p>
                        <button className='moveBtn' onClick={(e) => moveToZone(e, item.zoneNo)}>이동</button>
                    </div>

                    <ul className={
                        item.zoneNo === selectedValue.zoneNo
                            ? 'tree depth2 on'
                            : 'tree depth2'
                    }>
                        <li>
                            <div className='sensorType on'>
                                <Icon.Arrow size="xxxxxs" direction="bottom" />
                                <p className='sensorText'>센서</p>
                            </div>

                            <ul className='tree depth3 on'>
                                {getSensorGroups(item.zoneNo, item.__allSensors)}
                            </ul>
                        </li>
                    </ul>
                </li>
            );
        });
    };

    const getSensorGroups = (zoneNo, searchedSensors) => {
        if (!props.sensorTypes || props.sensorTypes.length === 0) return null;

        return props.sensorTypes.map((type) => {

            const zoneSensors = type.sensors.filter(
                s => s.sensor.zone_sn === zoneNo
            );

            if (zoneSensors.length === 0) return null;

            const sensorsToRender = searchedSensors
                ? zoneSensors.filter(s =>
                    searchedSensors.some(ss => ss.sensor.sensor_sn === s.sensor.sensor_sn)
                )
                : zoneSensors;

            if (sensorsToRender.length === 0) return null;

            const isOpen = selectedValue.sensorTypeCode === type.sensorTypeCode;

            return (
                <li key={`sensorType_${type.sensorTypeCode}`}>
                    <div
                        className={isOpen ? 'sensor on' : 'sensor'}
                        onClick={(e) => setSelectedValueInfo(e, 'sensorType', type)}
                    >
                        <Icon.Arrow
                            size="xxxxxs"
                            direction={isOpen ? "bottom" : "right"}
                        />
                        <p className='sensorText'>
                            {`${type.sensorTypeName} (${sensorsToRender.length})`}
                        </p>
                    </div>

                    <ul className={isOpen ? 'tree depth4 on' : 'tree depth4'}>
                        {getSensors(sensorsToRender)}
                    </ul>
                </li>
            );
        });
    };

    const getSensors = (sensors) => {
        if (!sensors || sensors.length === 0) return null;

        return sensors.map((item) => (
            <li
                key={`sensor_${item.sensor.sensor_sn}`}
                onClick={(e) => setSelectedValueInfo(e, 'sensor', item)}
            >
                <div className={selectedValue.sensorNo === item.sensor.sensor_sn ? 'on' : ''}>
                    <div className='sensorInfo'>
                        <Icon.MinusIcon size="xxxxxs" />
                        <p className='sensorText'>{item.sensor.sensor_name}</p>
                    </div>
                    <div className='sensorStatus'>
                        {item.sensor.enab
                            ? <Icon.ClipIcon size="xxxxxs" />
                            : <Icon.ClipOffIcon size="xxxxxs" />}
                        {getIsAlarmIcon(item.sensor.sensor_sn)}
                    </div>
                </div>
            </li>
        ));
    };

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
                    onClear={() => setSearchText("")}
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