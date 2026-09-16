import CryptoJS from 'crypto-js';
import sha256 from 'crypto-js/sha256';
import { JsonManager } from './jsonManager';

import AccountStore from '../accountStore';
import AccountResource from '../resource/id';

import ProjectResource from '../../Root/resource/id';

export class AccountController {
    static logoutMsgChk = false;
    static loading3DChk = false;

    static StartWatchTimer() {
        // 타이머 실행 유무 판단
        if (this.timerCheck)
            return false;

        // 타이머 실행 체크
        this.timerCheck = true;

        let timerLogin = setTimeout(async function tick() {
            await AccountController.WatchLoginCheck();
            timerLogin = setTimeout(tick, 5000);
        }, 5000);

        return true;
    }

    static async WatchLoginCheck() {
        const user = await ProjectResource.initUserInfo();

        if (user !== null && user !== undefined) {
            if (user.sessionKey === null || user.sessionKey === undefined) {
                let path = window.location.pathname;
                if (path !== ProjectResource.path.root/* && path !== ProjectResource.path.setPassword*/) {
                    ProjectResource.setLoginUser(null);
                    AccountStore.dispatch({ type: 'LOGIN_STATE', loginState: AccountResource.loginState.false, message: "로그아웃 되었습니다." });
                }

                return;
            }

            const userNo = user.no;
            const sessionKey = user.sessionKey;

            const [result, message, userData] = await AccountController.checkLoginSession(userNo, sessionKey);

            if (result === AccountResource.loginState.login) {
                // 세션이 유효

                // 계정 리덕스에 상태 업데이트
                AccountStore.dispatch({ type: 'LOGIN_STATE', loginState: result, message: message });

                if (this.isNotFirst !== true) {  // 브라우저 첫 접속 시, 세션(계정 및 옵션) 업데이트
                    console.log("WatchLoginCheck is First Connect");
                    this.isNotFirst = true;
                    ProjectResource.setLoginUser(userData);
                    AccountStore.dispatch({ type: 'UPDATE_INFO', user: userData });
                }
                else if (user.levelID !== userData.levelID || user.nickName !== userData.nickName) { // 계정정보 변경 체크
                    ProjectResource.setLoginUser(userData);
                    AccountStore.dispatch({ type: 'UPDATE_INFO', user: userData });
                }

            }
            /*else if (result === AccountResource.loginState.licenseWait ||
                result === AccountResource.loginState.licenseExpired) {
                // 세션이 유효

                // 계정 리덕스에 상태 업데이트
                AccountStore.dispatch({ type: 'LOGIN_STATE', loginState: result, message: message });

                if (this.isNotFirst !== true) {  // 브라우저 첫 접속 시, 세션(계정 및 옵션) 업데이트
                    console.log("WatchLoginCheck is First Connect");
                    this.isNotFirst = true;
                    ProjectResource.setLoginUser(userData);
                    AccountStore.dispatch({ type: 'UPDATE_INFO', user: userData });
                }
                else if (user.levelID !== userData.levelID || user.nickName !== userData.nickName) { // 계정정보 변경 체크
                    ProjectResource.setLoginUser(userData);
                    AccountStore.dispatch({ type: 'UPDATE_INFO', user: userData });
                }
            }*/
            else {
                if (result === AccountResource.loginState.logout ||
                    result === AccountResource.loginState.false ||
                    result === AccountResource.loginState.disconnected) {
                    ProjectResource.setLoginUser(null);
                }

                // 계정 리덕스에 상태 업데이트
                AccountStore.dispatch({ type: 'LOGIN_STATE', loginState: result, message: message });
            }
        } else {
            let path = window.location.pathname;
            if (path !== ProjectResource.path.root/* && path !== ProjectResource.path.setPassword*/) {
                ProjectResource.setLoginUser(null);
                AccountStore.dispatch({ type: 'LOGIN_STATE', loginState: AccountResource.loginState.false, message: "로그아웃 되었습니다." });
            }
        }
    }

