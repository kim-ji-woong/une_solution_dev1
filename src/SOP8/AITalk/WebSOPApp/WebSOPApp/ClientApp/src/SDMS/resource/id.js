import ProjectResource from "../../Root/resource/id";
import StringUtil from "../../Common/util/StringUtil";
import Icon from "../../Common/components/Icon/Icon";

export default class SdmsResource {
    static targetMode = 0;

    static get ID() {
        return SdmsResource.id[ProjectResource.targetLanguage];
    }

    static PopupAniTime = 200;      // 팝업 Show, Hide 시간 설정

    static id = {
        "ko": {
            projectName: "SDMS",
            menu:
            {
                statusInfo: "현황정보",
                dashboard: "대시보드\n요약 정보",
                event: "이벤트\n정보",
                manualReport: "수동신고",
                weatherInfo: "기상센서 상세정보",
                eventMemo: "메모",
                accessInfo: "출입 정보",
                sumpInfo: "집수정",
                detailInfo: "정보",
                cctvInfo: "CCTV 영상정보",
                alarmCCTVInfo: "이벤트 CCTV 영상정보",
                integrated: "통합 관제",
                equipment: "설비 관제",
                simulation: "시뮬레이션",
                editMode: "편집 모드",
                editMode_poi: "POI",
                editMode_fakeWall: "가벽",
                editMode_areaName: "구역명",
                editMode_addPoi: "추가 POI 목록",
                editMode_cctvMapping: "CCTV 매핑",
                equipmentAnalysis: "AI 설비 예지보전 분석 데이터",
                equipmentDetailInfo: "설비정보",
                equipmentChartDetailInfo: "그래프 상세정보"
            },
            sensor:
            {
                atmosphere: "대기",
                electric: "전류CT",
                weather: "기상",
                cctv: "cctv"
            },
        }
    }

    static facilityType = {
        FIRE: 300300,                       // 화재
        CCTV: 300303,                       // CCTV
        PSM_SENSOR: 300311,                 // 유해화학물질 누출감지 센서

        FIREWALL: 300315,                   // 방화벽
        DOOR: 300316,                       // 문
        BLACKOUT: 300317,                   // 정전 - 전력
        STRONG_WIND: 300318,                // 강풍
        WaterLevel: 300319,                 // 침수
        Terror: 300320,                     // 테러
        ETC: 300321,                        // 기타
        PM: 300322,                         // 미세먼지
        MOBILE_SCANNER: 300323,             // 이동식 스캐너
        SUMP: 300324,                       // 집수정

        EQUIPMENT: 300330,                  // AI 설비 예지보전

        Earthquake: 300350,                 // 지진

        Collapse: 300111,
        SOS: 300112,
        Confined: 300113,
        VirtualFence: 300114,
        Becon_Stay: 300115,                 // 비콘 체류알람
        Becon_SOS: 300116,                  // 비콘 SOS

        Environment: 300117,                // 환경설비
        Manufacture: 300118,                // 제조설비
        EmergencyBell: 300119,              // 비상벨
        
        Laser: 300120,                      // 레이저
        EXIT: 300121,                       // 비상구

        LowBattery: 300252,                 // 배터리교체 (UPS) - 전력

        Intrusion_S1: 300900,               // SVMS 침입
        Loiter_S1: 300901,                  // SVMS 배회
        Collapse_S1: 300902,                // SVMS 쓰러짐
        Theft_S1: 300903,                   // SVMS 도난
        Neglect_S1: 300904,                 // SVMS 방치
        VirtualFence_S1: 300905,            // SVMS 가상펜스
        Fire_S1: 300906,                    // SVMS 화재
        SVMS_Device_Event: 300908           // CCTV가 아닌 SVMS 장치 이벤트
    }

    static sensorSubType = {
        PSM: 11,                            // 유해화학물질 누출감지 센서

        STRONG_WIND: 18,                   // 강풍

        ETC: 21,                            // 기타

        Earthquake: 50,                     // 지진 센서

        // Soulbrain 공장설비
        Temp: 200,
        Humi: 201,
        CO2: 202,
        TVOC: 203,
        Dust_PM1: 204,
        Dust_PM2: 205,
        Dust_PM10: 206,
        AirPress: 207,
        Inclin_X: 208,
        Inclin_Y: 209,
        Vib_X: 210,
        Vib_Y: 211,
        Vib_Z: 212,
        Noise: 213,
        BLE_Count: 214,
        HF: 215,
        CO: 216,
        O2: 217,
        Value: 218,
        mA: 219,
        Contact: 220,
        Relay: 221,
        HCL: 222,
        CH3C: 223,
        N2H4: 224,
        CA: 225,
        EA: 226,
        VOC: 227,
        H2O2: 228,
        THC: 229,
        HNO3: 230,
        CL: 231,
        TOLUENE: 232,
        F2: 233,
        NH3: 234,
        LNG: 235,
        PGMEA: 236,
        H2S: 237,
        pH: 238,
        AUTO: 239,
        GATE1_OPEN: 240,
        GATE1_CLOSE: 241,
        GATE1_RATE: 242,
        GATE1_FAULT: 243,
        GATE2_OPEN: 244,
        GATE2_CLOSE: 245,
        GATE2_RATE: 246,
        GATE2_FAULT: 247,
        BATTERY: 248,
        OPERATION: 249,
        WATER_TEMP: 250,
        SCRUBBER: 251,
        F: 252,
        H2: 253,
        CL2: 254,
        C2H6O: 255,
        Flame: 256,
        Leak: 257,
        LEL: 258,
        TEPO: 259,
        CONNECT: 260,
    }

