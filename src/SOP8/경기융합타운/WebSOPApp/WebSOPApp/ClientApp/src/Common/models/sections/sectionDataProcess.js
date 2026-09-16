// import Receiver from './receiver.js';
import SectionData from './sectionData.js';

export default class SectionDataProcess extends SectionData {
    constructor() {
        super();
        this.receivers = [];
        this.receiverName = "";
        //this.receiver = new Receiver();
        this.missions = [];
        this.autoRun = false;
        this.typeID = SectionData.ProcessType;
        this.componentType = SectionDataProcess.getComponentType();
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

        json["missions"] = data.missions;
        json["receivers"] = data.receivers;
        //json["receivers"] = Receiver.listToJsonArray(data.receivers);
        json["autoRun"] = data.autoRun;

        return json;
    }

    static getComponentType() {
        return "process";
    }

    static copyTo(src, trg) {
        SectionData.copyTo(src, trg);

        trg.receivers = src.receivers;
        trg.receiverName = src.receiverName;
        trg.missions = [];
        trg.autoRun = src.autoRun;

        if (src.missions !== null) {
            for (let i = 0; i < src.missions.length; i++) {
                const mission = src.missions[i];
                trg.missions.push(mission);
            }
        }
    }
}
