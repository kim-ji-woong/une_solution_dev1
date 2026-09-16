export class GghJsonManager {
    static makeRequestNvrList() {
        const json = {
            "requestNvrList": true
        };

        return JSON.stringify(json);
    }

    static makeUpdateNvrList(nvrList) {
        const json = {
            "requestUpdateNvrList": {
                "updateList": nvrList
            }
        };

        return JSON.stringify(json);
    }
}
