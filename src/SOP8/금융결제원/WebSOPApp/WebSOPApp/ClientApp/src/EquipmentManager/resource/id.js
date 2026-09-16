export default class EquipmentResource {
    static menu = {
        상위_장비_목록: "상위 장비 목록",
        하위_장비_목록: "하위 장비 목록",
    }

    static sortParentList = {
        tpsName: "tpsName",                 // TPS 실
        childCount: "childCount",           // 하위 장비 수             
        equipmentName: "equipmentName",     // 자재명
        modelName: "modelName",             // 모델명
        equipmentIdenti: "equipmentIdenti", // 장비식별정보
        standard: "standard",               // 규격
        ip: "ip",                           // IP
        location: "location",               // 위치
        exchangeTime: "exchangeTime",       // 교체일자
        memo: "memo"                        // 비고
    }

    static sortChildList = {
        parentName: "parentName",           // 상위 장비
        zoneName: "zoneName",               // 층
        equipmentName: "equipmentName",     // 자재명
        modelName: "modelName",             // 모델명
        equipmentIdenti: "equipmentIdenti", // 장비식별정보
        standard: "standard",               // 규격
        ip: "ip",                           // IP
        location: "location",               // 위치
        exchangeTime: "exchangeTime",       // 교체일자
        memo: "memo"                        // 비고
    }
} 