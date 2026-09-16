/**
 * AutoMiniMap.jsx
 * 위경도 기반 자동 지도 타일 합성 + ID 선택적 마커 표출 독립 모듈
 *
 * ─── 사용법 ───────────────────────────────────────────────────────────────────
 *
 * import AutoMiniMap from '../autoMiniMap/AutoMiniMap';
 *
 * <AutoMiniMap
 *   points={[
 *     { lat: 36.050, lon: 129.340, id: 'sensor-1' },
 *     { lat: 36.061, lon: 129.351, id: 'sensor-2' },
 *     { lat: 36.048, lon: 129.330, id: 'sensor-3' },
 *   ]}
 *   selectedId="sensor-1"
 *   alarmIds={["sensor-2"]}
 *   options={{ tileUrlTemplate: '/tiles/{z}/{x}/{y}.png' }}
 * />
 *
 * ─── 크기 지정 ────────────────────────────────────────────────────────────────
 * size prop 없음. 부모 컨테이너의 100%를 채움.
 * ResizeObserver로 실측 크기 자동 감지 → 타일/마커 자동 재계산.
 * 크기 지정은 부모 컨테이너 CSS로 설정.
 *
 * ─── Props ───────────────────────────────────────────────────────────────────
 *
 * @param {Array<{
 *   lat: number,          위도 (WGS84)
 *   lon: number,          경도 (WGS84)
 *   id: string | number,  고유 식별자 (selectedId/alarmIds 매칭에 사용)
 *   label?: string        마커 레이블 (선택)
 * }>} points
 *   지도 범위 계산용 전체 포인트 목록.
 *   모든 포인트가 지도 안에 들어오도록 줌 레벨이 자동 조정됨.
 *   마커 표출 여부는 selectedId/alarmIds로 결정.
 *
 * @param {string | number} [selectedId]
 *   일반 마커(position_icon)로 표출할 포인트의 id.
 *   미전달 시 일반 마커 없음.
 *
 * @param {Array<string | number>} [alarmIds]
 *   알람 마커(alarm_icon, 깜빡임)로 표출할 포인트 id 목록.
 *   미전달 또는 빈 배열 시 알람 마커 없음.
 *
 * @param {{
 *   tileUrlTemplate?: string,   기본값: '/tiles/{z}/{x}/{y}.png'
 *   padding?: number,           기본값: 20  — 마커가 캔버스 가장자리에서 떨어지는 여백(px). 클수록 마커가 중앙으로 모임
 *   minZoom?: number,           기본값: 14  — 자동 계산된 줌의 하한선. 높을수록 더 확대된 상태 고정
 *   maxZoom?: number,           기본값: 15  — 자동 계산된 줌의 상한선. 낮을수록 더 넓은 범위 표출
 *   brightness?: number,        기본값: 2.1 — 지도 밝기 (1.0 = 원본, 2.0 = 2배 밝음)
 *   grayscale?: number,         기본값: 0   — 탈색 강도 0~100 (100 = 완전 흑백, 파란색 제거에 사용)
 *   markerScale?: number,       기본값: 1.0 — 모든 마커 크기 배율 (1.2 = 20% 확대, 0.8 = 20% 축소)
 *   iqrFence?: number,          기본값: 1.5 — IQR 배수. 작을수록 밀집 클러스터만 표출(타일↓ → 텍스트↑). 권장: 0.5~1.0
 *   viewShiftY?: number,        기본값: 0   — 지도를 세로 방향으로 이동 (0.1 = 10% 아래로 → 위쪽 영역 더 표출, 아래 잘림)
 *   darkFilter?: boolean        기본값: false
 * }} [options]
 */
import React, { useState, useEffect, useRef, useMemo } from 'react';
import useMapTile from './useMapTile';
import { latlonToRawPixel, calcIQRBounds } from './geoUtils';
import positionIcon from '../../images/position_icon.svg';
import alarmIcon    from '../../images/alarm_icon.svg';

const MARKER_DISPLAY = {
    normal: {
        icon: positionIcon,
        width: 14, height: 14,
        anchorX: 7, anchorY: 14,
        animate: false,
    },
    alarm: {
        icon: alarmIcon,
        width: 16, height: 16,
        anchorX: 8, anchorY: 16,
        animate: true,
    },
    'alarm-selected': {
        icon: alarmIcon,
        width: 21, height: 21,   // alarm(16) × 1.3
        anchorX: 10, anchorY: 21,
        animate: true,
    },
};

