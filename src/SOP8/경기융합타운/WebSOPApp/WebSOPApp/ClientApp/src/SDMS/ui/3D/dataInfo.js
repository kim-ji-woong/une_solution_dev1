import { i18n, withTranslation } from "../../../language/i18n";
import { SDMSController } from "../../services/sdmsController";
import { SDMSDataManager } from "../../services/sdmsDataManager";

export class DataInfo {
    static async processFacilityInfo(modelName/*: string*/, showBuildingInfoMethod) {
        if (modelName === null) {
            showBuildingInfoMethod("", null);
            return;
        }

        const response = await SDMSController.requestFacilityInfoData(modelName);

        if (response === null) {
            alert(i18n.t('sdms.dataInfo.설비 정보를 불러올 수 없습니다'));
        }
        else if (response.success === false) {
            alert(response.message);
        }
        else {
            const datas = [];
            const dataCount = response.datas.length;

            for (let i = 0; i < dataCount; i++) {
                const data = response.datas[i];
                datas.push([data.value, data.withDot, data.indentDepth]);
            }

            const arrInfo = new Array();

            arrInfo[0] = i18n.t('sdms.dataInfo.설비');       // 설비
            arrInfo[1] = response.facilityName;                            // 설비 이름
            arrInfo[2] = datas;

            showBuildingInfoMethod(arrInfo[0], arrInfo);
        }
    }

    static async processBuildingData(modelName/*: string*/, showBuildingInfoMethod) {
        const buildingName = DataInfo.getBuildingName(modelName);
        const response = await SDMSController.requestBuildingData(buildingName);

        if (response === null) {
            alert(i18n.t('sdms.dataInfo.건물 정보를 불러올 수 없습니다'));
        }
        else if (response.success === false) {
            alert(response.message);
        }
        else {
            const datas = [];
            const dataCount = response.datas.length;

            for (let i = 0; i < dataCount; i++) {
                const data = response.datas[i];
                datas.push([data.value, data.withDot, data.indentDepth]);
            }

            const arrInfo = new Array();

            arrInfo[0] = i18n.t('sdms.dataInfo.건물');        // 건물
            arrInfo[1] = response.displayText;                             // 건물 이름
            arrInfo[2] = datas;

            showBuildingInfoMethod(arrInfo[0], arrInfo);
        }
    }

    static async processBuildingGroupData(buildingGroupID/*: number*/, showBuildingInfoMethod) {
        const response = await SDMSController.requestBuildingGroupData(buildingGroupID);

        if (response === null) {
            alert(i18n.t('sdms.dataInfo.건물 그룹 정보를 불러올 수 없습니다'));
        }
        else if (response.success === false) {
            alert(response.message);
        }
        else {
            const datas = [];
            const dataCount = response.datas.length;

            for (let i = 0; i < dataCount; i++) {
                const data = response.datas[i];
                datas.push([data.value, data.withDot, data.indentDepth]);
            }

            const arrInfo = new Array();

            arrInfo[0] = i18n.t('sdms.dataInfo.건물 그룹');   // 건물
            arrInfo[1] = response.displayText;                             // 건물 이름
            arrInfo[2] = datas;

            showBuildingInfoMethod(arrInfo[0], arrInfo);
        }
    }

    static getBuildingName(boundingBoxName) {
        return boundingBoxName.substring(0, boundingBoxName.length - SDMSDataManager.BoundingBoxTag.length);
    }
}