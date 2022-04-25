"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Context = void 0;
class Context {
    constructor(client, options) {
        this.client = client;
        this.channel = options.channel;
        this.channelId = options.channel.id;
        this.createdAt = options.createdAt;
        this.createdTimestamp = options.createdTimestamp;
        this.guild = options.guild;
        this.guildId = options.guildId;
        this.member = options.member;
        this.user = options.user;
        this.userId = options.user.id;
        this.memberPermissions = options.memberPermissions;
    }
    inGuild() {
        return Boolean(this.guildId && this.member);
    }
    inCachedGuild() {
        return Boolean(this.guild && this.member);
    }
    inRawGuild() {
        return Boolean(this.guildId && !this.guild && this.member);
    }
    isCommand() {
        return Boolean(this.type === 'COMMAND');
    }
    isAutocomplete() {
        return Boolean(this.type === 'AUTOCOMPLETE');
    }
    isComponent() {
        return Boolean(this.type === 'BUTTON' || this.type === 'SELECT_MENU');
    }
    isButton() {
        return Boolean(this.type === 'BUTTON');
    }
    isSelectMenu() {
        return Boolean(this.type === 'SELECT_MENU');
    }
}
exports.Context = Context;
