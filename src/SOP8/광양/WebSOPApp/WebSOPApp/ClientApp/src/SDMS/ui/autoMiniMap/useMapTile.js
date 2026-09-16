/**
 * useMapTile.js
 * 타일 이미지 로드 및 Canvas 합성 훅
 *
 * 핵심 설계:
 *   canvas.width  = containerWidth   (ResizeObserver가 감지한 실제 표시 크기)
 *   canvas.height = containerHeight
 *   → 타일을 scaleX/scaleY로 축소하여 canvas에 정확히 맞춤
 *   → canvas 내부 픽셀 = 화면 표시 픽셀 (1:1) → 마커 위치 왜곡 없음
 */
import { useState, useEffect, useRef } from 'react';
import { lonToTileX, latToTileY, calcOptimalZoom } from './geoUtils';

const TILE_SIZE = 256;

/**
 * 타일 URL 생성
 * @param {number} z
 * @param {number} x
 * @param {number} y
 * @param {string} template - '{z}/{x}/{y}' 플레이스홀더 사용
 */
function buildTileUrl(z, x, y, template) {
    return template
        .replace('{z}', z)
        .replace('{x}', x)
        .replace('{y}', y);
}

function loadImage(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`타일 로드 실패: ${url}`));
        img.src = url;
    });
}

/**
 * @param {{ minLat: number, maxLat: number, minLon: number, maxLon: number } | null} bounds
 *   AutoMiniMap에서 calcBounds()로 미리 계산한 값.
 *   포인트 배열 대신 bounds만 받으므로 포인트 수(100개/1000개)와 무관하게 O(1) 처리.
 *
 * @param {{ width: number, height: number }} containerSize - ResizeObserver 실측 크기
 * @param {{
 *   tileUrlTemplate?: string,
 *   padding?: number,
 *   darkFilter?: boolean
 * }} options
 *
 * @returns {{
 *   canvasRef: React.RefObject,
 *   originTileX: number,
 *   originTileY: number,
 *   zoom: number,
 *   scaleX: number,
 *   scaleY: number,
 *   loading: boolean,
 *   error: string | null
 * }}
 */
