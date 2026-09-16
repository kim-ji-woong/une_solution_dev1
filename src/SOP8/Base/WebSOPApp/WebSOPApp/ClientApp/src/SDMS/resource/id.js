import ProjectResource from "../../Root/resource/id";
import StringUtil from "../../Common/util/StringUtil";

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
                statusInfo: "센서현황",
                weatherInfo: "기상센서 상세정보",
                miniMap: "미니맵",
                cctvInfo: "CCTV 영상정보",
                event: "이벤트 현황",
                eventMemo: "메모",
                simulation: "시뮬레이션",
                statusPsmSensorInfo: "대기센서 상세정보",
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
        ETC: 300321                         // 기타
    }

    static popupLayer = {
        statusInfo: "statusInfo",
        weatherInfo: "weatherInfo",
        miniMap: "miniMap",
        cctvInfo: "cctvInfo",
        event: "event",
        simulation: "simulation",
        statusPsmSensorInfo: "statusPsmSensorInfo"
    }

    // 기상정보 팝업 속성
    static weatherProperty = {
        default: 0,                 // 아무것도 선택되지 않음
        windDirection: 1,           // 풍향
        windSpeed: 2,               // 풍속
        humidity: 3,                // 습도
        barometric: 4               // 기압
    }

    // 방위
    static weatherBearing = {
        east: 0,                    // 동
        southEast: 1,               // 남동
        south: 2,                   // 남
        southWest: 3,               // 남서
        west: 4,                    // 서
        northWest: 5,               // 북서
        north: 6                    // 북
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
        if (nType === SdmsResource.facilityType.FIRE)
            return '화재';
        else if (nType === SdmsResource.facilityType.PSM_SENSOR)
            return '누출';
        else if (nType === SdmsResource.facilityType.ETC)
            return '기타';

        return "";
    }
}