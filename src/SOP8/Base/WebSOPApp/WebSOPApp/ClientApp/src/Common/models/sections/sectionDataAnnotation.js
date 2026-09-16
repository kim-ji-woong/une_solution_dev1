import SectionData from './sectionData.js';

export default class SectionDataAnnotation extends SectionData {
    constructor() {
        super();
        this.comment = {
            compn_sn: -1,
            contents: ""
        };

        this.component = Object.assign(this.component, {
            compn_code: SectionData.AnnotationType
        });
    }

    static toJson(data) {
        let json = SectionData.toJson(data, SectionData.AnnotationType);
        json["contents"] = data.comment.contents;
        json["text"] = data.comment.contents;
        return json;
    }

    static fromJson(json) {
        const data = new SectionDataAnnotation();
        data.comment.contents = json.text;
        return data;
    }

    static getComponentType() {
        return "annotation";
    }

    static copyTo(src, trg) {
        SectionData.copyTo(src, trg);
        trg.comment.contents = src.comment.contents;
    }

    static componentToSectionData(component) {
        const sectionData = new SectionDataAnnotation();
        return sectionData;
    }
}
