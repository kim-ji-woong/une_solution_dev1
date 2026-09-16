import React, { useEffect, useMemo, useState, useRef } from 'react';
import { withRouter } from 'react-router-dom';

import PopupDraggable from './popupDraggable';
import { StatusInfoComponent } from '../../styled/sdmsPopupsStyled';
import SdmsResource from '../../resource/id';
import IconButton from '../../../Common/components/iconButton';
import Icon from '../../../Common/components/Icon/Icon';
import SearchInputBox from '../../../Common/components/searchInputBox';
import { PoiManager } from '../3D/poi/poiManager';
import { useSensorServerStatus } from '../../../Common/hooks/useSensorServerStatus';

function StatusInfo(props) {
    const { statusMap: sensorServerStatusMap } = useSensorServerStatus();

    const [buildings, setBuildings] = useState(null);
    const [searchText, setSearchText] = useState("");
    const [allVisible, setAllVisible] = useState(true);

    // 존별 섹션 상태: 'sensor' | 'cctv' | 'equip' | null  (설비 섹션 포함)
    const [openGroupByZone, setOpenGroupByZone] = useState({});
    // 설비 2뎁스(가상 타입 헤더) 오픈 상태: zoneNo -> boolean
    const [openEquipTypeByZone, setOpenEquipTypeByZone] = useState({});
    const [openCctvSubTypeByZone, setOpenCctvSubTypeByZone] = useState({});

    const isEquipTypeOpen = (zoneNo) => !!openEquipTypeByZone[String(zoneNo)];
    const toggleEquipType = (zoneNo) =>
        setOpenEquipTypeByZone(prev => ({ ...prev, [String(zoneNo)]: !prev[String(zoneNo)] }));

    const resetOpenGroups = () => {
        setOpenGroupByZone({});
        setOpenEquipTypeByZone({});
    };

    // 헤더(센서/CCTV/설비) 클릭 시 토글
    const setOpenGroup = (zoneNo, group) => {
        setOpenGroupByZone(prev => {
            const current = prev[zoneNo] ?? null;
            const next = (current === group) ? null : group;
            return { ...prev, [zoneNo]: next };
        });
    };

    const isGroupOpen = (zoneNo, group) => (openGroupByZone[zoneNo] === group);

    const buildingGroupOptions = useMemo(() => {
        const groups = props.spatialManager?.buildingGroups;
        const base = [];

        if (groups) {
            for (const [key, value] of Object.entries(groups)) {
                base.push({
                    value: key,
                    label: value.displayText,
                });
            }
        }

        return base;
    }, [props.spatialManager]);

    useEffect(() => {
        if (!props.selectedStatusInfo.buildingGroupNo && buildingGroupOptions.length > 0) {
            props.setSelectedStatusInfo({
                buildingGroupNo: buildingGroupOptions[0].value,
                buildingNo: null,
                zoneNo: null,
                sensorTypeCode: null,
                sensorNo: null,
                facilityNo: null
            });
        }
    }, [buildingGroupOptions, props.selectedStatusInfo.buildingGroupNo, props.setSelectedStatusInfo]);

    // site의 outdoorZones를 가져옴
    // buildingGroups에는 siteNo가 없으므로, sites를 순회해 outdoorZones가 있는 첫 site를 반환한다.
    // (단일 site 가정이 성립하면 이 방식이 안전하다)
    const outdoorZones = useMemo(() => {
        const sites = props.spatialManager?.sites ?? {};
        for (const s of Object.values(sites)) {
            if (Array.isArray(s?.outdoorZones) && s.outdoorZones.length > 0) {
                return s.outdoorZones;
            }
        }
        return [];
    }, [props.spatialManager]);

    const outdoorEquipByZone = useMemo(() => {
        const map = new Map();
        for (const oz of (outdoorZones ?? [])) {
            const list = (oz.equipmentZoneDatas ?? []).map(ez => ({
                fclty_sn: ez.equipZoneNo,
                fclty_name: ez.displayText ?? ez.name,
                model_name: ez.name,
                zone_sn: oz.zoneNo,
            }));
            map.set(String(oz.zoneNo), list);
        }
        return map;
    }, [outdoorZones]);

    // (통합) 선택 그룹의 building 목록을 수집하고,
    // site의 외부 zone을 첫 building zoneDatas 끝에 렌더 전용으로 추가한다.
    // ※ spatialManager 싱글톤 변형 방지: building 객체는 shallow copy 후 zoneDatas를 교체한다.
    useEffect(() => {
        if (!props.spatialManager?.buildings) return;

        const selectedGroupNo =
            props.spatialManager?.buildingGroups?.[props.selectedStatusInfo.buildingGroupNo]?.buildingGroupNo ?? null;

        const _buildings = [];
        for (const key in props.spatialManager.buildings) {
            const b = props.spatialManager.buildings[key];
            if (selectedGroupNo !== null && b.buildingGroupNo === selectedGroupNo) {
                _buildings.push(b);
            }
        }

        // 외부 zone을 첫 번째 building의 마지막 층으로 추가
        if (outdoorZones.length && _buildings.length) {
            const target = _buildings[0];
            _buildings[0] = {
                ...target,
                zoneDatas: [
                    ...(target.zoneDatas ?? []),
                    ...outdoorZones.map(z => ({
                        zoneNo: z.zoneNo,
                        displayText: z.displayText ?? z.name ?? '외부영역',
                    })),
                ],
            };
        }

        setBuildings(_buildings.length > 0 ? _buildings : []);
    }, [props.selectedStatusInfo.buildingGroupNo, props.spatialManager, outdoorZones]);

    const handleSubmit = (value) => {
        setSearchText((value ?? "").trim());
    };

    // ---- 선택/토글: 선택된 것만 열림 ----
    const setSelectedValueInfo = (e, type, item) => {
        e.stopPropagation();

        if (type === 'building') {
            props.setSelectedStatusInfo(prev => ({
                ...prev,
                buildingNo: prev.buildingNo === item.buildingNo ? null : item.buildingNo,
                zoneNo: null,
                sensorTypeCode: null,
                sensorNo: null,
                facilityNo: null
            }));
            // 빌딩 변경 시 섹션 접기
            resetOpenGroups();
        }
        else if (type === 'zone') {
            // item: { zone, buildingNo }
            const nextZone = (props.selectedStatusInfo.zoneNo === item.zone.zoneNo) ? null : item.zone.zoneNo;
            props.setSelectedStatusInfo(prev => ({
                ...prev,
                buildingNo: item.buildingNo,
                zoneNo: nextZone,
                sensorTypeCode: null,
                sensorNo: null,
                facilityNo: null
            }));
            // 존 변경 시 섹션 접기
            resetOpenGroups();
        }
        else if (type === 'sensorGroupToggle') {
            // item: { zoneNo, group: 'sensor' | 'cctv' | 'equip' }
            setOpenGroup(item.zoneNo, item.group);
        }
        else if (type === 'sensorType') {
            // item: st (sensor type object)
            const nextType = (props.selectedStatusInfo.sensorTypeCode === item.sensorTypeCode) ? null : item.sensorTypeCode;
            props.setSelectedStatusInfo(prev => ({
                ...prev,
                sensorTypeCode: nextType,
                sensorNo: null,
                facilityNo: null
            }));
            const zone = props.selectedStatusInfo.zoneNo;
            if (zone != null && nextType != null) {
                const group =
                    (nextType === SdmsResource.facilityType.CCTV)
                        ? 'cctv'
                        : 'sensor'; // 설비 타입은 sensorTypes에서 제외
                setOpenGroupByZone(prev => (prev[zone] === group ? prev : { ...prev, [zone]: group }));
            }
        }
        else if (type === 'sensorGroupToggle') {
            setOpenGroup(item.zoneNo, item.group);

            // CCTV 섹션 닫힐 때 subType도 닫기
            if (item.group === 'cctv') {
                setOpenCctvSubTypeByZone(prev => ({
                    ...prev,
                    [item.zoneNo]: null
                }));
            }
        }
        else if (type === 'sensor') {
            props.setSelectedStatusInfo(prev => ({
                ...prev,
                sensorTypeCode: item.sensor.sensor_ty_code,
                sensorNo: prev.sensorNo === item.sensor.sensor_sn ? null : item.sensor.sensor_sn,
                facilityNo: null
            }));

            props.onSelectSensor(item.sensor);

            if (props.selectedStatusInfo.sensorTypeCode === SdmsResource.facilityType.CCTV) {
                props.setSelectedCCTVInfo?.({
                    zoneNo: item.sensor.zone_sn,
                    sensorNo: item.sensor.sensor_sn,
                    facilityNo: null
                });

                if (!props.showPopups[SdmsResource.ID.menu.cctvInfo]) {
                    props.setVisiblePopups(SdmsResource.ID.menu.cctvInfo, true);
                }
            }
        }
        else if (type === 'facility') {
            props.setSelectedStatusInfo(prev => ({
                ...prev,
                sensorNo: null,
                facilityNo: prev.facilityNo === item.fclty_sn ? null : item.fclty_sn
            }));

            props.onSelectFacility(item.model_name, item.zone_sn);
        }
    };

    // 검색 유틸 (대소문자 무시)
    const query = (searchText ?? '').trim().toLowerCase();
    const hasQuery = query.length > 0;
    const norm = (t) => (t ?? '').toString().trim().toLowerCase();
    const matchText = (t) => norm(t).includes(query);        // 부분 포함
    const equalsText = (t) => hasQuery && norm(t) === query; // 완전 일치

    // 존(zoneNo) 기준으로 센서명 매칭 여부
    const anySensorMatchInZone = (zoneNo) => {
        if (!hasQuery || !props.sensorTypes?.length) return false;
        for (const st of props.sensorTypes) {
            if (!st?.sensors?.length) continue;
            for (const s of st.sensors) {
                if (String(s?.sensor?.zone_sn) === String(zoneNo)) {
                    if (matchText(s?.sensor?.sensor_name)) return true;
                }
            }
        }
        return false;
    };

    const getFacilitiesByZone = (zoneNo) => {
        const base = (props.facilityList ?? []).filter(
            f => String(f?.zone_sn) === String(zoneNo)
        );
        const extra = outdoorEquipByZone.get(String(zoneNo)) ?? [];
        return [...base, ...extra];
    };

    // 설비명/모델명 매칭 여부
    const anyFacilityMatchInZone = (zoneNo) => {
        if (!hasQuery) return false;
        const all = getFacilitiesByZone(zoneNo);
        if (all.length === 0) return false;
        return all.some(f => matchText(f?.fclty_name) || matchText(f?.model_name));
    };

    // 검색어가 빌딩/존과 완전 일치하면 그 항목을 선택 상태로 전환 (하위 전체 노출 조건 유지)
    useEffect(() => {
        if (!hasQuery || !buildings?.length) return;

        // 1) 빌딩 완전 일치 우선
        const bExact = buildings.find(b => equalsText(b.displayText));
        if (bExact) {
            props.setSelectedStatusInfo(prev => ({
                ...prev,
                buildingNo: bExact.buildingNo,
                zoneNo: null,
                sensorTypeCode: null,
                sensorNo: null,
                facilityNo: null
            }));
            resetOpenGroups();
            return;
        }

        // 2) 존 완전 일치
        for (const b of buildings) {
            for (const z of (b.zoneDatas ?? [])) {
                if (equalsText(z.displayText)) {
                    props.setSelectedStatusInfo(prev => ({
                        ...prev,
                        buildingNo: b.buildingNo,
                        zoneNo: z.zoneNo,
                        sensorTypeCode: null,
                        sensorNo: null,
                        facilityNo: null
                    }));
                    resetOpenGroups();
                    return;
                }
            }
        }
    }, [query, hasQuery, buildings, props.setSelectedStatusInfo]);

    const scrollContainerRef = useRef(null);
    const groupHeaderRefs = useRef({});
    const typeHeaderRefs = useRef({});
    const sensorItemRefs = useRef({});
    const buildingItemRefs = useRef({});
    const facilityItemRefs = useRef({});

    const getBuildings = () => {
        if (!buildings || buildings.length === 0) return null;

        const filteredBuildings = hasQuery
            ? buildings.filter((b) => {
                const buildingExact = equalsText(b.displayText);
                if (buildingExact) return true;

                const zones = b.zoneDatas ?? [];
                const buildingMatched = matchText(b.displayText);
                const anyZoneNameMatched = zones.some((z) => matchText(z.displayText));

                // 검색 시 센서 or 설비 중 하나라도 매칭되면 표시
                const anyMatchInZone = zones.some((z) =>
                    anySensorMatchInZone(z.zoneNo) || anyFacilityMatchInZone(z.zoneNo)
                );

                return buildingMatched || anyZoneNameMatched || anyMatchInZone;
            })
            : buildings;

        if (filteredBuildings.length === 0) {
            return (
                <li className="empty" key="empty">
                    <div className="building">
                        <p>검색 결과가 없습니다.</p>
                    </div>
                </li>
            );
        }

        return filteredBuildings.map((b) => {
            const buildingExact = equalsText(b.displayText);
            const isBuildingOpen = b.buildingNo === props.selectedStatusInfo.buildingNo;

            const zonesForRender = hasQuery
                ? (buildingExact
                    ? (b.zoneDatas ?? [])
                    : (b.zoneDatas ?? []).filter((z) =>
                        matchText(z.displayText) ||
                        anySensorMatchInZone(z.zoneNo) ||
                        anyFacilityMatchInZone(z.zoneNo)
                    ))
                : b.zoneDatas;

            return (
                <li
                    key={`building_${b.buildingNo}`}
                    ref={(el) => { if (el) buildingItemRefs.current[b.buildingNo] = el; }}
                >
                    <div
                        className={isBuildingOpen ? 'building on' : 'building'}
                        onClick={(e) => setSelectedValueInfo(e, 'building', b)}
                    >
                        <Icon.Arrow size="xxxxxs" direction={isBuildingOpen ? "bottom" : "right"} />
                        <p>{b.displayText}</p>
                    </div>
                    <ul className={isBuildingOpen ? 'tree depth1 on' : 'tree depth1'}>
                        {getZones(zonesForRender, isBuildingOpen, buildingExact)}
                    </ul>
                </li>
            );
        });
    };

    const getZones = (zones, isBuildingOpen, buildingExact = false) => {
        if (!zones || zones.length === 0) return null;

        return zones.map((z) => {
            const isZoneOpen = isBuildingOpen && (z.zoneNo === props.selectedStatusInfo.zoneNo);
            
            const zoneMatched = matchText(z.displayText);
            const includeAllSensors = zoneMatched || buildingExact;

            // 섹션별 열림 여부
            const isSensorListOpen = isGroupOpen(z.zoneNo, 'sensor');
            const isCctvListOpen = isGroupOpen(z.zoneNo, 'cctv');
            const isEquipListOpen = isGroupOpen(z.zoneNo, 'equip');

            // 센서, CCTV, 설비 항목 하위의 센서 총 갯수 계산
            const sensorCount = countSensorsInSection(z.zoneNo, 'sensor', includeAllSensors);
            const cctvCount   = countSensorsInSection(z.zoneNo, 'cctv', includeAllSensors);
            const equipCount  = countSensorsInSection(z.zoneNo, 'equip', includeAllSensors);

            return (
                <li key={`zone_${z.zoneNo}`}>
                    <div
                        className={isZoneOpen ? 'zone on' : 'zone'}
                        onClick={(e) => setSelectedValueInfo(e, 'zone', { zone: z, buildingNo: props.selectedStatusInfo.buildingNo || null })}
                    >
                        <Icon.Arrow size="xxxxxs" direction={isZoneOpen ? "bottom" : "right"} />
                        <p>{z.displayText}</p>
                        <button
                            className='moveBtn'
                            onClick={(e) => { e.stopPropagation(); props.moveToZone(z.zoneNo); }}
                        >
                            이동
                        </button>
                    </div>
                    <ul className={isZoneOpen ? 'tree depth2 on' : 'tree depth2'}>
                        {/* 센서 섹션 */}
                        <li>
                            <div
                                className={isSensorListOpen ? 'sensorType on' : 'sensorType'}
                                onClick={(e) => setSelectedValueInfo(e, 'sensorGroupToggle', { zoneNo: z.zoneNo, group: 'sensor' })}
                                ref={(el) => {
                                    if (!groupHeaderRefs.current[z.zoneNo]) groupHeaderRefs.current[z.zoneNo] = {};
                                    groupHeaderRefs.current[z.zoneNo]['sensor'] = el;
                                }}
                            >
                                <Icon.Arrow size="xxxxxs" direction={isSensorListOpen ? "bottom" : "right"} />
                                <p className='sensorText'>센서 ({sensorCount})</p>
                            </div>
                            <ul
                                className={isSensorListOpen ? 'tree depth3 on' : 'tree depth3'}
                                onClick={(e) => e.stopPropagation()}  // 내부 클릭 버블링 차단
                            >
                                {isSensorListOpen ? getSensorGroups(z.zoneNo, includeAllSensors, 'sensor') : null}
                            </ul>
                        </li>

                        {/* CCTV 섹션 */}
                        <li>
                            <div
                                className={isCctvListOpen ? 'sensorType on' : 'sensorType'}
                                onClick={(e) => setSelectedValueInfo(e, 'sensorGroupToggle', { zoneNo: z.zoneNo, group: 'cctv' })}
                                ref={(el) => {
                                    if (!groupHeaderRefs.current[z.zoneNo]) groupHeaderRefs.current[z.zoneNo] = {};
                                    groupHeaderRefs.current[z.zoneNo]['cctv'] = el;
                                }}
                            >
                                <Icon.Arrow size="xxxxxs" direction={isCctvListOpen ? "bottom" : "right"} />
                                <p className='sensorText'>CCTV ({cctvCount})</p>
                            </div>
                            <ul
                                className={isCctvListOpen ? 'tree depth3 on' : 'tree depth3'}
                                onClick={(e) => e.stopPropagation()}  // 내부 클릭 버블링 차단
                            >
                                {isCctvListOpen ? getCctvGroupsBySubType(z.zoneNo, includeAllSensors) : null}
                            </ul>
                        </li>

                        {/* 금융결제원은 설비 섹션 사용 X */}
                        {/* 설비 섹션 (props.facilityList 사용, 3-depth) */}
                        {/* <li>
                            <div
                                className={isEquipListOpen ? 'sensorType on' : 'sensorType'}
                                onClick={(e) => setSelectedValueInfo(e, 'sensorGroupToggle', { zoneNo: z.zoneNo, group: 'equip' })}
                                ref={(el) => {
                                    if (!groupHeaderRefs.current[z.zoneNo]) groupHeaderRefs.current[z.zoneNo] = {};
                                    groupHeaderRefs.current[z.zoneNo]['equip'] = el;
                                }}
                            >
                                <Icon.Arrow size="xxxxxs" direction={isEquipListOpen ? "bottom" : "right"} />
                                <p className='sensorText'>설비 ({equipCount})</p>
                            </div>
                            <ul
                                className={isEquipListOpen ? 'tree depth3 on' : 'tree depth3'}
                                onClick={(e) => e.stopPropagation()}  // 내부 클릭 버블링 차단
                            >
                                {isEquipListOpen ? getFacilityGroups(z.zoneNo, includeAllSensors) : null}
                            </ul>
                        </li> */}
                    </ul>
                </li>
            );
        });
    };

    const countSensorsInSection = (zoneNo, group, includeAllSensors = false) => {
        if (group === 'equip') {
            const all = getFacilitiesByZone(zoneNo);
            const list = (hasQuery && !includeAllSensors)
                ? all.filter(f => matchText(f?.fclty_name) || matchText(f?.model_name))
                : all;
            return list.length;
        }
        if (!props.sensorTypes?.length) {
            if (group !== 'equip') return 0;
        }
        const CCTV_CODE = SdmsResource.facilityType.CCTV;
        let total = 0;
        for (const st of (props.sensorTypes ?? [])) {
            const isCctvType = (st.sensorTypeCode === CCTV_CODE);
            if (group === 'cctv' && !isCctvType) continue;
            if (group === 'sensor' && isCctvType) continue;
            const sensorsInZone = (st.sensors ?? []).filter(
                x => String(x?.sensor?.zone_sn) === String(zoneNo)
            );
            const sensorsForQuery = (hasQuery && !includeAllSensors)
                ? sensorsInZone.filter(x => matchText(x?.sensor?.sensor_name))
                : sensorsInZone;
            total += sensorsForQuery.length;
        }
        return total;
    };

    // group: 'sensor'
    const getSensorGroups = (zoneNo, includeAllSensors = false) => {
        if (!props.sensorTypes || props.sensorTypes.length === 0) return null;

        const CCTV_CODE = SdmsResource.facilityType.CCTV;

        return props.sensorTypes.map((st) => {
            // CCTV 타입은 센서 섹션에서 제외
            if (st.sensorTypeCode === CCTV_CODE) return null;

            const sensorsInZone = (st.sensors ?? []).filter(
                x => String(x?.sensor?.zone_sn) === String(zoneNo)
            );

            const sensorsForQuery = (hasQuery && !includeAllSensors)
                ? sensorsInZone.filter(x => matchText(x?.sensor?.sensor_name))
                : sensorsInZone;

            // 센서가 0개면 트리에서 제외
            if (sensorsForQuery.length === 0) return null;

            const isTypeOpen =
                zoneNo === props.selectedStatusInfo.zoneNo &&
                st.sensorTypeCode === props.selectedStatusInfo.sensorTypeCode;

            return (
                <li
                    key={`sensorType_${st.sensorTypeCode}`}
                    onClick={(e) => setSelectedValueInfo(e, 'sensorType', st)}
                >
                    <div
                        className={isTypeOpen ? 'sensor on' : 'sensor'}
                        ref={(el) => {
                            typeHeaderRefs.current[`${zoneNo}:${st.sensorTypeCode}`] = el;
                        }}
                    >
                        <Icon.Arrow
                            size="xxxxxs"
                            direction={isTypeOpen ? "bottom" : "right"}
                        />
                        <p className='sensorText'>{`${st.sensorTypeName} (${sensorsForQuery.length})`}</p>
                    </div>
                    <ul
                        className={isTypeOpen ? 'tree depth4 on' : 'tree depth4'}
                        onClick={(e) => e.stopPropagation()} // 내부 클릭 버블링 차단
                    >
                        {isTypeOpen ? getSensors(sensorsForQuery, st.sensorTypeCode) : null}
                    </ul>
                </li>
            );
        });
    };

    // group: 'cctv'
    const getCctvGroupsBySubType = (zoneNo, includeAllSensors = false) => {
        const CCTV_CODE = SdmsResource.facilityType.CCTV;

        const cctvType = (props.sensorTypes ?? []).find(
            st => st.sensorTypeCode === CCTV_CODE
        );
        if (!cctvType) return null;

        const sensorsInZone = (cctvType.sensors ?? []).filter(
            x => String(x.sensor.zone_sn) === String(zoneNo)
        );

        const sensorsForQuery =
            (hasQuery && !includeAllSensors)
                ? sensorsInZone.filter(x => matchText(x.sensor.sensor_name))
                : sensorsInZone;

        if (sensorsForQuery.length === 0) return null;

        const groups = sensorsForQuery.reduce((acc, cur) => {
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

        return Object.values(groups).map(group => {
            const opened = openCctvSubTypeByZone[zoneNo] === group.subTypeNo;

            return (
                <li key={`cctvSub_${zoneNo}_${group.subTypeNo}`}>
                    <div
                        className={opened ? 'sensor on' : 'sensor'}
                        onClick={(e) => {
                            e.stopPropagation();

                            props.setSelectedStatusInfo(prev => ({
                            ...prev,
                                sensorTypeCode: SdmsResource.facilityType.CCTV,
                                sensorNo: null
                            }));

                            setOpenCctvSubTypeByZone(prev => ({
                                ...prev,
                                [zoneNo]: opened ? null : group.subTypeNo
                            }));
                        }}
                    >
                        <Icon.Arrow size="xxxxxs" direction={opened ? 'bottom' : 'right'} />
                        <p className='sensorText'>
                            {`${group.subTypeName} (${group.sensors.length})`}
                        </p>
                    </div>

                    <ul
                        className={opened ? 'tree depth4 on' : 'tree depth4'}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {opened ? getSensors(group.sensors, CCTV_CODE) : null}
                    </ul>
                </li>
            );
        });
    };

    // 설비
    const getFacilityGroups = (zoneNo, includeAllSensors = false) => {
        const all = getFacilitiesByZone(zoneNo);
        const facilitiesForQuery = (hasQuery && !includeAllSensors)
            ? all.filter(f => matchText(f?.fclty_name) || matchText(f?.model_name))
            : all;

        if (facilitiesForQuery.length === 0) return null;

        const typeKey = `${zoneNo}:FACILITY`;
        const opened = isEquipTypeOpen(zoneNo);

        return (
            <li key={`facilityType_${zoneNo}`}>
                <div
                    className={opened ? 'sensor on' : 'sensor'}
                    onClick={(e) => { e.stopPropagation(); toggleEquipType(zoneNo); }}
                    ref={(el) => { typeHeaderRefs.current[typeKey] = el; }}
                >
                    <Icon.Arrow size="xxxxxs" direction={opened ? "bottom" : "right"} />
                    <p className='sensorText'>{`설비 (${facilitiesForQuery.length})`}</p>
                </div>
                <ul
                    className={opened ? 'tree depth4 on' : 'tree depth4'}
                    onClick={(e) => e.stopPropagation()}
                >
                    {opened ? facilitiesForQuery.map((f) => (
                        <li
                            key={`facility_${f.fclty_sn}`}
                            onClick={(e) => setSelectedValueInfo(e, 'facility', f)}
                        >
                            <div 
                                className={props.selectedStatusInfo.facilityNo === f.fclty_sn ? 'on' : null}
                                ref={(el) => { if (el) facilityItemRefs.current[f.fclty_sn] = el; }}
                            >
                                <div className={'sensorInfo'}>
                                    <Icon.MinusIcon size="xxxxxs" />
                                    <p className='sensorText'>
                                        {f.fclty_name}
                                    </p>
                                </div>
                            </div>
                        </li>
                    )) : null}
                </ul>
            </li>
        );
    };

    const getSensors = (filteredSensors, sensorTypeCode) => {
        if (!filteredSensors || filteredSensors.length === 0) return null;

        const sensorServerStatus = sensorServerStatusMap[sensorTypeCode];

        return filteredSensors.map((item) => (
            <li
                key={`sensor_${item.sensor.sensor_sn}`}
                onClick={(e) => setSelectedValueInfo(e, 'sensor', item)}
            >
                <div className={props.selectedStatusInfo.sensorNo === item.sensor.sensor_sn ? 'on' : null}>
                    <div
                        className={'sensorInfo'}
                        ref={(el) => {
                            if (el) sensorItemRefs.current[item.sensor.sensor_sn] = el;
                        }}
                    >
                        <Icon.MinusIcon size="xxxxxs" />
                        <p className='sensorText'>{item.sensor.sensor_name}</p>
                    </div>
                    <div className="sensorStatus">
                        {
                            !sensorServerStatus 
                                ? <Icon.ClipOffIcon size="xxxxxs" />
                                : item.sensor.enab 
                                    ? <Icon.ClipIcon size="xxxxxs" />
                                    : <Icon.ClipOffIcon size="xxxxxs" />
                        }

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

    const setVisiblePoi = (sensorType) => {
        props.setVisiblePoi(sensorType, !props.visibleSensorTypes[sensorType]);
    };

    const setAll = (value) => {
        props.setVisibleSensorTypes((prev) => {
            const next = {};
            for (const k of Object.keys(prev)) next[k] = value;
            return next;
        });
        setAllVisible(!allVisible);
    };

    const showAll = () => setAll(true);
    const hideAll = () => setAll(false);

    const toggleSensorGroup = (groupKey) => {
        const sensors = PoiManager.SENSOR_GROUP[groupKey];
        if (!sensors) return;

        // 그룹 내 하나라도 켜져 있으면 > 전체 OFF
        const isAnyOn = sensors.some(
            (key) => props.visibleSensorTypes[key]
        );

        const nextValue = !isAnyOn;

        const updated = { ...props.visibleSensorTypes };
        sensors.forEach((key) => {
            updated[key] = nextValue;
        });

        props.setVisibleSensorTypes(updated);
    };

    const isGroupOn = (groupKey) => {
        const sensors = PoiManager.SENSOR_GROUP[groupKey];
        if (!sensors) return false;

        return sensors.some(
            (key) => props.visibleSensorTypes[key]
        );
    };

    const zoneToBuildingNo = useMemo(() => {
        const map = new Map();
        if (buildings?.length) {
            for (const b of buildings) {
                for (const z of (b.zoneDatas ?? [])) {
                    map.set(String(z.zoneNo), b.buildingNo);
                }
            }
        }
        // 외부 zone은 buildings 루프에서 첫 번째 building의 buildingNo로 이미 매핑됨
        return map;
    }, [buildings]);

    useEffect(() => {
        const sel = props.selectedStatusInfo;
        if (!sel) return;
        if (sel.zoneNo != null && sel.sensorTypeCode != null) {
            const group =
                (sel.sensorTypeCode === SdmsResource.facilityType.CCTV)
                    ? 'cctv'
                    : 'sensor'; // 설비 타입은 sensorTypes에서 제외
            setOpenGroupByZone(prev => (
                prev[sel.zoneNo] === group ? prev : { ...prev, [sel.zoneNo]: group }
            ));
        }
    }, [props.selectedStatusInfo]);

    useEffect(() => {
        const container = scrollContainerRef.current;
        for (const [zone, group] of Object.entries(openGroupByZone)) {
            if (!group) continue;
            const el = groupHeaderRefs.current?.[zone]?.[group];
            if (!el) continue;
            if (container) {
                const elRect = el.getBoundingClientRect();
                const contRect = container.getBoundingClientRect();
                const isBelow = elRect.bottom > contRect.bottom;
                const isAbove = elRect.top < contRect.top;
                if (isBelow || isAbove) {
                    el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
                }
            } else {
                el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            }
        }
    }, [openGroupByZone]);

    useEffect(() => {
        const facilityNo = props.selectedStatusInfo?.facilityNo;
        if (!facilityNo) return;

        // 1) facility 정보 찾기
        const f = (props.facilityList ?? []).find(x => String(x?.fclty_sn) === String(facilityNo));
        if (!f) return;

        const foundZoneNo = f?.zone_sn;
        const bnFromZone = zoneToBuildingNo.get(String(foundZoneNo)) ?? props.selectedStatusInfo.buildingNo ?? null;

        // 2) building/zone이 선택되어 있지 않거나 다른 경우 맞춰주기
        const needsUpdate =
            bnFromZone !== props.selectedStatusInfo.buildingNo ||
            foundZoneNo !== props.selectedStatusInfo.zoneNo;

        if (needsUpdate) {
            props.setSelectedStatusInfo(prev => ({
            ...prev,
            buildingNo: bnFromZone,
            zoneNo: foundZoneNo,
            sensorTypeCode: null, // 설비는 sensorTypes와 별개
            }));
        }

        // 3) 존의 그룹을 'equip'으로 열고, 설비 2뎁스도 열기
        setOpenGroupByZone(prev => ({ ...prev, [foundZoneNo]: 'equip' }));
        setOpenEquipTypeByZone(prev => ({ ...prev, [String(foundZoneNo)]: true }));

        // 4) 스크롤 이동
        const scrollToFacility = () => {
            const el = facilityItemRefs.current[facilityNo];
            if (!el) return;

            const container = scrollContainerRef.current;
            if (container) {
            const contRect = container.getBoundingClientRect();
            const elRect = el.getBoundingClientRect();
            const current = container.scrollTop;
            const deltaTop = elRect.top - contRect.top;
            const target = current + deltaTop - (container.clientHeight / 2) + (elRect.height / 2);
            container.scrollTo({ top: target, behavior: 'smooth' });
            } else {
            el.scrollIntoView({ block: 'center', inline: 'nearest', behavior: 'smooth' });
            }
        };

        requestAnimationFrame(() => {
            requestAnimationFrame(scrollToFacility);
        });
    }, [props.selectedStatusInfo.facilityNo, props.facilityList, zoneToBuildingNo]);

    useEffect(() => {
        const sel = props.selectedStatusInfo;
        if (!sel) return;
        if (sel.zoneNo != null && sel.sensorTypeCode != null) {
            const key = `${sel.zoneNo}:${sel.sensorTypeCode}`;
            const el = typeHeaderRefs.current[key];
            if (!el) return;
            const container = scrollContainerRef.current;
            if (container) {
                const elRect = el.getBoundingClientRect();
                const contRect = container.getBoundingClientRect();
                const isBelow = elRect.bottom > contRect.bottom;
                const isAbove = elRect.top < contRect.top;
                if (isBelow || isAbove) {
                    el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
                }
            } else {
                el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            }
        }
    }, [props.selectedStatusInfo.zoneNo, props.selectedStatusInfo.sensorTypeCode]);

    useEffect(() => {
        const sensorNo = props.selectedStatusInfo?.sensorNo;
        if (!sensorNo) return;

        let zoneNo = props.selectedStatusInfo.zoneNo;
        let sensorTypeCode = props.selectedStatusInfo.sensorTypeCode;

        if (zoneNo == null || sensorTypeCode == null) {
            let found = null;
            for (const st of (props.sensorTypes ?? [])) {
                for (const s of (st.sensors ?? [])) {
                    if (String(s?.sensor?.sensor_sn) === String(sensorNo)) {
                        found = { zoneNo: s?.sensor?.zone_sn, sensorTypeCode: st.sensorTypeCode };
                        break;
                    }
                }
                if (found) break;
            }
            if (found) {
                const bn = zoneToBuildingNo.get(String(found.zoneNo)) ?? props.selectedStatusInfo.buildingNo ?? null;
                if (bn !== props.selectedStatusInfo.buildingNo || found.zoneNo !== props.selectedStatusInfo.zoneNo || found.sensorTypeCode !== props.selectedStatusInfo.sensorTypeCode) {
                    props.setSelectedStatusInfo(prev => ({
                        ...prev,
                        buildingNo: bn,
                        zoneNo: found.zoneNo,
                        sensorTypeCode: found.sensorTypeCode
                    }));
                    const g =
                        (found.sensorTypeCode === SdmsResource.facilityType.CCTV)
                            ? 'cctv'
                            : 'sensor';
                    setOpenGroupByZone(prev => ({ ...prev, [found.zoneNo]: g }));
                }
            }
        }

        const scrollToSensor = () => {
            const el = sensorItemRefs.current[sensorNo];
            if (!el) return;
            const container = scrollContainerRef.current;

            // 컨테이너가 있을 때: 센서 엘리먼트를 컨테이너의 세로 중앙에 위치
            if (container) {
                const contRect = container.getBoundingClientRect();
                const elRect = el.getBoundingClientRect();
                const current = container.scrollTop;
                const deltaTop = elRect.top - contRect.top;
                const target = current + deltaTop - (container.clientHeight / 2) + (elRect.height / 2);
                container.scrollTo({ top: target, behavior: 'smooth' });
                return;
            }

            // 컨테이너 ref가 없다면 브라우저 기본 중앙 옵션 사용 (대안)
            el.scrollIntoView({ block: 'center', inline: 'nearest', behavior: 'smooth' });
        };

        requestAnimationFrame(() => {
            requestAnimationFrame(scrollToSensor);
        });
    }, [props.selectedStatusInfo.sensorNo]);

    useEffect(() => {
        const sensorNo = props.selectedStatusInfo?.sensorNo;
        if (!sensorNo) return;

        const CCTV_CODE = SdmsResource.facilityType.CCTV;

        let found = null;

        for (const st of (props.sensorTypes ?? [])) {
            if (st.sensorTypeCode !== CCTV_CODE) continue;

            for (const s of (st.sensors ?? [])) {
                if (String(s?.sensor?.sensor_sn) === String(sensorNo)) {
                    found = {
                        zoneNo: s.sensor.zone_sn,
                        subTypeNo: s.sensor.subTypeNo
                    };
                    break;
                }
            }
            if (found) break;
        }

        if (!found) return;

        // CCTV 섹션 열기
        setOpenGroupByZone(prev => ({
            ...prev,
            [found.zoneNo]: 'cctv'
        }));

        // CCTV subType 열기
        setOpenCctvSubTypeByZone(prev => ({
            ...prev,
            [found.zoneNo]: found.subTypeNo
        }));
    }, [props.selectedStatusInfo.sensorNo, props.sensorTypes]);

    useEffect(() => {
        const bn = props.selectedStatusInfo?.buildingNo;
        if (!bn) return;

        const scrollToBuilding = () => {
            const el = buildingItemRefs.current[bn];
            if (!el) return;
            const container = scrollContainerRef.current;
            if (container) {
                const elRect = el.getBoundingClientRect();
                const contRect = container.getBoundingClientRect();
                const isBelow = elRect.bottom > contRect.bottom;
                const isAbove = elRect.top < contRect.top;
                if (isBelow || isAbove) {
                    el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
                }
            } else {
                el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            }
        };

        requestAnimationFrame(() => {
            requestAnimationFrame(scrollToBuilding);
        });
    }, [props.selectedStatusInfo.buildingNo]);

    return (
        <StatusInfoComponent id={props.popupType} className='UI_Section statusInfo' $resize={true}>
            <PopupDraggable
                id={props.popupType}
                popupMinWidth={340}
                popupMinHeight={400}
                topSize={40}
                popupState={props.popupState}
                setActiveDragPopup={props.setActiveDragPopup}
                setPopupState={props.setPopupState}
            >
                <div className='dslTop'>
                    <h5 className='dslTitle'>
                        {SdmsResource.ID.menu.statusInfo}
                    </h5>
                    <IconButton
                        variant="unfill"
                        size="xxs"
                        icon={<Icon.Closer size={"xxs"} />}
                        onClick={() => props.setVisiblePopups(SdmsResource.ID.menu.statusInfo, false)}
                    >
                        닫기
                    </IconButton>
                </div>
                <div className={'content'}>
                    <div className='poiwrap'>
                        <p>POI 뷰어</p>
                        <div>
                            <button
                                onClick={allVisible ? hideAll : showAll}
                                data-tooltip={allVisible ? "전체 OFF" : "전체 ON"}
                            >
                                {allVisible ? (
                                    <Icon.StatusInfoHideAll size="xxs" />
                                ) : (
                                    <Icon.StatusInfoShowAll size="xxs" />
                                )}
                            </button>
                            <button
                                className={isGroupOn("CCTV") ? "on" : null}
                                onClick={() => toggleSensorGroup("CCTV")}
                                data-tooltip="CCTV"
                            >
                                <Icon.StatusInfoCCTV size={"xxs"} />
                            </button>
                            <button
                                className={props.visibleSensorTypes[PoiManager.EmergencyBell_Sensor] ? 'on' : null}
                                onClick={() => setVisiblePoi(PoiManager.EmergencyBell_Sensor)}
                                data-tooltip="비상벨"
                            >
                                <Icon.StatusInfoEmergencyBell size={"xxs"} />
                            </button>
                            <button
                                className={props.visibleSensorTypes[PoiManager.DOOR_Sensor] ? 'on' : null}
                                onClick={() => setVisiblePoi(PoiManager.DOOR_Sensor)}
                                data-tooltip="출입문"
                            >
                                <Icon.StatusInfoDOOR size={"xxs"} />
                            </button>
                            <button
                                className={isGroupOn("INVASION") ? "on" : null}
                                onClick={() => toggleSensorGroup("INVASION")}
                                data-tooltip="침입"
                            >
                                <Icon.StatusInfoInvasion size={"xxs"} />
                            </button>
                            <button
                                className={props.visibleSensorTypes[PoiManager.EquipZoneName] ? 'on' : null}
                                onClick={() => setVisiblePoi(PoiManager.EquipZoneName)}
                                data-tooltip="구역명"
                            >
                                <Icon.StatusInfoEquipZoneName size={"xxs"} />
                            </button>
                        </div>
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
                    <ul className='buildingWrap' ref={scrollContainerRef}>
                        {getBuildings()}
                    </ul>
                </div>
            </PopupDraggable>
        </StatusInfoComponent>
    );
}

export default withRouter(StatusInfo);