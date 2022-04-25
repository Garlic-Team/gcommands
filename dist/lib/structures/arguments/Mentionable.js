"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MentionableType = void 0;
const regexes_1 = require("../../util/regexes");
const Argument_1 = require("../Argument");
const base_1 = require("./base");
class MentionableType extends base_1.MessageArgumentTypeBase {
    constructor(guild) {
        super();
        this.client = guild.client;
        this.guild = guild;
    }
    validate(content) {
        const matches = regexes_1.mentionableRegexp.exec(content);
        if (!matches || (!this.guild.roles.cache.get(matches?.[1]) && !this.client.users.cache.get(matches?.[1])))
            return false;
        this.value = matches[1];
        return true;
    }
    resolve(argument) {
        return {
            ...argument.toJSON(),
            type: Argument_1.ArgumentType[argument.type],
            user: this.client.users.cache.get(this.value),
            member: this.guild.members.cache.get(this.value),
            roles: this.guild.roles.cache.get(this.value),
        };
    }
}
exports.MentionableType = MentionableType;
