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
                dashboard: "대시보드\n요약정보",
                event: "이벤트 정보",
                manualReport: "수동신고",
                weatherInfo: "기상센서 상세정보",
                eventMemo: "메모",
                accessInfo: "출입자\n현황정보",
                accessRoute: "출입자 이동 동선",
                doorInfo: "출입문 현황정보",
                parkingInfo: "출입차량\n현황정보",
                detailInfo: "정보",
                cctvInfo: "CCTV 영상정보",
                alarmCCTVInfo: "이벤트 CCTV 영상정보",
                sensorInfo: "센서정보",
                integrated: "통합 관제",
                editMode: "편집 모드",
                editMode_poi: "POI",
                editMode_fakeWall: "가벽",
                editMode_areaName: "구역명",
                editMode_addPoi: "추가 POI 목록",
                editMode_cctvMapping: "CCTV 매핑",
                editMode_cctvInfo: "CCTV 영상정보",
                tpsInfo: "장비정보",
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
        DOOR: 300316,                       // 출입문
        EmergencyBell: 300319,              // 비상벨
        Invasion: 300320,                   // 침입
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
    }

    static getFacilityTypeString(nType) {
        if (nType === SdmsResource.facilityType.FIRE)
            return '화재';
        else if (nType === SdmsResource.facilityType.CCTV)
            return 'CCTV';
        else if (nType === SdmsResource.facilityType.DOOR)
            return '출입문';
        else if (nType === SdmsResource.facilityType.EmergencyBell)
            return '비상벨';
        else if (nType === SdmsResource.facilityType.Invasion)
            return '침입';

        return "";
    }

    static popupLayer = {
        statusInfo: "statusInfo",
        dashboard: "dashboard",
        event: "event",
        manualReport: "manualReport",
        detailInfo: "detailInfo",
        sensorInfo: "sensorInfo",
        accessInfo: "accessInfo",
        accessRoute: "accessRoute",
        accessInfoCollapsed: "accessInfoCollapsed",
        parkingInfo: "parkingInfo",
        doorInfo: "doorInfo",
        cctvInfo: "cctvInfo",
        alarmCCTVInfo: "alarmCCTVInfo",
        editMode_addPoi: "editMode_addPoi",
        editMode_cctvMapping: "editMode_cctvMapping",
        editMode_cctvInfo: "editMode_cctvInfo",
        tpsInfo: "tpsInfo",
    }

    static controlMode = {
        integrated: 0,      // 통합관제 모드
        editMode: 1,        // 편집 모드
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

    static getDateTime(iso) {
        if (!iso) return '-';
        const d = new Date(iso);
        return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')} 
                ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;
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