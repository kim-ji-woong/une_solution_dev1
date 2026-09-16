/**
 * MapMarker.jsx
 * 미니맵 마커 컴포넌트
 *
 * 위치 계산 방식:
 *   px/py는 canvas 내부 픽셀 좌표 = 화면 표시 픽셀 (canvas = container 설계)
 *   → CSS left/top에 직접 px 단위로 적용 (% 변환 불필요)
 *   → anchorX/anchorY로 아이콘 하단 중앙이 좌표에 오도록 보정
 */
import React from 'react';
import positionIcon from '../../images/position_icon.svg';
import alarmIcon from '../../images/alarm_icon.svg';

const MARKER_CONFIG = {
    normal: {
        icon: positionIcon,
        width: 20,
        height: 20,
        anchorX: 10,   // 아이콘 가로 중심
        anchorY: 20,   // 아이콘 하단 기준
        animate: false,
    },
    alarm: {
        icon: alarmIcon,
        width: 24,
        height: 24,
        anchorX: 12,
        anchorY: 24,
        animate: true,
    },
};

/**
 * @param {number}          px       - 화면 기준 절대 픽셀 X (canvas 픽셀 * scaleX)
 * @param {number}          py       - 화면 기준 절대 픽셀 Y (canvas 픽셀 * scaleY)
 * @param {'normal'|'alarm'} type
 * @param {string}          [label]
 */
export default function MapMarker({ px, py, type = 'normal', label }) {
    const config = MARKER_CONFIG[type] ?? MARKER_CONFIG.normal;

    return (
        <div
            style={{
                position: 'absolute',
                left: px,
                top: py,
                transform: `translate(-${config.anchorX}px, -${config.anchorY}px)`,
                zIndex: type === 'alarm' ? 10 : 5,
                pointerEvents: label ? 'auto' : 'none',
                cursor: label ? 'pointer' : 'default',
            }}
            title={label}
        >
            <img
                src={config.icon}
                alt={type === 'alarm' ? '알람 마커' : '위치 마커'}
                width={config.width}
                height={config.height}
                className={config.animate ? 'auto-minimap-alarm-blink' : undefined}
                draggable={false}
            />
            {label && (
                <span
                    style={{
                        position: 'absolute',
                        bottom: -14,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        fontSize: 9,
                        color: '#fff',
                        whiteSpace: 'nowrap',
                        textShadow: '0 0 3px rgba(0,0,0,0.95)',
                        pointerEvents: 'none',
                    }}
                >
                    {label}
                </span>
            )}
        </div>
    );
}
