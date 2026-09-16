export class AssessmentController {
    static async LoadQList() {
        try {
            const res = await fetch('SDMS/Assessment/LoadQList', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {
                    return [true, result.qList];
                }
                else {
                    return [false, result.message];
                }
            }
        } catch (e) {
            console.log("ERROR LoadQList : " + e);
            return [false, e.message];
        }
    }

    static async LoadQItem(qID) {
        try {
            const res = await fetch('SDMS/Assessment/LoadQItems', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ "QID": qID })
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {
                    return [true, result.qItems];
                }
                else {
                    return [false, result.message];
                }
            }
        } catch (e) {
            console.log("ERROR LoadQItem : " + e);
            return [false, e.message];
        }
    }

    static async DeleteQ(qID) {
        try {
            const res = await fetch('SDMS/Assessment/DeleteQ', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ "QID": qID })
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {
                    return [true];
                }
                else {
                    return [false, result.message];
                }
            }
        } catch (e) {
            console.log("ERROR DeleteQ : " + e);
            return [false, e.message];
        }
    }

    static async SaveQ(qID, /*title, userID,*/ EqZoneID, memberIDs, qItems, /*isOverWrite*/ type) {
        try {
            const data = {
                "QID": qID,
                //"Title": title,
                //"RegisterUserID": userID,
                "EqZoneID": EqZoneID,
                "MemberIDs": memberIDs,
                "QItemList": qItems,
                //"IsOverWrite": isOverWrite
                "Type": type
            };

            const res = await fetch('SDMS/Assessment/SaveQ', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {
                    return [true, result.saveID, ''];
                }
                else {
                    return [false, -1, result.message];
                }
            }
        } catch (e) {
            console.log("ERROR DeleteQ : " + e);
            return [false, -1, e.message];
        }

        return [false, -1, "SaveQ 실패하였습니다."];
    }

    static async SendEmail(eqZoneID, receiverMemberIDs, title, contents, userID, type) {
        try {
            const data = {
                "EquipmentZoneID": eqZoneID,
                "ReceiverMemberIDs": receiverMemberIDs,
                "Contents": contents,
                "Title": title,
                "SendUserID": userID,
                "Type": type
            };

            const res = await fetch('SDMS/Assessment/SendEmail', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {
                    return [true, ''];
                }
                else {
                    return [false, result.message];
                }
            }
        } catch (e) {
            console.log("ERROR DeleteQ : " + e);
            return [false, e.message];
        }
    }

    static async LoadAssessment(assessmentID, memberID) {
        try {
            const data = {
                "AssessmentID": assessmentID,
                "MemberID": memberID
            };

            const res = await fetch('SDMS/Assessment/LoadAssessment', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {
                    return [true, '', result.assessmentData, result.aList];
                }
                else {
                    return [false, result.message, null, null];
                }
            }
        } catch (e) {
            console.log("ERROR LoadAssessment : " + e);
            return [false, e.message, null, null];
        }
    }

    static async SaveAssessment(assessmentID, memberID, aList) {
        try {
            let aItemDatas = [];
            const length = aList.length;
            for (let i = 0; i < length; i++) {
                aItemDatas.push({
                    "aid": aList[i].id,
                    "score": aList[i].score,
                    "memo": aList[i].memo,
                });                
            }

            const data = {
                "AssessmentID": assessmentID,
                "MemberID": memberID,
                "AItemDatas": aItemDatas
            };

            const res = await fetch('SDMS/Assessment/SaveAssessment', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {
                    return [true, ''];
                }
                else {
                    return [false, result.message, null, null];
                }
            }
        } catch (e) {
            console.log("ERROR SaveAssessment : " + e);
            return [false, e.message];
        }
    }

    static async LoadScoreByZone(zoneID, site_sn) {
        try {
            const data = {
                "ZoneID": zoneID,
                "site_sn": site_sn
            };

            const res = await fetch('SDMS/Assessment/LoadScoreByZone', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {
                    return [result.scoreByZoneDatas, result.message];
                }
                else {
                    return [null, result.message];
                }
            }
        } catch (e) {
            console.log("ERROR LoadAssessment : " + e);
            return [null, e.message];
        }

        return [null, "LoadScoreByZone 실패하였습니다."];
    }

    static async CheckQTitle(title) {
        try {
            const res = await fetch('SDMS/Assessment/CheckQTitle', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ "Title": title })
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {
                    return [result.isCheck, result.qid, ""];
                }
                else {
                    return [null, null, result.message];
                }
            }
        } catch (e) {
            console.log("ERROR DeleteQ : " + e);
            return [null, null, e.message];
        }

        return [null, null, "CheckQTitle 실패하였습니다."];
    }

    static async LoadAssessmentClass(site_sn) {
        try {
            const res = await fetch('SDMS/Assessment/LoadAssessmentClass', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ "site_sn": site_sn })
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {
                    return [result.assessmentClasses, null];
                }
                else {
                    return [null, result.message];
                }
            }
        } catch (e) {
            console.log("ERROR LoadAssessmentClass : " + e);
            return [false, e.message];
        }
    }

    static async SaveAssessmentClass(classData) {
        try {
            const res = await fetch('SDMS/Assessment/SaveAssessmentClass', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(classData)
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {
                    return [result.success, null];
                }
                else {
                    return [result.success, result.message];
                }
            }
        } catch (e) {
            console.log("ERROR SaveAssessmentClass : " + e);
            return [false, e.message];
        }
    }

    static async LoadEquipZoneQItem(equipZoneID, type) {
        try {
            const res = await fetch('SDMS/Assessment/LoadEquipZoneQItems', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ "EquipZoneID": equipZoneID, "Type": type })
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {
                    return [true, result.assessmentQ, result.qItems];
                }
                else {
                    return [false, result.message, null];
                }
            }
        } catch (e) {
            console.log("ERROR LoadEquipZoneQItem : " + e);
            return [false, e.message, null];
        }

        return [false, "ERROR LoadEquipZoneQItem", null];
    }

    static async SaveQList(qList) {
        try {
            const data = {
                "Qlist": qList,
            };

            const res = await fetch('SDMS/Assessment/SaveQlist', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {
                    return [true, ''];
                }
                else {
                    return [false, result.message];
                }
            }
        } catch (e) {
            console.log("ERROR SaveQList : " + e);
            return [false, e.message];
        }

        return [false, "SaveQList 실패하였습니다."];
    }

    static async LoadAutoAssessment(site_sn) {
        try {
            const res = await fetch('SDMS/Assessment/LoadAutoAssessment', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ "site_sn": site_sn })
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {
                    return [true, result.type, result.date];
                }
                else {
                    return [false, result.message, null];
                }
            }
        } catch (e) {
            console.log("ERROR LoadAutoAssessment : " + e);
            return [false, e.message, null];
        }

        return [false, "LoadAutoAssessment 실패하였습니다.", null];
    }

    static async SetAutoAssessment(site_sn, type, date) {
        try {
            const res = await fetch('SDMS/Assessment/SetAutoAssessment', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ "site_sn": site_sn, "Type": type, "Date": date })
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
        } catch (e) {
            console.log("ERROR SetAutoAssessment : " + e);
            return [false, e.message];
        }

        return [false, "SetAutoAssessment 실패하였습니다."];
    }

    static async SetQList(type, qItems) {
        try {
            const res = await fetch('SDMS/Assessment/SetQList', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ "Type": type, "QItems": qItems })
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
        } catch (e) {
            console.log("ERROR SetQList : " + e);
            return [false, e.message];
        }

        return [false, "SetQList 실패하였습니다."];
    }
}