# AutoMiniMap 모듈 마스터 매뉴얼

> 최종 업데이트: 2026-03-13
> 대상 프로젝트: WebSOPApp — SDMS 미니맵 모듈
> 모듈 위치: `ClientApp/src/SDMS/ui/autoMiniMap/`

---

## 목차

1. [모듈 개요](#1-모듈-개요)
2. [파일 구조](#2-파일-구조)
3. [전체 설치 및 사용 과정 (단계별)](#3-전체-설치-및-사용-과정-단계별)
4. [tiles.config.json 속성 상세](#4-tilesconfigjson-속성-상세)
5. [downloadTiles.js 실행 옵션](#5-downloadtilesjs-실행-옵션)
6. [AutoMiniMap 컴포넌트 Props 상세](#6-autominimap-컴포넌트-props-상세)
7. [options 속성 상세](#7-options-속성-상세)
8. [마커 동작 규칙](#8-마커-동작-규칙)
9. [실제 연동 예시 (miniMap.jsx 패턴)](#9-실제-연동-예시-minimapjsx-패턴)
10. [자주 쓰는 조정 가이드](#10-자주-쓰는-조정-가이드)
11. [FAQ](#11-faq)

---

## 1. 모듈 개요

`AutoMiniMap`은 **위도·경도 좌표 목록**을 입력받아 다음을 자동으로 처리하는 독립 React 컴포넌트입니다.

```
입력: 센서 위경도 목록 (+ 선택/알람 ID)
        ↓
자동: 모든 좌표가 포함되는 지도 범위 계산
        ↓
자동: 해당 범위의 지도 타일 이미지 합성
        ↓
자동: 각 좌표 위치에 마커 표출
        ↓
출력: 완성된 미니맵 UI (부모 컨테이너 100% 채움)
```

### 기존 방식과의 차이

| 구분 | 기존 miniMap.jsx | AutoMiniMap |
|------|-----------------|-------------|
| 지도 이미지 | 고정 PNG 파일 | 타일 자동 합성 |
| 좌표 변환 | 하드코딩 상수 | Mercator 수식 자동 계산 |
| 지역 변경 | 이미지 + 상수 수동 교체 | 좌표만 바꾸면 자동 적용 |
| 오프라인 | 고정 이미지 | 타일 사전 다운로드 |
| 확장성 | 포항 산단 전용 | 대한민국 전국 모든 지역 |

---

## 2. 파일 구조

```
프로젝트 루트 (WebSOPApp/)
│
├── WebSOPApp/
│   └── wwwroot/
│       └── tiles/                      ← ★ 사전 다운로드된 지도 타일 저장 위치
│           └── {zoom}/
│               └── {x}/
│                   └── {y}.png
│
└── ClientApp/
    ├── scripts/
    │   ├── downloadTiles.js            ← 타일 다운로드 스크립트 (배포 전 1회 실행)
    │   └── tiles.config.json           ← ★ 타일 다운로드 설정 파일 (DB접속 + API키 입력)
    │
    └── src/SDMS/ui/
        ├── autoMiniMap/                ← AutoMiniMap 독립 모듈 폴더
        │   ├── AutoMiniMap.jsx         ← ★ 진입점 (이것만 import해서 사용)
        │   ├── useMapTile.js           ← 타일 로드 및 Canvas 합성 훅
        │   ├── geoUtils.js             ← 좌표 변환 유틸 (Mercator 투영)
        │   └── MapMarker.jsx           ← 마커 렌더링 컴포넌트
        │
        └── popups/
            └── miniMap.jsx             ← 기존 미니맵 팝업 (AutoMiniMap 호출)
```

---

## 3. 전체 설치 및 사용 과정 (단계별)

> **환경 구분**
> - **개발/배포 준비 환경**: 인터넷이 되는 PC (타일 다운로드 실행)
> - **운영 환경**: 폐쇄망 서버 (타일 파일 + 앱 배포)

---

### STEP 1. Node.js 의존 패키지 설치 (최초 1회)

`ClientApp` 디렉토리에서 실행합니다.

```bash
cd WebSOPApp/WebSOPApp/ClientApp
npm install pg --save-dev
```

> `pg`는 PostgreSQL 클라이언트입니다. 타일 다운로드 스크립트가 DB에서 센서 위경도를 조회하는 데 사용합니다.

---

### STEP 2. tiles.config.json 작성

`ClientApp/scripts/tiles.config.json` 파일을 열어 실제 정보를 입력합니다.

```json
{
  "db": {
    "host":     "127.0.0.1", // 실제 DB 호스트 입력
    "port":     5432, // PostreSQL : 5432, MsSQL: 1433 
    "database": "wsop_101", // 산단 사이트별 DB 명
    "user":     "postgres", // 계정ID
    "password": "실제_비밀번호_입력" // 계정PW
  },

  "tileSource": {
    "type":   "mapbox-dark",
    "apiKey": "발급받은_Mapbox_토큰_입력" // Mapbox 회원가입 후 Default public token의 token값 입력
  },

  "tiles": { // '10.자주 쓰는 조정 가이드' 참고 현재 값은 포항 Default
    "zoomMin":   11,
    "zoomMax":   15,
    "bufferDeg": 0.05
  }
}
```

> 각 속성의 상세 설명은 [섹션 4](#4-tilesconfigjson-속성-상세)를 참고하세요.

⚠️ **이 파일에는 DB 비밀번호와 API 키가 포함됩니다. git에 커밋하지 마세요.**

---

### STEP 3. Mapbox 토큰 발급 (최초 1회)

1. [mapbox.com](https://www.mapbox.com) 접속 → 로그인
2. 대시보드 → **Tokens** 탭 클릭
3. **Default public token** 복사 (`pk.eyJ1Ij...` 형태)
4. 복사한 토큰을 `tiles.config.json`의 `tileSource.apiKey`에 붙여넣기

> Mapbox 무료 플랜은 월 50,000회 타일 요청을 제공합니다.
> 타일 다운로드는 1회만 실행하므로 실제로는 수백~수천 회만 사용됩니다.

---

### STEP 4. 타일 다운로드 실행

`ClientApp` 디렉토리에서 실행합니다.

```bash
cd WebSOPApp/WebSOPApp/ClientApp
node scripts/downloadTiles.js
```

실행 시 콘솔 출력 예시:

```
=== AutoMiniMap 타일 다운로드 ===

[1] DB 연결 중... (127.0.0.1:5432/wsop_101)
  → 47개 센서 위경도 조회 완료
  타일 소스: mapbox-dark

[2] 범위 계산 완료 (buffer: ±0.05°)
  위도: 36.00123 ~ 36.10456
  경도: 129.28234 ~ 129.39876

[3] 타일 목록 생성 (줌 11~15)
  줌 11: 4장   (X 1769~1770, Y 827~828)
  줌 12: 9장   (X 3538~3540, Y 1655~1657)
  줌 13: 25장  (X 7076~7080, Y 3311~3315)
  줌 14: 81장  (X 14152~14161, Y 6622~6631)
  줌 15: 289장 (X 28304~28323, Y 13244~13263)

  총 408장 예상

[4] 다운로드 시작... (저장: wwwroot/tiles)

  진행: 50/408
  진행: 100/408
  ...
  진행: 408/408

=== 완료 ===
  다운로드: 408장
  스킵(기존): 0장

  저장 경로: WebSOPApp/wwwroot/tiles
  wwwroot/tiles/ 를 앱 배포에 포함해주세요.
```

---

### STEP 5. 타일 파일 확인

다운로드 완료 후 아래 경로에 파일이 생성되어 있는지 확인합니다.

```
WebSOPApp/wwwroot/tiles/
├── 11/
│   └── 1769/
│       ├── 827.png
│       └── 828.png
├── 12/
│   └── ...
├── 13/
│   └── ...
├── 14/
│   └── ...
└── 15/
    └── ...
```

---

### STEP 6. 앱에서 AutoMiniMap 사용

`AutoMiniMap.jsx`를 import하여 사용합니다.

```jsx
import AutoMiniMap from '../autoMiniMap/AutoMiniMap';

// 부모 컨테이너 크기 = 지도 표시 크기
<div style={{ width: 500, height: 380 }}>
    <AutoMiniMap
        points={allPoints}
        selectedId={selectedId}
        alarmIds={alarmIds}
        options={{
            tileUrlTemplate: '/tiles/{z}/{x}/{y}.png',
            padding:    20,
            minZoom:    15,
            maxZoom:    15,
            brightness: 1.2,
            iqrFence:   0.7,
            viewShiftY: 0.15,
        }}
    />
</div>
```

---

### STEP 7. 앱 빌드 및 배포

Visual Studio 또는 Rider에서 **폴더에 게시** 실행 시 `wwwroot/tiles/` 폴더가 함께 포함됩니다.

```
게시 출력 폴더/
├── WebSOPApp.exe (또는 dll)
├── wwwroot/
│   ├── tiles/          ← ★ 이 폴더가 포함되어야 함
│   │   ├── 11/
│   │   ├── 12/
│   │   └── ...
│   ├── js/
│   └── css/
└── ...
```

IIS에 사이트 추가 후 `/tiles/{z}/{x}/{y}.png` 경로로 정적 파일이 서빙되면 오프라인 환경에서도 정상 동작합니다.

---

## 4. tiles.config.json 속성 상세

```json
{
  "db": { ... },
  "tileSource": { ... },
  "tiles": { ... }
}
```

---

### `db` — PostgreSQL 접속 정보

| 속성 | 타입 | 설명 | 예시 |
|------|------|------|------|
| `host` | string | DB 서버 IP 또는 호스트명 | `"127.0.0.1"` |
| `port` | number | DB 포트 번호 | `5432` |
| `database` | string | DB명 | `"wsop_101"` |
| `user` | string | DB 접속 계정 | `"postgres"` |
| `password` | string | DB 접속 비밀번호 | `"your_password"` |

> 스크립트는 `public.ex_sensor_link` 테이블에서 `lat`, `lon` 컬럼을 조회합니다.
> 이 데이터를 기반으로 타일 다운로드 범위(bounds)를 자동 계산합니다.

---

### `tileSource` — 타일 소스 설정

| 속성 | 타입 | 설명 |
|------|------|------|
| `type` | string | 사용할 타일 소스 종류 (아래 목록 참고) |
| `apiKey` | string | 해당 서비스의 API 키 또는 토큰 |

#### `type` 선택 가능 값

| 값 | 서비스 | 특징 | API 키 필요 |
|----|--------|------|------------|
| `"mapbox-dark"` | Mapbox Dark v11 | ★ 권장. 어둡고 선명, 한국어 지명 표출 | ✅ Mapbox 토큰 |
| `"vworld-midnight"` | 브이월드 midnight | 어두운 스타일, 국내 서비스 | ✅ 브이월드 API 키 |
| `"vworld-base"` | 브이월드 기본 | 밝은 기본 스타일 | ✅ 브이월드 API 키 |
| `"vworld-white"` | 브이월드 white | 흰 배경 스타일 | ✅ 브이월드 API 키 |
| `"cartodb-dark"` | CartoDB Dark Matter | 어두운 스타일, API 키 불필요 | ❌ 없음 |

> `cartodb-dark`는 API 키 없이 사용 가능하지만 서비스 약관상 내부 비상업적 용도 권장.
> 실사용 프로젝트에는 `mapbox-dark` 사용을 권장합니다.

---

### `tiles` — 다운로드 범위 설정

| 속성 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `zoomMin` | number | `11` | 다운로드 줌 레벨 최소값. 낮을수록 넓은 범위(적은 타일) |
| `zoomMax` | number | `15` | 다운로드 줌 레벨 최대값. 높을수록 상세한 지도(많은 타일) |
| `bufferDeg` | number | `0.05` | DB bounds에 추가하는 여유 범위 (도 단위). `0.05` ≈ 약 5.5km |

#### 줌 레벨 가이드

| zoomMin~zoomMax | 커버 범위 | 타일 수 (포항 산단 기준) | 용량 (약) |
|-----------------|-----------|--------------------------|-----------|
| `15~15` | 상세 지도만 | ~289장 | ~14MB |
| `13~15` | 중간~상세 | ~315장 | ~15MB |
| `11~15` | 전체~상세 | ~408장 | ~20MB |
| `11~16` | 전체~매우 상세 | ~1500장 | ~75MB |

> 미니맵에서 `minZoom: 15, maxZoom: 15`로 고정해 사용한다면 `zoomMax: 15`까지만 다운로드해도 충분합니다.

---

## 5. downloadTiles.js 실행 옵션

```bash
# 기본 실행
node scripts/downloadTiles.js

# dry-run: 실제 다운로드 없이 타일 수/범위만 출력
node scripts/downloadTiles.js --dry-run

# 줌 레벨 덮어쓰기 (config보다 우선 적용)
node scripts/downloadTiles.js --zoom=15
node scripts/downloadTiles.js --zoom=13-15

# 버퍼 범위 덮어쓰기
node scripts/downloadTiles.js --buffer=0.1
```

> `--dry-run`은 실제 다운로드 전 타일 수를 미리 확인할 때 유용합니다.

---

## 6. AutoMiniMap 컴포넌트 Props 상세

```jsx
<AutoMiniMap
    points={...}       // 필수
    selectedId={...}   // 선택
    alarmIds={...}     // 선택
    options={...}      // 선택
/>
```

---

### `points` ✅ 필수

지도 범위 계산용 전체 포인트 목록입니다. 모든 포인트가 지도 안에 들어오도록 줌 레벨이 자동 조정됩니다.
마커 표출 여부는 `selectedId` / `alarmIds`로 별도로 결정됩니다.

```ts
Array<{
    lat:     number,         // 위도 (WGS84)  예: 36.0520
    lon:     number,         // 경도 (WGS84)  예: 129.3401
    id:      string|number,  // 고유 식별자 (selectedId/alarmIds 매칭 기준)
    label?:  string,         // 마커 하단 텍스트 (선택, 없으면 표출 안 함)
}>
```

---

### `selectedId` (선택)

일반 마커(파란 위치 아이콘)로 표출할 포인트의 `id`입니다.

```ts
string | number
```

- 미전달 시 일반 마커 없음
- `points` 배열에 해당 `id`를 가진 포인트가 없으면 마커 미표출

---

### `alarmIds` (선택)

알람 마커(빨간 깜빡이 아이콘)로 표출할 포인트 `id` 목록입니다.

```ts
Array<string | number>
```

- 미전달 또는 빈 배열 시 알람 마커 없음
- 중복 ID는 자동 제거됨

---

### `options` (선택)

지도 표출 세부 옵션입니다. 미전달 시 기본값 사용.

---

## 7. options 속성 상세

```jsx
options={{
    tileUrlTemplate: '/tiles/{z}/{x}/{y}.png',
    padding:         20,
    minZoom:         15,
    maxZoom:         15,
    brightness:      1.2,
    grayscale:       0,
    markerScale:     1.0,
    iqrFence:        0.7,
    viewShiftY:      0.15,
    darkFilter:      false,
}}
```

---

### `tileUrlTemplate`

| 항목 | 내용 |
|------|------|
| 타입 | `string` |
| 기본값 | `'/tiles/{z}/{x}/{y}.png'` |

타일 이미지 URL 패턴입니다. `{z}`, `{x}`, `{y}` 플레이스홀더를 사용합니다.

```js
// 로컬 서버 (운영 환경 — 기본값)
'/tiles/{z}/{x}/{y}.png'

// Mapbox 직접 연결 (온라인 개발 테스트용)
'https://api.mapbox.com/styles/v1/mapbox/dark-v11/tiles/256/{z}/{x}/{y}?access_token=YOUR_TOKEN'

// CartoDB 직접 연결 (API 키 없이 테스트용)
'https://basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png'
```

> 운영 환경(폐쇄망)에서는 반드시 로컬 경로(`/tiles/...`)를 사용하세요.

---

### `padding`

| 항목 | 내용 |
|------|------|
| 타입 | `number` (px) |
| 기본값 | `50` |

마커가 지도 가장자리에서 떨어지는 여백입니다. 값이 클수록 마커들이 더 중앙으로 모입니다.

```
padding: 10  → 마커가 가장자리 가까이까지 표출 (지도 범위 넓게)
padding: 50  → 기본값
padding: 80  → 마커가 중앙에 모임 (줌 레벨이 낮아짐)
```

---

### `minZoom` / `maxZoom`

| 항목 | 내용 |
|------|------|
| 타입 | `number` |
| 기본값 | `minZoom: 1`, `maxZoom: 19` |

자동 계산된 줌 레벨의 허용 범위입니다.

```js
// 줌 고정 (미니맵에서 권장)
minZoom: 15, maxZoom: 15

// 자동 계산 허용 범위 지정
minZoom: 13, maxZoom: 15
```

| 줌 레벨 | 표출 범위 |
|---------|-----------|
| 12 | 포항시 전체 |
| 13 | 포항 산단 전체 |
| 14 | 포항 산단 일부 |
| 15 | 공장 단지 블록 단위 |

> `minZoom: 15, maxZoom: 15`로 고정하면 항상 일정한 축척으로 표출됩니다.
> 단, 해당 줌 레벨의 타일이 `wwwroot/tiles/`에 있어야 합니다.

---

### `brightness`

| 항목 | 내용 |
|------|------|
| 타입 | `number` |
| 기본값 | `2.1` |

지도 밝기입니다. CSS `brightness()` 필터를 사용합니다.

```
1.0 = 원본 밝기
1.2 = 20% 밝게 (권장 — 어두운 타일을 조금 밝게)
2.0 = 2배 밝게
```

---

### `grayscale`

| 항목 | 내용 |
|------|------|
| 타입 | `number` (0~100) |
| 기본값 | `0` |

흑백 변환 강도입니다. CSS `grayscale()` 필터를 사용합니다.

```
0   = 원본 색상 유지
30  = 30% 흑백 (색상이 연해짐)
100 = 완전 흑백
```

> VWorld midnight 타일처럼 파란 색감이 강한 경우 `grayscale: 30~50` 사용 권장.

---

### `markerScale`

| 항목 | 내용 |
|------|------|
| 타입 | `number` |
| 기본값 | `1.0` |

모든 마커 크기의 배율입니다. 마커 기본 크기에 이 값을 곱합니다.

```
1.0 = 기본 크기 (normal: 14px, alarm: 16px, alarm-selected: 21px)
1.2 = 20% 크게
0.8 = 20% 작게
```

---

### `iqrFence`

| 항목 | 내용 |
|------|------|
| 타입 | `number` |
| 기본값 | `1.5` |

IQR(사분위범위) 기반 이상치 제거 강도입니다. 값이 작을수록 밀집 클러스터만 지도 범위에 포함됩니다.

```
0.5 → 중심 클러스터만 표출 (텍스트 크게, 이상치 포인트 지도 밖)
0.7 → 권장 (포항 산단처럼 일부 이상치 센서 제외)
1.0 → 적당한 범위
1.5 → 기본값 (Tukey 표준, 거의 모든 포인트 포함)
```

> 포인트가 4개 이하인 경우 IQR 계산 없이 모든 포인트를 범위에 포함합니다.

---

### `viewShiftY`

| 항목 | 내용 |
|------|------|
| 타입 | `number` |
| 기본값 | `0` |

지도 뷰 창을 북쪽으로 이동합니다. 타일 범위 자체를 이동시켜 실제 지형 타일이 로드됩니다.

```
0    = 이동 없음 (기본)
0.1  = 타일 행 수의 10%만큼 북쪽으로 이동
0.15 = 타일 행 수의 15%만큼 북쪽으로 이동 (권장)
0.3  = 타일 행 수의 30%만큼 북쪽으로 이동
```

> 예: 현재 표출 중인 타일 행이 4개이고 `viewShiftY: 0.15`이면 → 0.6 ≈ 1행 북쪽으로 이동.
> 선택된 마커가 지도 위쪽에서 잘릴 때 사용합니다.

---

### `darkFilter`

| 항목 | 내용 |
|------|------|
| 타입 | `boolean` |
| 기본값 | `false` |

Canvas 레벨 다크 필터 적용 여부입니다.

```
false = Mapbox dark, CartoDB dark 타일처럼 이미 어두운 타일 사용 시
true  = OSM 기본 타일처럼 밝은 타일을 다크로 변환할 때
```

> Mapbox dark-v11 또는 CartoDB dark 타일 사용 시 `false`(기본값)로 유지하세요.

---

## 8. 마커 동작 규칙

### 마커 종류

| 상태 | 아이콘 | 기본 크기 | 효과 | zIndex |
|------|--------|-----------|------|--------|
| `normal` — 선택됨 | 파란 위치 아이콘 (`position_icon.svg`) | 14×14px | 없음 | 5 |
| `alarm` — 알람 발생 | 빨간 알람 아이콘 (`alarm_icon.svg`) | 16×16px | 깜빡임 | 10 |
| `alarm-selected` — 알람 + 선택 | 빨간 알람 아이콘 | 21×21px (alarm × 1.3) | 깜빡임 + 크게 | 15 |

### 우선순위 규칙

```
같은 포인트에 selectedId와 alarmIds가 동시에 해당될 경우:
  → alarm-selected 타입으로 표출 (알람 마커가 선택 마커보다 우선)
  → 알람 상태인 센서는 선택되어도 항상 알람 아이콘 유지
```

### 마커가 표출되는 경우

```
points 배열의 포인트 p에 대해:

  p.id ∈ alarmIds  AND  p.id === selectedId  →  alarm-selected 마커
  p.id ∈ alarmIds  AND  p.id ≠  selectedId  →  alarm 마커
  p.id ∉ alarmIds  AND  p.id === selectedId  →  normal 마커
  그 외                                       →  마커 없음 (지도 범위 계산에만 기여)
```

---

## 9. 실제 연동 예시 (miniMap.jsx 패턴)

```jsx
import React, { useMemo, useState } from 'react';
import PopupDraggable from './popupDraggable';
import { MiniMapComponent } from '../../styled/sdmsPopupsStyled';
import SdmsResource from '../../resource/id';
import AutoMiniMap from '../autoMiniMap/AutoMiniMap';

function MiniMap(props) {
    const [opacity, setOpacity] = useState(1);

    // ① zone_sn → sensorLink 매핑 (Map 구조)
    const sensorLinkByZoneSn = useMemo(() => {
        const links = Array.isArray(props.sensorLinks) ? props.sensorLinks : [];
        const map = new Map();
        for (const link of links) {
            const key = link?.zone_sn != null ? String(link.zone_sn) : null;
            if (key != null) map.set(key, link);
        }
        return map;
    }, [props.sensorLinks]);

    // ② 전체 센서 포인트 목록 (지도 범위 계산 + 마커 후보)
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

    // ③ 선택된 센서 ID (일반 마커 표출 대상)
    const selectedId = useMemo(() => {
        const sn = props.selectedSensor?.sensor?.sensorLink?.zone_sn;
        return sn != null ? String(sn) : undefined;
    }, [props.selectedSensor]);

    // ④ 알람 발생 zone_sn 목록 (알람 마커 표출 대상, 중복 제거)
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
                        onChange={(e) => setOpacity(e.target.valueAsNumber)}
                    />
                    <button className='dslX'>닫기</button>
                </div>

                <div className='content'>
                    <div>
                        <AutoMiniMap
                            points={allPoints}
                            selectedId={selectedId}
                            alarmIds={alarmIds}
                            options={{
                                tileUrlTemplate: '/tiles/{z}/{x}/{y}.png',
                                padding:    20,
                                minZoom:    15,
                                maxZoom:    15,
                                brightness: 1.2,
                                grayscale:  0,
                                iqrFence:   0.7,
                                viewShiftY: 0.15,
                            }}
                        />
                    </div>
                </div>
            </PopupDraggable>
        </MiniMapComponent>
    );
}

export default MiniMap;
```

---

## 10. 자주 쓰는 조정 가이드

| 증상 | 원인 | 해결 옵션 |
|------|------|-----------|
| 지도 범위가 너무 넓음 / 텍스트 작음 | 이상치 센서가 범위 확대 | `iqrFence` 줄이기 (`0.7 → 0.5`) |
| 지도 범위가 너무 좁음 | iqrFence가 너무 작음 | `iqrFence` 늘리기 (`0.7 → 1.5`) |
| 줌이 계속 바뀜 / 범위 불안정 | 자동 줌 계산 중 | `minZoom`, `maxZoom` 같은 값으로 고정 |
| 마커가 지도 위쪽 밖으로 나감 | 뷰 범위가 남쪽 편향 | `viewShiftY` 올리기 (`0.15 → 0.25`) |
| 지도 아래쪽이 잘림 | viewShiftY 과도 | `viewShiftY` 줄이기 (`0.25 → 0.1`) |
| 지도가 너무 어두움 | 기본 brightness | `brightness` 올리기 (`1.2 → 1.5`) |
| 지도 색이 파랗거나 화려함 | 타일 원본 색상 | `grayscale` 올리기 (`0 → 30`) |
| 마커가 너무 작게 보임 | 기본 markerScale | `markerScale` 올리기 (`1.0 → 1.3`) |
| 마커가 가장자리에 걸림 | padding 부족 | `padding` 올리기 (`20 → 50`) |
| 타일 경계선(격자)이 보임 | 브라우저 렌더링 이슈 | 이미 내부적으로 해결됨 (Math.floor/ceil 적용) |

---

## 11. FAQ

### Q1. 타일 다운로드를 다시 실행하면 어떻게 되나요?

기존에 다운로드된 파일은 자동으로 스킵합니다. 새로 추가된 범위의 타일만 다운로드됩니다.

---

### Q2. 지역을 다른 곳으로 바꾸고 싶습니다.

1. `tiles.config.json`의 `bufferDeg`를 조정하거나, DB의 센서 위경도 데이터가 새 지역을 포함하도록 업데이트합니다.
2. `node scripts/downloadTiles.js`를 재실행합니다.
3. `AutoMiniMap`의 `points` props에 새 지역 좌표를 넣으면 자동으로 해당 지역 지도가 표시됩니다.

---

### Q3. 타일 다운로드 중 일부 실패했습니다.

콘솔에 `✗ z/x/y: HTTP 404` 등의 오류가 출력됩니다. 스크립트를 다시 실행하면 실패한 타일만 재시도합니다 (성공한 타일은 스킵).

---

### Q4. 폐쇄망에서 지도가 표시되지 않습니다.

다음을 순서대로 확인하세요.

1. `wwwroot/tiles/` 폴더가 배포 패키지에 포함되어 있는지 확인
2. IIS에서 `.png` 정적 파일 서빙이 허용되어 있는지 확인
3. 브라우저 개발자 도구(F12) → Network 탭에서 `/tiles/15/28304/13244.png` 같은 요청이 `200 OK`인지 확인
4. `200 OK`이지만 지도가 안 보이면 브라우저 콘솔에서 JavaScript 오류 확인

---

### Q5. `minZoom: 15, maxZoom: 15`인데 지도가 검게 나옵니다.

`wwwroot/tiles/15/` 폴더가 없거나 비어있는 경우입니다.
`tiles.config.json`의 `zoomMax`를 `15` 이상으로 설정하고 타일 다운로드를 다시 실행하세요.

---

### Q6. `tiles.config.json`에 DB 정보 없이 타일만 다운로드할 수 있나요?

현재 스크립트는 DB에서 센서 위경도를 조회하여 bounds를 자동 계산합니다.
DB 없이 사용하려면 스크립트 내부의 bounds 계산 부분을 수동 좌표로 대체해야 합니다.

---

### Q7. 마커가 지도 위치와 약간 어긋납니다.

- 타일 로드가 완료되기 전에는 마커 위치가 계산되지 않습니다 (`loading` 상태 동안 마커 없음).
- 로드 완료 후에도 어긋난다면 `points` 배열의 `lat`, `lon` 값이 정확한지 확인하세요.

---

*이 매뉴얼은 AutoMiniMap 모듈의 현재 구현 상태(2026-03-13 기준)를 기반으로 작성되었습니다.*
