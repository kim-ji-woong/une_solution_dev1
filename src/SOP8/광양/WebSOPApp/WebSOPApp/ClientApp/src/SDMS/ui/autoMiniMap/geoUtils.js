/**
 * geoUtils.js
 * Web Mercator(EPSG:3857) 좌표 변환 유틸
 * - 위경도 → 타일 번호
 * - 위경도 → 캔버스 원시 픽셀 좌표 (스케일 적용 전)
 * - 좌표 목록 → 최적 줌 레벨 자동 계산
 */

const TILE_SIZE = 256;

/** 경도 → 정수 타일 X 번호 */
export function lonToTileX(lon, zoom) {
    return Math.floor(((lon + 180) / 360) * Math.pow(2, zoom));
}

/** 위도 → 정수 타일 Y 번호 */
export function latToTileY(lat, zoom) {
    const latRad = (lat * Math.PI) / 180;
    return Math.floor(
        ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) *
        Math.pow(2, zoom)
    );
}

/**
 * 위경도 → 256px 타일 기준 원시 픽셀 좌표
 * (스케일 적용 전 좌표 — useMapTile에서 반환한 scaleX/scaleY를 곱해야 실제 표시 픽셀이 됨)
 *
 * @param {number} lat
 * @param {number} lon
 * @param {number} zoom
 * @param {number} originTileX - 캔버스 좌상단 타일 X
 * @param {number} originTileY - 캔버스 좌상단 타일 Y
 * @param {number} [tileSize=256]
 * @returns {{ rawPx: number, rawPy: number }}
 */
export function latlonToRawPixel(lat, lon, zoom, originTileX, originTileY, tileSize = TILE_SIZE) {
    const n = Math.pow(2, zoom);
    const latRad = (lat * Math.PI) / 180;

    const xTile = ((lon + 180) / 360) * n;
    const yTile =
        ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n;

    return {
        rawPx: (xTile - originTileX) * tileSize,
        rawPy: (yTile - originTileY) * tileSize,
    };
}

/**
 * bounds에서 모든 점이 포함되는 최적 줌 레벨 자동 계산
 * 줌 19부터 내려가며 canvasWidth×canvasHeight 안에 bounds 전체가 들어오는 최대 줌 탐색
 *
 * @param {{ minLat: number, maxLat: number, minLon: number, maxLon: number }} bounds
 * @param {number} canvasWidth  - 실제 캔버스 표시 너비 (px)
 * @param {number} canvasHeight - 실제 캔버스 표시 높이 (px)
 * @param {number} [padding=40] - 마커 주변 여백 (px)
 * @returns {number} zoom
 */
export function calcOptimalZoom(bounds, canvasWidth, canvasHeight, padding = 40) {
    const { minLat, maxLat, minLon, maxLon } = bounds;

    for (let z = 19; z >= 1; z--) {
        const n = Math.pow(2, z) * TILE_SIZE;

        const toY = (lat) => {
            const r = (lat * Math.PI) / 180;
            return ((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2) * n;
        };

        const minX = ((minLon + 180) / 360) * n;
        const maxX = ((maxLon + 180) / 360) * n;
        const minY = toY(maxLat); // 위도 높음 = Y 작음
        const maxY = toY(minLat);

        const spanX = maxX - minX;
        const spanY = maxY - minY;

        if (
            spanX + padding * 2 <= canvasWidth &&
            spanY + padding * 2 <= canvasHeight
        ) {
            return z;
        }
    }

    return 1;
}

/**
 * 포인트 배열에서 bounds 계산 (O(n) 단일 순회)
 * AutoMiniMap에서 1회만 계산하고 useMapTile에는 bounds만 전달하기 위해 사용
 *
 * @param {{ lat: number, lon: number }[]} points
 * @returns {{ minLat: number, maxLat: number, minLon: number, maxLon: number } | null}
 */
export function calcBounds(points) {
    if (!points || points.length === 0) return null;

    let minLat = Infinity, maxLat = -Infinity;
    let minLon = Infinity, maxLon = -Infinity;

    for (const p of points) {
        if (p.lat < minLat) minLat = p.lat;
        if (p.lat > maxLat) maxLat = p.lat;
        if (p.lon < minLon) minLon = p.lon;
        if (p.lon > maxLon) maxLon = p.lon;
    }

    return { minLat, maxLat, minLon, maxLon };
}

/**
 * IQR(사분위범위) 기반 이상치 제거 후 주요 클러스터 bounds 계산
 *
 * Tukey fence 방식: Q1 - fence×IQR  ~  Q3 + fence×IQR 범위만 포함
 * - fence 값이 작을수록 더 밀집된 클러스터만 표출 → 타일 수 감소 → 텍스트 크게 보임
 * - fence 값이 클수록 더 넓은 범위 포함
 * - 기본값 1.5 (Tukey 표준), 텍스트 가독성 향상 필요 시 0.5~1.0 사용
 *
 * @param {{ lat: number, lon: number }[]} points
 * @param {number} [fence=1.5] - IQR 배수 (작을수록 더 좁은 범위)
 * @returns {{ minLat: number, maxLat: number, minLon: number, maxLon: number } | null}
 */
export function calcIQRBounds(points, fence = 1.5) {
    if (!points || points.length === 0) return null;
    if (points.length <= 4) return calcBounds(points);

    const lats = points.map(p => p.lat).sort((a, b) => a - b);
    const lons = points.map(p => p.lon).sort((a, b) => a - b);

    const n = lats.length;
    const q1i = Math.floor(n * 0.25);
    const q3i = Math.floor(n * 0.75);

    const latQ1 = lats[q1i], latQ3 = lats[q3i];
    const lonQ1 = lons[q1i], lonQ3 = lons[q3i];

    const latIQR = latQ3 - latQ1;
    const lonIQR = lonQ3 - lonQ1;

    return {
        minLat: latQ1 - fence * latIQR,
        maxLat: latQ3 + fence * latIQR,
        minLon: lonQ1 - fence * lonIQR,
        maxLon: lonQ3 + fence * lonIQR,
    };
}
