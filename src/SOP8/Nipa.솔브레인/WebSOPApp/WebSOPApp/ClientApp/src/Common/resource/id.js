import ProjectResource from "../../Root/resource/id";

export default class CommonResource {
    static get ID() {
        return CommonResource.id[ProjectResource.targetLanguage];
    }

    static id = {
        "ko": {
            "contextMenu": {
                columns:
                {
                    addToLeft: "왼쪽 열추가",
                    addToRight: "오른쪽 열추가",
                    delete: "열삭제"
                },
                rows:
                {
                    addToUp: "위쪽 행추가",
                    addToDown: "아래쪽 행추가",
                    delete: "행삭제"
                }
            }
        },
        "en": {
        }
    }
}