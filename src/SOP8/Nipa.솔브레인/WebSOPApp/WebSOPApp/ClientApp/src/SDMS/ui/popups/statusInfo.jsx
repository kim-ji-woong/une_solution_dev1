import React, { useEffect, useMemo, useState, useRef } from 'react';
import { withRouter } from 'react-router-dom';

import PopupDraggable from './popupDraggable';
import { StatusInfoComponent } from '../../styled/sdmsPopupsStyled';
import SdmsResource from '../../resource/id';
import IconButton from '../../../Common/components/iconButton';
import Icon from '../../../Common/components/Icon/Icon';
import SelectBox from '../../../Common/components/selectBox';
import SearchInputBox from '../../../Common/components/searchInputBox';
import { PoiManager } from '../3D/poi/poiManager';
import ToggleSwitch from '../../../Common/ui/toggleSwitch';
import { useSensorServerStatus } from '../../../Common/hooks/useSensorServerStatus';
import { getProjectTypeState } from '../../../Root/resource/projectType';

const ALL_BUILDING_GROUP_VALUE = '__all__';
const OUTDOOR_BUILDING_GROUP_VALUE = 'OUTDOOR';
const WATER_BUILDING_CODES = new Set(['T2-13', 'T8-1']);
const POWER_BUILDING_CODES = new Set(['T8-1']);
// Water 타입에서 T8-1 공장은 1층만 표시
const WATER_T8_1_FLOOR_FILTER = new Set(['T8-1 1층']);

