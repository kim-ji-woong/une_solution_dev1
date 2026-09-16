export class JsonManager {
    static makeUserLogin(data, key) {
        const json = {
            "value": data,
            "key": key
        }

        return JSON.stringify(json);
    }

    static makeUserLogout() {
        const json = {
        }

        return JSON.stringify(json);
    }

    static makeUpdateAccountUser(accountUser, accessedUserID) {
        const json = {
            "updateAccountUsers":
            {
                "AccountUsers": accountUser,
                "AccessedUserID": accessedUserID
            }
        }

        return JSON.stringify(json);
    }

    static makeRemoveAccountUsers(accountUser) {
        const json = {
            "removeAccountUsers": accountUser
        }

        return JSON.stringify(json);
    }

    static makeReRegisterAccountUsers(accountUser) {
        const json = {
            "reRegisterAccountUsers": accountUser
        }

        return JSON.stringify(json);
    }

    static makeGetAccountUsers() {
        const json = {
            "getAccountUsers": true
        }

        return JSON.stringify(json);
    }

    static makeChangePassword(name, data, value, key, mode) {
        const json = {
            "changePassword":
            {
                "name": name,
                "data": data,
                "value": value,
                "key": key,
                "mode": mode,
            },
        }

        return JSON.stringify(json);
    }

    static makeCheckParamsCode(code) {
        const json = {
            "checkParamsCode":
            {
                "code": code,
            },
        }

        return JSON.stringify(json);
    }

    static makeSetPassword(data, key) {
        const json = {
            "setPassword":
            {
                "value": data,
                "key": key,
            },
        }

        return JSON.stringify(json);
    }

    static makeCheckLoginSession(userNo, sessionKey) {
        const json = {
            "userNo": userNo,
            "sessionKey": sessionKey,
        }

        return JSON.stringify(json);
    }

    static makeAutoLogin(beginCode, key) {
        const json = {
            "autoLogin":
            {
                "beginCode": beginCode,
                "key": key
            }
        }

        return JSON.stringify(json);
    }

    static makeRequestLoginKey(num, userID) {
        const json = {
            "num": num,
            "userID": userID
        }

        return JSON.stringify(json);
    }

    static makeRequestLoginKey2(num, name, data, mode) {
        const json = {
            "requestLoginKey":
            {
                "num": num,
                "name": name,
                "data": data,
                "mode": mode
            }
        }

        return JSON.stringify(json);
    }

    static makeRequestAccountLevels(userNo) {
        const json = {
            "userNo": userNo
        }

        return JSON.stringify(json);
    }

    static makeRequestAccountLevels2(userNo) {
        const json = {
            "userNo": userNo
        }

        return JSON.stringify(json);
    }

    static makeRequestSearchUserList(siteID, userID, levelID) {
        const json = {
            "requestSearchUserList": {
                "siteID": siteID,
                "userID": userID,
                "levelID": levelID
            }
        }

        return JSON.stringify(json);
    }

    static makeRequestRemoveUserList(userIDs) {
        const json = {
            "requestRemoveAccountUsers": {
                "userIDs": userIDs
            }
        }

        return JSON.stringify(json);
    }

    static makeRequestUpdateAccountUsers2(updateUserDatas) {
        const json = {
            "requestUpdateAccountUsers2": {
                "updateUserDatas": updateUserDatas
            }
        }

        return JSON.stringify(json);
    }

    static makeRequestSiteDataCenters(siteID, userID) {
        const json = {
            "requestSiteDataCenters": {
                "siteID": siteID,
                "userID": userID
            }
        }

        return JSON.stringify(json);
    }

    static makeRequestValidUserID(userID) {
        const json = {
            "requestValidUserID": {
                "userID": userID
            }
        }

        return JSON.stringify(json);
    }

    static makeRequestNewUser(siteID, levelID, userID, companyName, nickName, password, dataCenterIDs, memo) {
        const json = {
            "requestNewUser": {
                "siteID": siteID,
                "levelID": levelID,
                "userID": userID,
                "companyName": companyName,
                "nickName": nickName,
                "password": password,
                "dataCenterIDs": dataCenterIDs,
                "memo": memo
            }
        }

        return JSON.stringify(json);
    }

    static makeRequestUserInfo(userID) {
        const json = {
            "requestUserInfo": {
                "userID": userID
            }
        }

        return JSON.stringify(json);
    }
}