import { GghJsonManager } from './gghJsonManager';

export class GghController {
    static async requestNvrList() {

        try {
            const jsonData = GghJsonManager.makeRequestNvrList();

            const res = await fetch('SDMS/GGH/RequestData', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {
                    return [result.nvrList, ""];
                }
                else {
                    return [null, result.message];
                }
            }

        }
        catch (e) {
            //console.log(e);
        }

        return [null, "requestNvrList 실패"];
    }

    static async updateNvrList(nvrList) {

        try {
            const jsonData = GghJsonManager.makeUpdateNvrList(nvrList);

            const res = await fetch('SDMS/GGH/RequestData', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {
                    return [true, ""];
                }
                else {
                    return [false, result.message];
                }
            }

        }
        catch (e) {
            //console.log(e);
        }

        return [false, "updateNvrList 실패"];
    }
}
