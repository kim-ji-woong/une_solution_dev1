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
                statusInfo: "현황정보",
                dashboard: "대시보드요약창",
                event: "이벤트정보",
                manualReport: "수동신고",

                waterLevelInfo: "집수정",
                electricInInfo: "전력",
                elevatorInfo: "엘리베이터",

                miniMap: "미니맵",
                cctvInfo: "CCTV 영상정보",
                simulation: "시뮬레이션",
            },
            sensor:
            {
                fire: "화재",
                cctv: "CCTV",
                emergencyBell: "비상벨",
                parkingLot: "주차장",
                zoneName: "구역명"
            },
        }
    }

    static adminMenu = {
        뷰포트_설정: "뷰포트 설정",
        POI_이동: "POI 이동",
        가벽: "가벽",
        화재센서_이동: "화재센서 이동",
        누출센서_이동: "누출센서 이동",
        기타센서_이동: "기타센서 이동",
        CCTV_이동: "CCTV 이동"
    }

    static facilityType = {
        FIRE: 0,                        // 화재
    }

    // SDMS 팝업 시스템 초기화 셋팅 값
    static popupResetLocation = {
        statusInfo: {
            x: '1%', y: '7%', height: '600px', width: '300px'
        },
        miniMap: {
            x: '1%', y: '13%', height: '254px', width: '300px'
        },
        cctvInfo: {
            x: '1%', y: '13%', height: '314px', width: '300px'
        },
        event: {
            x: '1%', y: '13%', height: '600px', width: '300px'
        },
        event: {
            x: '1%', y: '13%', height: '300px', width: '300px'
        },
        dashboard: {
            x: '1%', y: '13%', height: '300px', width: '300px'
        },
    }

    static popupLayer = {
        statusInfo: "statusInfo",
        miniMap: "miniMap",
        cctvInfo: "cctvInfo",
        event: "event",
        simulation: "simulation",
        dashboard: "dashboard",
        manualReport: "manualReport",
    }

    static SelectedStatusInfoType = {
        none: 0,
        buildingGroup: 1,
        building: 2,
        zone: 3,
        sensorGroups: 4,
        fireSensors: 5,
        psmSensors: 6,
        etcSensors: 7,
        cctvGroups: 8,
        cctvSubGroups: 9,
        facilityGroups: 10,
        facilitySubGroups: 11,
        closeZone: 12,
        earthquakeSensors: 13,
        strongWindSensors: 14,
        environmentSensors: 15,
        manufactureSensors: 16,
        emergencyBellSensors: 17,
        laser: 18,
        door: 19
    }

    static AssessmentClass = {
        A: "A",
        B: "B",
        C: "C",
        D: "D",
        E: "E"
    }

    static assessmentType = {
        eqZone: 1,
        environ: 2
    };

    static waterLevel = {
        default: 0,
        low: 1,
        high: 2
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

        return "";
    }
}