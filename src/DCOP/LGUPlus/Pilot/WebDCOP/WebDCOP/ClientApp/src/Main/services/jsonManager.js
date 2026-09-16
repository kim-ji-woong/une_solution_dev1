export class JsonManager {
    static makeRequestCurrentWeather(dataCenterNo) {
        const json = {
            "dataCenterNo": dataCenterNo
        }

        return JSON.stringify(json);
    }

    static makeRequestRackGroupList(dataCenterNo, companyNo, type, unit, searchText, pageIndex, pageItemCount) {
        const json = {
            "dataCenterNo": dataCenterNo,
            "companyNo": companyNo,
            "type": type,
            "unitSize": unit,
            "searchText": searchText,
            "pageIndex": pageIndex,
            "pageItemCount": pageItemCount
        }

        return JSON.stringify(json);
    }

    static makeRequestRackItemList(rackNo, categoryName, equipmentTypeName, companyNo, type, unit, searchText, pageIndex, pageItemCount) {
        const json = {
            "rackNo": rackNo,
            "categoryName": categoryName,
            "equipmentTypeName": equipmentTypeName,
            "companyNo": companyNo,
            "type": type,
            "unitSize": unit,
            "searchText": searchText,
            "pageIndex": pageIndex,
            "pageItemCount": pageItemCount
        }

        return JSON.stringify(json);
    }

    static makeRequestDataCenterRackItemList(dataCenterNo, categoryName, equipmentTypeName, companyNo, type, unit, searchText, pageIndex, pageItemCount) {
        const json = {
            "dataCenterNo": dataCenterNo,
            "categoryName": categoryName,
            "equipmentTypeName": equipmentTypeName,
            "companyNo": companyNo,
            "type": type,
            "unitSize": unit,
            "searchText": searchText,
            "pageIndex": pageIndex,
            "pageItemCount": pageItemCount
        }

        return JSON.stringify(json);
    }

    static makeRequestItemData(itemNo) {
        const json = {
            "itemNo": itemNo
        }

        return JSON.stringify(json);
    }

    static makeRequestSensorList(dataCenterNo) {
        const json = {
            "dataCenterNo": dataCenterNo
        }

        return JSON.stringify(json);
    }

    static makeRequestRackTypeList(companyNo, type, unit, searchText, pageIndex, pageItemCount) {
        const json = {
            "companyNo": companyNo,
            "type": type,
            "unitSize": unit,
            "searchText": searchText,
            "pageIndex": pageIndex,
            "pageItemCount": pageItemCount
        }

        return JSON.stringify(json);
    }

    static makeRequestItemTypeList(categoryName, equipmentTypeName, companyNo, type, unit, searchText, pageIndex, pageItemCount) {
        const json = {
            "categoryName": categoryName,
            "equipmentTypeName": equipmentTypeName,
            "companyNo": companyNo,
            "type": type,
            "unitSize": unit,
            "searchText": searchText,
            "pageIndex": pageIndex,
            "pageItemCount": pageItemCount
        }

        return JSON.stringify(json);
    }

    static makeRequestRackFilterList() {
        const json = {
        }

        return JSON.stringify(json);
    }

    static makeRequestItemFilterList() {
        const json = {
        }

        return JSON.stringify(json);
    }

    static makeRequestAlarmList(dataCenterNo) {
        const json = {
            "dataCenterNo": dataCenterNo
        }

        return JSON.stringify(json);
    }

    static makeRequest360CameraUrl(dataCenterNo) {
        const json = {
            "dataCenterNo": dataCenterNo
        }

        return JSON.stringify(json);
    }

    static makeRequestFacilityInfo(facilityNo) {
        const json = {
            "facilityNo": facilityNo
        }

        return JSON.stringify(json);
    }
}