export default class SectionDataProcessMission {
    constructor(id, text) {
        this.misn_sn = id;
        this.misn_contents = text;
    }

    static toJson(mission) {
        const json = {
            "misn_sn": mission.misn_sn,
            "misn_contents": mission.misn_contents,
            "compn_sn": -1
        }

        return json;
    }

    static missionsToJson(missions) {
        const json = [];

        for (const mission of missions) {
            json.push(SectionDataProcessMission.toJson(mission));
        }

        return json;
    }
}
