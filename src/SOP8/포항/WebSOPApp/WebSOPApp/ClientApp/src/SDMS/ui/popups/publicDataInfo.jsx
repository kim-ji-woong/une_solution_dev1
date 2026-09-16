import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';

import PopupDraggable from './popupDraggable';
import { PublicDataComponent } from '../../styled/sdmsPopupsStyled';
import SdmsResource from '../../resource/id';
import {ExternalController} from "../../services/externalController";
import {SDMSController} from "../../services/sdmsController";
import ProjectResource from "../../../Root/resource/id";

function PublicData(props) {
    const { showConfirmDialog } = props;
    
    const [opacity, setOpacity] = useState(1); 
    const [menu, setMenu] = useState(SdmsResource.publicDataMenuType.emission);
    
    const [loading, setLoading] = useState(false);
    const [loadError, setLoadError] = useState(null);
    
    const [tmsList, setTmsList] = useState(null);
    const [airKoreaList, setAirKoreaList] = useState(null);
    const [weatherList, setWeatherList] = useState(null);
    
    const [selectedValue, setSelectedValue] = useState('');
    
    const inFlightRef = React.useRef(false);
    const mountedRef = React.useRef(false);

    const fetchPublicData = useCallback(async () => {
        if (inFlightRef.current) return;

        inFlightRef.current = true;
        setLoading(true);
        setLoadError(null);

        try {
            const result = await ExternalController.requestExternalPublicData();

            if (!result.success) return;
            if (!mountedRef.current) return;

            setTmsList(result.publicTmsList);
            setAirKoreaList(result.publicAirKoreaList);
            setWeatherList(result.publicWeatherList);
        }
        catch (e) {
            showConfirmDialog(ProjectResource.dialogTypes.ERROR, '공공데이터를 불러오는 중 오류가 발생했습니다.', null, null);
        }
        finally {
            setLoading(false);
            inFlightRef.current = false;
        }
    }, [showConfirmDialog, inFlightRef.current, mountedRef.current]);
    
    const fetchRef = useRef(fetchPublicData);

    useEffect(() => {
        fetchRef.current = fetchPublicData;
    }, [fetchPublicData]);

    useEffect(() => {
        mountedRef.current = true;

        fetchRef.current(); // 최초 1회

        const intervalMs = 10 * 60 * 1000;
        const timerId = window.setInterval(() => {
            fetchRef.current(); // 이후 10분마다
        }, intervalMs);

        return () => {
            mountedRef.current = false;
            window.clearInterval(timerId);
        };
    }, []);

    const getNodataUI = () => (
        <div className="noData">
            <p>선택한 측정소에 데이터가 없습니다.</p>
            <p>공공데이터가 제공되지 않습니다.</p>
        </div>
    );

    const changePopupOpacity = (value) => {
        setOpacity(value);
    }

    useEffect(() => {
        setSelectedValue('');
    }, [menu]);

    const menuConfig = useMemo(() => {
        if (menu === SdmsResource.publicDataMenuType.emission) {
            return {
                list: Array.isArray(tmsList) ? tmsList : [],
                getValue: (item) => item.company_name, // option value
                getLabel: (item) => item.company_name, // option text
            };
        }

        if (menu === SdmsResource.publicDataMenuType.airQuality) {
            return {
                list: Array.isArray(airKoreaList) ? airKoreaList : [],
                getValue: (item) => item.lc_name,
                getLabel: (item) => item.lc_name,
            };
        }

        if (menu === SdmsResource.publicDataMenuType.weather) {
            return {
                list: Array.isArray(weatherList) ? weatherList : [],
                getValue: (item) => item.region_name ?? item.name,
                getLabel: (item) => item.region_name ?? item.name,
            };
        }

        return { list: [], getValue: () => '', getLabel: () => '' };
    }, [menu, tmsList, airKoreaList, weatherList]);

    const selectedItem = useMemo(() => {
        if (!selectedValue) 
            return null;
        
        return menuConfig.list.find((x) => String(menuConfig.getValue(x)) === String(selectedValue)) ?? null;
    }, [selectedValue, menuConfig]);

    const derivedViewModel = useMemo(() => {
        if (!selectedItem) {
            return { locationText: '', rows: null, measuredAtText: '-' };
        }

        const locationText = selectedItem.address ?? selectedItem.address ?? '';
        const measuredAtText = selectedItem.tm ?? selectedItem.tm ?? '-';
        //const rows = Array.isArray(selectedItem.items) ? selectedItem.items : null;
        let rows = [];
        if (menu === SdmsResource.publicDataMenuType.emission) {
            rows.push({ label: '황산화물', value: selectedItem.sox_value ?? ''});
            rows.push({ label: '질소산화물', value: selectedItem.nox_value ?? ''});
            rows.push({ label: '일산화탄소', value: selectedItem.co_value ?? ''});
            rows.push({ label: '먼지', value: selectedItem.tsp_value ?? ''});
            rows.push({ label: '염화수소', value: selectedItem.hcl_value ?? ''});
            rows.push({ label: '불화수소', value: selectedItem.hf_value ?? ''});
            rows.push({ label: '암모니아', value: selectedItem.nh3_value ?? ''});
        }
        if (menu === SdmsResource.publicDataMenuType.airQuality) {
            rows.push({ label: '미세먼지', value: selectedItem.pm10_value ?? ''});
            rows.push({ label: '초미세먼지', value: selectedItem.pm25_value ?? ''});
            rows.push({ label: '오존', value: selectedItem.o3_value ?? ''});
            rows.push({ label: '일산화탄소', value: selectedItem.co_value ?? ''});
            rows.push({ label: '이산화황', value: selectedItem.so2_value ?? ''});
        }
        if (menu === SdmsResource.publicDataMenuType.weather) {
            rows.push({ label: '온도', value: selectedItem.temp_value ?? ''});
            rows.push({ label: '습도', value: selectedItem.humi_value ?? ''});
            rows.push({ label: '풍속', value: selectedItem.wind_speed_value ?? ''});
            rows.push({ label: '풍향', value: selectedItem.wind_direction_value ?? ''});
            rows.push({ label: '기압', value: selectedItem.air_pressure_value ?? ''});
            rows.push({ label: '일사량', value: selectedItem.insolation_value ?? ''});
        }

        return { locationText, rows, measuredAtText };
    }, [selectedItem, menu]);

    const selectGrid = (
        <div className="selectWrap">
            <select
                value={selectedValue}
                onChange={(e) => setSelectedValue(e.target.value)}
                disabled={loading || menuConfig.list.length === 0}
            >
                <option value="">선택</option>
                {menuConfig.list.map((item, idx) => {
                    const v = menuConfig.getValue(item);
                    const label = menuConfig.getLabel(item);
                    return (
                        <option key={`${String(v)}-${idx}`} value={String(v)}>
                            {String(label)}
                        </option>
                    );
                })}
            </select>
        </div>
    );

    const bodyUI = (() => {
        // 선택이 없거나 rows가 없으면 no-data UI
        if (!selectedItem) return getNodataUI();
        if (!derivedViewModel.rows || derivedViewModel.rows.length === 0) return getNodataUI();

        return (
            <>
                <ul className="head">
                    <li>
                        <span>항목</span>
                        <span>수치</span>
                    </li>
                </ul>

                <ul className="body scrollbar">
                    {derivedViewModel.rows.map((row, idx) => (
                        <li key={idx} className={row.disabled ? 'disable' : null}>
                            <span>{row.label}</span>
                            <span>{row.value ?? '-'}</span>
                        </li>
                    ))}
                </ul>
            </>
        );
    })();

    const locationUI = derivedViewModel.locationText ? (
        <div className="location">
            <p>{derivedViewModel.locationText}</p>
        </div>
    ) : (
        <div className="location">
            <p></p>
        </div>
    );

    const formatDateTime = (input) => {
        if (!input) return '-';

        // Date 객체도 허용
        if (input instanceof Date) {
            const y = input.getFullYear();
            const m = String(input.getMonth() + 1).padStart(2, '0');
            const d = String(input.getDate()).padStart(2, '0');
            const hh = String(input.getHours()).padStart(2, '0');
            const mm = String(input.getMinutes()).padStart(2, '0');
            const ss = String(input.getSeconds()).padStart(2, '0');
            return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
        }

        const s = String(input).trim();

        // 1) 이미 "YYYY-MM-DD HH:mm:ss"면 그대로(초가 없으면 보정)
        const matchSpace = s.match(/^(\d{4}-\d{2}-\d{2})\s(\d{2}:\d{2})(?::(\d{2}))?$/);
        if (matchSpace) {
            const date = matchSpace[1];
            const time = matchSpace[3] ? `${matchSpace[2]}:${matchSpace[3]}` : `${matchSpace[2]}:00`;
            return `${date} ${time}`;
        }

        // 2) ISO 문자열(예: 2025-10-31T09:00:00, 2025-10-31T09:00:00Z, 2025-10-31T09:00:00+09:00)
        const matchIso = s.match(/^(\d{4}-\d{2}-\d{2})[T\s](\d{2}:\d{2}:\d{2})/);
        if (matchIso) {
            return `${matchIso[1]} ${matchIso[2]}`;
        }

        // 3) 그 외는 Date 파싱 시도(환경에 따라 로컬/UTC 처리 차이가 있을 수 있음)
        const dt = new Date(s);
        if (!Number.isNaN(dt.getTime())) {
            const y = dt.getFullYear();
            const m = String(dt.getMonth() + 1).padStart(2, '0');
            const d = String(dt.getDate()).padStart(2, '0');
            const hh = String(dt.getHours()).padStart(2, '0');
            const mm = String(dt.getMinutes()).padStart(2, '0');
            const ss = String(dt.getSeconds()).padStart(2, '0');
            return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
        }

        return '-';
    };


    return (
        <PublicDataComponent id={props.popupType} className="UI_Section publicData" $opacity={opacity} $resize={true} $menu={menu}>
            <PopupDraggable
                id={props.popupType}
                popupMinWidth={300}
                popupMinHeight={476}
                topSize={40}
                popupState={props.popupState}
                setActiveDragPopup={props.setActiveDragPopup}
                setPopupState={props.setPopupState}
                usePopupResize={true}
            >
                <div className="dslTop">
                    <h5 className="dslTitle">
                        {SdmsResource.ID.menu.publicData}
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
                    <button className="dslX">닫기</button>
                </div>

                <div className={'content'}>
                    <div className="menuWrap">
                        <button
                            className={menu === SdmsResource.publicDataMenuType.emission ? 'on' : null}
                            onClick={() => setMenu(SdmsResource.publicDataMenuType.emission)}
                        >
                            배출
                        </button>
                        <button
                            className={menu === SdmsResource.publicDataMenuType.airQuality ? 'on' : null}
                            onClick={() => setMenu(SdmsResource.publicDataMenuType.airQuality)}
                        >
                            대기질
                        </button>
                        <button
                            className={menu === SdmsResource.publicDataMenuType.weather ? 'on' : null}
                            onClick={() => setMenu(SdmsResource.publicDataMenuType.weather)}
                        >
                            기상
                        </button>
                    </div>

                    <div className="contentWrap">
                        {selectGrid}

                        <div className="contentBox">
                            {locationUI}
                            {bodyUI}
                        </div>

                        <div className="timeWrap">
                            <span>측정일시</span>
                            <span>{selectedItem ? formatDateTime(derivedViewModel.measuredAtText) : '-'}</span>
                        </div>
                    </div>
                </div>
            </PopupDraggable>
        </PublicDataComponent>
    );
}

export default PublicData;