    static getFacilityTypeString(nType) {
        if (nType === SdmsResource.facilityType.FIRE)
            return '화재';
        else if (nType === SdmsResource.facilityType.PSM_SENSOR)
            return '누출';
        else if (nType === SdmsResource.facilityType.BLACKOUT)
            return '정전';
        else if (nType === SdmsResource.facilityType.STRONG_WIND)
            return '강풍';
        else if (nType === SdmsResource.facilityType.ETC)
            return '기타';
        else if (nType === SdmsResource.facilityType.Earthquake)
            return '지진';
        else if (nType === SdmsResource.facilityType.Becon_Stay)
            return '비콘_체류';
        else if (nType === SdmsResource.facilityType.Becon_SOS)
            return '비콘_SOS';
        else if (nType === SdmsResource.facilityType.Laser)
            return '레이저';
        else if (nType === SdmsResource.facilityType.DOOR)
            return '도어';
        else if (nType === SdmsResource.sensorSubType.Temp)
            return '온도';
        else if (nType === SdmsResource.sensorSubType.Humi)
            return '습도';
        else if (nType === SdmsResource.sensorSubType.CO2)
            return '이산화탄소';
        else if (nType === SdmsResource.sensorSubType.TVOC)
            return 'TVOC';
        else if (nType === SdmsResource.sensorSubType.Dust_PM1)
            return '미세먼지(PM 1.0)';
        else if (nType === SdmsResource.sensorSubType.Dust_PM2)
            return '미세먼지(PM 2.5)';
        else if (nType === SdmsResource.sensorSubType.Dust_PM10)
            return '미세먼지(PM 10)';
        else if (nType === SdmsResource.sensorSubType.AirPress)
            return '기압';
        else if (nType === SdmsResource.sensorSubType.Inclin_X)
            return '기울기(X)';
        else if (nType === SdmsResource.sensorSubType.Inclin_Y)
            return '기울기(Y)';
        else if (nType === SdmsResource.sensorSubType.Vib_X)
            return '진동(X)';
        else if (nType === SdmsResource.sensorSubType.Vib_Y)
            return '진동(Y)';
        else if (nType === SdmsResource.sensorSubType.Vib_Z)
            return '진동(Z)';
        else if (nType === SdmsResource.sensorSubType.Noise)
            return '소음';
        else if (nType === SdmsResource.sensorSubType.BLE_Count)
            return 'BLE Count';
        else if (nType === SdmsResource.sensorSubType.HF)
            return '불화수소';
        else if (nType === SdmsResource.sensorSubType.CO)
            return '일산화탄소';
        else if (nType === SdmsResource.sensorSubType.O2)
            return '산소';
        else if (nType === SdmsResource.sensorSubType.Value)
            return 'ESH_v5.1 측정값';
        else if (nType === SdmsResource.sensorSubType.mA)
            return 'mA';
        else if (nType === SdmsResource.sensorSubType.Contact)
            return '접점';
        else if (nType === SdmsResource.sensorSubType.Relay)
            return '릴레이';
        else if (nType === SdmsResource.sensorSubType.HCL)
            return '염화수소';
        else if (nType === SdmsResource.sensorSubType.CH3C)
            return '초산';
        else if (nType === SdmsResource.sensorSubType.N2H4)
            return '하이드라진';
        else if (nType === SdmsResource.sensorSubType.CA)
            return 'CA Gas';
        else if (nType === SdmsResource.sensorSubType.EA)
            return '에틸알콜';
        else if (nType === SdmsResource.sensorSubType.VOC)
            return 'VOC';
        else if (nType === SdmsResource.sensorSubType.H2O2)
            return '과수';
        else if (nType === SdmsResource.sensorSubType.THC)
            return '에탄올';
        else if (nType === SdmsResource.sensorSubType.HNO3)
            return '질산';
        else if (nType === SdmsResource.sensorSubType.CL)
            return '염소가스';
        else if (nType === SdmsResource.sensorSubType.TOLUENE)
            return '톨루엔';
        else if (nType === SdmsResource.sensorSubType.F2)
            return '불소';
        else if (nType === SdmsResource.sensorSubType.NH3)
            return '암모니아';
        else if (nType === SdmsResource.sensorSubType.LNG)
            return '액화천연가스';
        else if (nType === SdmsResource.sensorSubType.PGMEA)
            return '유기가스';
        else if (nType === SdmsResource.sensorSubType.H2S)
            return '황화수소';
        else if (nType === SdmsResource.sensorSubType.pH)
            return 'pH';
        else if (nType === SdmsResource.sensorSubType.AUTO)
            return '자동모드';
        else if (nType === SdmsResource.sensorSubType.GATE1_OPEN)
            return '수문1 열림';
        else if (nType === SdmsResource.sensorSubType.GATE1_CLOSE)
            return '수문1 닫힘';
        else if (nType === SdmsResource.sensorSubType.GATE1_RATE)
            return '수문1 개도율';
        else if (nType === SdmsResource.sensorSubType.GATE1_FAULT)
            return '수문1 FAULT';
        else if (nType === SdmsResource.sensorSubType.GATE2_OPEN)
            return '수문2 열림';
        else if (nType === SdmsResource.sensorSubType.GATE2_CLOSE)
            return '수문2 닫힘';
        else if (nType === SdmsResource.sensorSubType.GATE2_RATE)
            return '수문2 개도율';
        else if (nType === SdmsResource.sensorSubType.GATE2_FAULT)
            return '수문2 FAULT';
        else if (nType === SdmsResource.sensorSubType.BATTERY)
            return '배터리';
        else if (nType === SdmsResource.sensorSubType.OPERATION)
            return '동작상태';
        else if (nType === SdmsResource.sensorSubType.WATER_TEMP)
            return '수온';
        else if (nType === SdmsResource.sensorSubType.SCRUBBER)
            return '스크러버';
        else if (nType === SdmsResource.sensorSubType.F)
            return 'F';
        else if (nType === SdmsResource.sensorSubType.H2)
            return '수소';
        else if (nType === SdmsResource.sensorSubType.CL2)
            return 'CL2';
        else if (nType === SdmsResource.sensorSubType.C2H6O)
            return 'C2H6O';
        else if (nType === SdmsResource.sensorSubType.Flame)
            return 'Flame';
        else if (nType === SdmsResource.sensorSubType.Leak)
            return 'Leak';
        else if (nType === SdmsResource.sensorSubType.LEL)
            return 'LEL';
        else if (nType === SdmsResource.sensorSubType.TEPO)
            return 'TEPO';
        else if (nType === SdmsResource.sensorSubType.CONNECT)
            return '통신상태';
        else if (nType === SdmsResource.facilityType.Intrusion_S1)
            return '지능형영상(;)';
        else if (nType === SdmsResource.facilityType.Loiter_S1)
            return '지능형영상(;)';
        else if (nType === SdmsResource.facilityType.Collapse_S1)
            return '지능형영상(쓰;)';
        else if (nType === SdmsResource.facilityType.Theft_S1)
            return '지능형영상(;)';
        else if (nType === SdmsResource.facilityType.Neglect_S1)
            return '지능형영상(;)';
        else if (nType === SdmsResource.facilityType.VirtualFence_S1)
            return '지능형영상(가상;)';
        else if (nType === SdmsResource.facilityType.Fire_S1)
            return '지능형영상(;)';
        else if (nType === SdmsResource.facilityType.Environment)
            return '환경설비';
        else if (nType === SdmsResource.facilityType.Manufacture)
            return '제조설비';
        else if (nType === SdmsResource.facilityType.EmergencyBell)
            return '비상벨';

        return "";
    }

