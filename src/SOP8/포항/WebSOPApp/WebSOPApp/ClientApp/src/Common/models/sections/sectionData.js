export default class SectionData {
    static None = -1;
    static ProcessType = 0;
    static DecisionType = 1;
    static AnnotationType = 2;
    static EndpointType = 3;
    //static LinkType = 4;
    static TransSOPType = 5;
    static InternalType = 4;
    static ExternalType = 7;

    static Status_Normal = 1;
    static Status_Run = 2;
    static Status_Done = 3;
    static Status_Input = 4;
    static Status_Skip = 5;

    constructor() {
        this.component = {
            column_no: -1,
            compn_code: SectionData.None,
            compn_sn: -1,
            row_no: -1,
            status: null
        };
    }

    static toJson(data, typeID) {
        let json = {};

        json["column_no"] = data.component.column_no;
        json["compn_code"] = typeID;
        json["compn_sn"] = data.component.compn_sn;
        json["row_no"] = data.component.row_no;
        json["grid_sn"] = -1;

        return json;
    }

    static copyTo(src, trg) {
        console.log(trg);
        console.log(src);
        
        trg.component.column_no = src.component.column_no;
        trg.component.compn_code = src.component.compn_code;
        trg.component.compn_sn = src.component.compn_sn;
        trg.component.row_no = src.component.row_no;
    }

    static getComponentTypeID(compn_code) {
        if (compn_code === "process") {
            return SectionData.ProcessType;
        }
        else if (compn_code === "annotation") {
            return SectionData.AnnotationType;
        }
        else if (compn_code === "decision") {
            return SectionData.DecisionType;
        }
        else if (compn_code === "endpoint") {
            return SectionData.EndpointType;
        }
        else if (compn_code === "internal") {
            return SectionData.InternalType;
        }

        return -1;
    }

    static getComponentTypeString(compn_code) {
        if (compn_code === SectionData.ProcessType) {
            return "process";
        }
        else if (compn_code === SectionData.AnnotationType) {
            return "annotation";
        }
        else if (compn_code === SectionData.DecisionType) {
            return "decision";
        }
        else if (compn_code === SectionData.EndpointType) {
            return "endpoint";
        }
        else if (compn_code === SectionData.InternalType) {
            return "internal";
        }

        return null;
    }
}