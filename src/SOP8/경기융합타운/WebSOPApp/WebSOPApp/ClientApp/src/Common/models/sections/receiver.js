export default class Receiver {
    static None = -1;
    static TemporaryNormalTeam  = 0;
    static TemporaryEmergencyTeam = 1;
    static RegularTeam = 2;    

    constructor() {
        this.teamType = Receiver.None;
        this.teamName = null;
        this.includeChildTeams = true;
    }

    static copyTo(src, trg) {
        trg.teamType = src.teamType;
        trg.team = src.team;
        trg.includeChildTeams = src.includeChildTeams;
        trg.name = src.name;
    }

    /*static listToJsonArray(receivers) {
        const arr = [];

        if (!receivers) {
            return arr;
        }

        const count = receivers.length;

        for (let i = 0; i < count; i++) {
            const receiver = receivers[i];

            if (receiver.teamName && receiver.teamName.length > 0) {
                arr.push(receiver.teamType + "_" + receiver.teamName);
            }
        }

        return arr;
    }*/
}