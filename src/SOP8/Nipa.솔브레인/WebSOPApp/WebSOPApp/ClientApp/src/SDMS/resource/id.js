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
                event: "이벤트\n현황정보",
                manualReport: "수동신고",
                weatherInfo: "기상센서 상세정보",
                eventMemo: "메모",
                accessInfo: "출입 정보",
                sumpInfo: "집수정",
                detailInfo: "정보",
                cctvInfo: "CCTV 영상정보",
                alarmCCTVInfo: "이벤트 CCTV 영상정보",
                sensorInfo: "센서정보",
                workerInfo: "작업자 정보",
                integrated: "통합 관제",
                equipment: "설비 관제",
                simulation: "시뮬레이션",
                editMode: "편집 모드",
                editMode_poi: "POI",
                editMode_fakeWall: "가벽",
                editMode_areaName: "구역명",
                editMode_addPoi: "추가 POI 목록",
                editMode_cctvMapping: "CCTV 매핑",
                editMode_cctvInfo: "CCTV 영상정보",
                equipmentAnalysis: "AI 설비 이상 예측 차트",
                equipmentDetailInfo: "설비정보",
                equipmentChartDetailInfo: "그래프 상세정보",
                equipmentChartInfo: "설비차트정보",
                electricChartInfo: "전력차트정보",
            },
            poi_editSubMenu: {
                none: 0,
                move_poi: 1,
                delete_poi: 2,
                add_poi: 3,
                add_wall: 4,
                move_wall: 5,
                length_wall: 6,
                rotate_wall: 7,
                delete_wall: 8,
                move_area: 9,
                name_area: 10,
                cctv_area: 11
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

    static alarmOption = {
        stayCurrent: 0,
        moveToFirstAlarm: 1,
        moveToLastAlarm: 2
    }

    static facilityType = {
        FIRE: 300300,                       // 화재
        CCTV: 300303,                       // CCTV
        PSM_SENSOR: 300311,                 // 유해화학물질 누출감지 센서

        Environment: 300117,                   // 환경설비
        Manufacture: 300118,                   // 제조설비
        EmergencyBell: 300119,                 // 비상벨

        FIREWALL: 300315,                   // 방화벽
        DOOR: 300316,                       // 문
        BLACKOUT: 300317,                   // 정전 - 전력
        STRONG_WIND: 300318,                // 강풍
        WaterLevel: 300319,                 // 침수
        Terror: 300320,                     // 테러
        ETC: 300321,                        // 기타

        PM: 300322,                         // 미세먼지
        MOBILE_SCANNER: 300323,             // 이동식 스캐너 (비인가자 탐지)
        SUMP: 300324,                       // 집수정

        EQUIPMENT_PredictAlarm: 300330,     // AI 설비 예지보전
        EQUIPMENT_PeakPower: 300331,        // AI 전력분석

        Intrusion_S1: 900,                  // SVMS 침입
        Loiter_S1: 901,                     // SVMS 배회
        Collapse_S1: 902,                   // SVMS 쓰러짐
        Theft_S1: 903,                      // SVMS 도난
        Neglect_S1: 904,                    // SVMS 방치
        VirtualFence_S1: 905,               // SVMS 가상펜스
        Fire_S1: 906,                       // SVMS 화재
        SVMS_Device_Event: 908              // CCTV가 아닌 SVMS 장치 이벤트
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
        PM10: 270,      // 미세먼지
        PM2_5: 271,     // 미세먼지
        CO2: 272,       // 미세먼지
        VOCS: 273,      // 미세먼지
        REAL_TIME_ANALYSIS_300330: 276,      // 실시간 예측 (AI 설비 예지보전),
        REAL_TIME_ANALYSIS_300331: 277,      // 실시간 예측 (AI 전력분석)
        PREDICTIVE_ANALYSIS: 278      // 예측 분석
    }

    static getFacilityTypeString(nType) {
        if (nType === SdmsResource.facilityType.FIRE)
            return '화재';
        else if (nType === SdmsResource.facilityType.CCTV)
            return 'CCTV';
        else if (nType === SdmsResource.facilityType.PSM_SENSOR)
            return '누출';
        else if (nType === SdmsResource.facilityType.ETC)
            return '기타';
        else if (nType === SdmsResource.facilityType.PM)
            return '미세먼지';
        else if (nType === SdmsResource.facilityType.MOBILE_SCANNER)
            return '이동식 스캐너';
        else if (nType === SdmsResource.facilityType.SUMP)
            return '집수정';
        else if (nType === SdmsResource.facilityType.EQUIPMENT_PredictAlarm)
            return 'AI 설비 예지보전';
        else if (nType === SdmsResource.facilityType.EQUIPMENT_PeakPower)
            return 'AI 전력분석';
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
            return '지능형영상(침입)';
        else if (nType === SdmsResource.facilityType.Loiter_S1)
            return '지능형영상(배회)';
        else if (nType === SdmsResource.facilityType.Collapse_S1)
            return '지능형영상(쓰러짐)';
        else if (nType === SdmsResource.facilityType.Theft_S1)
            return '지능형영상(도난)';
        else if (nType === SdmsResource.facilityType.Neglect_S1)
            return '지능형영상(방치)';
        else if (nType === SdmsResource.facilityType.VirtualFence_S1)
            return '지능형영상(가상펜스)';
        else if (nType === SdmsResource.facilityType.Fire_S1)
            return '지능형영상(화재)';
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
        sensorInfo: "sensorInfo",
        cctvInfo: "cctvInfo",
        alarmCCTVInfo: "alarmCCTVInfo",
        workerInfo: "workerInfo",
        editMode_addPoi: "editMode_addPoi",
        editMode_cctvMapping: "editMode_cctvMapping",
        editMode_cctvInfo: "editMode_cctvInfo",
        equipmentAnalysis: "equipmentAnalysis",
        equipmentDetailInfo: "equipmentDetailInfo",
        equipmentChartDetailInfo: "equipmentChartDetailInfo",
        equipmentChartInfo: "equipmentChartInfo",
        electricChartInfo: "electricChartInfo",
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

        if (SdmsResource.isDayLight()) {
            return <Icon.imgCloudDay width={iconSize} height={iconSize} />
        }

        return <Icon.imgCloudNight width={iconSize} height={iconSize} />;
    }

    static isDayLight() {
        const now = new Date();
        const hour = now.getHours();

        if (hour < 6 || hour >= 19) {
            return false;
        }

        return true;
    }

    static getWeatherStateString(state) {
        if (state === SdmsResource.weatherInfo.Sunshine) {
            return '맑음';
        }
        else if (state === SdmsResource.weatherInfo.Thunder) {
            return '천둥번개';
        }
        else if (state === SdmsResource.weatherInfo.SnowRain) {
            return '진눈깨비';
        }
        else if (state === SdmsResource.weatherInfo.HeavySnow) {
            return '폭설';
        }
        else if (state === SdmsResource.weatherInfo.Snow) {
            return '눈';
        }
        else if (state === SdmsResource.weatherInfo.HeavyRain) {
            return '폭우';
        }
        else if (state === SdmsResource.weatherInfo.Rain) {
            return '비';
        }
        else if (state === SdmsResource.weatherInfo.Cloudy) {
            return '구름';
        }
        else if (state === SdmsResource.weatherInfo.DustStorm) {
            return '황사';
        }

        if (SdmsResource.isDayLight()) {
            return '구름조금';
        }

        return '밤';
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

    static isSVMSSensorType(type) {
        if (type === SdmsResource.facilityType.Intrusion_S1 ||
            type === SdmsResource.facilityType.Loiter_S1 ||
            type === SdmsResource.facilityType.Collapse_S1 ||
            type === SdmsResource.facilityType.Theft_S1 ||
            type === SdmsResource.facilityType.Neglect_S1 ||
            type === SdmsResource.facilityType.VirtualFence_S1 ||
            type === SdmsResource.facilityType.Fire_S1 ||
            type === SdmsResource.facilityType.EmergencyBell_S1)
            return true;

        return false;
    }

    static isETCSensorType(type) {
        if ((type >= SdmsResource.facilityType.FIREWALL && type <= SdmsResource.facilityType.ETC &&
            type != SdmsResource.facilityType.STRONG_WIND && type != SdmsResource.facilityType.BLACKOUT && type != SdmsResource.facilityType.DOOR && type != SdmsResource.facilityType.WaterLevel && type != SdmsResource.facilityType.Terror) ||
            type === SdmsResource.sensorSubType.Temp ||
            type === SdmsResource.sensorSubType.Humi ||
            type === SdmsResource.sensorSubType.CO2 ||
            type === SdmsResource.sensorSubType.TVOC ||
            type === SdmsResource.sensorSubType.Dust_PM1 ||
            type === SdmsResource.sensorSubType.Dust_PM2 ||
            type === SdmsResource.sensorSubType.Dust_PM10 ||
            type === SdmsResource.sensorSubType.AirPress ||
            type === SdmsResource.sensorSubType.Inclin_X ||
            type === SdmsResource.sensorSubType.Inclin_Y ||
            type === SdmsResource.sensorSubType.Vib_X ||
            type === SdmsResource.sensorSubType.Vib_Y ||
            type === SdmsResource.sensorSubType.Vib_Z ||
            type === SdmsResource.sensorSubType.Noise ||
            type === SdmsResource.sensorSubType.BLE_Count ||
            type === SdmsResource.sensorSubType.O2 ||
            type === SdmsResource.sensorSubType.Value ||
            type === SdmsResource.sensorSubType.mA ||
            type === SdmsResource.sensorSubType.Contact ||
            type === SdmsResource.sensorSubType.Relay ||
            type === SdmsResource.sensorSubType.pH ||
            type === SdmsResource.sensorSubType.AUTO ||
            type === SdmsResource.sensorSubType.GATE1_OPEN ||
            type === SdmsResource.sensorSubType.GATE1_CLOSE ||
            type === SdmsResource.sensorSubType.GATE1_RATE ||
            type === SdmsResource.sensorSubType.GATE1_FAULT ||
            type === SdmsResource.sensorSubType.GATE2_OPEN ||
            type === SdmsResource.sensorSubType.GATE2_CLOSE ||
            type === SdmsResource.sensorSubType.GATE2_RATE ||
            type === SdmsResource.sensorSubType.GATE2_FAULT ||
            type === SdmsResource.sensorSubType.BATTERY ||
            type === SdmsResource.sensorSubType.OPERATION ||
            type === SdmsResource.sensorSubType.WATER_TEMP ||
            type === SdmsResource.sensorSubType.SCRUBBER ||
            type === SdmsResource.sensorSubType.Flame ||
            type === SdmsResource.sensorSubType.Leak ||
            type === SdmsResource.sensorSubType.LEL ||
            type === SdmsResource.sensorSubType.CONNECT ||
            type === SdmsResource.facilityType.SVMS_Device_Event)
            return true;

        return false;
    }

    static isPSMSensorType(type) {
        if (type === SdmsResource.facilityType.PSM_SENSOR ||
            type === SdmsResource.sensorSubType.HF ||
            type === SdmsResource.sensorSubType.CO ||
            type === SdmsResource.sensorSubType.HCL ||
            type === SdmsResource.sensorSubType.CH3C ||
            type === SdmsResource.sensorSubType.N2H4 ||
            type === SdmsResource.sensorSubType.CA ||
            type === SdmsResource.sensorSubType.EA ||
            type === SdmsResource.sensorSubType.VOC ||
            type === SdmsResource.sensorSubType.H2O2 ||
            type === SdmsResource.sensorSubType.THC ||
            type === SdmsResource.sensorSubType.HNO3 ||
            type === SdmsResource.sensorSubType.CL ||
            type === SdmsResource.sensorSubType.TOLUENE ||
            type === SdmsResource.sensorSubType.F2 ||
            type === SdmsResource.sensorSubType.NH3 ||
            type === SdmsResource.sensorSubType.LNG ||
            type === SdmsResource.sensorSubType.PGMEA ||
            type === SdmsResource.sensorSubType.H2S ||
            type === SdmsResource.sensorSubType.F ||
            type === SdmsResource.sensorSubType.H2 ||
            type === SdmsResource.sensorSubType.CL2 ||
            type === SdmsResource.sensorSubType.C2H6O ||
            type === SdmsResource.sensorSubType.TEPO)
            return true;

        return false;
    }
    
    static businessPlace = {
        GONGJU: "1000",
        PAJU: "2000",
        HEADOFFICE: "4000",
    }
}