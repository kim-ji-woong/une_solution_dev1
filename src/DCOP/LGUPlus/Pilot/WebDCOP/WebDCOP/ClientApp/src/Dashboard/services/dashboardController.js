import ProjectResource from "../../Root/resource/id";
import { JsonManager } from "./jsonManager";

export class DashboardController {
    static async requestDataCenterList() {
        try {
            const jsonData = JsonManager.makeRequestDataCenterList();

            const res = await fetch(ProjectResource.baseUrl + '/api/Main/RequestDataCenterList', {
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
                    return [result.datas, result.message];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, "requestDataCenterList 호출에 실패하였습니다."];
    }
}
