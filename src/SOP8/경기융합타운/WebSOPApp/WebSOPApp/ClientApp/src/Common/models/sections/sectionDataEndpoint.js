import SectionData from './sectionData.js';

export default class SectionDataEndpoint extends SectionData {
    constructor() {
        super();
        this.isBegin = true;
        this.typeID = SectionData.EndpointType;
        this.componentType = SectionDataEndpoint.getComponentType();
    }

    static toJson(data) {
        let json = SectionData.toJson(data, SectionData.EndpointType);
        json["isBegin"] = data.isBegin;
        return json;
    }

    static getComponentType() {
        return "endpoint";
    }

    static copyTo(src, trg) {
        SectionData.copyTo(src, trg);
        trg.isBegin = src.isBegin;
    }
}
