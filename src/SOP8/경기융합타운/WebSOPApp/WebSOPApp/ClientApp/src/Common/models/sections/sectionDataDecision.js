import SectionData from './sectionData.js';

export default class SectionDataDecision extends SectionData {
    constructor() {
        super();
        this.typeID = SectionData.DecisionType;
        this.componentType = SectionDataDecision.getComponentType();
        this.teamType = null;
        this.teamName = null;
        this.description = null;
        this.autoRunScript = null;
    }

    static toJson(data) {
        let json = SectionData.toJson(data, SectionData.DecisionType);

        if (data.teamType && data.teamName && data.teamName.length > 0) {
            json["teamType"] = data.teamType;
            json["teamName"] = data.teamName;
        }

        if (data.description) {
            json["description"] = data.description;
        }

        if (data.autoRunScript) {
            json["autoRunScript"] = data.autoRunScript;
        }

        return json;
    }

    static getComponentType() {
        return "decision";
    }

    static copyTo(src, trg) {
        SectionData.copyTo(src, trg);
        trg.description = src.description;
        trg.autoRunScript = src.autoRunScript;
    }
}