function StatusInfo(props) {
    const { statusMap: sensorServerStatusMap } = useSensorServerStatus();
    const projectTypeState = getProjectTypeState();

    const [buildings, setBuildings] = useState(null);
    const [searchText, setSearchText] = useState("");
    const [allVisible, setAllVisible] = useState(true);

    // 존별 섹션 상태: 'sensor' | 'cctv' | 'equip' | null  (설비 섹션 포함)
    const [openGroupByZone, setOpenGroupByZone] = useState({});
    // 설비 2뎁스(가상 타입 헤더) 오픈 상태: zoneNo -> boolean
    const [openEquipTypeByZone, setOpenEquipTypeByZone] = useState({});
    const [openTypeByZone, setOpenTypeByZone] = useState({});

    const isEquipTypeOpen = (zoneNo) => !!openEquipTypeByZone[String(zoneNo)];
    const toggleEquipType = (zoneNo) =>
        setOpenEquipTypeByZone(prev => ({ ...prev, [String(zoneNo)]: !prev[String(zoneNo)] }));

    const toggleSensorType = (zoneNo, typeCode) => {
        const key = `${zoneNo}:${typeCode}`;

        const openedKey = Object.keys(openTypeByZone).find(
            k => k.startsWith(`${zoneNo}:`) && openTypeByZone[k] === true
        );

        const isCurrentlyOpen = !!openTypeByZone[key];

        // 트리 열림 상태 계산
        const next = { ...openTypeByZone };

        Object.keys(next).forEach(k => {
            if (k.startsWith(`${zoneNo}:`)) {
                next[k] = false;
            }
        });

        next[key] = !isCurrentlyOpen;

        setOpenTypeByZone(next);

        // 선택 해제 처리
        if (openedKey) {
            const [, openedTypeCode] = openedKey.split(":");

            if (
                props.selectedStatusInfo.zoneNo === zoneNo &&
                String(props.selectedStatusInfo.sensorTypeCode) === String(openedTypeCode)
            ) {
                props.setSelectedStatusInfo(prev => ({
                    ...prev,
                    sensorTypeCode: null,
                    sensorNo: null
                }));
            }
        }
    };

    const resetOpenGroups = () => {
        setOpenGroupByZone({});
        setOpenEquipTypeByZone({});
        setOpenTypeByZone({});
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

    const allowedBuildingCodeSet = useMemo(() => {
        if (projectTypeState.isWater) {
            return WATER_BUILDING_CODES;
        }

        if (projectTypeState.isPower) {
            return POWER_BUILDING_CODES;
        }

        return null;
    }, [projectTypeState.isPower, projectTypeState.isWater]);

    const isAllowedBuilding = (building) => {
        if (!allowedBuildingCodeSet) {
            return true;
        }

        const buildingKeys = [
            building?.buildingCode,
            building?.displayText,
            building?.name,
            building?.broadcastText,
        ]
            .filter(Boolean)
            .map(value => String(value).trim().toUpperCase());

        return buildingKeys.some(key => allowedBuildingCodeSet.has(key));
    };

    const isBuildingT8_1 = (building) => {
        const keys = [building?.buildingCode, building?.displayText, building?.name, building?.broadcastText]
            .filter(Boolean)
            .map(v => String(v).trim().toUpperCase());
        return keys.includes('T8-1');
    };

    const filterZonesForBuilding = (building) => {
        const zones = building?.zoneDatas ?? [];
        if (projectTypeState.isWater && isBuildingT8_1(building)) {
            return zones.filter(z => WATER_T8_1_FLOOR_FILTER.has(String(z.displayText ?? '').trim()));
        }
        return zones;
    };

    const buildingGroupOptions = useMemo(() => {
        const groups = props.spatialManager?.buildingGroups;
        const sites = props.spatialManager?.sites;
        const base = [];

        if (groups) {
            for (const [key, value] of Object.entries(groups)) {
                const hasAllowedBuildings = (value?.buildingDatas ?? []).some(bd =>
                    isAllowedBuilding(bd) && filterZonesForBuilding(bd).length > 0
                );

                if (!hasAllowedBuildings) {
                    continue;
                }

                base.push({
                    value: key,
                    label: value.displayText,
                });
            }
        }

        // sites 안에 하나라도 outdoorZones가 있으면 '외부영역' 옵션 추가
        const hasOutdoor = !allowedBuildingCodeSet && !!Object.values(sites ?? {}).find(
            (s) => Array.isArray(s?.outdoorZones) && s.outdoorZones.length > 0
        );
        if (hasOutdoor) {
            base.push({
                value: OUTDOOR_BUILDING_GROUP_VALUE,
                label: '외부영역',
            });
        }

        if (base.length === 0) {
            return [];
        }

        if (projectTypeState.isPower) {
            return base;
        }

        return [
            {
                value: ALL_BUILDING_GROUP_VALUE,
                label: '전체',
            },
            ...base
        ];
    }, [allowedBuildingCodeSet, projectTypeState.isPower, props.spatialManager]);

    useEffect(() => {
        const hasSelectedBuildingGroup = buildingGroupOptions.some(
            option => String(option.value) === String(props.selectedStatusInfo.buildingGroupNo)
        );

        if ((props.selectedStatusInfo.buildingGroupNo == null || !hasSelectedBuildingGroup) && buildingGroupOptions.length > 0) {
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

    // OUTDOOR 선택 시 sites에서 outdoorZones를 꺼내옴
    const outdoorZones = useMemo(() => {
        const sites = props.spatialManager?.sites ?? {};
        const zones = [];

        for (const s of Object.values(sites)) {
            if (Array.isArray(s?.outdoorZones) && s.outdoorZones.length > 0) {
                zones.push(...s.outdoorZones);
            }
        }
        return zones;
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

    const outdoorPseudoBuilding = useMemo(() => {
        if (!outdoorZones?.length) return null;
        return {
            buildingNo: OUTDOOR_BUILDING_GROUP_VALUE,
            displayText: '외부영역',
            zoneDatas: outdoorZones.map(z => ({
                zoneNo: z.zoneNo,
                displayText: z.displayText ?? z.name,
                sensors: z.sensors,
            })),
        };
    }, [outdoorZones]);

    useEffect(() => {
        if (props.selectedStatusInfo.buildingGroupNo === ALL_BUILDING_GROUP_VALUE) {
            const allBuildings = Object.values(props.spatialManager?.buildings ?? {}).filter(isAllowedBuilding);
            const nextBuildings = !allowedBuildingCodeSet && outdoorPseudoBuilding
                ? [...allBuildings, outdoorPseudoBuilding]
                : allBuildings;

            setBuildings(nextBuildings);
            return;
        }
        // OUTDOOR 선택 시: 외부영역만 트리에 보이도록 세팅
        if (props.selectedStatusInfo.buildingGroupNo === OUTDOOR_BUILDING_GROUP_VALUE) {
            if (!allowedBuildingCodeSet && outdoorPseudoBuilding) {
                setBuildings([outdoorPseudoBuilding]);
            } else {
                setBuildings([]);
            }
            return;
        }

        if (!props.spatialManager?.buildings) return;

        const _buildings = [];
        for (const key in props.spatialManager.buildings) {
            const selectedGroupNo = props.spatialManager?.buildingGroups?.[props.selectedStatusInfo.buildingGroupNo]?.buildingGroupNo ?? null;
            const b = props.spatialManager.buildings[key];
            if (selectedGroupNo !== null && b.buildingGroupNo === selectedGroupNo && isAllowedBuilding(b)) {
                _buildings.push(b);
            }
        }
        setBuildings(_buildings.length > 0 ? _buildings : []);
    }, [allowedBuildingCodeSet, props.selectedStatusInfo.buildingGroupNo, props.spatialManager, outdoorPseudoBuilding]);

    const handleSubmit = (value) => {
        setSearchText((value ?? "").trim());
    };

    const handleChangeBuildingGroup = (value) => {
        props.setSelectedStatusInfo({
            buildingGroupNo: value,
            buildingNo: null,
            zoneNo: null,
            sensorTypeCode: null,
            sensorNo: null,
            facilityNo: null
        });
        // 그룹 전환 시 섹션/설비타입 접기
        resetOpenGroups();
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
                if (!props.showPopups[SdmsResource.ID.menu.cctvInfo]) props.setVisiblePopups(SdmsResource.ID.menu.cctvInfo, true);
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

    const getBuildingGroups = () => buildingGroupOptions;

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
            for (const z of filterZonesForBuilding(b)) {
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

                const zones = filterZonesForBuilding(b);
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
            const buildingMatched = matchText(b.displayText);
            const isBuildingOpen =
                b.buildingNo === props.selectedStatusInfo.buildingNo;

            const allowedZones = filterZonesForBuilding(b);
            const zonesForRender = hasQuery
                ? (buildingMatched
                    ? allowedZones
                    : allowedZones.filter((z) =>
                        matchText(z.displayText) ||
                        anySensorMatchInZone(z.zoneNo) ||
                        anyFacilityMatchInZone(z.zoneNo)
                    ))
                : allowedZones;

            return (
                <li key={`building_${b.buildingNo}`}>
                    <div
                        className={isBuildingOpen ? 'building on' : 'building'}
                        onClick={(e) => setSelectedValueInfo(e, 'building', b)}
                    >
                        <Icon.Arrow
                            size="xxxxxs"
                            direction={isBuildingOpen ? "bottom" : "right"}
                        />
                        <p>{b.displayText}</p>
                    </div>

                    <ul className={isBuildingOpen ? 'tree depth1 on' : 'tree depth1'}>
                        {getZones(zonesForRender, isBuildingOpen, buildingMatched)}
                    </ul>
                </li>
            );
        });
    };

    const getZones = (zones, isBuildingOpen, buildingMatched = false) => {
        if (!zones || zones.length === 0) return null;

        return zones.map((z) => {
            const zoneMatched = matchText(z.displayText);
            const includeAllSensors = zoneMatched || buildingMatched;

            const isZoneOpen =
                isBuildingOpen &&
                z.zoneNo === props.selectedStatusInfo.zoneNo;

            const isSensorListOpen = isGroupOpen(z.zoneNo, 'sensor');
            const isCctvListOpen = isGroupOpen(z.zoneNo, 'cctv');
            const isEquipListOpen = isGroupOpen(z.zoneNo, 'equip');

            const zoneSensors = z.sensors ?? {};

            // 센서 그룹 (CCTV 및 프로젝트 타입에 따른 설비 타입 제외)
            const hiddenSensorTypeNames = new Set(['CCTV']);
            if (projectTypeState.isWater) hiddenSensorTypeNames.add(SdmsResource.getFacilityTypeString(SdmsResource.facilityType.EQUIPMENT_PeakPower));
            if (projectTypeState.isPower) hiddenSensorTypeNames.add(SdmsResource.getFacilityTypeString(SdmsResource.facilityType.EQUIPMENT_PredictAlarm));

            const normalSensorEntries = Object.entries(zoneSensors)
                .filter(([key]) => !hiddenSensorTypeNames.has(key));

            const sensorCount = normalSensorEntries.reduce((acc, [, list]) => {
                const items = includeAllSensors
                    ? list
                    : list.filter(item =>
                        matchText(item.sensor.sensor_name)
                    );
                return acc + items.length;
            }, 0);

            // CCTV
            const cctvList = zoneSensors['CCTV'] ?? [];
            const cctvCount = includeAllSensors
                ? cctvList.length
                : cctvList.filter(item =>
                    matchText(item.sensor.sensor_name)
                ).length;

            // 설비
            const equipCount = countSensorsInSection(
                z.zoneNo,
                'equip',
                includeAllSensors
            );

            return (
                <li key={`zone_${z.zoneNo}`}>
                    <div
                        className={isZoneOpen ? 'zone on' : 'zone'}
                        onClick={(e) =>
                            setSelectedValueInfo(e, 'zone', {
                                zone: z,
                                buildingNo: props.selectedStatusInfo.buildingNo || null
                            })
                        }
                    >
                        <Icon.Arrow
                            size="xxxxxs"
                            direction={isZoneOpen ? 'bottom' : 'right'}
                        />
                        <p>{z.displayText}</p>
                        {/* 외부영역을 제외한 zone에만 이동 버튼 표출 */}
                        {z.zoneNo < 20000 &&
                            <button
                                className='moveBtn'
                                onClick={(e) => { e.stopPropagation(); props.moveToZone(z.zoneNo); }}
                            >
                                이동
                            </button>
                        }
                    </div>

                    <ul className={isZoneOpen ? 'tree depth2 on' : 'tree depth2'}>

                        {/* 센서 섹션 */}
                        <li>
                            <div
                                className={isSensorListOpen ? 'sensorType on' : 'sensorType'}
                                onClick={(e) =>
                                    setSelectedValueInfo(e, 'sensorGroupToggle', {
                                        zoneNo: z.zoneNo,
                                        group: 'sensor'
                                    })
                                }
                                ref={(el) => {
                                    if (!groupHeaderRefs.current[z.zoneNo]) groupHeaderRefs.current[z.zoneNo] = {};
                                    groupHeaderRefs.current[z.zoneNo]['sensor'] = el;
                                }}
                            >
                                <Icon.Arrow
                                    size="xxxxxs"
                                    direction={isSensorListOpen ? 'bottom' : 'right'}
                                />
                                <p className="sensorText">
                                    센서 ({sensorCount})
                                </p>
                            </div>

                            <ul
                                className={isSensorListOpen ? 'tree depth3 on' : 'tree depth3'}
                                onClick={(e) => e.stopPropagation()}  // 내부 클릭 버블링 차단
                            >
                                {isSensorListOpen
                                    ? getSensorGroups(z.zoneNo, includeAllSensors, 'sensor')
                                    : null}
                            </ul>
                        </li>

                        {/* CCTV 섹션 */}
                        <li>
                            <div
                                className={isCctvListOpen ? 'sensorType on' : 'sensorType'}
                                onClick={(e) =>
                                    setSelectedValueInfo(e, 'sensorGroupToggle', {
                                        zoneNo: z.zoneNo,
                                        group: 'cctv'
                                    })
                                }
                                ref={(el) => {
                                    if (!groupHeaderRefs.current[z.zoneNo]) groupHeaderRefs.current[z.zoneNo] = {};
                                    groupHeaderRefs.current[z.zoneNo]['cctv'] = el;
                                }}
                            >
                                <Icon.Arrow
                                    size="xxxxxs"
                                    direction={isCctvListOpen ? 'bottom' : 'right'}
                                />
                                <p className="sensorText">
                                    CCTV ({cctvCount})
                                </p>
                            </div>

                            <ul
                                className={isCctvListOpen ? 'tree depth3 on' : 'tree depth3'}
                                onClick={(e) => e.stopPropagation()}  // 내부 클릭 버블링 차단
                            >
                                {isCctvListOpen
                                    ? getSensorGroups(z.zoneNo, includeAllSensors, 'cctv')
                                    : null}
                            </ul>
                        </li>

                        {/* 설비 섹션 (props.facilityList 사용, 3-depth) */}
                        <li>
                            <div
                                className={isEquipListOpen ? 'sensorType on' : 'sensorType'}
                                onClick={(e) =>
                                    setSelectedValueInfo(e, 'sensorGroupToggle', {
                                        zoneNo: z.zoneNo,
                                        group: 'equip'
                                    })
                                }
                                ref={(el) => {
                                    if (!groupHeaderRefs.current[z.zoneNo]) groupHeaderRefs.current[z.zoneNo] = {};
                                    groupHeaderRefs.current[z.zoneNo]['equip'] = el;
                                }}
                            >
                                <Icon.Arrow
                                    size="xxxxxs"
                                    direction={isEquipListOpen ? 'bottom' : 'right'}
                                />
                                <p className="sensorText">
                                    설비 ({equipCount})
                                </p>
                            </div>

                            <ul
                                className={isEquipListOpen ? 'tree depth3 on' : 'tree depth3'}
                                onClick={(e) => e.stopPropagation()}  // 내부 클릭 버블링 차단
                            >
                                {isEquipListOpen
                                    ? getFacilityGroups(z.zoneNo, includeAllSensors)
                                    : null}
                            </ul>
                        </li>
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
            if (projectTypeState.isWater && st.sensorTypeCode === SdmsResource.facilityType.EQUIPMENT_PeakPower) continue;
            if (projectTypeState.isPower && st.sensorTypeCode === SdmsResource.facilityType.EQUIPMENT_PredictAlarm) continue;
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

    // group: 'sensor' | 'cctv'
    const getSensorGroups = (zoneNo, includeAllSensors = false, group = 'sensor') => {
        if (!props.sensorTypes || props.sensorTypes.length === 0) return null;

        const isCctvSection = (group === 'cctv');
        const CCTV_CODE = SdmsResource.facilityType.CCTV;

        return props.sensorTypes.map((st) => {
            const isCctvType = (st.sensorTypeCode === CCTV_CODE);

            if (isCctvSection && !isCctvType) return null;
            if (!isCctvSection && isCctvType) return null;

            if (projectTypeState.isWater && st.sensorTypeCode === SdmsResource.facilityType.EQUIPMENT_PeakPower) return null;
            if (projectTypeState.isPower && st.sensorTypeCode === SdmsResource.facilityType.EQUIPMENT_PredictAlarm) return null;

            const sensorsInZone = (st.sensors ?? []).filter(
                x => String(x?.sensor?.zone_sn) === String(zoneNo)
            );

            const sensorsForQuery = (hasQuery && !includeAllSensors)
                ? sensorsInZone.filter(x => matchText(x?.sensor?.sensor_name))
                : sensorsInZone;

            if (sensorsForQuery.length === 0) return null;

            const key = `${zoneNo}:${st.sensorTypeCode}`;
            const isTypeOpen = !!openTypeByZone[key];

            return (
                <li key={`sensorType_${st.sensorTypeCode}`}>
                    <div
                        className={isTypeOpen ? 'sensor on' : 'sensor'}
                        onClick={(e) => {
                            e.stopPropagation();
                            toggleSensorType(zoneNo, st.sensorTypeCode);
                        }}
                        ref={(el) => {
                            typeHeaderRefs.current[key] = el;
                        }}
                    >
                        <Icon.Arrow
                            size="xxxxxs"
                            direction={isTypeOpen ? "bottom" : "right"}
                        />
                        <p className='sensorText'>
                            {`${st.sensorTypeName} (${sensorsForQuery.length})`}
                        </p>
                    </div>

                    <ul
                        className={isTypeOpen ? 'tree depth4 on' : 'tree depth4'}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {isTypeOpen
                            ? getSensors(sensorsForQuery, st.sensorTypeCode)
                            : null}
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
                            item.sensor.sensor_ty_code !== SdmsResource.facilityType.EQUIPMENT_PredictAlarm &&
                            item.sensor.sensor_ty_code !== SdmsResource.facilityType.EQUIPMENT_PeakPower && (
                                !sensorServerStatus 
                                    ? <Icon.ClipOffIcon size="xxxxxs" />
                                    : item.sensor.enab 
                                        ? <Icon.ClipIcon size="xxxxxs" />
                                        : <Icon.ClipOffIcon size="xxxxxs" />
                            )
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

    const moveToBuildingGroup = (e) => {
        e.stopPropagation();
        if (!props.selectedStatusInfo.buildingGroupNo) return;
        props.moveToBuildingGroup(props.selectedStatusInfo.buildingGroupNo);
    };

    const setVisiblePoi = (sensorType) => {
        if (sensorType === PoiManager.Equipment_Predict) {
            // AI 설비 예지보전과 AI 전력분석 POI는 함께 Visible
            props.visibleSensorTypes[PoiManager.Equipment_Power] = !props.visibleSensorTypes[sensorType];
        }

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

    const zoneToBuildingNo = useMemo(() => {
        const map = new Map();
        if (buildings?.length) {
            for (const b of buildings) {
                for (const z of filterZonesForBuilding(b)) {
                    map.set(String(z.zoneNo), b.buildingNo);
                }
            }
        }
        // OUTDOOR 선택 시 외부영역 zone들도 매핑
        for (const oz of (outdoorZones ?? [])) {
            map.set(String(oz.zoneNo), OUTDOOR_BUILDING_GROUP_VALUE);
        }
        return map;
    }, [buildings, outdoorZones]);

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

    // POI 뷰어의 개별 버튼이 전부 show/hide 상태라면 그에 맞게 전체 toogleSwitch도 상태 변경
    useEffect(() => {
        if (!props.visibleSensorTypes) return;

        const values = Object.values(props.visibleSensorTypes);

        if (values.length === 0) return;

        const allOn = values.every(v => v === true);
        const allOff = values.every(v => v === false);

        if (allOn && !allVisible) {
            setAllVisible(true);
        } else if (allOff && allVisible) {
            setAllVisible(false);
        }
    }, [props.visibleSensorTypes]);

    useEffect(() => {
        const { zoneNo, sensorTypeCode } = props.selectedStatusInfo;

        if (!zoneNo || !sensorTypeCode) return;

        const key = `${zoneNo}:${sensorTypeCode}`;

        setOpenTypeByZone(prev => ({
            ...prev,
            [key]: true
        }));

    }, [props.selectedStatusInfo.zoneNo, props.selectedStatusInfo.sensorTypeCode]);

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
                        <div className='titleWrap'>
                            <p>POI 뷰어</p>
                            <div className='all'>
                                <p>전체</p>
                                <ToggleSwitch
                                    leftcolor="#878787" 
                                    rightcolor="#ffffff"
                                    leftbgcolor="#787C87"
                                    rightbgcolor="#E5ECFF"
                                    circleColor="#0C2CCA"
                                    type="normal"
                                    setChecked={allVisible ? hideAll : showAll}
                                    isChecked={allVisible}
                                    isDisabled={false}
                                />
                            </div>
                        </div>
                        <div className='buttonWrap'>
                            <button
                                className={props.visibleSensorTypes[PoiManager.Fire_Sensor] ? 'on' : null}
                                onClick={() => setVisiblePoi(PoiManager.Fire_Sensor)}
                                data-tooltip="화재"
                            >
                                <Icon.StatusInfoFire size={"xxxs"} />
                            </button>
                            <button
                                className={props.visibleSensorTypes[PoiManager.PSM_Sensor] ? 'on' : null}
                                onClick={() => setVisiblePoi(PoiManager.PSM_Sensor)}
                                data-tooltip="누출"
                            >
                                <Icon.StatusInfoPSM size={"xxxs"} />
                            </button>
                            <button
                                className={props.visibleSensorTypes[PoiManager.PM25] ? 'on' : null}
                                onClick={() => setVisiblePoi(PoiManager.PM25)}
                                data-tooltip="미세먼지"
                            >
                                <Icon.StatusInfoPM25 size={"xxs"} />
                            </button>
                            <button
                                className={props.visibleSensorTypes[PoiManager.MovingScanerPoi] ? 'on' : null}
                                onClick={() => setVisiblePoi(PoiManager.MovingScanerPoi)}
                                data-tooltip="이동식 스캐너"
                            >
                                <Icon.StatusInfoWorker size={"xxxs"} />
                            </button>
                            <button
                                className={props.visibleSensorTypes[PoiManager.Sump] ? 'on' : null}
                                onClick={() => setVisiblePoi(PoiManager.Sump)}
                                data-tooltip="집수정"
                            >
                                <Icon.StatusInfoSump size={"xxxs"} />
                            </button>
                            <button
                                className={props.visibleSensorTypes[PoiManager.Etc_Sensor] ? 'on' : null}
                                onClick={() => setVisiblePoi(PoiManager.Etc_Sensor)}
                                data-tooltip="ETC"
                            >
                                <Icon.StatusInfoETC size={"xxs"} />
                            </button>
                            <button
                                className={props.visibleSensorTypes[PoiManager.CCTV_Sensor] ? 'on' : null}
                                onClick={() => setVisiblePoi(PoiManager.CCTV_Sensor)}
                                data-tooltip="CCTV"
                            >
                                <Icon.StatusInfoCCTV size={"xxxs"} />
                            </button>
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
                    <div className='buildingGroupWrap'>
                        <SelectBox
                            value={props.selectedStatusInfo.buildingGroupNo || ""}
                            onChange={handleChangeBuildingGroup}
                            options={getBuildingGroups()}
                        />
                        <button className='moveBtn' onClick={moveToBuildingGroup}>이동</button>
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