export default class JsonManager {

    static makeRequestEquipmentList(searchText) {
        const json = {
            "searchText": searchText
        };

        return JSON.stringify(json);
    }

    static makeRequestInsertEquipment(equipment) {
        const json = {
            "equipment": equipment
        };

        return JSON.stringify(json);
    }

    static makeRequestUpdateEquipment(equipment) {
        const json = {
            "equipment": equipment
        };

        return JSON.stringify(json);
    }

    static makeRequestDeleteEquipment(equipments) {
        const json = {
            "equipments": equipments
        };

        return JSON.stringify(json);
    }
}