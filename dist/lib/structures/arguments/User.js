"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserType = void 0;
const regexes_1 = require("../../util/regexes");
const Argument_1 = require("../Argument");
const base_1 = require("./base");
class UserType extends base_1.MessageArgumentTypeBase {
    constructor(guild) {
        super();
        this.client = guild.client;
        this.guild = guild;
    }
    validate(content) {
        const matches = regexes_1.userRegexp.exec(content);
        if (!matches || !this.client.users.cache.get(matches?.[1]))
            return false;
        this.value = matches[1];
        return true;
    }
    resolve(argument) {
        return {
            ...argument.toJSON(),
            type: Argument_1.ArgumentType[argument.type],
            user: this.client.users.cache.get(this.value),
            member: this.guild.members.cache.get(this.value)
        };
    }
}
exports.UserType = UserType;
