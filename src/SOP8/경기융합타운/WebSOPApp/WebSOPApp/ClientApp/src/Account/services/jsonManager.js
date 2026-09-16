export class JsonManager {
    static makeUserLogin(data, key, isFullVersion) {
        const json = {
            "value": data,
            "key": key
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


    static makeGetAccountLevels() {
        const json = {
            "getAccountLevels": true
        }

        return JSON.stringify(json);
    }

    static makeGetAccountUsers(siteNo) {
        const json = {
            "getAccountUsers":
            {
                siteNo: siteNo
            }
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

    static makeCheckBrowserID(userID, sessionKey) {
        const json = {
            "requestCheckBrowserID":
            {
                "userID": userID,
                "sessionKey": sessionKey,
            }
        }
        return JSON.stringify(json);
    }

    static makeCheckAutoLogin() {
        const json = {
            "checkAutoLogin": true
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
}