export default class JsonManager{
    static makeRequestSettings(userID, siteNo) {
        const json = {
            "requestSettings":
            {
                "siteNo": siteNo,
                "userID": userID
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestSdmsCommonSettings() {
        const json = {
            "requestSdmsCommonSettings": true
        };

        return JSON.stringify(json);
    }

    static makeRequestSopCommonSettings() {
        const json = {
            "requestSopCommonSettings": true
        };

        return JSON.stringify(json);
    }

    static makeRequestAccountSettings(userID) {
        const json = {
            "requestAccountSettings":
            {
                "userID": userID,
            }
        };

        return JSON.stringify(json);
    }

    static makeSaveSettings(saveData, site_sn) {
        const json = {
            "requestSaveSettings":
            {
                "site_sn": site_sn,
                "userID": saveData.user_id,
                "shortcutKey": saveData.shortcutKey,
                "idleTime": saveData.idleTime,
                "reAlarm": saveData.reAlarm,
                "useReceiveFire": saveData.useReceiveFire,
                "useReceivePSM": saveData.useReceivePSM,
                "useReceiveETC": saveData.useReceiveETC,
                "useReceiveEnvironment": saveData.useReceiveEnvironment,
                "useReceiveManufacture": saveData.useReceiveManufacture,
                "useReceiveSVMS": saveData.useReceiveSVMS,
                "useReceiveEarthquake": saveData.useReceiveEarthquake,
                "useReceiveStrongWind": saveData.useReceiveStrongWind,
                "eventInfoDisplayTerm": saveData.eventInfoDisplayTerm,
                "useScreenMove": saveData.useScreenMove,
                "exeCautionSOP": saveData.exeCautionSOP,
                "exeAlartSOP": saveData.exeAlartSOP,
                "exeSeriousSOP": saveData.exeSeriousSOP,
                "useTrainingMode": saveData.useTrainingMode,
                "useWaterMark": saveData.useWaterMark,
                "useHeadMessage": saveData.useHeadMessage,
                "useAutoMoveSOPScreen": saveData.useAutoMoveSOPScreen,
                "useBroadcast": saveData.useBroadcast,
                "useSMS": saveData.useSMS,
                "useEmail": saveData.useEmail,
                "useConfirm": saveData.useConfirm,
                "workingBeginHour": saveData.workingBeginHour,
                "workingEndHour": saveData.workingEndHour,
                "useResultSummary": saveData.useResultSummary,
                "dashboardBegin": saveData.dashboardBegin,
                "dashboardEnd": saveData.dashboardEnd,
                "fireSOPWaitEndTime": saveData.fireSOPWaitEndTime,
                "psmsopWaitEndTime": saveData.psmsopWaitEndTime,
                "etcsopWaitEndTime": saveData.etcsopWaitEndTime,
                "fireSOPRecoverEndTime": saveData.fireSOPRecoverEndTime,
                "psmsopRecoverEndTime": saveData.psmsopRecoverEndTime,
                "etcsopRecoverEndTime": saveData.etcsopRecoverEndTime,
                "moveDisplayAlarm": saveData.moveDisplayAlarm,
                "useAlarmBroadcast": saveData.useAlarmBroadcast,
                "usePoiFocus": saveData.usePoiFocus,
                "usePoiHighlight": saveData.usePoiHighlight,
                "turnStart": saveData.turnStart,
                "useAlarmTurn": saveData.useAlarmTurn,
                "useAlarmArea": saveData.useAlarmArea,
            }
        };

        return JSON.stringify(json);
    }

    static makeUpdateSdmsSettings(settings) {
        const json = {
            "requestUpdateSettings": {
                "properties": settings,
                // Options.OptionTarget.SDMS
                "optionTarget": 0
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestResetPopup(userID, popupState) {
        const json = {
            "requestResetPopup":
            {
                "userID": userID,
                "popupState": popupState,
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestDownloadBuilding(site_sn) {
        const json = {
            "requestDownloadBuilding": 
            {
                "site_sn": site_sn
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestDownloadBuildingGroup(site_sn) {
        const json = {
            "requestDownloadBuildingGroup": 
            {
                "site_sn": site_sn
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestDownloadFacility(site_sn) {
        const json = {
            "requestDownloadFacility": 
            {
                "site_sn": site_sn
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestDownloadRegularTeam(site_sn) {
        const json = {
            "requestDownloadRegularTeam": 
            {
                "site_sn": site_sn
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestGetSpreadMessage(sensorType, sensorSubType, messageType, detectType, isActive, buildingGroupNo, buildingNo, zoneNo, searchText, pageIndex, pageItemCount, searchTextTypes, sensorTypeDatas) {
        const json = {
            "sensorType": sensorType,
            "sensorSubType": sensorSubType,
            "messageType": messageType,
            "detectType": detectType,
            "isActive": isActive,
            "buildingGroupNo": buildingGroupNo,
            "buildingNo": buildingNo,
            "zoneNo": zoneNo,
            "searchText": searchText,
            "pageIndex": pageIndex,
            "pageItemCount": pageItemCount,
            "searchTextTypes": searchTextTypes,
            "sensorTypeDatas": sensorTypeDatas
        };

        return JSON.stringify(json);
    }

    static makeRequestSetSpreadMessage(notificationName, notifyMessage, sensorType, sensorSubType, messageType, detectType, isActive, notificationNo, buildingGroupNo, buildingNo, zoneNo, regularNos, regularMemberNos, temporaryNos, temporaryMemberNos) {
        const json = {
            "notificationName": notificationName,
            "notifyMessage": notifyMessage,
            "sensorType": sensorType,
            "sensorSubType": sensorSubType,
            "messageType": messageType,
            "detectType": detectType,
            "isActive": isActive,
            "notificationNo": notificationNo,
            "buildingGroupNo": buildingGroupNo,
            "buildingNo": buildingNo,
            "zoneNo": zoneNo,
            "regularNos": regularNos,
            "regularMemberNos": regularMemberNos,
            "temporaryNos": temporaryNos,
            "temporaryMemberNos": temporaryMemberNos
        };

        return JSON.stringify(json);
    }

    static makeDeleteSpreadMessage(notificationNo) {
        const json = {
            "notificationNo": notificationNo
        };

        return JSON.stringify(json);
    }

    static makeRequestSetAccoutPopup(userID) {
        const json = {
            "requestSetAccoutPopup":
            {
                "userID": userID,
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestResetAccoutPopup(userID) {
        const json = {
            "requestResetAccoutPopup":
            {
                "userID": userID,
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestOnOffBroadcast(onOff, buildingID) {
        const json = {
            "requestOnOffBroadcast":
            {
                "onOff": onOff,
                "buildingID": buildingID,
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestSetting(siteNo, categoryName, propertyName) {
        const json = {
            "siteNo": siteNo,
            "categoryName": categoryName,
            "propertyName": propertyName
        };

        return JSON.stringify(json);
    }

    static makeRequestSave(categories) {
        const json = {
            "categories": categories
        };

        return JSON.stringify(json);
    }

    static makeRequestInitialize(siteNo) {
        const json = {
            "siteNo": siteNo
        };

        return JSON.stringify(json);
    }
}