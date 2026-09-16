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

    static makeGetAccountUsers(site_sn) {
        const json = {
            "getAccountUsers":
            {
                site_sn: site_sn
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
            "value": data,
            "key": key,
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

    static makeRequestAllSite() {
        const json = {
        }

        return JSON.stringify(json);
    }

    static makeRequestUserList(searchText, pageNo, pageRowCount, useTeamName, useMemberName, useNickName, useJobLevel, useJobPosition, useGrade, usePhoneNumber, useEmail, siteNo) {
        const json = {
            "searchText": searchText,
            "pageNo": pageNo,
            "pageRowCount": pageRowCount,
            "useTeamName": useTeamName,
            "useMemberName": useMemberName,
            "useNickName": useNickName,
            "useJobLevel": useJobLevel,
            "useJobPosition": useJobPosition,
            "useGrade": useGrade,
            "usePhoneNumber": usePhoneNumber,
            "useEmail": useEmail,
            "siteNo": siteNo
        }

        return JSON.stringify(json);
    }

    static makeRequestGradeList() {
        const json = {
        }

        return JSON.stringify(json);
    }

    static makeUpdateUserInfo(userNo, nickName, grade, memo) {
        const json = {
            "userNo": userNo,
            "nickName": nickName,
            "grade": grade,
            "memo": memo
        }

        return JSON.stringify(json);
    }

    static makeDeleteUser(userNo) {
        const json = {
            "userNo": userNo
        }

        return JSON.stringify(json);
    }

    static makeCreateUser(userID, userNickName, grade, regularMemberNo, memo, siteNo) {
        const json = {
            "userID": userID,
            "nickName": userNickName,
            "grade": grade,
            "regularMemberNo": regularMemberNo,
            "memo": memo,
            "siteNo": siteNo
        }

        return JSON.stringify(json);
    }

    static makeRequestPasswordPolicy() {
        const json = {
        }

        return JSON.stringify(json);
    }

    static makeRequestTemporaryPasswordWithSMS(userName, phoneNumber) {
        const json = {
            "userName": userName,
            "phoneNumber": phoneNumber
        }

        return JSON.stringify(json);
    }

    static makeRequestTemporaryPasswordWithEmail(userName, email) {
        const json = {
            "userName": userName,
            "email": email
        }

        return JSON.stringify(json);
    }

    static makeRequestSaveOptions(userNo, options) {
        const json = {
            "userNo": userNo,
            "options": options
        }

        return JSON.stringify(json);
    }

    static makeRequestOptions(userNo, category, subCategory) {
        const json = {
            "userNo": userNo,
            "category": category,
            "subCategory": subCategory
        }

        return JSON.stringify(json);
    }
}