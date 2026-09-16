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
                event: "이벤트 정보",
                publicData: "공공데이터",
                miniMap: "미니맵",
                poiViewer: "POI뷰어",
                simulation: "시뮬레이션",
                eventMemo: "메모",
                eventDashboard: "이벤트 대시보드",
                weatherInfo: "기상센서 상세정보",
                atmosphereSimulation: "대기",
                floodSimulation: "홍수",
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
        Water: 300333,
        WaterDisaster: 300334,
    }

    static toolbar3DMenu = {
        "initScene": 1,
        "setInitScene": 2,
        "zoomIn": 3,
        "zoomOut": 4,
        "autoRotate": 5,
    }

    static materialType = {
        'Atmospheric pressure': 1,
        'Chlorophyll-A': 2,
        'CO': 3,
        'CO2': 4,
        'Collector': 5,
        'Diluted': 6,
        'DO': 7,
        'EC': 8,
        'FLW': 9,
        'FLW_2': 10,
        'H2S': 11,
        'HCL': 12,
        'Humi': 13,
        'MOS': 14,
        'NH3': 15,
        'NO2': 16,
        'O2': 17,
        'Odor': 18,
        'OdorUnit': 19,
        'PH': 20,
        'PM-10': 21,
        'PM-2.5': 22,
        'Rainfall': 23,
        'SO2': 24,
        'Solar radiation': 25,
        'SS': 26,
        'SSQ': 27,
        'Temp': 28,
        'TSP': 29,
        'Turbidity': 30,
        'TVOC': 31,
        'VOC': 32,
        'WaterTemp': 33,
        'WD': 34,
        'WS': 35,
    }

    static atmosphereMaterialType = {
        'Atmospheric pressure': 1,
        'Chlorophyll-A': 2,
        'CO': 3,
        'CO2': 4,
        'Collector': 5,
        'Diluted': 6,
        'DO': 7,
        'EC': 8,
        'FLW': 9,
        'FLW_2': 10,
        'H2S': 11,
        'HCL': 12,
        'Humi': 13,
        'MOS': 14,
        'NH3': 15,
        'NO2': 16,
        'O2': 17,
        'Odor': 18,
        'OdorUnit': 19,
        'PH': 20,
        'PM-10': 21,
        'PM-2.5': 22,
        'Rainfall': 23,
        'SO2': 24,
        'Solar radiation': 25,
        'SS': 26,
        'SSQ': 27,
        'Temp': 28,
        'TSP': 29,
        'Turbidity': 30,
        'TVOC': 31,
        'VOC': 32,
        'WaterTemp': 33,
        'WD': 34,
        'WS': 35,
    }

    static weatherMaterialType = {
        'Atmospheric pressure': 36,
        'Chlorophyll-A': 37,
        'CO': 38,
        'CO2': 39,
        'Collector': 40,
        'Diluted': 41,
        'DO': 42,
        'EC': 43,
        'FLW': 44,
        'FLW_2': 45,
        'H2S': 46,
        'HCL': 47,
        'Humi': 48,
        'MOS': 49,
        'NH3': 50,
        'NO2': 51,
        'O2': 52,
        'Odor': 53,
        'OdorUnit': 54,
        'PH': 55,
        'PM-10': 56,
        'PM-2.5': 57,
        'Rainfall': 58,
        'SO2': 59,
        'Solar radiation': 60,
        'SS': 61,
        'SSQ': 62,
        'Temp': 63,
        'TSP': 64,
        'Turbidity': 65,
        'TVOC': 66,
        'VOC': 67,
        'WaterTemp': 68,
        'WD': 69,
        'WS': 70,
    }

    static waterMaterialType = {
        'Atmospheric pressure': 71,
        'Chlorophyll-A': 72,
        'CO': 73,
        'CO2': 74,
        'Collector': 75,
        'Diluted': 76,
        'DO': 77,
        'EC': 78,   // 전기전도도
        'FLW': 79,
        'FLW_2': 80,
        'H2S': 81,
        'HCL': 82,
        'Humi': 83,
        'MOS': 84,
        'NH3': 85,
        'NO2': 86,
        'O2': 87,
        'Odor': 88,
        'OdorUnit': 89,
        'PH': 90,
        'PM-10': 91,
        'PM-2.5': 92,
        'Rainfall': 93,
        'SO2': 94,
        'Solar radiation': 95,
        'SS': 96,
        'SSQ': 97,
        'Temp': 98,
        'TSP': 99,
        'Turbidity': 100,
        'TVOC': 101,
        'VOC': 102,
        'WaterTemp': 103,
        'WD': 104,
        'WS': 105,
    }

    static waterDisasterMaterialType = {
        'Atmospheric pressure': 106,
        'Chlorophyll-A': 107,
        'CO': 108,
        'CO2': 109,
        'Collector': 110,
        'Diluted': 111,
        'DO': 112,
        'EC': 113,
        'FLW': 114,
        'FLW_2': 115,
        'H2S': 116,
        'HCL': 117,
        'Humi': 118,
        'MOS': 119,
        'NH3': 120,
        'NO2': 121,
        'O2': 122,
        'Odor': 123,
        'OdorUnit': 124,
        'PH': 125,
        'PM-10': 126,
        'PM-2.5': 127,
        'Rainfall': 128,
        'SO2': 129,
        'Solar radiation': 130,
        'SS': 131,
        'SSQ': 132,
        'Temp': 133,
        'TSP': 134,
        'Turbidity': 135,
        'TVOC': 136,
        'VOC': 137,
        'WaterTemp': 138,
        'WD': 139,
        'WS': 140,
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
        "temperature": 0,       // 온도
        "wind": 1,              // 풍향
        "humidity": 2,          // 습도
        "pressure": 3,          // 기압
        "solarRadiation": 4,    // 일사량
        "rainfall": 5           // 강수량
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
        else if (nType === SdmsResource.facilityType.Water)
            return '수질';
        else if (nType === SdmsResource.facilityType.WaterDisaster)
            return '수해방지';
        
        return "";
    }
    
    static externalSensorType = {
        "atmosphere": 1,
        "weather": 2,
        "water": 3,
        "waterDisaster": 4,
        "trafficCCTV": 5,
        "existingCCTV": 6,
        "buildingName": 18  // 건물명
    }
    
    static detectTypeString = {
        1: "대기오염",
        3: "수질오염",
        4: "수해방지"
    }
    
    static getDetectTypeString = (type) => {
        return SdmsResource.detectTypeString[type] || "알수없음";
    }
    
    static externalSensorTypeTitle = {
        1: "대기센서 ",
        2: "기상센서 ",
        3: "수질센서 ",
        4: "수해방지 "
    }

    static getExternalSensorTypeTitle = (type) => {
        return SdmsResource.externalSensorTypeTitle[type] || "";
    }

    static isAtmosphereSensorType = (type) => {
        return type === SdmsResource.externalSensorType.atmosphere;
    }

    static isWaterSensorType = (type) => {
        return type === SdmsResource.externalSensorType.water;
    }

    static isCCTVType = (type) => {
        return type === SdmsResource.externalSensorType.trafficCCTV ||
            type === SdmsResource.externalSensorType.existingCCTV;
        
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
               sensorType === SdmsResource.sensorCode.water ||
               sensorType === SdmsResource.sensorCode.waterDisaster ||
               sensorType === SdmsResource.sensorCode.etc
    }
    
    static sensorCode = {
        "etc": 300321, // 알람처리가 없는 센서는 ETC로 처리
        "atmosphere": 300331, // 대기
        "water": 300333, // 수질
        "waterDisaster": 300334, // 수해방지
    }
    
    static getSensorCodeString = (sensorType) => {
        switch (sensorType) {
            case SdmsResource.sensorCode.atmosphere:
                return "Atmosphere"
            case SdmsResource.sensorCode.water:
                return "Water"
            case SdmsResource.sensorCode.waterDisaster:
                return "WaterDisaster"
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
    
    static weatherSite = {
        gwangyang: 1
    }


    // - 하늘상태(SKY) 코드 : 맑음(1), 구름많음(3), 흐림(4)
    // - 강수형태(PTY) 코드 : (초단기) 없음(0), 비(1), 비/눈(2), 눈(3), 빗방울(5), 빗방울눈날림(6), 눈날림(7)
    static skyStatement = {
        // TODO 3D 개발자와 상태값 조율 후에 구현예정
    }
    
    static rainStatement = {
        "none": 0,
        "rain": 1,
        "rain_snow": 2,
        "snow": 3,
        "raindrop": 5,
        "raindrop_flurries": 6,
        "flurries": 7
    }

    static nameTag = {
        1801: "태인동 행정복지센터",
        1802: "OCI 태인폐수처리장",
        1803: "OCI 터미널",
        1804: "광양상수도 사업소",
        1805: "금호건강 생활지원센터",
        1806: "금호동 주민센터",
        1807: "대주기업",
        1808: "대한시멘트 2공장",
        1809: "부영아파트",
        1810: "와우포구",
        1811: "우현피엔티",
        1812: "인선이엔티",
        1813: "태금역",
        1814: "태인가압장",
        1815: "태인목욕탕",
        1816: "포스코모빌리티",
        1817: "피제이메탈",
        1818: "한라시멘트"
    }

    static getNameTag = (parameter) => {
        const key = Number(parameter);
        return SdmsResource.nameTag[key] || "";
    }
    
    
    
}
