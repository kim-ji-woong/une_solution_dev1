export default class SessionString {
    static get Key() {
        return SessionString.text;
    }
    static text = { 
        "regularTeam": "TeamEditor의 조직",
        "temporaryTeam": "TeamEditor의 평일 비상 조직",
        "temporaryEmergencyTeam": "TeamEditor의 휴일 비상 조직",
        "regularMember": "TeamEditor의 조직 멤버",
        "commands": "TeamEditor Commands",
        "commandIndex": "TeamEditor 현재 Command index",
        "commandSaveIndex": "TeamEditor 현재 저장할 Command index",
        "commandHistoryChangeTeamID": "TeamEditor 편집을 통한 Team ID 변경 이력",
        "commandHistoryChangeMemberID": "TeamEditor 편집을 통한 Member ID 변경 이력",
        "optionJobLevels": "직급",
        "optionJobPositions": "직책",
        "account": "로그인 정보",
        }
}