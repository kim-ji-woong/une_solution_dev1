import Receiver from './receiver.js';
import SectionData from './sectionData.js';
import SectionDataProcess from './sectionDataProcess.js';

export default class SectionDataInternal extends SectionData {
    constructor() {
        super();
        this.transmission = {
            compn_sn: -1,
            title: "",
            sms_yn: true,
            brdcst_yn: false,
            email_yn: false,
            receivers: [],
            receiverName: "",
            atmc_execut_yn: false,
            mssage: ""
        };

        this.component = Object.assign(this.component, {
            compn_code: SectionData.InternalType
        });
    }

    static toJson(data) {
        let json = SectionData.toJson(data, SectionData.InternalType);
        json["sms_yn"] = data.transmission.sms_yn;
        json["brdcst_yn"] = data.transmission.brdcst_yn;//data.sms_yn ? false : true;
        json["email_yn"] = data.transmission.email_yn;
        json["mssage"] = data.transmission.mssage;
        json["atmc_execut_yn"] = data.transmission.atmc_execut_yn;
        //----------------json["siren_yn"] = data.transmission.siren_yn;
        //----------------json["leadr_prvuse_yn"] = data.transmission.leadr_prvuse_yn;
        json["title"] = data.transmission.title;
        SectionDataInternal.setReceivers(data.transmission.receivers, json);
        return json;
    }

    static setReceivers(receivers, json) {
        for (const receiver of receivers) {
            if (receiver.teamType === Receiver.RegularTeam) {
                let regulars = json["transmissionRegulars"];

                if (!regulars) {
                    regulars = [];
                    json["transmissionRegulars"] = regulars;
                }

                const regular = {
                    "rgl_sn": receiver.teamID
                };

                regulars.push(regular);
            }
            else if (receiver.teamType === Receiver.TemporaryNormalTeam || receiver.teamType === Receiver.TemporaryEmergencyTeam) {
                let temporaries = json["transmissionTemporaries"];

                if (!temporaries) {
                    temporaries = [];
                    json["transmissionTemporaries"] = temporaries;
                }

                const temporary = {
                    "tmpr_sn": receiver.teamID
                };

                temporaries.push(temporary);
            }
        }
    }

    static fromJson(json) {
        const data = new SectionDataInternal();

        data.transmission.title = json.title;
        data.transmission.sms_yn = json.sms_yn;
        data.transmission.brdcst_yn = json.brdcst_yn;
        data.transmission.email_yn = json.email_yn;
        data.transmission.receiverName = json.receiverName;
        data.transmission.atmc_execut_yn = json.atmc_execut_yn;
        data.transmission.mssage = json.mssage;

        SectionDataInternal.toReceivers(data.transmission.receivers, json);

        return data;
    }

    static toReceivers(receivers, json) {
        if (json.transmissionRegulars) {
            for (const regular of json.transmissionRegulars) {
                receivers.push(SectionDataProcess.makeReceiver(regular.rgl_sn, Receiver.RegularTeam));
            }
        }

        if (json.transmissionTemporaries) {
            for (const temporary of json.transmissionTemporaries) {
                receivers.push(SectionDataProcess.makeReceiver(temporary.tmpr_sn, temporary.nor_yn ? Receiver.TemporaryNormalTeam : Receiver.TemporaryEmergencyTeam));
            }
        }
    }

    static getComponentType() {
        return "internal";
    }

    static copyTo(src, trg) {
        console.log(trg);
        console.log(src);
        
        SectionData.copyTo(src, trg);
        trg.transmission.title = src.transmission.title;
        trg.transmission.sms_yn = src.transmission.sms_yn;
        trg.transmission.brdcst_yn = src.transmission.brdcst_yn;
        trg.transmission.email_yn = src.transmission.email_yn;
        trg.transmission.receivers = src.transmission.receivers;
        trg.transmission.receiverName = src.transmission.receiverName;
        trg.transmission.atmc_execut_yn = src.transmission.atmc_execut_yn;
        trg.transmission.mssage = src.transmission.mssage;
    }

    static componentToSectionData(component) {
        const sectionData = new SectionDataInternal();
        return sectionData;
    }
}
