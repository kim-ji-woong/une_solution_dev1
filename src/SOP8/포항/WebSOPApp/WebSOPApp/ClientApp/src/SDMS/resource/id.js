import ProjectResource from "../../Root/resource/id";
import StringUtil from "../../Common/util/StringUtil";

export default class SdmsResource {
    static targetMode = 0;

    static webSocketPort = '1238';
    static get ID() {
        return SdmsResource.id[ProjectResource.targetLanguage];
    }

    static PopupAniTime = 200;      // 팝업 Show, Hide 시간 설정

    static id = {
        "ko": {
            projectName: "SDMS",
            menu:
            {
                statusInfo: "센서현황",
                statusSensorInfo: "센서 상세정보",
                weatherInfo: "기상센서 상세정보",
                event: "이벤트 현황",
                publicData: "공공데이터",
                miniMap: "미니맵",
                eventMemo: "메모",
                atmosphereSimulation: "대기 시뮬레이션",
                floodSimulation: "홍수 시뮬레이션",
                eventDashboard: "이벤트 대시보드",
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
        FIRE: 0,                        // 화재
        CCTV: 300303,                   // CCTV
        ETC: 300321,                     // 기타
        ATMOSPHERE: 300331,             // 대기유해물질측정기
        WaterLevel: 300332,
        Rainfall: 300334,
        Odor: 300343,
        AIOdor: 300344,
    }

    static materialType = {
        'Temp': 1,
        'Humi': 2,
        'CO2': 3,
        'PH': 4,
        'FLW': 5,
        'SS': 6,
        'NH3': 7,
        'H2S': 8,
        'CO': 9,
        'O2': 10,
        'SO2': 11,
        'NO2': 12,
        'VOC': 13,
        'TVOC': 14,
        'PM-10': 15,
        'PM-2.5': 16,
        'Diluted': 17,
        'TSP': 18,
        'OdorUnit': 19,
        'WD': 20,
        'WS': 21,
        'Rainfall': 22,
        'Atmospheric pressure': 23,
        'Solar radiation': 24,
        //'FLW': 25,
        'Collector': 26,
        'Odor': 27,
        'MOS': 28,
        'HCL': 29,
    }
    
    static weatherMaterialType = {
        'Temp': 30,
        'Humi': 31,
        'CO2': 32,
        'PH': 33,
        'FLW': 34,
        'SS': 35,
        'NH3': 36,
        'H2S': 37,
        'CO': 38,
        'O2': 39,
        'SO2': 40,
        'NO2': 41,
        'VOC': 42,
        'TVOC': 43,
        'PM-10': 44,
        'PM-2.5': 45,
        'Diluted': 46,
        'TSP': 47,
        'OdorUnit': 48,
        'WD': 49,
        'WS': 50,
        'Rainfall': 51,
        'Atmospheric pressure': 52,
        'Solar radiation': 53,
        //'FLW': 54,
        'Collector': 55,
        'Odor': 56,
        'MOS': 57,
        'HCL': 58,
    }

    // 방위
    static weatherBearing = {
        east: 0,                    // 동
        southEast: 1,               // 남동
        northEast: 2,               // 북동
        south: 3,                   // 남
        southWest: 4,               // 남서
        west: 5,                    // 서
        northWest: 6,               // 북서
        north: 7                    // 북
    }

    static popupLayer = {
        statusInfo: "statusInfo",
        statusSensorInfo: "statusSensorInfo",
        weatherInfo: "weatherInfo",
        event: "event",
        publicData: "publicData",
        miniMap: "miniMap",
        atmosphereSimulation: "atmosphereSimulation"
    }

    // 기상정보 팝업 속성
    static weatherProperty = {
        "temperature": 0,             // 온도
        "windDirection": 1,           // 풍향
        "windSpeed": 2,               // 풍속
        "humidity": 3,                // 습도
        "pm-2.5": 4,             // 미세먼지 PM2.5
        "pm-10": 5               // 미세먼지 PM10
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

    static getFacilityTypeString(nType) {
        if (nType === SdmsResource.facilityType.ETC)
            return '기타';
        else if (nType === SdmsResource.facilityType.FIRE)
            return '화재';
        else if (nType === SdmsResource.facilityType.CCTV)
            return 'CCTV';
        else if (nType === SdmsResource.facilityType.ATMOSPHERE)
            return '대기유해물질측정기';
        else if (nType === SdmsResource.facilityType.WaterLevel)
            return '수해방지(수위계)';
        else if (nType === SdmsResource.facilityType.Rainfall)
            return '수해방지(강우량계)';
        else if (nType === SdmsResource.facilityType.Odor)
            return '악취측정기';
        else if (nType === SdmsResource.facilityType.AIOdor)
            return 'AI 악취측정기';
        
        return "";
    }
    
    static externalSensorType = {
        "atmosphere": 1,
        "waterLevel": 2,
        "waterLevelCCTV": 3,
        "rainLevel": 4,
        "weather": 5,
        "environmentCCTV": 6,
        "mainStreetCCTV": 7,
        "smartLamp": 8,
        "smartCrossroad": 9,
        "smartCrosswalkCCTV": 10,
        "smartCrosswalkLightingCCTV": 11,
        "smartStation": 12,
        "stinks": 13,
        "aiStinks": 14,
        "airKorea": 15, // 도시대기 측정망 - Public
        "kma_asos": 16, // 기상청 자동기상관측망 - Public
        "cleanSys": 17, // 배출가스 측정망
        "buildingName": 18  // 건물명
    }
    
    static detectTypeString = {
        1: "대기오염",
        2: "수해방지(수위계)",
        4: "수해방지(강우량계)",
        13: "악취",
        14: "AI악취",
    }
    
    static getDetectTypeString = (type) => {
        return SdmsResource.detectTypeString[type] || "알수없음";
    }
    
    static isCCTVType = (type) => {
        return type === SdmsResource.externalSensorType.environmentCCTV ||
            type === SdmsResource.externalSensorType.waterLevelCCTV ||
            type === SdmsResource.externalSensorType.mainStreetCCTV ||
            type === SdmsResource.externalSensorType.smartCrosswalkCCTV ||
            type === SdmsResource.externalSensorType.smartCrosswalkLightingCCTV ||
            type === SdmsResource.externalSensorType.smartCrossroad;
        
    }
    
    static navigationBarIcon = {
        "initScene": 1,
        "setInitScene": 2,
        "zoomIn": 3,
        "zoomOut": 4,
        "autoRotate": 5,
        "distanceMeasure": 6,
        "keyMap": 7,
    }

    static simulationType = {
        "atmosphere": 1,    // 대기
        "flood": 2          // 홍수
    } 

    static alarmDepth = {
        no_alarm: 0,
        alarm_1: 1,
        alarm_2: 2,
        alarm_3: 3,
        alarm_4: 4
    }
    
    static isSensorType = (sensorType) => {
        return sensorType === SdmsResource.sensorCode.atmosphere ||
               sensorType === SdmsResource.sensorCode.waterLevel ||
               sensorType === SdmsResource.sensorCode.rainLevel ||
               sensorType === SdmsResource.sensorCode.stinks ||
               sensorType === SdmsResource.sensorCode.aiStinks ||
               sensorType === SdmsResource.sensorCode.etc;
    }
    
    static sensorCode = {
        "etc": 300321, // 알람처리가 없는 센서는 ETC로 처리
        "atmosphere": 300331, // 대기
        "waterLevel": 300332, // 수위계
        "rainLevel": 300334, // 강우량계
        "stinks": 300343, // 악취
        "aiStinks": 300344, // 인공지능 악취
    }
    
    static getSensorCodeString = (sensorType) => {
        switch (sensorType) {
            case SdmsResource.sensorCode.atmosphere:
                return "Atmosphere"
            case SdmsResource.sensorCode.waterLevel:
                return "WaterLevel"
            case SdmsResource.sensorCode.rainLevel:
                return "Rainfall"
            case SdmsResource.sensorCode.stinks:
                return "Odor"
            case SdmsResource.sensorCode.aiStinks:
                return "AIOdor"
            case SdmsResource.sensorCode.etc:
                return null
            default:
                return null
        }
    }
    
    static getWindDirectionString = (bearing) => {
        if (bearing < 0 || bearing > 360) return '알수없음';

        const directions = [
            '북', '북북동', '북동', '동북동', '동', '동남동', '남동', '남남동',
            '남', '남남서', '남서', '서남서', '서', '서북서', '북서', '북북서', '북'
        ];

        const index = Math.round(bearing / 22.5);
        return directions[index];
    };

    static reactionType = {
        "알람신호": 400201,
        "재난신고": 400222
    }

    // 공공데이터 논모달 메뉴 타입
    static publicDataMenuType = {
        emission: "emission",   // 배출
        airQuality: "airQuality",   // 대기질
        weather: "weather",   // 기상
    }
}