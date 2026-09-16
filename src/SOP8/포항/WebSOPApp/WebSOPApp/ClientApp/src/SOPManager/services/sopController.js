import SectionData from "../../Common/models/sections/sectionData";
import Receiver from "../../Common/models/sections/receiver";
import SopManagerResource from "../resource/id";
import JsonManager from "./jsonManager";
import ProjectResource from "../../Root/resource/id";
import SopDataManager from "./sopDataManager";

export default class SopController {
    /*static async openDB(disasterID = null) {
        if (disasterID) {
            let actionStepDatas = null;

            await fetch('SOPManager/SOP/Open?disasterID=' + disasterID)
                .then(function (response) {
                    return response.json();
                })
                .then((json) => actionStepDatas = json);

            if (actionStepDatas) {
                SopController.setArrowSections(actionStepDatas);
            }

            return actionStepDatas;
        }
        else {
            let disasterCategories = null;

            await fetch('SOPManager/SOP/DisasterCategories')
                .then(function (response) {
                    return response.json();
                })
                .then((json) => disasterCategories = json);

            return disasterCategories;
        }
    }*/

    // 화살표와 Section 정보를 연결시켜준다.
    static setArrowSections(actionStepDatas) {
        const actionStepCount = actionStepDatas.length;

        for (let i = 0; i < actionStepCount; i++) {
            const actionStepData = actionStepDatas[i];

            if (actionStepData?.actionStep) {
                if (actionStepData.stepMemberDatas) {
                    const stepMemberCount = actionStepData.stepMemberDatas.length;

                    for (let j = 0; j < stepMemberCount; j++) {
                        const stepMemberData = actionStepData.stepMemberDatas[j];

                        if (stepMemberData) {
                            SopController.setArrowSections(stepMemberData.arrows, stepMemberData.sections);
                        }
                    }
                }
            }
        }
    }

    static setArrowSections(arrows, sections) {
        if (arrows && sections) {
            const arrowCount = arrows.length;

            for (let i = 0; i < arrowCount; i++) {
                const arrow = arrows[i];

                const [beginSectionType, beginSectionID] = SopController.getSectionInfo(arrow.beginComponentID);
                const [endSectionType, endSectionID] = SopController.getSectionInfo(arrow.endComponentID);


            }
        }
    }

    static findSection(componentID, sections) {
        const [sectionType, sectionID] = SopController.getSectionInfo(componentID);
        const sectionCount = sections.length;

        for (let i = 0; i < sectionCount; i++) {
            const section = sections[i];

            console.log("...");
        }
    }

    static getSectionInfo(componentID) {
        const sectionType = (componentID >> 24);
        const sectionID = (componentID & 0xffffff);
        return [sectionType, sectionID];
    }

    static getDefaultTeamType(sectionData) {
        if (sectionData?.receivers) {
            const receiverCount = sectionData.receivers.length;
            let temporaryNormal = false, temporaryEmergency = false;

            for (let i = 0; i < receiverCount; i++) {
                const receiver = sectionData.receivers[i];

                if (receiver.teamType === Receiver.RegularTeam) {
                    return Receiver.RegularTeam;
                }
                else if (receiver.teamType === Receiver.TemporaryNormalTeam) {
                    temporaryNormal = true;
                }
                else if (receiver.teamType === Receiver.TemporaryEmergencyTeam) {
                    temporaryEmergency = true;
                }
            }

            if (temporaryNormal) {
                return Receiver.TemporaryNormalTeam;
            }
            else if (temporaryEmergency) {
                return Receiver.TemporaryEmergencyTeam;
            }
        }

        return Receiver.RegularTeam;
    }

    /*static async saveDB(sopData) {
        const data = JsonManager.fromSOPData(sopData);
        const jsonData = JSON.stringify(data, JsonManager.replacer);

        const response = await fetch('SOPManager/SOP/Save', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: jsonData
        });
    }*/

