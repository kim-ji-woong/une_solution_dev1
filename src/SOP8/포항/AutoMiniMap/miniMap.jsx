// ═══════════════════════════════════════════════════════════════════════════════
// [ORIGINAL] 기존 convertCoords 방식 — 원복 시 아래 주석 해제 후 AutoMiniMap 블록 주석 처리
// ═══════════════════════════════════════════════════════════════════════════════
//
// import React, {useMemo, useState, useEffect, useCallback} from 'react';
//
// import PopupDraggable from './popupDraggable';
// import { MiniMapComponent } from '../../styled/sdmsPopupsStyled';
// import SdmsResource from '../../resource/id';
//
// import miniMapImg from '../../images/miniMap_img.png';
// import miniMapPng from '../../images/minimap.png';
// import position from '../../images/position_icon.svg';
// import alarm from '../../images/alarm_icon.svg';
//
// function MiniMap(props) {
//     const [opacity, setOpacity] = useState(1);
//
//     const changePopupOpacity = (value) => {
//         setOpacity(value);
//     };
//
//     let showPosition = true;
//     let showAlarm = true;
//
//     const convertCoords = useCallback((lat, lon) => {
//         const nLat = Number(lat);
//         const nLon = Number(lon);
//
//         if (!Number.isFinite(nLat) || !Number.isFinite(nLon)) return null;
//
//         const left = (nLon - 129.332) * 961.5;
//         const top = (36.0691 - nLat) * 744.4;
//
//         return {
//             top: `${top.toFixed(3)}%`,
//             left: `${left.toFixed(3)}%`,
//         };
//     }, []);
//
//     const sensorLinkByZoneSn = useMemo(() => {
//         const links = Array.isArray(props.sensorLinks) ? props.sensorLinks : [];
//         const map = new Map();
//
//         for (const link of links) {
//             const key = link?.zone_sn != null ? String(link.zone_sn) : null;
//             if (key != null) map.set(key, link);
//         }
//
//         return map;
//     }, [props.sensorLinks]);
//
//     const selectedLat = props.selectedSensor?.sensor?.sensorLink?.lat;
//     const selectedLon = props.selectedSensor?.sensor?.sensorLink?.lon;
//
//     const positionStyle = useMemo(() => {
//         return convertCoords(selectedLat, selectedLon);
//     }, [selectedLat, selectedLon, convertCoords]);
//
//     const alarmStyles = useMemo(() => {
//         if (sensorLinkByZoneSn.size === 0) return [];
//
//         const alarms = Array.isArray(props.sensorAlarms) ? props.sensorAlarms : [];
//         const seenZones = new Set();
//         const styles = [];
//
//         for (const a of alarms) {
//             const zoneKey = a?.zoneNo != null ? String(a.zoneNo) : null;
//             if (!zoneKey) continue;
//
//             if (seenZones.has(zoneKey)) continue;
//             seenZones.add(zoneKey);
//
//             const matchedLink = sensorLinkByZoneSn.get(zoneKey);
//             const style = convertCoords(matchedLink?.lat, matchedLink?.lon);
//             if (!style) continue;
//
//             styles.push({ key: `zone-${zoneKey}`, zoneNo: zoneKey, style });
//         }
//
//         return styles;
//     }, [props.sensorAlarms, sensorLinkByZoneSn, convertCoords]);
//
//     return (
//         <MiniMapComponent
//             id={props.popupType}
//             className='UI_Section miniMap'
//             $opacity={opacity}
//             $resize={false}
//             $showPosition={showPosition}
//             $showAlarm={showAlarm}
//         >
//             <PopupDraggable
//                 id={props.popupType}
//                 popupMinWidth={300}
//                 popupMinHeight={254}
//                 topSize={40}
//                 popupState={props.popupState}
//                 setActiveDragPopup={props.setActiveDragPopup}
//                 setPopupState={props.setPopupState}
//                 usePopupResize={false}
//             >
//                 <div className='dslTop'>
//                     <h5 className='dslTitle'>
//                         {SdmsResource.ID.menu.miniMap}
//                     </h5>
//                     <input
//                         type="range"
//                         className="rangeInput"
//                         min={0.1}
//                         max={1}
//                         color="gray"
//                         step={0.1}
//                         defaultValue={opacity}
//                         onChange={(e) => { changePopupOpacity(e.target.valueAsNumber); }}
//                     />
//                     <button className='dslX'>닫기</button>
//                 </div>
//
//                 <div className={'content'}>
//                     <div>
//                         <img src={miniMapPng} alt='미니맵 이미지' />
//
//                         {positionStyle && (
//                             <img
//                                 src={position}
//                                 alt='포지션 아이콘'
//                                 className='position'
//                                 style={positionStyle}
//                             />
//                         )}
//
//                         {alarmStyles.map((a) => (
//                             <img
//                                 key={a.key}
//                                 src={alarm}
//                                 alt='알람 아이콘'
//                                 className='alarm'
//                                 style={a.style}
//                                 data-zone-no={a.zoneNo}
//                             />
//                         ))}
//                     </div>
//                 </div>
//             </PopupDraggable>
//         </MiniMapComponent>
//     );
// }
//
// export default MiniMap;


