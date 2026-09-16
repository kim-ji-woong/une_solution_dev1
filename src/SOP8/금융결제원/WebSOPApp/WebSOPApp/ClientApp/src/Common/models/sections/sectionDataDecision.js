import SectionData from './sectionData.js';

export default class SectionDataDecision extends SectionData {
    constructor() {
        super();
        this.decision = {
            compn_sn: -1,
            title: "",
            desc: "",
            atmc_execut_script: null,

        };

        this.component = Object.assign(this.component, {
            compn_code: SectionData.DecisionType
        });
    }

    static toJson(data) {
        let json = SectionData.toJson(data, SectionData.DecisionType);

        json["title"] = data.decision.title;
        json["descp"] = data.decision.descp;
        json["description"] = data.decision.descp;

        if (data.decision.atmc_execut_script) {
            json["atmc_execut_script"] = data.decision.atmc_execut_script;
            json["autoRunScript"] = data.decision.atmc_execut_script;
        }

        return json;
    }

    static fromJson(json) {
        const data = new SectionDataDecision();

        data.decision.title = json.title;
        data.decision.descp = json.descp;
        data.decision.atmc_execut_script = json.atmc_execut_script;

        return data;
    }

    static getComponentType() {
        return "decision";
    }

    static copyTo(src, trg) {
        SectionData.copyTo(src, trg);
        trg.decision.title = src.decision.title;
        trg.decision.descp = src.decision.descp;
        trg.decision.atmc_execut_script = src.decision.atmc_execut_script;
    }

    static componentToSectionData(component) {
        const sectionData = new SectionDataDecision();
        return sectionData;
    }
}
