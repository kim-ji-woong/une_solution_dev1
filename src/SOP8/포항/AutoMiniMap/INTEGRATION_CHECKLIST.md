# AutoMiniMap 신규 프로젝트 적용 체크리스트

**작성일:** 2026-03-13
**대상 프로젝트:** SOP8 WebSOPApp 시리즈

---

## 1. 모듈 구성 파일

다음 파일들을 복사하여 신규 프로젝트에 적용해야 합니다.

### 필수 파일 (반드시 복사)

| 파일 | 설명 | 비고 |
|------|------|------|
| `autoMiniMap/AutoMiniMap.jsx` | 메인 컴포넌트 | 지도 렌더링 및 마커 표시 담당 |
| `autoMiniMap/useMapTile.js` | 타일 로드 훅 | **버그 수정 필수** (아래 참고) |
| `autoMiniMap/geoUtils.js` | 좌표 변환 유틸 | GPS 좌표 → 캔버스 좌표 변환 |
| `scripts/downloadTiles.js` | 타일 다운로드 스크립트 | 사전 설정 후 실행 필수 |
| `scripts/tiles.config.example.json` | 타일 설정 예시 | 프로젝트 설정에 맞게 수정 후 tiles.config.json 생성 |
| `scripts/minimap_master_manual.md` | 타일 다운로드 사용법 | 참고용 문서 |

### 미사용 파일 (복사 불필요)

| 파일 | 사유 |
|------|------|
| `autoMiniMap/MapMarker.jsx` | `AutoMiniMap.jsx`에서 import되지 않음. 마커는 내부 MARKER_DISPLAY로 렌더링됨 |

### 참고용 파일 (프로젝트에 맞게 수정 후 활용)

| 파일 | 설명 |
|------|------|
| `miniMap.jsx` | AutoMiniMap 통합 사용 예제. 신규 프로젝트의 환경에 맞게 props 및 options 수정 필요 |

---

## 2. useMapTile.js 필수 버그 수정

`useMapTile.js`를 복사한 후 **반드시 아래 버그를 수정**해야 합니다.

### 위치
파일의 134~135번째 줄 근처

### 수정 내용

**버그 코드 (수정 전):**
```javascript
const scale = width / (colCount * TILE_SIZE);
```

**수정된 코드 (수정 후):**
```javascript
const scaleX = width  / (colCount * TILE_SIZE);
const scaleY = height / (rowCount * TILE_SIZE);
const scale  = Math.max(scaleX, scaleY);
```

### 증상
지도 하단에 어두운 배경색(`#1a1a2e`)이 노출되어 지도가 잘린 것처럼 보입니다.

### 원인
기존 코드는 `Math.ceil`로 열(column) 개수를 보정할 때 너비만 기준으로 스케일을 계산하므로, 타일 높이가 캔버스 높이보다 작아져서 하단에 공백이 생깁니다.

### 수정 효과
캔버스 전체를 타일로 완전히 커버하여 배경색이 노출되지 않습니다.

---

## 3. 팝업 CSS 수정 (sdmsPopupsStyled.js)

MiniMapComponent 스타일 정의에서 다음 두 항목을 반드시 수정해야 합니다.

### 3-1. 기존 img 규칙 제거 (필수)

**문제:**
기존 MiniMapComponent에 아래와 같은 규칙이 있으면 반드시 제거해야 합니다.
```css
.content > div img { width: 268px; height: 184px; }
```

**이유:**
이는 기존 정적 지도 이미지용 규칙이 AutoMiniMap의 마커 `<img>` 태그에도 적용되어 마커가 수백px 크기로 과대 렌더링됩니다.

**수정:**
해당 규칙을 삭제하거나, AutoMiniMap의 마커 이미지 요소에만 예외를 적용합니다.

### 3-2. 팝업 초기 크기 조정 (필수)

**문제:**
MiniMapComponent의 초기 `width`/`height`가 작으면 팝업이 작은 크기로 시작되어 지도가 잘립니다.

**주의:**
`popupMinWidth`, `popupMinHeight`는 **리사이즈 최솟값**일 뿐 **초기 크기를 결정하지 않습니다.**

**수정 예시:**

`miniMap.jsx`의 설정이 `popupMinWidth={550}, popupMinHeight={420}`인 경우:

```css
export const MiniMapComponent = styled(PopupsCommon)`
    position: absolute;
    width: 550px;
    height: 420px;
    top: 60%;   /* 화면 크기에 맞게 조정 */
    left: 70%;  /* 화면 크기에 맞게 조정 */

    .content {
        padding: 16px;

        > div {
            position: relative;
            width: 100%;
            height: 100%;
        }
    }
`;
```