// ═══════════════════════════════════════════════════════════════════════════════
// [ACTIVE] AutoMiniMap 방식 — 원복 시 이 블록 주석 처리 후 ORIGINAL 블록 주석 해제
// ═══════════════════════════════════════════════════════════════════════════════

import React, { useMemo, useState } from 'react';
import PopupDraggable from './popupDraggable';
import { MiniMapComponent } from '../../styled/sdmsPopupsStyled';
import SdmsResource from '../../resource/id';
import AutoMiniMap from '../autoMiniMap/AutoMiniMap';

function MiniMap(props) {
    const [opacity, setOpacity] = useState(1);

    const changePopupOpacity = (value) => setOpacity(value);

    // zone_sn → sensorLink 매핑
    const sensorLinkByZoneSn = useMemo(() => {
        const links = Array.isArray(props.sensorLinks) ? props.sensorLinks : [];
        const map = new Map();
        for (const link of links) {
            const key = link?.zone_sn != null ? String(link.zone_sn) : null;
            if (key != null) map.set(key, link);
        }
        return map;
    }, [props.sensorLinks]);

    // 전체 센서 포인트 목록 (지도 범위 계산용)
    // id: zone_sn 을 고유 식별자로 사용
    const allPoints = useMemo(() => {
        const result = [];
        sensorLinkByZoneSn.forEach((link, zoneSn) => {
            const lat = Number(link?.lat);
            const lon = Number(link?.lon);
            if (Number.isFinite(lat) && Number.isFinite(lon)) {
                result.push({ lat, lon, id: zoneSn });
            }
        });
        return result;
    }, [sensorLinkByZoneSn]);

    // 선택된 센서 ID (selectedSensor의 zone_sn)
    const selectedId = useMemo(() => {
        const sn = props.selectedSensor?.sensor?.sensorLink?.zone_sn;
        return sn != null ? String(sn) : undefined;
    }, [props.selectedSensor]);

    // 알람 발생 zone_sn 목록 (중복 제거)
    const alarmIds = useMemo(() => {
        const alarms = Array.isArray(props.sensorAlarms) ? props.sensorAlarms : [];
        return [...new Set(
            alarms
                .map((a) => (a?.zoneNo != null ? String(a.zoneNo) : null))
                .filter(Boolean)
        )];
    }, [props.sensorAlarms]);

    return (
        <MiniMapComponent
            id={props.popupType}
            className='UI_Section miniMap'
            $opacity={opacity}
            $resize={false}
        >
            <PopupDraggable
                id={props.popupType}
                popupMinWidth={550}
                popupMinHeight={420}
                topSize={40}
                popupState={props.popupState}
                setActiveDragPopup={props.setActiveDragPopup}
                setPopupState={props.setPopupState}
                usePopupResize={false}
            >
                <div className='dslTop'>
                    <h5 className='dslTitle'>{SdmsResource.ID.menu.miniMap}</h5>
                    <input
                        type="range"
                        className="rangeInput"
                        min={0.1} max={1} step={0.1}
                        defaultValue={opacity}
                        onChange={(e) => changePopupOpacity(e.target.valueAsNumber)}
                    />
                    <button className='dslX'>닫기</button>
                </div>

                <div className={'content'}>
                    <div>
                        {allPoints.length > 0 ? (
                            <AutoMiniMap
                                points={allPoints}
                                selectedId={selectedId}
                                alarmIds={alarmIds}
                                options={{
                                    tileUrlTemplate: '/tiles/{z}/{x}/{y}.png',
                                    padding: 20,
                                    minZoom: 15,
                                    maxZoom: 15,
                                    brightness: 1.2,
                                    grayscale: 0,
                                    iqrFence: 0.7,
                                    viewShiftY: 0.15 }}
                            />
                        ) : null}
                    </div>
                </div>
            </PopupDraggable>
        </MiniMapComponent>
    );
}

export default MiniMap;