    static popupLayer = {
        statusInfo: "statusInfo",
        dashboard: "dashboard",
        event: "event",
        manualReport: "manualReport",
        detailInfo: "detailInfo",
        cctvInfo: "cctvInfo",
        alarmCCTVInfo: "alarmCCTVInfo",
        editMode_addPoi: "editMode_addPoi",
        editMode_cctvMapping: "editMode_cctvMapping",
        equipmentAnalysis: "equipmentAnalysis",
        equipmentDetailInfo: "equipmentDetailInfo",
        equipmentChartDetailInfo: "equipmentChartDetailInfo"
    }

    static controlMode = {
        integrated: 0,      // 통합관제 모드
        equipment: 1,       // 설비관제 모드
        editMode: 2,        // 편집 모드
        simulation: 3       // 시뮬레이션 모드
    }

    static weatherInfo = {
        Unknown: 100300,
        Sunshine: 100301,
        Thunder: 100302,
        SnowRain: 100303,
        HeavySnow: 100304,
        Snow: 100305,
        HeavyRain: 100306,
        Rain: 100307,
        Cloudy: 100308,
        Cloud: 100309,
        DustStorm: 100310,
        FineDust: 100311,
    }

    static getWeatherStateImage(state, iconSize) {
        if (state === SdmsResource.weatherInfo.Sunshine) {
            if (SdmsResource.isDayLight()) {
                return <Icon.imgSunnyDay width={iconSize} height={iconSize} />
            }
            else {
                return <Icon.imgSunnyNight width={iconSize} height={iconSize} />
            }
        }
        else if (state === SdmsResource.weatherInfo.Thunder) {
            return <Icon.imgThunder width={iconSize} height={iconSize} />
        }
        else if (state === SdmsResource.weatherInfo.SnowRain) {
            return <Icon.imgSnow width={iconSize} height={iconSize} />
        }
        else if (state === SdmsResource.weatherInfo.HeavySnow) {
            return <Icon.imgSnow width={iconSize} height={iconSize} />
        }
        else if (state === SdmsResource.weatherInfo.Snow) {
            return <Icon.imgSnow width={iconSize} height={iconSize} />
        }
        else if (state === SdmsResource.weatherInfo.HeavyRain) {
            return <Icon.imgRain width={iconSize} height={iconSize} />
        }
        else if (state === SdmsResource.weatherInfo.Rain) {
            return <Icon.imgRain width={iconSize} height={iconSize} />
        }
        else if (state === SdmsResource.weatherInfo.Cloudy) {
            if (SdmsResource.isDayLight()) {
                return <Icon.imgCloudDay width={iconSize} height={iconSize} />
            }
            else {
                return <Icon.imgCloudNight width={iconSize} height={iconSize} />
            }
        }
        else if (state === SdmsResource.weatherInfo.DustStorm) {
            return <Icon.imgDustStorm width={iconSize} height={iconSize} />
        }

        return '';
    }

