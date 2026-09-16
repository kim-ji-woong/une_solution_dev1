/**
 * downloadTiles.js
 * DB(ex_sensor_link)에서 위경도를 조회해 bounds를 자동 계산하고
 * CartoDB Dark Matter 타일을 wwwroot/tiles/에 사전 다운로드하는 스크립트.
 *
 * ─── 사전 준비 ──────────────────────────────────────────────────────────────
 *  1. npm install pg --save-dev  (ClientApp 디렉토리에서 1회)
 *  2. scripts/tiles.config.json 에 DB 접속 정보 입력
 *
 * ─── 실행 ───────────────────────────────────────────────────────────────────
 *  node scripts/downloadTiles.js
 *
 * ─── 옵션 ───────────────────────────────────────────────────────────────────
 *  --dry-run    타일 다운로드 없이 DB 조회 결과/bounds/타일 수만 출력
 *  --zoom=11-15 줌 레벨 범위 덮어쓰기 (config보다 우선)
 *  --buffer=0.1 여유 범위(도) 덮어쓰기
 */

const https   = require('https');
const http    = require('http');
const fs      = require('fs');
const path    = require('path');
const { Pool } = require('pg');

// ─── 설정 로드 ────────────────────────────────────────────────────────────────
const CONFIG_PATH = path.resolve(__dirname, 'tiles.config.json');

function loadConfig() {
    if (!fs.existsSync(CONFIG_PATH)) {
        console.error(`[오류] 설정 파일이 없습니다: ${CONFIG_PATH}`);
        console.error('  scripts/tiles.config.json 을 생성하고 DB 접속 정보를 입력하세요.');
        process.exit(1);
    }

    let cfg;
    try {
        const raw = fs.readFileSync(CONFIG_PATH, 'utf8');
        // JSON5 스타일 주석 제거 후 파싱
        const stripped = raw.replace(/\/\/[^\n]*/g, '').replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');
        cfg = JSON.parse(stripped);
    } catch (e) {
        console.error(`[오류] 설정 파일 파싱 실패: ${e.message}`);
        process.exit(1);
    }

    if (cfg.db?.password === '여기에_실제_비밀번호_입력') {
        console.error('[오류] tiles.config.json 에 실제 DB 비밀번호를 입력해주세요.');
        process.exit(1);
    }

    return cfg;
}

// ─── CLI 인자 파싱 ────────────────────────────────────────────────────────────
function parseArgs() {
    const args = {};
    for (const arg of process.argv.slice(2)) {
        if (arg === '--dry-run') { args.dryRun = true; continue; }
        const m = arg.match(/^--(\w+)=(.+)$/);
        if (m) args[m[1]] = m[2];
    }
    return args;
}

// ─── 타일 좌표 계산 ───────────────────────────────────────────────────────────
function lonToTileX(lon, zoom) {
    return Math.floor(((lon + 180) / 360) * Math.pow(2, zoom));
}

