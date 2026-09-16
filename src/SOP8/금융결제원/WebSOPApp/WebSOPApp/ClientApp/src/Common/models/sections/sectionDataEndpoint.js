import SectionData from './sectionData.js';

export default class SectionDataEndpoint extends SectionData {
    constructor() {
        super();
        this.endpoint = {
            begin_yn: true,
            compn_sn: -1,
            title: ""
        };

        this.component = Object.assign(this.component, {
            compn_code: SectionData.EndpointType
        });
    }

    static toJson(data) {
        let json = SectionData.toJson(data, SectionData.EndpointType);

        json["begin_yn"] = data.endpoint.begin_yn;
        json["title"] = data.endpoint.title;

        return json;
    }

    static fromJson(json) {
        const data = new SectionDataEndpoint();
        data.endpoint.begin_yn = json.begin_yn;
        data.endpoint.title = json.title;
        return data;
    }

    static getComponentType() {
        return "endpoint";
    }

    static copyTo(src, trg) {
        SectionData.copyTo(src, trg);
        trg.endpoint.title = src.endpoint.title;
        trg.endpoint.begin_yn = src.endpoint.begin_yn;
    }

    static componentToSectionData(component) {
        const sectionData = new SectionDataEndpoint();
        return sectionData;
    }
}
