import ProjectResource from "../../Root/resource/id";

export default class TeamEditorResource {
    static get ID() {
        return TeamEditorResource.id[ProjectResource.targetLanguage];
    }

    static id = {
        "ko": {
            "textSchedule": "근무표",
            "textRegular": "조직",
            "textTemporary": "평일 비상조직",
            "textTemporaryEmergency": "휴일 비상조직",
            "textFixed": "고정 근무표",
            "textCurrent": "실시간 근무표",
            "textFilter": "검색어 입력",
            "textSearch": "검색",
            "textSelectTeam": "조직선택",
            "textSetTeamManager": "조직 담당자 설정",
            "textSelect": "선택",
            "textCancle": "취소",

            colTextMode:
            {
                memberName: "이름",
                phoneNumber: "휴대전화번호",
                jobLevel: '직위',
                jobPosition: '직급',
                officePhoneNumber: "근무처 전화번호",
                email: "이메일",
                memberID: "사번",
                role: "정/부",
                displaySOPName: "SOP이름",
                regularTeamName: "부서명",
                regularMemberName: "성명",
            }
        },
        "en": {
            "textTeam": "Team",
            "textSchedule": "Work Schedule"
        },

        
    }
}