    static async loadActionStepNames(site_sn) {
        let actionStepNames = ["관심", "주의", "경계", "심각"];

        try {
            const jsonData = JsonManager.makeRequestDefault(site_sn);

            const res = await fetch('api/SOP/Default', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });
            
            if (res.ok) {
                const result = await res.json();
                if (result.actionStepNames && result.actionStepNames !== null && result.actionStepNames.length > 0) {
                    actionStepNames = result.actionStepNames;
                    SopManagerResource.actionStep._1st = actionStepNames.length > 0 ? actionStepNames[0] : "";
                    SopManagerResource.actionStep._2nd = actionStepNames.length > 1 ? actionStepNames[1] : "";
                    SopManagerResource.actionStep._3rd = actionStepNames.length > 2 ? actionStepNames[2] : "";
                    SopManagerResource.actionStep._4th = actionStepNames.length > 3 ? actionStepNames[3] : "";
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return actionStepNames;
    }

    static async disasterCategories(isNormal, site_sn) {
        try {
            const jsonData = JsonManager.makeRequestDisasterCategories(isNormal, site_sn);

            const res = await fetch('api/SOP/DisasterCategoryList', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {
                    return [result.disasterCategoryDatas, ""];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, ""];
    }

    static async requestDefaultStepMemberData(actionStep) {
        try {
            const actionStepNo = actionStep?.actionStep?.action_step_sn ? actionStep?.actionStep?.action_step_sn : -1;
            const jsonData = JsonManager.makeRequestStepMemberData(actionStepNo);

            const res = await fetch('api/SOP/DefaultStepMemberData', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {
                    if (actionStep.stepMemberDatas) {
                        actionStep.stepMemberDatas.push(result.stepMemberData);
                    }
                    else {
                        actionStep.stepMemberDatas = [result.stepMemberData];
                    }

                    return [result.stepMemberData, ""];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, ""];
    }

    static async requestDefaultActionStepDatas(site_sn = -1) {
        try {
            const jsonData = JsonManager.makeRequestActionStepDatas(site_sn);

            const res = await fetch('api/SOP/Default', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {
                    return [result.actionStepDatas, ""];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, ""];
    }

    // 특정 Disaster에 대한 버전 리스트를 얻어온다.
    static async requestDisasterVersions(sopData) {
        try {
            const jsonData = JsonManager.makeRequestDisasterVersions(sopData);

            if (jsonData === null) {
                return [null, "SOP 정보가 존재하지 않습니다."];
            }

            const res = await fetch('api/SOP/DisasterVersions', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {
                    return [result, ""];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, ""];
    }

    static async requestOpenXML(file, siteNo) {
        try {
            const formData = new FormData();
            formData.append('files', file, siteNo);

            const res = await fetch('api/SOP/OpenXML', {
            //const res = await fetch('SOPManager/SOP/OpenXML', {
                method: 'post',
                body: formData
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {
                    SopDataManager.setSectionComponents(result.sopData);
                    return [result, ""];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, ""];
    }

    static async requestSaveXML(userID, sopData) {
        try {
            const jsonData = JsonManager.makeRequestSaveXML(userID, sopData);

            if (jsonData === null) {
                return [null, "올바르지 않은 SOP 데이터입니다."];
            }

            const res = await fetch('api/SOP/Save', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                if (res.headers.get('content-type') === 'text/xml') {
                    await SopController.downloadFile(res);
                    return [sopData, ""];
                }
                else {
                    const result = await res.json();

                    if (result.success) {
                        return [result, ""];
                    }
                    else {
                        return [null, result.message];
                    }
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, ""];
    }

    static async downloadFile(response) {
        const fileName = SopController.getFileName(response);

        if (fileName.length === 0) {
            return;
        }

        const blob = await response.blob();
        const newBlob = new Blob([blob]);

        const blobUrl = window.URL.createObjectURL(newBlob);

        const link = document.createElement('a');
        link.href = blobUrl;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);

        window.URL.revokeObjectURL(blob);
    }

    static getFileName(response) {
        const result = response.headers.get('content-disposition');
        const tokens = result.split(';');

        const tokenCount = tokens.length;

        for (let i = 0; i < tokenCount; i++) {
            const token = tokens[i].trim();
            const index = token.indexOf('=');

            if (index > 0) {
                const key = token.substring(0, index).trim();
                const value = token.substring(index + 1).trim();

                if (key === 'filename*') {
                    const index2 = value.indexOf("''");

                    if (index2 >= 0) {
                        const uri = value.substring(index2 + 2).trim();
                        return decodeURI(uri);
                    }
                }
            }
        }

        return "";
    }

    static async requestSaveDB(user_sn, sopData) {
        try {
            const jsonData = JsonManager.makeRequestSaveDB(user_sn, sopData);

            if (jsonData === null) {
                return [null, "올바르지 않은 SOP 데이터입니다."];
            }

            const res = await fetch('api/SOP/Save', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {
                    SopController.changeSopData(result.sopData);
                    return [result, ""];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, ""];
    }

    // Backend에서 전달받은 SectionData를 Frontend에서 인식할 수 있도록 변환한다.
    static changeSopData(sopData) {
        if (!sopData) {
            return;
        }

        for (const actionStepData of sopData.actionStepDatas) {
            for (const stepMemberData of actionStepData.stepMemberDatas) {
                stepMemberData.sections = SopDataManager.jsonToSections(stepMemberData.rawSections);
                delete stepMemberData.rawSections;
            }
        }
    }

    static async requestOpenDB(disasterNo) {
        try {
            const jsonData = JsonManager.makeRequestOpenDB(disasterNo);

            if (jsonData === null) {
                return [null, "올바르지 않은 SOP 데이터입니다."];
            }

            const res = await fetch('api/SOP/Open', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {
                    SopDataManager.setSectionComponents(result.sopData);
                    return [result, ""];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, "requestOpenDB 실패"];
    }

    // siteNo가 null이면 siteNo와 상관없이 전체 SOP를 요청한다.
    static async requestOpenAll(siteNo) {
        try {
            const jsonData = JsonManager.makeRequestOpenAll(siteNo);

            if (jsonData === null) {
                return [null, "올바르지 않은 SOP 데이터입니다."];
            }

            const res = await fetch('api/SOP/OpenAll', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {
                    SopDataManager.setDisasterCategories(result.disasterCategories);
                    return [result, ""];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, "requestOpenAll 실패"];
    }

    static async requestDeleteDB(versionNos) {
        try {
            const jsonData = JsonManager.makeRequestDeleteDB(versionNos);

            if (jsonData === null) {
                return [null, "올바르지 않은 데이터 형식입니다."];
            }

            const res = await fetch('api/SOP/Delete', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();
                return [result.success, result.message];
            }
        }
        catch (e) {
            console.log(e);
            return [false, e.message];
        }

        return [false, ""];
    }

    static addStepMember(disasterCategories, stepMemberData) {
        for (let i = 0; i < disasterCategories.length; i++) {
            const dc = disasterCategories[i];

            for (let j = 0; j < dc.subDisasterCategories.length; j++) {
                const sdc = dc.subDisasterCategories[j];

                for (const key in sdc.disasters) {
                    const disasterDatas = sdc.disasters[key];

                    if (disasterDatas.length > 0) {
                        const disasterData = disasterDatas[0];

                        if (disasterData.actionSteps) {
                            for (let k = 0; k < disasterData.actionSteps.length; k++) {
                                const actionStepData = disasterData.actionSteps[k];

                                if (actionStepData === null) {
                                    continue;
                                }

                                if (actionStepData.stepMemberDatas) {
                                    actionStepData.stepMemberDatas.push({ ...stepMemberData });
                                }
                                else {
                                    actionStepData.stepMemberDatas = [{ ...stepMemberData }];
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    static removeVersion(disasterCategories) {
        for (let i = 0; i < disasterCategories.length; i++) {
            const dc = disasterCategories[i];

            for (let j = 0; j < dc.subDisasterCategories.length; j++) {
                const sdc = dc.subDisasterCategories[j];

                for (const key in sdc.disasters) {
                    const disasterDatas = sdc.disasters[key];

                    // 새로운 SOP를 생성하는 것이니 Disaster 정보는 하나만 남기고 지운다.
                    disasterDatas.splice(1);

                    /*if (disasterDatas.length > 0) {
                        const disasterData = disasterDatas[0];
    
                        disasterData.disaster.versionID = -1;
                        disasterData.version = this.initVersion(disasterData.version);
                    }*/
                }
            }
        }
    }

    /**
     * @param : SpecialMessageParameter
     */
    static async requestParseSpecialMessage(param) {
        try {
            const jsonData = JsonManager.makeRequestParseSpecialMessage(param);

            const res = await fetch('api/SOP/ParseSpecialMessage', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {
                    return [result.parseMessage, null];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, ""];
    }

    static async requestSpecialMessageList() {
        try {
            const jsonData = JsonManager.makeRequestSpecialMessageList();

            const res = await fetch('api/SOP/SpecialMessageList', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {
                    return [result.specialMessages, null];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, ""];
    }

    static async requestLinkedSOPs(siteNo = null, sensorTypeDatas = null) {
        try {
            const jsonData = JsonManager.makeRequestLinkedSopDatas(siteNo, sensorTypeDatas);

            const res = await fetch('api/SOP/LinkedSOPs', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {
                    return [result.linkedSops, null];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, "requestLinkedSOPs 실패"];
    }

    static async requestSaveLinkedSops(linkedSops, site_sn) {
        try {
            const json = {
                "siteNo": site_sn,
                "linkedSopDatas": linkedSops
            };

            const jsonData = JSON.stringify(json);

            const res = await fetch('api/SOP/SaveLinkedSOPs', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {
                    return [result.success, null];
                }
                else {
                    return [false, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, ""];
    }

    static async requestLoadLinkedSopVersions(site_sn, versionNos) {
        try {
            const jsonData = JsonManager.makeRequestLoadLinkedSopVersions(site_sn, versionNos);

            if (jsonData === null) {
                return [null, "올바르지 않은 데이터 형식입니다."];
            }

            const res = await fetch('api/SOP/LoadLinkedSopVersions', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();
                if (result.success) {
                    return [result.versionIDs, null];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
            return [false, e.message];
        }

        return [false, ""];
    }

    static async checkSectionValidation(sectionData, stepMemberNo) {
        try {
            const copySectionData = { ...sectionData };

            if (copySectionData.component?.compn_code === undefined || copySectionData.component?.compn_code === null) {
                // 화살표
                copySectionData.compn_code = -1;
            }
            else if (Number.isInteger(copySectionData.component.compn_code) === false) {
                copySectionData.component.compn_code = SectionData.getComponentTypeID(copySectionData.component.compn_code);
            }

            const user = ProjectResource.getUserInfo();

            if (!user) {
                return [null, "먼저 로그인을 하여야 합니다."];
            }

            const jsonData = !copySectionData.component || copySectionData.component.compn_code < 0 ? JsonManager.makeCheckArrowValidation(copySectionData, stepMemberNo, user.user_sn) : JsonManager.makeCheckSectionValidation(copySectionData, stepMemberNo, user.user_sn);

            if (jsonData === null) {
                return [null, "올바르지 않은 SOP 데이터입니다."];
            }

            const res = await fetch('api/SOP/CheckSectionData', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();
                return [result.success, result.message];
            }
        }
        catch (e) {
            console.log(e);
        }

        return [false, "컴포넌트의 유효성 검증이 실패하였습니다."];
    }
}