**체크포인트:**
- MiniMapComponent의 `width` >= `popupMinWidth`
- MiniMapComponent의 `height` >= `popupMinHeight`

---

## 4. sdms.jsx — MiniMap 컴포넌트 props 연결 확인 (필수)

`sdms.jsx`에서 MiniMap 컴포넌트를 렌더링할 때 아래 두 prop이 **반드시 올바르게 전달**되어야 합니다.

### 필수 props

```jsx
<MiniMap
    ...
    sensorLinks={sensorLinks}        {/* ← 누락 시 allPoints=[] → 지도 렌더링 자체 안됨 */}
    sensorAlarms={sensorAlarms}      {/* ← 오탈자(sensoralarms) 또는 누락 시 알람 마커 미표출 */}
    ...
/>
```

### 주의사항

| 문제 | 증상 |
|------|------|
| `sensorLinks` 누락 또는 undefined | `allPoints`가 빈 배열이 되어 `AutoMiniMap` 컴포넌트 자체가 렌더링되지 않음 (지도가 아예 안 보임) |
| `sensorAlarms` 대소문자 오류 (예: `sensoralarms`) | boolean `true` 값으로 전달되어 알람 마커가 동작하지 않음 |
| `sensorAlarms` 누락 | 알람 마커가 표출되지 않음 |

### 확인 방법

```javascript
// sdms.jsx에서 MiniMap 호출 시
console.log('sensorLinks:', sensorLinks);  // 배열이어야 함
console.log('sensorAlarms:', sensorAlarms);  // 배열이어야 함
```

---

## 5. 환경 의존성 사전 확인

AutoMiniMap이 정상 작동하려면 다음 환경 요소들이 준비되어야 합니다.

### 5-1. 아이콘 이미지 파일

**요구사항:**
AutoMiniMap.jsx가 참조하는 경로에 이미지 파일이 있어야 합니다.

**기본 경로:**
```
../../images/position_icon.svg
../../images/alarm_icon.svg
```

**조치 방법:**
- 해당 경로에 파일이 없으면 마커가 표출되지 않습니다.
- 파일 배치 위치가 다르면 `AutoMiniMap.jsx` 상단의 import 경로를 수정해야 합니다.

### 5-2. 알람 깜빡임 CSS 클래스

**요구사항:**
전역 CSS에 아래 애니메이션이 정의되어 있어야 합니다.

```css
@keyframes auto-minimap-alarm-blink {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.2; }
}

.auto-minimap-alarm-blink {
    animation: auto-minimap-alarm-blink 1s ease-in-out infinite;
}
```

**문제:**
이 클래스가 없으면 알람 마커가 정지 상태(깜빡이지 않음)로만 표출됩니다.

**추가 위치:**
`src/index.css` 또는 프로젝트의 전역 CSS 파일에 추가합니다.

### 5-3. 타일 줌 레벨 범위 일치

**요구사항:**
`tiles.config.json`의 줌 범위가 `miniMap.jsx` options의 줌 범위를 **포함**해야 합니다.

**예시:**

miniMap.jsx에서:
```jsx
minZoom: 15,
maxZoom: 15
```

tiles.config.json에서:
```json
{
  "zoomMin": 15,
  "zoomMax": 15
}
```

**문제:**
포함되지 않은 줌 레벨을 요청하면 `Promise.all` 전체가 실패하여 지도가 렌더링되지 않습니다.

**확인 체크:**
- `tiles.config.json`의 `zoomMin` <= `miniMap.jsx`의 `minZoom`
- `tiles.config.json`의 `zoomMax` >= `miniMap.jsx`의 `maxZoom`

### 5-4. 정적 파일 서빙 순서 (Startup.cs)

**요구사항:**
ASP.NET Core의 미들웨어 등록 순서가 올바르게 되어야 `/tiles/...` 요청이 정상 서빙됩니다.

**올바른 순서:**
```csharp
app.UseStaticFiles();   // ← 반드시 UseSpa() 보다 먼저
...
app.UseSpa(...);        // ← 이 이후에 등록된 것은 SPA로 fallback됨
```

**문제:**
- `UseStaticFiles()`가 `UseSpa()` **뒤에** 있으면 `/tiles/15/28001/12977.png` 같은 타일 요청이 React 앱으로 fallback되어 **404 또는 HTML 반환**됩니다.
- 정적 파일 미들웨어가 없으면 타일 파일에 접근할 수 없습니다.

**확인 방법:**
```csharp
// Startup.cs Configure 메서드
public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
{
    // ... 기타 미들웨어 ...

    app.UseStaticFiles();  // ← 이 줄이 먼저 와야 함

    app.UseRouting();
    app.UseEndpoints(...);

    app.UseSpa(...);       // ← 마지막에 등록
}
```

