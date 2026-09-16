import JsonManager from "./jsonManager";

export class EquipmentController {

    // 장비 타입 리스트 가져오기
    static async requestEquipmentType() {
        try {
            const res = await fetch('Equipment/RequestEquipmentType', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {
                    return [result.equipmentTypes, ""];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e.message);
        }

        return [null, "requestEquipmentType 실패"];
    }

    // 상위 장비 리스트 가져오기
    static async requestParentItemList () {
        try {
            const res = await fetch('Equipment/RequestParentItemList', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {
                    return [result.parentList, ""];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e.message);
        }

        return [null, "requestParentItemList 실패"];
    }

    // tps실 리스트 가져오기
    static async requestTpsList () {
        try {
            const res = await fetch('Equipment/RequestTpsList', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {
                    return [result.tpsList, ""];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e.message);
        }

        return [null, "requestTpsList 실패"];
    }

    // 상위 장비 목록 가져오기
    static async requestParentEquipmentList(searchText = null) {
        try {
            const res = await fetch('Equipment/RequestParentEquipmentList', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JsonManager.makeRequestEquipmentList(searchText)
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {
                    return [result.equipmentList, ""];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e.message);
        }

        return [null, "requestEquipmentList 실패"];
    }

    // 하위 장비 목록 가져오기
    static async requestEquipmentList(searchText = null) {
        try {
            const res = await fetch('Equipment/RequestEquipmentList', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JsonManager.makeRequestEquipmentList(searchText)
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {
                    return [result.equipmentList, ""];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e.message);
        }

        return [null, "requestEquipmentList 실패"];
    }

    // 상위 장비 추가
    static async requestInsertParentEquipment(equipment) {
        try {
            const res = await fetch('Equipment/RequestInsertParentEquipment', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JsonManager.makeRequestInsertEquipment(equipment)
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {
                    return [result.success, result.equipment, ""];
                }
                else {
                    return [false, null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e.message);
        }

        return [null, null, "requestInsertParentEquipment 실패"];
    }

    // 하위 장비 추가
    static async requestInsertEquipment(equipment) {
        try {
            const res = await fetch('Equipment/RequestInsertEquipment', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JsonManager.makeRequestInsertEquipment(equipment)
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {
                    return [result.success, result.equipment, ""];
                }
                else {
                    return [false, null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e.message);
        }

        return [null, null, "requestInsertEquipment 실패"];
    }

    // 상위 장비 수정
    static async requestUpdateParentEquipment(equipment) {
        try {
            const res = await fetch('Equipment/RequestUpdateParentEquipment', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JsonManager.makeRequestUpdateEquipment(equipment)
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {
                    return [result.success, ""];
                }
                else {
                    return [false, result.message];
                }
            }
        }
        catch (e) {
            console.log(e.message);
        }

        return [null, "requestUpdateParentEquipment 실패"];
    }

    // 하위 장비 수정
    static async requestUpdateEquipment(equipment) {
        try {
            const res = await fetch('Equipment/RequestUpdateEquipment', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JsonManager.makeRequestUpdateEquipment(equipment)
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {
                    return [result.success, "", result.equipment];
                }
                else {
                    return [false, result.message, null];
                }
            }
        }
        catch (e) {
            console.log(e.message);
        }

        return [null, "requestUpdateEquipment 실패", null];
    }

    // 상위 장비 삭제
    static async requestDeleteParentEquipment(equipments) {
        try {
            const res = await fetch('Equipment/RequestDeleteParentEquipment', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JsonManager.makeRequestDeleteEquipment(equipments)
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {
                    return [result.success, ""];
                }
                else {
                    return [false, result.message];
                }
            }
        }
        catch (e) {
            console.log(e.message);
        }

        return [null, "requestDeleteParentEquipment 실패"];
    }

    // 하위 장비 삭제
    static async requestDeleteEquipment(equipments) {
        try {
            const res = await fetch('Equipment/RequestDeleteEquipment', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JsonManager.makeRequestDeleteEquipment(equipments)
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {
                    return [result.success, ""];
                }
                else {
                    return [false, result.message];
                }
            }
        }
        catch (e) {
            console.log(e.message);
        }

        return [null, "requestDeleteEquipment 실패"];
    }


    // 기능 삭제로 주석처리
    // static async downloadExcelEquipments() {
    //     try {
    //         const res = await fetch('Equipment/DownloadExcelEquipments', {
    //             method: 'POST',
    //             headers: {
    //                 'Accept': 'application/json',
    //                 'Content-Type': 'application/json'
    //             },
    //         });

    //         if (res.ok) {
    //             if (res.headers.get('content-type') === 'application/vnd.ms-excel') {
    //                 await EquipmentController.downloadFile(res);
    //                 return [true, ""];
    //             }
    //             else {
    //                 const result = await res.json();

    //                 if (result.success) {
    //                     return [result.success, ""];
    //                 }
    //                 else {
    //                     return [null, result.message];
    //                 }
    //             }
    //         }
    //     }
    //     catch (e) {
    //         console.log(e.message);
    //     }

    //     return [null, "downloadExcelEquipments 실패"];
    // }

    // static async downloadFile(response) {
    //     const fileName = EquipmentController.getFileName(response);

    //     if (fileName.length === 0) {
    //         return;
    //     }

    //     const blob = await response.blob();
    //     const newBlob = new Blob([blob]);

    //     const blobUrl = window.URL.createObjectURL(newBlob);

    //     const link = document.createElement('a');
    //     link.href = blobUrl;
    //     link.setAttribute('download', fileName);
    //     document.body.appendChild(link);
    //     link.click();
    //     link.parentNode.removeChild(link);

    //     window.URL.revokeObjectURL(blob);
    // }

    // static getFileName(response) {
    //     const result = response.headers.get('content-disposition');
    //     const tokens = result.split(';');

    //     const tokenCount = tokens.length;

    //     for (let i = 0; i < tokenCount; i++) {
    //         const token = tokens[i].trim();
    //         const index = token.indexOf('=');

    //         if (index > 0) {
    //             const key = token.substring(0, index).trim();
    //             const value = token.substring(index + 1).trim();

    //             if (key === 'filename*') {
    //                 const index2 = value.indexOf("''");

    //                 if (index2 >= 0) {
    //                     const uri = value.substring(index2 + 2).trim();
    //                     return decodeURI(uri);
    //                 }
    //             }
    //         }
    //     }

    //     return "";
    // }
}