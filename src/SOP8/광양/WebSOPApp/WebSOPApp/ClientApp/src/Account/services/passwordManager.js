export class PasswordManager {
    static checkValidPassword(password, passwordPolicy) {
        const [success1, message1] = PasswordManager.checkLength(password, passwordPolicy.minimumLength, passwordPolicy.maximumLength);

        if (success1 === false) {
            return [success1, message1];
        }

        const [success2, message2] = PasswordManager.checkCharacters(password, passwordPolicy.needCharacter, passwordPolicy.allowCharacters);

        if (success2 === false) {
            return [success2, message2];
        }

        const [success3, message3] = PasswordManager.checkNumber(password, passwordPolicy.needNumber);

        if (success3 === false) {
            return [success3, message3];
        }

        const [success4, message4] = PasswordManager.checkLowerCase(password, passwordPolicy.needLowerCase);

        if (success4 === false) {
            return [success4, message4];
        }

        const [success5, message5] = PasswordManager.checkUpperCase(password, passwordPolicy.needUpperCase);

        if (success5 === false) {
            return [success5, message5];
        }

        return [true, ""];
    }

    static checkUpperCase(password, needUpperCase) {
        if (needUpperCase === false)
            return [true, ""];

        let len = password.length;

        for (let i = 0; i < len; i++) {
            const ch = password[i];

            if (ch >= 'A' && ch <= 'Z') {
                return [true, ""];
            }
        }

        return [false, "알파벳 대문자가 적어도 하나 이상 존재하여야만 합니다."];
    }

    static checkLowerCase(password, needLowerCase) {
        if (needLowerCase === false)
            return [true, ""];

        let len = password.length;

        for (let i = 0; i < len; i++)
        {
            const ch = password[i];

            if (ch >= 'a' && ch <= 'z') {
                return [true, ""];
            }
        }

        return [false, "알파벳 소문자가 적어도 하나 이상 존재하여야만 합니다."];
    }

    static checkNumber(password, needNumber) {
        if (needNumber === false) {
            return [true, ""];
        }

        const len = password.length;

        for (let i = 0; i < len; i++)
        {
            const ch = password[i];

            if (ch >= '0' && ch <= '9') {
                return [true, ""];
            }
        }

        return [false, "숫자가 적어도 하나 이상 존재하여야만 합니다."];
    }

    static checkCharacters(password, needCharacter, allowCharacters) {
        /*if (needCharacter === false) {
            return [true, ""];
        }*/

        if (allowCharacters == null) {
            return [false, "허용 가능한 특수문자의 목록을 알수 없습니다."];
        }

        let findCharacters = false;
        const len = password.length;

        for (let i = 0; i < len; i++)
        {
            const ch = password[i];

            if (ch >= '0' && ch <= '9') {
                continue;
            }
            else if (ch >= 'A' && ch <= 'Z') {
                continue;
            }
            else if (ch >= 'a' && ch <= 'z') {
                continue;
            }
            else {
                if (allowCharacters.includes(ch) === false) {
                    return [false, `'${ch}'는 허용되지 않는 특수문자 입니다.\n입력 가능한 특수문자의 종류는 다음과 같습니다.\n"${PasswordManager.getCharacters(allowCharacters)}"`];
                }
                else {
                    findCharacters = true;
                }
            }
        }

        if (findCharacters === false && needCharacter === true) {
            return [false, "특수문자가 적어도 하나 이상 존재하여야만 합니다."];
        }

        return [true, ""];
    }

    static getCharacters(allowCharacters) {
        let characters = "";

        for (const ch of allowCharacters)
        {
            characters += ch.toString();
        }

        return characters;
    }

    static checkLength(password, minimumLength, maximumLength) {
        if (minimumLength === null && maximumLength === null) {
            return [true, ""];
        }

        if (minimumLength !== null && password.length < minimumLength) {
            return [false, "비밀번호는 최소 " + minimumLength + "글자 이상이어야만 합니다."];
        }

        if (maximumLength !== null && password.length > maximumLength) {
            return [false, "비밀번호는 최대 " + maximumLength + "글자 까지만 허용합니다."];
        }

        return [true, ""];
    }
}