export default function useMapTile(bounds, containerSize, options = {}) {
    const {
        tileUrlTemplate = '/tiles/{z}/{x}/{y}.png',
        padding = 50,
        darkFilter = false,
        minZoom = 1,
        maxZoom = 19,
        viewShiftY = 0,   // 0.1 = 지도를 height의 10% 아래로 이동 (위쪽 영역 더 표출)
    } = options;

    const canvasRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [mapMeta, setMapMeta] = useState({
        originTileX: 0,
        originTileY: 0,
        zoom: 12,
        scale: 1,
        offsetX: 0,
        offsetY: 0,
    });

    useEffect(() => {
        const { width, height } = containerSize;

        // bounds 또는 컨테이너 크기가 미확정이면 스킵
        if (!bounds || !width || !height) return;

        const rawZoom = calcOptimalZoom(bounds, width, height, padding);
        const zoom = Math.min(maxZoom, Math.max(minZoom, rawZoom));

        // bounds의 네 꼭짓점으로 타일 범위 계산 (여유 1타일씩 추가)
        const { minLat, maxLat, minLon, maxLon } = bounds;
        let minTX = lonToTileX(minLon, zoom) - 1;
        let maxTX = lonToTileX(maxLon, zoom) + 1;
        let minTY = latToTileY(maxLat, zoom) - 1; // 위도 높음 = Y 작음
        let maxTY = latToTileY(minLat, zoom) + 1;

        let colCount = maxTX - minTX + 1;
        let rowCount = maxTY - minTY + 1;

        // 타일 영역 비율을 컨테이너 비율에 맞게 조정
        // → scaleX ≈ scaleY 가 되어 늘어남 없이 컨테이너를 꽉 채움
        const containerRatio = width / height;
        const tileRatio      = colCount / rowCount;

        if (tileRatio < containerRatio) {
            // 타일 영역이 컨테이너보다 세로로 길다 → 좌우로 타일 추가
            const targetCols = Math.ceil(rowCount * containerRatio);
            const extra      = targetCols - colCount;
            minTX -= Math.floor(extra / 2);
            maxTX += Math.ceil(extra / 2);
        } else {
            // 타일 영역이 컨테이너보다 가로로 길다 → 위아래로 타일 추가
            const targetRows = Math.ceil(colCount / containerRatio);
            const extra      = targetRows - rowCount;
            minTY -= Math.floor(extra / 2);
            maxTY += Math.ceil(extra / 2);
        }

        colCount = maxTX - minTX + 1;
        rowCount = maxTY - minTY + 1;

        // viewShiftY: 양수면 타일 윈도우 전체를 북쪽으로 이동 → 위쪽 실제 지형 타일 로드
        // offsetY 이동이 아닌 타일 범위 자체를 이동 → 마커가 지도 밖으로 나가지 않음
        if (viewShiftY !== 0) {
            const northShift = Math.round(rowCount * viewShiftY);
            minTY -= northShift;
            maxTY -= northShift;
        }

        // 가로/세로 중 큰 scale 사용 → 캔버스 전체를 타일로 커버 (바닥 공백 방지)
        const scaleX = width  / (colCount * TILE_SIZE);
        const scaleY = height / (rowCount * TILE_SIZE);
        const scale  = Math.max(scaleX, scaleY);
        const offsetX = 0;
        const offsetY = 0;

        setMapMeta({
            originTileX: minTX,
            originTileY: minTY,
            zoom,
            scale,
            offsetX,
            offsetY,
        });

        // 모든 타일 병렬 fetch
        const tilePromises = [];
        for (let ty = minTY; ty <= maxTY; ty++) {
            for (let tx = minTX; tx <= maxTX; tx++) {
                const url = buildTileUrl(zoom, tx, ty, tileUrlTemplate);
                tilePromises.push(
                    loadImage(url).then((img) => ({
                        img,
                        col: tx - minTX,
                        row: ty - minTY,
                    }))
                );
            }
        }

        setLoading(true);
        setError(null);

        Promise.all(tilePromises)
            .then((tiles) => {
                const canvas = canvasRef.current;
                if (!canvas) return;

                // canvas 내부 해상도 = 컨테이너 실제 크기 (1:1 대응)
                canvas.width  = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');

                // OSM 등 밝은 타일 → 다크 필터 후처리
                if (darkFilter) {
                    ctx.filter = 'grayscale(100%) invert(100%) brightness(0.5) contrast(1.3)';
                }

                // 타일을 단일 scale로 렌더링 + offset으로 중앙 정렬
                // Math.floor/ceil 적용: 소수점 오차로 생기는 타일 경계 격자선 제거
                tiles.forEach(({ img, col, row }) => {
                    const dx = Math.floor(offsetX + col * TILE_SIZE * scale);
                    const dy = Math.floor(offsetY + row * TILE_SIZE * scale);
                    const dw = Math.ceil(offsetX + (col + 1) * TILE_SIZE * scale) - dx;
                    const dh = Math.ceil(offsetY + (row + 1) * TILE_SIZE * scale) - dy;
                    ctx.drawImage(img, dx, dy, dw, dh);
                });

                ctx.filter = 'none';
                setLoading(false);
            })
            .catch((err) => {
                console.error('[AutoMiniMap] 타일 로드 실패:', err);
                setError(err.message || '지도 로드 실패');
                setLoading(false);
            });
    // bounds는 4개의 숫자 — 각각 primitive 비교로 충분 (JSON.stringify 불필요)
    }, [
        bounds?.minLat, bounds?.maxLat, bounds?.minLon, bounds?.maxLon,
        containerSize.width, containerSize.height,
        tileUrlTemplate, padding, darkFilter, viewShiftY,
    ]);

    return {
        canvasRef,
        originTileX: mapMeta.originTileX,
        originTileY: mapMeta.originTileY,
        zoom:        mapMeta.zoom,
        scale:       mapMeta.scale,
        offsetX:     mapMeta.offsetX,
        offsetY:     mapMeta.offsetY,
        loading,
        error,
    };
}
