import SectionData from './sectionData.js';

export default class SectionDataAnnotation extends SectionData {
    constructor() {
        super();
        this.typeID = SectionData.AnnotationType;
        this.componentType = SectionDataAnnotation.getComponentType();
    }

    static toJson(data) {
        let json = SectionData.toJson(data, SectionData.AnnotationType);
        return json;
    }

    static getComponentType() {
        return "annotation";
    }

    static copyTo(src, trg) {
        SectionData.copyTo(src, trg);
    }
}
