import React, { useEffect, useState, useMemo, useRef } from 'react';
import { EditStatusInfoComponent } from '../../styled/sdmsPopupsStyled';
import SearchInputBox from '../../../Common/components/searchInputBox';
import Icon from '../../../Common/components/Icon/Icon';
import SdmsResource from '../../resource/id';
import { useSensorServerStatus } from '../../../Common/hooks/useSensorServerStatus';

function EditStatusInfo(props) {
    const { statusMap: sensorServerStatusMap } = useSensorServerStatus();

    const [buildings, setBuildings] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [openGroupByZone, setOpenGroupByZone] = useState({});
    const [openCctvSubTypeByZone, setOpenCctvSubTypeByZone] = useState({});

    const scrollContainerRef = useRef(null);
    const typeHeaderRefs = useRef({});
    const sensorItemRefs = useRef({});
    const buildingItemRefs = useRef({});

    const selected = props.selectedStatusInfo;

    /* ---------------- 공통 유틸 ---------------- */

    const resetOpenGroups = () => {
        autoOpenedRef.current = false;
        setOpenGroupByZone({});
        setOpenCctvSubTypeByZone({});
    };

    const isGroupOpen = (zoneNo, group) =>
        openGroupByZone[zoneNo] === group;

    const toggleGroup = (zoneNo, group) => {
        setOpenGroupByZone(prev => ({
            ...prev,
            [zoneNo]: prev[zoneNo] === group ? null : group
        }));
    };

    /* ---------------- 빌딩 그룹 ---------------- */

    const buildingGroupOptions = useMemo(() => {
        const groups = props.spatialManager?.buildingGroups;
        if (!groups) return [];
        return Object.entries(groups).map(([key, value]) => ({
            value: key,
            label: value.displayText
        }));
    }, [props.spatialManager]);

    useEffect(() => {
        if (!selected?.buildingGroupNo && buildingGroupOptions.length > 0) {
            props.setSelectedStatusInfo(prev => ({
                ...prev,
                buildingGroupNo: buildingGroupOptions[0].value
            }));
        }
    }, [buildingGroupOptions, selected?.buildingGroupNo]);

    useEffect(() => {
        if (!props.spatialManager?.buildings || !selected?.buildingGroupNo) return;

        const result = [];
        const groupNo =
            props.spatialManager.buildingGroups?.[selected.buildingGroupNo]?.buildingGroupNo ?? null;

        for (const key in props.spatialManager.buildings) {
            const b = props.spatialManager.buildings[key];
            if (groupNo !== null && b.buildingGroupNo === groupNo) {
                result.push(b);
            }
        }

        setBuildings(result);
    }, [props.spatialManager, selected?.buildingGroupNo]);

    /* ---------------- 검색 ---------------- */

    const query = searchText.trim().toLowerCase();
    const hasQuery = query.length > 0;
    const norm = t => (t ?? '').toString().toLowerCase();
    const matchText = t => norm(t).includes(query);
    const equalsText = t => hasQuery && norm(t) === query;

    const anySensorMatchInZone = (zoneNo) => {
        if (!hasQuery || !props.sensorTypes) return false;

        for (const st of props.sensorTypes) {
            for (const s of st.sensors ?? []) {
                if (
                    String(s.sensor.zone_sn) === String(zoneNo) &&
                    matchText(s.sensor.sensor_name)
                ) {
                    return true;
                }
            }
        }
        return false;
    };

    /* ---------------- 자동 전개 ---------------- */

    const autoOpenedRef = useRef(false);

    useEffect(() => {
        const sensorNo = selected?.sensorNo;
        if (!sensorNo) return;
        if (autoOpenedRef.current) return;

        let found = null;

        for (const st of props.sensorTypes ?? []) {
            for (const s of st.sensors ?? []) {
                if (String(s.sensor.sensor_sn) === String(sensorNo)) {
                    found = {
                        zoneNo: s.sensor.zone_sn,
                        sensorTypeCode: st.sensorTypeCode
                    };
                    break;
                }
            }
            if (found) break;
        }

        if (!found) return;

        const group =
            found.sensorTypeCode === SdmsResource.facilityType.CCTV
                ? 'cctv'
                : 'sensor';

        setOpenGroupByZone(prev => ({
            ...prev,
            [found.zoneNo]: group
        }));

        autoOpenedRef.current = true;
    }, [selected?.sensorNo]);

    useEffect(() => {
        const sensorNo = selected?.sensorNo;
        if (!sensorNo) return;

        let found = null;

        for (const st of props.sensorTypes ?? []) {
            for (const s of st.sensors ?? []) {
                if (String(s.sensor.sensor_sn) === String(sensorNo)) {
                    found = {
                        zoneNo: s.sensor.zone_sn,
                        sensorTypeCode: st.sensorTypeCode,
                        subTypeNo: s.sensor.subTypeNo
                    };
                    break;
                }
            }
            if (found) break;
        }

        if (!found) return;

        // zone / sensorType 동기화
        if (
            found.zoneNo !== selected.zoneNo ||
            found.sensorTypeCode !== selected.sensorTypeCode
        ) {
            props.setSelectedStatusInfo(prev => ({
                ...prev,
                zoneNo: found.zoneNo,
                sensorTypeCode: found.sensorTypeCode
            }));
        }

        // 그룹 열기
        const group =
            found.sensorTypeCode === SdmsResource.facilityType.CCTV
                ? 'cctv'
                : 'sensor';

        setOpenGroupByZone(prev => ({
            ...prev,
            [found.zoneNo]: group
        }));

        // CCTV subType 열기
        if (group === 'cctv' && found.subTypeNo != null) {
            setOpenCctvSubTypeByZone(prev => ({
                ...prev,
                [found.zoneNo]: found.subTypeNo
            }));
        }
    }, [selected?.sensorNo]);

    useEffect(() => {
        const sensorNo = selected?.sensorNo;
        if (!sensorNo) return;

        const scrollToSensor = () => {
            const el = sensorItemRefs.current[sensorNo];
            if (!el) return;

            const container = scrollContainerRef.current;

            if (container) {
                const contRect = container.getBoundingClientRect();
                const elRect = el.getBoundingClientRect();
                const current = container.scrollTop;
                const deltaTop = elRect.top - contRect.top;
                const target =
                    current +
                    deltaTop -
                    container.clientHeight / 2 +
                    elRect.height / 2;

                container.scrollTo({ top: target, behavior: 'smooth' });
            } else {
                el.scrollIntoView({ block: 'center', behavior: 'smooth' });
            }
        };

        requestAnimationFrame(() => {
            requestAnimationFrame(scrollToSensor);
        });
    }, [selected?.sensorNo]);

    /* ---------------- 렌더 ---------------- */

    const getBuildings = () => {
        if (!buildings.length) return null;

        const filtered = hasQuery
            ? buildings.filter(b => {
                if (equalsText(b.displayText)) return true;
                return (b.zoneDatas ?? []).some(z =>
                    matchText(z.displayText) ||
                    anySensorMatchInZone(z.zoneNo)
                );
            })
            : buildings;

        if (!filtered.length) {
            return (
                <li className="empty">
                    <div className="building">
                        <p>검색 결과가 없습니다.</p>
                    </div>
                </li>
            );
        }

        return filtered.map(b => {
            const isOpen = b.buildingNo === selected?.buildingNo;
            const buildingExact = equalsText(b.displayText);

            const zonesForRender = hasQuery && !buildingExact
                ? (b.zoneDatas ?? []).filter(z =>
                    matchText(z.displayText) || anySensorMatchInZone(z.zoneNo)
                )
                : b.zoneDatas;

            return (
                <li key={b.buildingNo} ref={el => (buildingItemRefs.current[b.buildingNo] = el)}>
                    <div
                        className={isOpen ? 'building on' : 'building'}
                        onClick={() => {
                            resetOpenGroups();

                            props.setSelectedStatusInfo(prev => ({
                                ...prev,
                                buildingNo: prev.buildingNo === b.buildingNo ? null : b.buildingNo,
                                zoneNo: null,
                                sensorTypeCode: null,
                                sensorNo: null
                            }));
                        }}
                    >
                        <Icon.Arrow size="xxxxxs" direction={isOpen ? 'bottom' : 'right'} />
                        <p>{b.displayText}</p>
                    </div>

                    <ul className={isOpen ? 'tree depth1 on' : 'tree depth1'}>
                        {isOpen && getZones(zonesForRender, buildingExact)}
                    </ul>
                </li>
            );
        });
    };

    const getZones = (zones, buildingExact = false) =>
        zones.map(z => {
            const isOpen = z.zoneNo === selected?.zoneNo;

            const zoneMatched = matchText(z.displayText);
            const includeAll = zoneMatched || buildingExact;

            const sensorCount = countSensors(z.zoneNo, 'sensor', includeAll);
            const cctvCount = countSensors(z.zoneNo, 'cctv', includeAll);

            return (
                <li key={z.zoneNo}>
                    <div
                        className={isOpen ? 'zone on' : 'zone'}
                        onClick={() => {
                            resetOpenGroups();

                            props.setSelectedStatusInfo(prev => ({
                                ...prev,
                                zoneNo: prev.zoneNo === z.zoneNo ? null : z.zoneNo,
                                sensorTypeCode: null,
                                sensorNo: null
                            }));
                        }}
                    >
                        <Icon.Arrow size="xxxxxs" direction={isOpen ? 'bottom' : 'right'} />
                        <p>{z.displayText}</p>
                        <button
                            className="moveBtn"
                            onClick={e => {
                                e.stopPropagation();
                                props.moveToZone(z.zoneNo);
                            }}
                        >
                            이동
                        </button>
                    </div>

                    <ul className={isOpen ? 'tree depth2 on' : 'tree depth2'}>
                        {isOpen &&
                            ['sensor', 'cctv'].map(group => (
                                <li key={group}>
                                    <div
                                        className={isGroupOpen(z.zoneNo, group) ? 'sensorType on' : 'sensorType'}
                                        onClick={e => {
                                            e.stopPropagation();
                                            toggleGroup(z.zoneNo, group);
                                        }}
                                    >
                                        <Icon.Arrow
                                            size="xxxxxs"
                                            direction={isGroupOpen(z.zoneNo, group) ? 'bottom' : 'right'}
                                        />
                                        <p className="sensorText">
                                            {group === 'sensor' ? '센서' : 'CCTV'} (
                                            {group === 'sensor' ? sensorCount : cctvCount})
                                        </p>
                                    </div>

                                    <ul className={isGroupOpen(z.zoneNo, group) ? 'tree depth3 on' : 'tree depth3'}>
                                        {isGroupOpen(z.zoneNo, group) &&
                                            (group === 'sensor'
                                                ? getSensorGroups(z.zoneNo, includeAll)
                                                : getCctvGroupsBySubType(z.zoneNo, includeAll))}
                                    </ul>
                                </li>
                            ))}
                    </ul>
                </li>
            );
        });

    /* ---------------- 센서 / CCTV ---------------- */

    const countSensors = (zoneNo, group, includeAll = false) => {
        const CCTV = SdmsResource.facilityType.CCTV;
        let total = 0;

        for (const st of props.sensorTypes ?? []) {
            if (group === 'sensor' && st.sensorTypeCode === CCTV) continue;
            if (group === 'cctv' && st.sensorTypeCode !== CCTV) continue;

            const list = (st.sensors ?? []).filter(
                s => String(s.sensor.zone_sn) === String(zoneNo)
            );

            total += hasQuery && !includeAll
                ? list.filter(s => matchText(s.sensor.sensor_name)).length
                : list.length;
        }
        return total;
    };

    const getSensorGroups = (zoneNo, includeAll = false) => {
        const CCTV = SdmsResource.facilityType.CCTV;

        return (props.sensorTypes ?? []).map(st => {
            if (st.sensorTypeCode === CCTV) return null;

            const sensors = (st.sensors ?? []).filter(
                s =>
                    String(s.sensor.zone_sn) === String(zoneNo) &&
                    (!hasQuery || includeAll || matchText(s.sensor.sensor_name))
            );

            if (!sensors.length) return null;

            const isOpen = selected?.sensorTypeCode === st.sensorTypeCode;
            const serverOk = sensorServerStatusMap[st.sensorTypeCode];

            return (
                <li key={st.sensorTypeCode}>
                    <div
                        className={isOpen ? 'sensor on' : 'sensor'}
                        ref={el => (typeHeaderRefs.current[`${zoneNo}:${st.sensorTypeCode}`] = el)}
                        onClick={e => {
                            e.stopPropagation();

                            props.setSelectedStatusInfo(prev => ({
                                ...prev,
                                sensorTypeCode:
                                    prev.sensorTypeCode === st.sensorTypeCode
                                        ? null
                                        : st.sensorTypeCode,
                                sensorNo: null
                            }));
                        }}
                    >
                        <Icon.Arrow size="xxxxxs" direction={isOpen ? 'bottom' : 'right'} />
                        <p className="sensorText">
                            {`${st.sensorTypeName} (${sensors.length})`}
                        </p>
                    </div>

                    <ul className={isOpen ? 'tree depth4 on' : 'tree depth4'}>
                        {isOpen &&
                            sensors.map(s => (
                                <li
                                    key={s.sensor.sensor_sn}
                                    onClick={e => {
                                        e.stopPropagation();
                                        props.setSelectedStatusInfo(prev => ({
                                            ...prev,
                                            sensorNo: s.sensor.sensor_sn
                                        }));
                                    }}
                                >
                                    <div className={selected?.sensorNo === s.sensor.sensor_sn ? 'on' : null}>
                                        <div
                                            className="sensorInfo"
                                            ref={el => (sensorItemRefs.current[s.sensor.sensor_sn] = el)}
                                        >
                                            <Icon.MinusIcon size="xxxxxs" />
                                            <p className="sensorText">{s.sensor.sensor_name}</p>
                                        </div>
                                        <div className="sensorStatus">
                                            {!serverOk
                                                ? <Icon.ClipOffIcon size="xxxxxs" />
                                                : s.sensor.enab
                                                    ? <Icon.ClipIcon size="xxxxxs" />
                                                    : <Icon.ClipOffIcon size="xxxxxs" />}
                                        </div>
                                    </div>
                                </li>
                            ))}
                    </ul>
                </li>
            );
        });
    };

    const getCctvGroupsBySubType = (zoneNo, includeAll = false) => {
        const CCTV = SdmsResource.facilityType.CCTV;
        const cctvType = (props.sensorTypes ?? []).find(st => st.sensorTypeCode === CCTV);
        if (!cctvType) return null;

        const sensors = (cctvType.sensors ?? []).filter(
            s =>
                String(s.sensor.zone_sn) === String(zoneNo) &&
                (!hasQuery || includeAll || matchText(s.sensor.sensor_name))
        );

        if (!sensors.length) return null;

        const groups = sensors.reduce((acc, cur) => {
            const { subTypeNo, subTypeName } = cur.sensor;

            if (!acc[subTypeNo]) {
                acc[subTypeNo] = {
                    subTypeNo,
                    subTypeName,
                    sensors: []
                };
            }

            acc[subTypeNo].sensors.push(cur);
            return acc;
        }, {});

        return Object.values(groups).map(g => {
            const opened = openCctvSubTypeByZone[zoneNo] === g.subTypeNo;

            return (
                <li key={g.subTypeNo}>
                    <div
                        className={opened ? 'sensor on' : 'sensor'}
                        onClick={e => {
                            e.stopPropagation();
                            setOpenCctvSubTypeByZone(prev => ({
                                ...prev,
                                [zoneNo]: opened ? null : g.subTypeNo
                            }));
                        }}
                    >
                        <Icon.Arrow size="xxxxxs" direction={opened ? 'bottom' : 'right'} />
                        <p className="sensorText">
                            {`${g.subTypeName} (${g.sensors.length})`}
                        </p>
                    </div>

                    <ul className={opened ? 'tree depth4 on' : 'tree depth4'}>
                        {opened &&
                            g.sensors.map(s => (
                                <li
                                    key={s.sensor.sensor_sn}
                                    onClick={e => {
                                        e.stopPropagation();
                                        props.setSelectedStatusInfo(prev => ({
                                            ...prev,
                                            sensorNo: s.sensor.sensor_sn
                                        }));
                                    }}
                                >
                                    <div className={selected?.sensorNo === s.sensor.sensor_sn ? 'on' : null}>
                                        <div
                                            className="sensorInfo"
                                            ref={el => (sensorItemRefs.current[s.sensor.sensor_sn] = el)}
                                        >
                                            <Icon.MinusIcon size="xxxxxs" />
                                            <p className="sensorText">{s.sensor.sensor_name}</p>
                                        </div>
                                    </div>
                                </li>
                            ))}
                    </ul>
                </li>
            );
        });
    };

    const handleSubmit = (value) => {
        setSearchText((value ?? "").trim());
    };

    return (
        <EditStatusInfoComponent>
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

            <ul className="buildingWrap" ref={scrollContainerRef}>
                {getBuildings()}
            </ul>
        </EditStatusInfoComponent>
    );
}

export default EditStatusInfo;