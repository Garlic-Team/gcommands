"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleType = void 0;
const regexes_1 = require("../../util/regexes");
const Argument_1 = require("../Argument");
const base_1 = require("./base");
class RoleType extends base_1.MessageArgumentTypeBase {
    constructor(guild) {
        super();
        this.guild = guild;
    }
    validate(content) {
        const matches = regexes_1.roleRegexp.exec(content);
        if (!matches || !this.guild.roles.cache.get(matches?.[1]))
            return false;
        this.value = matches[1];
        return true;
    }
    resolve(argument) {
        return {
            ...argument.toJSON(),
            type: Argument_1.ArgumentType[argument.type],
            channel: this.guild.roles.cache.get(this.value)
        };
    }
}
exports.RoleType = RoleType;
