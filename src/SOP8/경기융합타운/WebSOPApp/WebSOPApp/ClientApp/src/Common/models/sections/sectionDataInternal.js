// import Receiver from './receiver.js';
import SectionData from './sectionData.js';

export default class SectionDataInternal extends SectionData {
    constructor() {
        super();
        this.isSMS = true;
        this.isBroadcast = false;
        this.isEmail = false;
        this.receivers = [];
        this.receiverName = "";
        //this.receiver = new Receiver();
        this.autoRun = false;
        this.typeID = SectionData.InternalType;
        this.componentType = SectionDataInternal.getComponentType();
        this.message = "";
    }

    static toJson(data) {
        let json = SectionData.toJson(data, SectionData.InternalType);
        json["isSMS"] = data.isSMS;
        json["isBroadcast"] = data.isBroadcast;//data.isSMS ? false : true;
        json["isEmail"] = data.isEmail;
        json["message"] = data.message;
        json["autoRun"] = data.autoRun;
        json["receivers"] = data.receivers;
        //json["receivers"] = Receiver.listToJsonArray(data.receivers);
        return json;
    }

    static getComponentType() {
        return "internal";
    }

    static copyTo(src, trg) {
        SectionData.copyTo(src, trg);
        trg.isSMS = src.isSMS;
        trg.isBroadcast = src.isBroadcast;
        trg.isEmail = src.isEmail;
        trg.receivers = src.receivers;
        trg.receiverName = src.receiverName;
        trg.autoRun = src.autoRun;
        trg.message = src.message;
    }
}
