import React, { useEffect, useMemo, useState } from 'react';
import { withRouter } from 'react-router-dom';

import PopupDraggable from './popupDraggable';
import { StatusInfoComponent } from '../../styled/sdmsPopupsStyled';
import SdmsResource from '../../resource/id';
import IconButton from '../../../Common/components/iconButton';
import Icon from '../../../Common/components/Icon/Icon';
import SelectBox from '../../../Common/components/selectBox';
import SearchInputBox from '../../../Common/components/searchInputBox';
import { PoiManager } from '../3D/poi/poiManager';

function StatusInfo(props) {
    const [buildings, setBuildings] = useState(null);
    const [searchText, setSearchText] = useState("");
    const [allVisible, setAllVisible] = useState(true);

    // 존별 섹션 상태: 'sensor' | 'cctv' | null
    const [openGroupByZone, setOpenGroupByZone] = useState({});

    const resetOpenGroups = () => setOpenGroupByZone({});

    // 헤더(센서/CCTV/설비) 클릭 시 토글
    const setOpenGroup = (zoneNo, group) => {
        setOpenGroupByZone(prev => {
            const current = prev[zoneNo] ?? null;
            const next = (current === group) ? null : group;
            return { ...prev, [zoneNo]: next };
        });
    };

    // 센서타입 클릭 시에는 항상 '열림' 유지
    const ensureOpenGroup = (zoneNo, group) => {
        setOpenGroupByZone(prev => (
            prev[zoneNo] === group ? prev : { ...prev, [zoneNo]: group }
        ));
    };

    const isGroupOpen = (zoneNo, group) => (openGroupByZone[zoneNo] === group);

    const buildingGroupOptions = useMemo(() => {
        const groups = props.spatialManager?.buildingGroups;
        if (!groups) return [];

        return Object.entries(groups).map(([key, value]) => ({
            value: key,
            label: value.displayText,
        }));
    }, [props.spatialManager]);

    useEffect(() => {
        if (!props.selectedStatusInfo.buildingGroupNo && buildingGroupOptions.length > 0) {
            props.setSelectedStatusInfo({
                buildingGroupNo: buildingGroupOptions[0].value,
                buildingNo: null,
                zoneNo: null,
                sensorTypeCode: null,
                sensorNo: null
            });
        }
    }, [buildingGroupOptions, props.selectedStatusInfo.buildingGroupNo, props.setSelectedStatusInfo]);

    useEffect(() => {
        if (!props.spatialManager?.buildings) return;

        const _buildings = [];
        for (const key in props.spatialManager.buildings) {
            const selectedGroupNo = props.spatialManager?.buildingGroups?.[props.selectedStatusInfo.buildingGroupNo]?.buildingGroupNo ?? null;
            const b = props.spatialManager.buildings[key];
            if (selectedGroupNo !== null && b.buildingGroupNo === selectedGroupNo) {
                _buildings.push(b);
            }
        }
        setBuildings(_buildings.length > 0 ? _buildings : []);
    }, [props.selectedStatusInfo.buildingGroupNo, props.spatialManager]);

    const handleSubmit = (value) => {
        setSearchText((value ?? "").trim());
    };

    const handleChangeBuildingGroup = (value) => {
        props.setSelectedStatusInfo({
            buildingGroupNo: value,
            buildingNo: null,
            zoneNo: null,
            sensorTypeCode: null,
            sensorNo: null
        });
        // 그룹 전환 시 섹션 접기
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
                sensorNo: null
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
                sensorNo: null
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
            props.setSelectedStatusInfo(prev => ({
                ...prev,
                sensorTypeCode: prev.sensorTypeCode === item.sensorTypeCode ? null : item.sensorTypeCode,
                sensorNo: null
            }));
            // 특정 센서 타입 선택 시, 섹션은 항상 열림 유지
            const group =
                (item.sensorTypeCode === SdmsResource.facilityType.CCTV)
                    ? 'cctv'
                    : (item.sensorTypeCode === SdmsResource.facilityType.EQUIPMENT)
                        ? 'equip'
                        : 'sensor';
            if (props.selectedStatusInfo.zoneNo != null) {
                ensureOpenGroup(props.selectedStatusInfo.zoneNo, group);
            }
        }
        else if (type === 'sensor') {
            props.setSelectedStatusInfo(prev => ({
                ...prev,
                sensorNo: prev.sensorNo === item.sensor.sensor_sn ? null : item.sensor.sensor_sn
            }));

            if (props.selectedStatusInfo.sensorTypeCode === SdmsResource.facilityType.CCTV) {
                props.setSelectedCCTVInfo?.({
                    zoneNo: item.sensor.zone_sn,
                    sensorNo: item.sensor.sensor_sn
                });
                if (!props.showPopups[SdmsResource.ID.menu.cctvInfo]) props.setVisiblePopups(SdmsResource.ID.menu.cctvInfo, true);
            }
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
                sensorNo: null
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
                        sensorNo: null
                    }));
                    resetOpenGroups();
                    return;
                }
            }
        }
    }, [query, hasQuery, buildings, props.setSelectedStatusInfo]);

    const getBuildings = () => {
        if (!buildings || buildings.length === 0) return null;

        const filteredBuildings = hasQuery
            ? buildings.filter((b) => {
                const buildingExact = equalsText(b.displayText);
                if (buildingExact) return true;

                const zones = b.zoneDatas ?? [];
                const buildingMatched = matchText(b.displayText);
                const anyZoneNameMatched = zones.some((z) => matchText(z.displayText));
                const anySensorMatched = zones.some((z) => anySensorMatchInZone(z.zoneNo));
                return buildingMatched || anyZoneNameMatched || anySensorMatched;
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
                    : (b.zoneDatas ?? []).filter((z) => matchText(z.displayText) || anySensorMatchInZone(z.zoneNo)))
                : b.zoneDatas;

            return (
                <li key={`building_${b.buildingNo}`}>
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
            const zoneExact = equalsText(z.displayText);
            const isZoneOpen = isBuildingOpen && (z.zoneNo === props.selectedStatusInfo.zoneNo);

            // 섹션별 열림 여부
            const isSensorListOpen = isGroupOpen(z.zoneNo, 'sensor');
            const isCctvListOpen = isGroupOpen(z.zoneNo, 'cctv');
            const isEquipListOpen = isGroupOpen(z.zoneNo, 'equip');

            const includeAllSensors = zoneExact || buildingExact;

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
                            >
                                <Icon.Arrow size="xxxxxs" direction={isSensorListOpen ? "bottom" : "right"} />
                                <p className='sensorText'>센서</p>
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
                            >
                                <Icon.Arrow size="xxxxxs" direction={isCctvListOpen ? "bottom" : "right"} />
                                <p className='sensorText'>CCTV</p>
                            </div>
                            <ul
                                className={isCctvListOpen ? 'tree depth3 on' : 'tree depth3'}
                                onClick={(e) => e.stopPropagation()}  // 내부 클릭 버블링 차단
                            >
                                {isCctvListOpen ? getSensorGroups(z.zoneNo, includeAllSensors, 'cctv') : null}
                            </ul>
                        </li>

                        {/* 설비 섹션 */}
                        <li>
                            <div
                                className={isEquipListOpen ? 'sensorType on' : 'sensorType'}
                                onClick={(e) => setSelectedValueInfo(e, 'sensorGroupToggle', { zoneNo: z.zoneNo, group: 'equip' })}
                            >
                                <Icon.Arrow size="xxxxxs" direction={isEquipListOpen ? "bottom" : "right"} />
                                <p className='sensorText'>설비</p>
                            </div>
                            <ul
                                className={isEquipListOpen ? 'tree depth3 on' : 'tree depth3'}
                                onClick={(e) => e.stopPropagation()}  // 내부 클릭 버블링 차단
                            >
                                {isEquipListOpen ? getSensorGroups(z.zoneNo, includeAllSensors, 'equip') : null}
                            </ul>
                        </li>
                    </ul>
                </li>
            );
        });
    };

    // group: 'sensor' | 'cctv' | 'equip'
    const getSensorGroups = (zoneNo, includeAllSensors = false, group = 'sensor') => {
        if (!props.sensorTypes || props.sensorTypes.length === 0) return null;

        const isCctvSection = (group === 'cctv');
        const isEquipSection = (group === 'equip');
        const CCTV_CODE = SdmsResource.facilityType.CCTV;
        const EQUIP_CODE = SdmsResource.facilityType.EQUIPMENT;

        return props.sensorTypes.map((st) => {
            const isCctvType = (st.sensorTypeCode === CCTV_CODE);
            const isEquipType = (st.sensorTypeCode === EQUIP_CODE);

            // 섹션 필터링
            if (isCctvSection && !isCctvType) return null;     // CCTV 섹션엔 CCTV만
            if (isEquipSection && !isEquipType) return null;   // 설비 섹션엔 EQUIPMENT만
            if (!isCctvSection && !isEquipSection && (isCctvType || isEquipType)) return null; // 센서 섹션엔 나머지(일반 센서)만

            const sensorsInZone = (st.sensors ?? []).filter(
                x => String(x?.sensor?.zone_sn) === String(zoneNo)
            );

            const sensorsForQuery = (hasQuery && !includeAllSensors)
                ? sensorsInZone.filter(x => matchText(x?.sensor?.sensor_name))
                : sensorsInZone;
            if (hasQuery && sensorsForQuery.length === 0) return null;
            const isTypeOpen =
                zoneNo === props.selectedStatusInfo.zoneNo &&
                st.sensorTypeCode === props.selectedStatusInfo.sensorTypeCode;

            return (
                <li
                    key={`sensorType_${st.sensorTypeCode}`}
                    onClick={(e) => setSelectedValueInfo(e, 'sensorType', st)}
                >
                    <div className={isTypeOpen ? 'sensor on' : 'sensor'}>
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

    const getSensors = (filteredSensors, sensorTypeCode) => {
        if (!filteredSensors || filteredSensors.length === 0) return null;

        const sensorServerStatus = props.getSensorServerStatus(sensorTypeCode);

        return filteredSensors.map((item) => (
            <li
                key={`sensor_${item.sensor.sensor_sn}`}
                onClick={(e) => setSelectedValueInfo(e, 'sensor', item)}
            >
                <div className={props.selectedStatusInfo.sensorNo === item.sensor.sensor_sn ? 'on' : null}>
                    <div className={'sensorInfo'}>
                        <Icon.MinusIcon size="xxxxxs" />
                        <p className='sensorText'>{item.sensor.sensor_name}</p>
                    </div>
                    <div className={'sensorStatus'}>
                        {/* sensorServerStatus === fasle : 센서 서버 연결 비정상 */}
                        {/* sensorServerStatus === true || null || undefined : 센서 서버 연결 정상 */}
                        {!sensorServerStatus ?  <Icon.ClipOffIcon size="xxxxxs" /> : item.sensor.enab ? <Icon.ClipIcon size="xxxxxs" /> : <Icon.ClipOffIcon size="xxxxxs" />}
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

    const setVisiblePoi = (sensorType) =>  {
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

    return (
        <StatusInfoComponent id={props.popupType} className='UI_Section statusInfo' $resize={true}>
            <PopupDraggable
                id={props.popupType}
                popupMinWidth={340}
                popupMinHeight={726}
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
                        <button
                            onClick={allVisible ? hideAll : showAll}
                            data-tooltip={allVisible ? "모두 숨기기" : "모두 보이기"}
                        >
                            {allVisible ? (
                                <Icon.StatusInfoHideAll size="xxs" />
                            ) : (
                                <Icon.StatusInfoShowAll size="xxs" />
                            )}
                        </button>
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
                            className={props.visibleSensorTypes[PoiManager.Worker] ? 'on' : null}
                            onClick={() => setVisiblePoi(PoiManager.Worker)}
                            data-tooltip="작업·인원현황"
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
                            className={props.visibleSensorTypes[PoiManager.EquipZoneName] ? 'on' : null}
                            onClick={() => setVisiblePoi(PoiManager.EquipZoneName)}
                            data-tooltip="구역명"
                        >
                            <Icon.StatusInfoEquipZoneName size={"xxxs"} />
                        </button>
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
                    <ul className='buildingWrap'>
                        {getBuildings()}
                    </ul>
                </div>
            </PopupDraggable>
        </StatusInfoComponent>
    );
}

export default withRouter(StatusInfo);