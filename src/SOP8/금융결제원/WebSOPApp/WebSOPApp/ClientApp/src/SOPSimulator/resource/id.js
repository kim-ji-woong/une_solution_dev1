import ProjectResource from "../../Root/resource/id";

export default class SopSimulatorResource {
    static get ID() {
        return SopSimulatorResource.id[ProjectResource.targetLanguage];
    }

    static id = {
        "ko": {
            projectName: "SOP",

            menu:
            {
                fasterSOP: "SOP 빠른실행",
                callSOP: "SOP 불러오기",
                execSOP: "SOP 실행",
                setSOP: "SOP 설정",

                summarySOP: "SOP 요약",
                beginSOPOption: "SOP 시작 옵션",
            },
            actionStep:
            {
                _1st: "관심",
                _2nd: "주의",
                _3rd: "경계",
                _4th: "심각",
            }
        }
    }

    static menu = {
        SOP_빠른실행: "SOP 빠른실행",
        SOP_불러오기: "SOP 불러오기",
        SOP_실행: "SOP 실행",
        SOP_설정: "SOP 설정",
        SOP_요약: "SOP 요약",
        SOP_시작_옵션: "SOP 시작 옵션"
    }
}