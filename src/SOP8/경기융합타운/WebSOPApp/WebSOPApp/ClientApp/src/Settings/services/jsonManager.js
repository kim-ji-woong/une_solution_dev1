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

    static makeSaveSettings(saveData, siteNo) {
        const json = {
            "requestSaveSettings":
            {
                "siteNo": siteNo,
                "userID": saveData.userID,
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

    static makeRequestDownloadBuilding(siteNo) {
        const json = {
            "requestDownloadBuilding": 
            {
                "siteNo": siteNo
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestDownloadBuildingGroup(siteNo) {
        const json = {
            "requestDownloadBuildingGroup": 
            {
                "siteNo": siteNo
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestDownloadFacility(siteNo) {
        const json = {
            "requestDownloadFacility": 
            {
                "siteNo": siteNo
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestDownloadRegularTeam(siteNo) {
        const json = {
            "requestDownloadRegularTeam": 
            {
                "siteNo": siteNo
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestGetSpreadMessage() {
        const json = {
            "requestGetSpreadMessage": true
        };

        return JSON.stringify(json);
    }

    static makeRequestSetSpreadMessage(addSpreadMessage, updateSpreadMessage, removeSpreadMessage) {
        const json = {
            "requestSetSpreadMessage":
            {
                "addSpreadMessage": addSpreadMessage,
                "updateSpreadMessage": updateSpreadMessage,
                "removeSpreadMessage": removeSpreadMessage,
            }
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
}