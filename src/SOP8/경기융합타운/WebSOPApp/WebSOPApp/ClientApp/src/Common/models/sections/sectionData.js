export default class SectionData {
    static None = -1;
    static ProcessType = 0;
    static DecisionType = 1;
    static AnnotationType = 2;
    static EndpointType = 3;
    static LinkType = 4;
    static TransSOPType = 5;
    static InternalType = 6;
    static ExternalType = 7;

    static Status_Normal = 1;
    static Status_Run = 2;
    static Status_Done = 3;
    static Status_Input = 4;
    static Status_Skip = 5;

    constructor() {
        this.id = -1;
        this.componentID = "";
        this.componentType = "";
        this.typeID = SectionData.None;
        this.gridColumnIndex = -1;
        this.gridRowIndex = -1;
        this.width = 0;
        this.height = 0;
        this.text = "";
        this.status = null;
    }

    static toJson(data, typeID) {
        let json = {};

        json["id"] = data.id;
        json["componentType"] = typeID;
        json["gridID"] = -1;
        json["gridColumnIndex"] = data.gridColumnIndex;
        json["gridRowIndex"] = data.gridRowIndex;
        json["width"] = data.width;
        json["height"] = data.height;
        json["componentID"] = data.componentID;
        json["text"] = data.text;

        return json;
    }

    static copyTo(src, trg) {
        trg.id = src.id;
        trg.typeID = src.typeID;
        trg.componentID = src.componentID;
        trg.componentType = src.componentType;
        trg.gridColumnIndex = src.gridColumnIndex;
        trg.gridRowIndex = src.gridRowIndex;
        trg.width = src.width;
        trg.height = src.height;
        trg.text = src.text;
        trg.removed = src.removed;
    }

    static getComponentTypeID(componentType) {
        if (componentType === "process") {
            return SectionData.ProcessType;
        }
        else if (componentType === "annotation") {
            return SectionData.AnnotationType;
        }
        else if (componentType === "decision") {
            return SectionData.DecisionType;
        }
        else if (componentType === "endpoint") {
            return SectionData.EndpointType;
        }
        else if (componentType === "internal") {
            return SectionData.InternalType;
        }

        return -1;
    }
}