---

## 6. miniMap.jsx 주요 options 설명

`miniMap.jsx`의 options 객체에 설정되는 주요 파라미터들입니다. 신규 프로젝트의 특성에 맞게 조정할 수 있습니다.

```jsx
options={{
    tileUrlTemplate: '/tiles/{z}/{x}/{y}.png',
    padding: 20,
    minZoom: 15,
    maxZoom: 15,
    brightness: 1.2,
    grayscale: 0,
    iqrFence: 0.7,
    viewShiftY: 0.15
}}
```

| 옵션 | 기본값 | 설명 | 조정 가이드 |
|------|--------|------|-----------|
| `tileUrlTemplate` | `/tiles/{z}/{x}/{y}.png` | 타일 URL 패턴 | 타일 서버 경로가 다르면 변경 |
| `padding` | `20` | 마커가 캔버스 가장자리에서 떨어지는 여백(px) | 마커가 경계에 너무 가까우면 증가 |
| `minZoom` | `15` | 최소 줌 레벨 | 다운로드된 타일 범위 내로 설정 |
| `maxZoom` | `15` | 최대 줌 레벨 | 다운로드된 타일 범위 내로 설정 |
| `brightness` | `1.2` | 지도 밝기 (1.0=원본) | 높을수록 밝음, 어두운 배경이면 증가 |
| `grayscale` | `0` | 탈색 정도 (0~100) | 0=컬러, 100=흑백, 흑백으로 표시하려면 증가 |
| `iqrFence` | `0.7` | IQR 배수, 마커 밀집도 필터링 | 낮을수록 밀집된 클러스터만 표출 |
| `viewShiftY` | `0.15` | 지도 북쪽 이동 비율 | 위쪽 영역을 더 표출하려면 증가 |

---

## 7. 빠른 확인 체크리스트 (요약)

아래 체크리스트를 순서대로 진행하며 AutoMiniMap 적용 준비도를 확인합니다.

- [ ] `autoMiniMap/` 폴더 하위 필수 파일 3개 복사 완료 (AutoMiniMap.jsx, useMapTile.js, geoUtils.js)
- [ ] `useMapTile.js` scale 버그 수정 완료 (`Math.max(scaleX, scaleY)` 적용)
- [ ] `scripts/downloadTiles.js`, `scripts/tiles.config.example.json` 복사 완료
- [ ] 이미지 경로 확인: `position_icon.svg`, `alarm_icon.svg` 파일 존재 확인
- [ ] 전역 CSS에 `auto-minimap-alarm-blink` 클래스 정의 확인 또는 추가
- [ ] `sdmsPopupsStyled.js` MiniMapComponent에서 기존 `img` 크기 규칙 제거 완료
- [ ] `sdmsPopupsStyled.js` MiniMapComponent: 초기 `width`/`height`를 popupMinWidth/Height 이상으로 설정 완료
- [ ] `sdms.jsx` MiniMap 렌더링: `sensorLinks={sensorLinks}` prop 전달 확인
- [ ] `sdms.jsx` MiniMap 렌더링: `sensorAlarms={sensorAlarms}` prop 전달 확인 (대소문자 및 값 바인딩)
- [ ] `tiles.config.json` 타일 줌 범위가 `miniMap.jsx` options의 minZoom~maxZoom 포함 확인
- [ ] `Startup.cs` `UseStaticFiles()`가 `UseSpa()` 보다 먼저 등록 확인
- [ ] `downloadTiles.js` 실행 후 `wwwroot/tiles/` 하위에 타일 파일 존재 확인
- [ ] 개발 서버 실행 후 브라우저에서 지도 표시 및 마커 렌더링 확인

---

## 추가 트러블슈팅

### 지도가 아예 안 보임
1. `sensorLinks` prop 전달 확인
2. `allPoints` 배열이 비어있지 않은지 확인 (개발자 도구 콘솔)
3. 타일 파일이 다운로드되어 있는지 확인 (`wwwroot/tiles/`)

### 마커가 안 보임
1. 이미지 파일 경로 확인
2. 콘솔에서 404 에러 확인
3. AutoMiniMap.jsx의 import 경로 수정

### 알람 마커가 안 깜빡임
1. 전역 CSS에 `auto-minimap-alarm-blink` 정의 확인
2. `sensorAlarms` prop이 배열로 전달되는지 확인

### 지도 하단에 검은색 배경이 노출됨
1. `useMapTile.js`의 scale 버그 수정 확인 (이 문서의 섹션 2 참고)

### 팝업이 너무 작게 시작됨
1. MiniMapComponent의 `width`/`height` CSS 확인
2. `popupMinWidth`/`popupMinHeight`는 최솟값임을 인지

---

**끝**