    static isDayLight() {
        const now = new Date();
        const hour = now.getHours();

        if (hour < 6 || hour >= 19) {
            return false;
        }

        return true;
    }

    static windDirection = {
        North: 100400,
        NorthNorthEast: 100401,
        NorthEast: 100402,
        EastNorthEast: 100403,
        East: 100404,
        EastSouthEast: 100405,
        SouthEast: 100406,
        SouthSouthEast: 100407,
        South: 100408,
        SouthSouthWest: 100409,
        SouthWest: 100410,
        WestSouthWest: 100411,
        West: 100412,
        WestNorthWest: 100413,
        NorthWest: 100414,
        NorthNorthWest: 100415,
    };

    static windDirectionNames = {
        [SdmsResource.windDirection.North]: "북",
        [SdmsResource.windDirection.NorthNorthEast]: "북북동",
        [SdmsResource.windDirection.NorthEast]: "북동",
        [SdmsResource.windDirection.EastNorthEast]: "동북동",
        [SdmsResource.windDirection.East]: "동",
        [SdmsResource.windDirection.EastSouthEast]: "동남동",
        [SdmsResource.windDirection.SouthEast]: "남동",
        [SdmsResource.windDirection.SouthSouthEast]: "남남동",
        [SdmsResource.windDirection.South]: "남",
        [SdmsResource.windDirection.SouthSouthWest]: "남남서",
        [SdmsResource.windDirection.SouthWest]: "남서",
        [SdmsResource.windDirection.WestSouthWest]: "서남서",
        [SdmsResource.windDirection.West]: "서",
        [SdmsResource.windDirection.WestNorthWest]: "서북서",
        [SdmsResource.windDirection.NorthWest]: "북서",
        [SdmsResource.windDirection.NorthNorthWest]: "북북서",
    };

    static toolbar3DMenu = {
        "initScene": 1,
        "setInitScene": 2,
        "zoomIn": 3,
        "zoomOut": 4,
        "autoRotate": 5,
    }

    static getDate(date) {
        const dt = date;

        let mm = dt.getMonth() + 1;
        let dd = dt.getDate();
        let ss = dt.getSeconds();
        const ymd = dt.getFullYear() + '.' + StringUtil.getDoubleString(mm) + '.' + StringUtil.getDoubleString(dd);
        const hms = StringUtil.getDoubleString(dt.getHours()) + ':' + StringUtil.getDoubleString(dt.getMinutes()) + ':' + StringUtil.getDoubleString(ss);

        return [ymd, hms];
    }
}