export default function AutoMiniMap({
    points    = [],
    selectedId,
    alarmIds,
    options   = {},
}) {
    const {
        brightness  = 2.1,
        grayscale   = 0,
        markerScale = 1.0,
        iqrFence    = 1.5,
    } = options;
    const containerRef = useRef(null);
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

    // ResizeObserver: 부모 컨테이너 실측 크기 감지
    // → MiniMapComponent CSS가 바뀌거나 창 크기가 변경되어도 자동 대응
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const observer = new ResizeObserver(([entry]) => {
            const { width, height } = entry.contentRect;
            const w = Math.floor(width);
            const h = Math.floor(height);
            if (w > 0 && h > 0) {
                setContainerSize((prev) =>
                    prev.width === w && prev.height === h ? prev : { width: w, height: h }
                );
            }
        });

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    // 유효 포인트만 추출 (마커 매칭 및 bounds 계산에 사용)
    const validPoints = useMemo(
        () => points.filter((p) => Number.isFinite(p.lat) && Number.isFinite(p.lon)),
        [points]
    );

    // 마커로 표출할 포인트 결정 (bounds 계산에도 사용)
    // - selectedId 에 해당하는 포인트 → 일반 마커
    // - alarmIds 에 포함된 포인트   → 알람 마커
    // - 나머지는 지도 범위 계산에만 참여, 마커 없음
    const alarmSet = useMemo(() => new Set((alarmIds ?? []).map(String)), [alarmIds]);

    const visibleMarkers = useMemo(() => {
        if (selectedId == null && alarmSet.size === 0) return [];

        const result = [];
        for (const p of validPoints) {
            const pid = String(p.id);
            const isAlarm    = alarmSet.has(pid);
            const isSelected = selectedId != null && pid === String(selectedId);

            if (isAlarm && isSelected) {
                result.push({ ...p, type: 'alarm-selected' });
            } else if (isAlarm) {
                result.push({ ...p, type: 'alarm' });
            } else if (isSelected) {
                result.push({ ...p, type: 'normal' });
            }
        }
        return result;
    }, [validPoints, selectedId, alarmSet]);

    // bounds: IQR 기반 이상치 제거 후 주요 클러스터 범위로 고정
    // - 선택/알람 변경과 무관하게 항상 동일한 지도 범위 유지
    // - 수동 수치 없음 — 데이터 분포에서 자동으로 클러스터 경계 결정
    const bounds = useMemo(() => calcIQRBounds(validPoints, iqrFence), [validPoints, iqrFence]);

    const {
        canvasRef,
        originTileX,
        originTileY,
        zoom,
        scale,
        offsetX,
        offsetY,
        loading,
        error,
    } = useMapTile(bounds, containerSize, options);

    // 마커 화면 픽셀 위치 계산 (타일 로드 완료 후)
    const markerPositions = useMemo(() => {
        if (loading || !zoom || !scale) return [];

        return visibleMarkers.map((m, idx) => {
            const { rawPx, rawPy } = latlonToRawPixel(
                m.lat, m.lon, zoom, originTileX, originTileY
            );
            return {
                ...m,
                px:   rawPx * scale + offsetX,
                py:   rawPy * scale + offsetY,
                _key: m.id ?? idx,
            };
        });
    }, [visibleMarkers, loading, zoom, originTileX, originTileY, scale, offsetX, offsetY]);

    return (
        <div
            ref={containerRef}
            style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                background: '#1a1a2e',
            }}
        >
            {loading && (
                <div style={OVERLAY_STYLE}>
                    <span style={{ color: '#888', fontSize: 11 }}>지도 로딩 중...</span>
                </div>
            )}

            {!loading && error && (
                <div style={OVERLAY_STYLE}>
                    <span style={{ color: '#f66', fontSize: 11 }}>지도 로드 실패</span>
                </div>
            )}

            {/* 지도 캔버스 — 내부 해상도 = containerSize (1:1) */}
            <canvas
                ref={canvasRef}
                style={{
                    position: 'absolute',
                    top: 0, left: 0,
                    width: '100%', height: '100%',
                    display: 'block',
                    filter: `grayscale(${grayscale}%) brightness(${brightness}) contrast(0.9)`,
                }}
            />

            {/* 마커 오버레이 — 실제 화면 픽셀 직접 사용 */}
            {markerPositions.map((m) => {
                const cfg = MARKER_DISPLAY[m.type] ?? MARKER_DISPLAY.normal;
                const w  = Math.round(cfg.width   * markerScale);
                const h  = Math.round(cfg.height  * markerScale);
                const ax = Math.round(cfg.anchorX * markerScale);
                const ay = Math.round(cfg.anchorY * markerScale);
                const zIndex = m.type === 'alarm-selected' ? 15 : m.type === 'alarm' ? 10 : 5;
                return (
                    <div
                        key={m._key}
                        style={{
                            position: 'absolute',
                            left: m.px,
                            top:  m.py,
                            transform: `translate(-${ax}px, -${ay}px)`,
                            zIndex,
                            pointerEvents: m.label ? 'auto' : 'none',
                            cursor: m.label ? 'pointer' : 'default',
                        }}
                        title={m.label}
                    >
                        <img
                            src={cfg.icon}
                            alt={m.type === 'alarm' || m.type === 'alarm-selected' ? '알람 마커' : '위치 마커'}
                            width={w}
                            height={h}
                            className={cfg.animate ? 'auto-minimap-alarm-blink' : undefined}
                            draggable={false}
                        />
                        {m.label && <span style={LABEL_STYLE}>{m.label}</span>}
                    </div>
                );
            })}
        </div>
    );
}

const OVERLAY_STYLE = {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
};

const LABEL_STYLE = {
    position: 'absolute',
    bottom: -14,
    left: '50%',
    transform: 'translateX(-50%)',
    fontSize: 9,
    color: '#fff',
    whiteSpace: 'nowrap',
    textShadow: '0 0 3px rgba(0,0,0,0.95)',
    pointerEvents: 'none',
};
