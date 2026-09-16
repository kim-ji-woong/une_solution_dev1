import EquipmentResource from "../resource/id";

export const parentColumns = [
    {
        key: "typeNo",
        label: "장비 타입",
        headerType: "typeFilter",
        type: "comboType",
        comboConfig: {
            valueKey: "typeNo",
            optionsSource: "equipmentTypes",
            valueField: "equipmentTypNo",
            labelField: "equipmentTypName",
            buildPatch: (selected) => ({
                typeNo: selected.equipmentTypNo,
                typeName: selected.equipmentTypName,
            }),
        },
    },
    {
        key: EquipmentResource.sortParentList.tpsName,
        label: "TPS 실",
        sortable: true,
        type: "comboType",
        comboConfig: {
            valueKey: "tpsNo",
            optionsSource: "tpsList",
            valueField: "tpsNo",
            labelField: "tpsName",
            buildPatch: (selected) => ({
                tpsNo: selected.tpsNo,
                tpsName: selected.tpsName,
            }),
            nullable: true,
            nullPatch: { tpsNo: null, tpsName: "" },
        },
    },
    {
        key: EquipmentResource.sortParentList.childCount,
        label: "하위 장비 수",
        sortable: true,
        type: "text",
    },
    {
        key: EquipmentResource.sortParentList.equipmentName,
        label: "자재명",
        sortable: true,
        type: "textEdit",
    },
    {
        key: EquipmentResource.sortParentList.modelName,
        label: "모델명",
        sortable: true,
        type: "textEdit",
    },
    {
        key: EquipmentResource.sortParentList.equipmentIdenti,
        label: "장비식별정보",
        sortable: true,
        type: "textEdit",
    },
    {
        key: EquipmentResource.sortParentList.standard,
        label: "규격",
        sortable: true,
        type: "textarea",
    },
    {
        key: EquipmentResource.sortParentList.ip,
        label: "IP",
        sortable: true,
        type: "textEdit",
    },
    {
        key: EquipmentResource.sortParentList.location,
        label: "위치",
        sortable: true,
        type: "textEdit",
    },
    {
        key: EquipmentResource.sortParentList.exchangeTime,
        label: "교체일자",
        sortable: true,
        type: "date",
    },
    {
        key: EquipmentResource.sortParentList.memo,
        label: "비고",
        sortable: true,
        type: "textarea",
    },
];

export const childColumns = [
    {
        key: "typeNo",
        label: "장비 타입",
        headerType: "typeFilter",
        type: "comboType",
        comboConfig: {
            valueKey: "typeNo",
            optionsSource: "equipmentTypes",
            valueField: "equipmentTypNo",
            labelField: "equipmentTypName",
            buildPatch: (selected) => ({
                typeNo: selected.equipmentTypNo,
                typeName: selected.equipmentTypName,
            }),
        },
    },
    {
        key: EquipmentResource.sortChildList.parentName,
        label: "상위 장비",
        sortable: true,
        type: "comboType",
        comboConfig: {
            valueKey: "parentNo",
            optionsSource: "parentList",
            valueField: "parentNo",
            labelField: "parentName",
            buildPatch: (selected) => ({
                parentNo: selected.parentNo,
                parentName: selected.parentName,
            }),
            nullable: true,
            nullPatch: { parentNo: null, parentName: "" },
        },
    },
    {
        key: EquipmentResource.sortChildList.zoneName,
        label: "층",
        sortable: true,
        type: "text",
    },
    {
        key: EquipmentResource.sortChildList.equipmentName,
        label: "자재명",
        sortable: true,
        type: "textEdit",
    },
    {
        key: EquipmentResource.sortChildList.modelName,
        label: "모델명",
        sortable: true,
        type: "textEdit",
    },
    {
        key: EquipmentResource.sortChildList.equipmentIdenti,
        label: "장비식별정보",
        sortable: true,
        type: "textEdit",
    },
    {
        key: EquipmentResource.sortChildList.standard,
        label: "규격",
        sortable: true,
        type: "textarea",
    },
    {
        key: EquipmentResource.sortChildList.ip,
        label: "IP",
        sortable: true,
        type: "textEdit",
    },
    {
        key: EquipmentResource.sortChildList.location,
        label: "위치",
        sortable: true,
        type: "textEdit",
    },
    {
        key: EquipmentResource.sortChildList.exchangeTime,
        label: "교체일자",
        sortable: true,
        type: "date",
    },
    {
        key: EquipmentResource.sortChildList.memo,
        label: "비고",
        sortable: true,
        type: "textarea",
    },
];