function latToTileY(lat, zoom) {
    const r = (lat * Math.PI) / 180;
    return Math.floor(
        ((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2) *
        Math.pow(2, zoom)
    );
}

// ─── 파일 다운로드 ────────────────────────────────────────────────────────────
function downloadFile(url, dest) {
    return new Promise((resolve, reject) => {
        if (fs.existsSync(dest)) return resolve('skipped');

        const dir = path.dirname(dest);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

        const protocol = url.startsWith('https') ? https : http;
        const file = fs.createWriteStream(dest);

        protocol
            .get(url, { headers: { 'User-Agent': 'AutoMiniMap-TileDownloader/1.0' } }, (res) => {
                if (res.statusCode !== 200) {
                    file.close();
                    fs.unlink(dest, () => {});
                    return reject(new Error(`HTTP ${res.statusCode}: ${url}`));
                }
                res.pipe(file);
                file.on('finish', () => file.close(() => resolve('downloaded')));
            })
            .on('error', (err) => {
                file.close();
                fs.unlink(dest, () => {});
                reject(err);
            });
    });
}

// ─── 동시 실행 제한 ───────────────────────────────────────────────────────────
async function runWithConcurrency(tasks, concurrency) {
    const results = new Array(tasks.length);
    let index = 0;

    async function worker() {
        while (index < tasks.length) {
            const i = index++;
            results[i] = await tasks[i]();
        }
    }

    await Promise.all(
        Array.from({ length: Math.min(concurrency, tasks.length) }, worker)
    );
    return results;
}

// ─── 메인 ────────────────────────────────────────────────────────────────────
async function main() {
    const config = loadConfig();
    const args   = parseArgs();

    const dryRun    = args.dryRun ?? false;
    const bufferDeg = parseFloat(args.buffer ?? config.tiles?.bufferDeg ?? 0.05);
    const zoomArg   = args.zoom;
    let   zoomMin   = config.tiles?.zoomMin ?? 11;
    let   zoomMax   = config.tiles?.zoomMax ?? 15;

    if (zoomArg) {
        const parts = zoomArg.split('-').map(Number);
        if (parts.length === 2) { zoomMin = parts[0]; zoomMax = parts[1]; }
        else                    { zoomMin = zoomMax = parts[0]; }
    }

    const OUTPUT_DIR  = path.resolve(__dirname, '../../../WebSOPApp/wwwroot/tiles');
    const sourceType  = config.tileSource?.type  ?? 'cartodb-dark';
    const apiKey      = config.tileSource?.apiKey ?? '';

    // VWorld WMTS는 좌표 순서가 {z}/{y}/{x} (표준 XYZ의 x/y 반대)
    // Mapbox / CartoDB는 표준 XYZ {z}/{x}/{y}
    // 로컬 저장은 tiles/{z}/{x}/{y}.png 로 유지 (tileUrlTemplate과 일치)
    const TILE_SOURCES = {
        'mapbox-dark':     (z, x, y) => `https://api.mapbox.com/styles/v1/mapbox/dark-v11/tiles/256/${z}/${x}/${y}?access_token=${apiKey}`,
        'vworld-midnight': (z, x, y) => `https://api.vworld.kr/req/wmts/1.0.0/${apiKey}/midnight/${z}/${y}/${x}.png`,
        'vworld-base':     (z, x, y) => `https://api.vworld.kr/req/wmts/1.0.0/${apiKey}/Base/${z}/${y}/${x}.png`,
        'vworld-white':    (z, x, y) => `https://api.vworld.kr/req/wmts/1.0.0/${apiKey}/white/${z}/${y}/${x}.png`,
        'cartodb-dark':    (z, x, y) => `https://basemaps.cartocdn.com/dark_all/${z}/${x}/${y}.png`,
    };

    const TILE_URL = TILE_SOURCES[sourceType];
    if (!TILE_URL) {
        console.error(`[오류] 알 수 없는 tileSource.type: "${sourceType}"`);
        console.error('  사용 가능: mapbox-dark | vworld-midnight | vworld-base | vworld-white | cartodb-dark');
        process.exit(1);
    }

    if (!apiKey || apiKey.includes('여기에_')) {
        console.error(`[오류] tiles.config.json 에 API 키/토큰을 입력해주세요. (tileSource.apiKey)`);
        process.exit(1);
    }

    console.log(`  타일 소스: ${sourceType}`);

    // ── 1. DB 연결 및 위경도 조회 ─────────────────────────────────────────────
    console.log('=== AutoMiniMap 타일 다운로드 ===\n');
    console.log(`[1] DB 연결 중... (${config.db.host}:${config.db.port}/${config.db.database})`);

    const pool = new Pool({
        host:     config.db.host,
        port:     config.db.port,
        database: config.db.database,
        user:     config.db.user,
        password: config.db.password,
        connectionTimeoutMillis: 5000,
    });

    let rows;
    try {
        const result = await pool.query(`
            SELECT lat, lon
            FROM public.ex_sensor_link
            WHERE lat IS NOT NULL
              AND lon IS NOT NULL
              AND lat BETWEEN -90  AND 90
              AND lon BETWEEN -180 AND 180
        `);
        rows = result.rows;
    } catch (err) {
        console.error(`\n[오류] DB 조회 실패: ${err.message}`);
        console.error('  tiles.config.json 의 DB 접속 정보를 확인하세요.');
        await pool.end();
        process.exit(1);
    }
    await pool.end();

    if (rows.length === 0) {
        console.error('\n[오류] ex_sensor_link 에 유효한 lat/lon 데이터가 없습니다.');
        process.exit(1);
    }

    console.log(`  → ${rows.length}개 센서 위경도 조회 완료`);

    // ── 2. bounds 자동 계산 ───────────────────────────────────────────────────
    let minLat = Infinity, maxLat = -Infinity;
    let minLon = Infinity, maxLon = -Infinity;

    for (const r of rows) {
        const lat = parseFloat(r.lat);
        const lon = parseFloat(r.lon);
        if (lat < minLat) minLat = lat;
        if (lat > maxLat) maxLat = lat;
        if (lon < minLon) minLon = lon;
        if (lon > maxLon) maxLon = lon;
    }

    // 여유 범위(buffer) 적용
    minLat -= bufferDeg;
    maxLat += bufferDeg;
    minLon -= bufferDeg;
    maxLon += bufferDeg;

    console.log(`\n[2] 범위 계산 완료 (buffer: ±${bufferDeg}°)`);
    console.log(`  위도: ${minLat.toFixed(5)} ~ ${maxLat.toFixed(5)}`);
    console.log(`  경도: ${minLon.toFixed(5)} ~ ${maxLon.toFixed(5)}`);

    // ── 3. 타일 목록 생성 ─────────────────────────────────────────────────────
    console.log(`\n[3] 타일 목록 생성 (줌 ${zoomMin}~${zoomMax})`);

    const allTiles = [];
    let totalCount = 0;

    for (let z = zoomMin; z <= zoomMax; z++) {
        // useMapTile.js 와 동일하게 ±1 타일 여유 추가
        const tMinX = lonToTileX(minLon, z) - 1;
        const tMaxX = lonToTileX(maxLon, z) + 1;
        const tMinY = latToTileY(maxLat, z) - 1; // 위도 높음 = Y 작음
        const tMaxY = latToTileY(minLat, z) + 1;
        const count = (tMaxX - tMinX + 1) * (tMaxY - tMinY + 1);
        totalCount += count;
        console.log(`  줌 ${z}: ${count}장 (X ${tMinX}~${tMaxX}, Y ${tMinY}~${tMaxY})`);

        for (let x = tMinX; x <= tMaxX; x++) {
            for (let y = tMinY; y <= tMaxY; y++) {
                allTiles.push({ z, x, y });
            }
        }
    }

    console.log(`\n  총 ${totalCount}장 예상`);

    if (dryRun) {
        console.log('\n[dry-run] 실제 다운로드 없이 종료합니다.');
        console.log(`  저장 경로: ${OUTPUT_DIR}`);
        return;
    }

    // ── 4. 타일 다운로드 ──────────────────────────────────────────────────────
    console.log(`\n[4] 다운로드 시작... (저장: ${OUTPUT_DIR})\n`);

    let downloaded = 0, skipped = 0, errors = 0;

    const tasks = allTiles.map(({ z, x, y }) => async () => {
        const url  = TILE_URL(z, x, y);
        const dest = path.join(OUTPUT_DIR, `${z}`, `${x}`, `${y}.png`);
        try {
            const status = await downloadFile(url, dest);
            if (status === 'downloaded') {
                downloaded++;
                if (downloaded % 50 === 0) {
                    process.stdout.write(`  진행: ${downloaded + skipped}/${totalCount}\n`);
                }
            } else {
                skipped++;
            }
        } catch (err) {
            errors++;
            process.stdout.write(`  ✗ ${z}/${x}/${y}: ${err.message}\n`);
        }
    });

    await runWithConcurrency(tasks, 4);

    // ── 5. 완료 요약 ──────────────────────────────────────────────────────────
    console.log('\n=== 완료 ===');
    console.log(`  다운로드: ${downloaded}장`);
    console.log(`  스킵(기존): ${skipped}장`);
    if (errors > 0) console.log(`  실패: ${errors}장`);
    console.log(`\n  저장 경로: ${OUTPUT_DIR}`);
    console.log('  wwwroot/tiles/ 를 앱 배포에 포함해주세요.\n');
}

main().catch((err) => {
    console.error('\n[오류]', err.message);
    process.exit(1);
});
