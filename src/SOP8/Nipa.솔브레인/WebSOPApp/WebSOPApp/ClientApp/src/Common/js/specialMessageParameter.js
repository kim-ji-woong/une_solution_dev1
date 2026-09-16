export default class SpecialMessageParameter
{
    constructor() {
        this.message = "";
        this.location = "";
        this.isRealMode = null;
        this.isNormalMode = null;
        this.variables = [];

        this.setCurrentTime();
    }

    setCurrentTime() {
        const now = new Date();
        this.time = now.getFullYear() + "-" + this.getDoubleString(now.getMonth() + 1) + "-" + this.getDoubleString(now.getDate()) + " " + this.getDoubleString(now.getHours()) + ":" + this.getDoubleString(now.getMinutes()) + ":" + this.getDoubleString(now.getSeconds());
    }

    getDoubleString(num) {
        if (num < 10) {
            return "0" + num;
        }

        return num;
    }

    addVariable(key, value) {
        this.variables.push(key + ";" + value);
    }

    toJson() {
        const json = {};

        if (this.message && this.message.length > 0) {
            json.message = this.message;
        }

        if (this.time && this.time.length > 0) {
            json.time = this.time;
        }

        if (this.location && this.location.length > 0) {
            json.location = this.location;
        }

        if (this.isRealMode !== null && this.isRealMode !== undefined) {
            json.isRealMode = this.isRealMode;
        }

        if (this.isNormalMode !== null && this.isNormalMode !== undefined) {
            json.isNormalMode = this.isNormalMode;
        }

        json.variables = [];
        const variableCount = this.variables.length;

        for (let i = 0; i < variableCount; i++) {
            const variable = this.variables[i];
            json.variables.push(variable);
        }

        return json;
    }
}