    static async checkLoginSession(userNo, sessionKey) {
        try {
            const jsonData = JsonManager.makeCheckLoginSession(userNo, sessionKey);

            const res = await fetch(ProjectResource.baseUrl + '/api/Account/CheckLoginSession', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();
                AccountController.loading3DChk = false;

                if (result.success) {
                    return [AccountResource.loginState.login, result.message, result.user];
                }
                else {
                    return [AccountResource.loginState.false, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);

            if (AccountController.loading3DChk === false) {
                let message = "서버와 연결이 끊어졌습니다.";

                return [AccountResource.loginState.disconnected, message];
            }

        }

        // 요청 중에 페이지 이동 시 응답을 받지 못하는 경우가 발생할 수 있음. 
        return [AccountResource.loginState.login, "checkLoginSession 실패하였습니다."];
    }

    static falseResult(message) {
        const result = {
            success: false,
            message: message
        }

        return result;
    }

    static async login(id, pw) {
        const loginKeyResult = await AccountController.requestLoginKey(id);

        if (loginKeyResult === null) {
            return AccountController.falseResult("로그인 과정을 진행할 수 없습니다.");
        }

        if (loginKeyResult.externalLogin) {
            return await AccountController.externalLogin(id, pw);
        }

        if (loginKeyResult.success === false) {
            return AccountController.falseResult(loginKeyResult.message);
        }

        const key = loginKeyResult.loginKey;
        const salt = loginKeyResult.externalLogin ? "" : loginKeyResult.salt;

        try {
            const pwHash = sha256(pw + salt);
            const strEnc = AccountController.encrypt(id + "|" + pwHash, key);
            const jsonData = JsonManager.makeUserLogin(strEnc, key);

            const res = await fetch(ProjectResource.baseUrl + '/api/Account/Login', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success === true) {
                    if (result.user?.options && typeof (result.user.options) === 'string') {
                        result.user.options = JSON.parse(result.user.options);
                    }
                }

                return result;
            } else {
                let result = {};
                result.success = false;
                result.message = "Account Controller 페이지를 찾을 수 없습니다. 네트워크를 확인해주세요.";

                return result;
            }
        }
        catch (e) {
            console.log(e);
        }

        return AccountController.falseResult("로그인에 실패하였습니다.");
    }

    static async logout() {
        try {
            const jsonData = JsonManager.makeUserLogout();

            const res = await fetch(ProjectResource.baseUrl + '/api/Account/Logout', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();
                return result;
            } else {
                let result = {};
                result.success = false;
                result.message = "Account Controller 페이지를 찾을 수 없습니다. 네트워크를 확인해주세요.";

                return result;
            }
        }
        catch (e) {
            console.log(e);
        }

        return AccountController.falseResult("로그아웃에 실패하였습니다.");
    }

    static async externalLogin(id, pw) {
        const key = await AccountController.getLoginKey();

        if (!key)
            return AccountController.falseResult("로그인에 실패하였습니다.");;

        try {
            const pwHash = sha256(pw);
            const strEnc = AccountController.encrypt(id + "|" + pwHash, key);
            const jsonData = JsonManager.makeUserLogin(strEnc, key);

            const res = await fetch(ProjectResource.baseUrl + '/api/Account/Login', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();
                return result;
            }
        }
        catch (e) {
            console.log(e);
        }

        return AccountController.falseResult("로그인에 실패하였습니다.");;
    }

    static async getLoginKey() {
        const now = new Date();
        const ticks = now.getTime();

        let key = null;

        try {
            const res = await fetch(ProjectResource.baseUrl + '/api/Account/GetLoginKey?num=' + ticks);
            key = await res.text();
        }
        catch (e) {
            console.log(e);
        }

        return key;
    }

    static async requestLoginKey(userID) {
        const now = new Date();
        const ticks = now.getTime();

        try {
            const jsonData = JsonManager.makeRequestLoginKey(ticks, userID);

            const res = await fetch(ProjectResource.baseUrl + '/api/Account/RequestLoginKey', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();
                return result;
            }
        }
        catch (e) {
            console.log(e);
        }

        return null;
    }

    static async requestLoginKey2(name, data, mode) {
        const now = new Date();
        const ticks = now.getTime();

        try {
            const jsonData = JsonManager.makeRequestLoginKey2(ticks, name, data, mode);

            const res = await fetch(ProjectResource.baseUrl + '/api/Account/RequestData', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();
                return result;
            }
        }
        catch (e) {
            console.log(e);
        }

        return null;
    }

    static async requestAccountLevels(userNo) {
        try {
            const jsonData = JsonManager.makeRequestAccountLevels(userNo);

            const res = await fetch(ProjectResource.baseUrl + '/api/Account/RequestAccountLevels', {
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
                    return [result.levels, ""];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, "사용자 권한조회에 실패하였습니다."];
    }

    static async requestAccountLevels2(userNo) {
        try {
            const jsonData = JsonManager.makeRequestAccountLevels2(userNo);

            const res = await fetch(ProjectResource.baseUrl + '/api/Account/RequestAccountLevels2', {
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
                    return [result.levels, ""];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, "사용자 권한조회에 실패하였습니다."];
    }

    static encrypt(str, KEY) {
        const IV = KEY.substring(0, 16);
        const key = CryptoJS.enc.Utf8.parse(KEY);
        const iv = CryptoJS.enc.Utf8.parse(IV);

        const srcs = CryptoJS.enc.Utf8.parse(str);
        const encrypted = CryptoJS.AES.encrypt(srcs, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });

        return encrypted.ciphertext.toString();
    }
}