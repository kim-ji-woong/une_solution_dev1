import Receiver from './receiver.js';
import SectionData from './sectionData.js';
import SectionDataProcessMission from './sectionDataProcessMission.js';

export default class SectionDataProcess extends SectionData {
    constructor() {
        super();
        this.process = {
            compn_sn: -1,
            title: "",
            receivers: [],
            receiverName: "",
            missions: [],
            atmc_execut_yn: false
        };

        this.component = Object.assign(this.component, {
            compn_code: SectionData.ProcessType
        });
    }

    static toJson(data) {
        let json = SectionData.toJson(data, SectionData.ProcessType);

        /*const missions = [];

        if (data.missions !== null) {
            for (let i = 0; i < data.missions.length; i++) {
                const mission = data.missions[i];

                missions.push({ "id": mission.id, "missionText": mission.missionText });
            }
        }*/

        json["missions"] = SectionDataProcessMission.missionsToJson(data.process.missions);
        //json["externalMissions"] = data.process.externalMissions;
        //----------------json["leadr_prvuse_yn"] = data.process.leadr_prvuse_yn;
        json["title"] = data.process.title;
        json["atmc_execut_yn"] = data.process.atmc_execut_yn;
        SectionDataProcess.setReceivers(data.process.receivers, json);

        return json;
    }

    static setReceivers(receivers, json) {
        for (const receiver of receivers) {
            if (receiver.teamType === Receiver.RegularTeam) {
                let regulars = json["regulars"];

                if (!regulars) {
                    regulars = [];
                    json["regulars"] = regulars;
                }

                const regular = {
                    "rgl_sn": receiver.teamID
                };

                regulars.push(regular);
            }
            else if (receiver.teamType === Receiver.TemporaryNormalTeam || receiver.teamType === Receiver.TemporaryEmergencyTeam) {
                let temporaries = json["temporaries"];

                if (!temporaries) {
                    temporaries = [];
                    json["temporaries"] = temporaries;
                }

                const temporary = {
                    "tmpr_sn": receiver.teamID
                };

                temporaries.push(temporary);
            }
        }
    }

    static toReceivers(receivers, json) {
        if (json.regulars) {
            for (const regular of json.regulars) {
                receivers.push(SectionDataProcess.makeReceiver(regular.rgl_sn, Receiver.RegularTeam));
            }
        }

        if (json.temporaries) {
            for (const temporary of json.temporaries) {
                receivers.push(SectionDataProcess.makeReceiver(temporary.tmpr_sn, temporary.nor_yn ? Receiver.TemporaryNormalTeam : Receiver.TemporaryEmergencyTeam));
            }
        }
    }

    static makeReceiver(teamNo, teamType) {
        const json = {
            "teamID": teamNo,
            "teamType": teamType
        }

        return json;
    }

    static fromJson(json) {
        const data = new SectionDataProcess();

        data.process.missions = json.missions;
        data.process.externalMissions = json.externalMissions;
        data.process.leadr_prvuse_yn = json.leadr_prvuse_yn;
        data.process.title = json.title;
        data.process.atmc_execut_yn = json.atmc_execut_yn;

        SectionDataProcess.toReceivers(data.process.receivers, json);

        return data;
    }

    static getComponentType() {
        return "process";
    }

    static copyTo(src, trg) {
        SectionData.copyTo(src, trg);

        trg.process.title = src.process.title;
        trg.process.receivers = src.process.receivers;
        trg.process.receiverName = src.process.receiverName;
        trg.process.missions = [];
        trg.process.atmc_execut_yn = src.process.atmc_execut_yn;

        if (src.process.missions) {
            for (let i = 0; i < src.process.missions.length; i++) {
                const mission = src.process.missions[i];
                trg.process.missions.push(mission);
            }
        }
    }

    static componentToSectionData(component) {
        const sectionData = new SectionDataProcess();
        return sectionData;
    }
}
