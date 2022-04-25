"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttachmentType = void 0;
const discord_js_1 = require("discord.js");
const Argument_1 = require("../Argument");
const base_1 = require("./base");
class AttachmentType extends base_1.MessageArgumentTypeBase {
    validate(attachment) {
        if (attachment instanceof discord_js_1.MessageAttachment) {
            this.value = attachment;
            return true;
        }
        return false;
    }
    resolve(argument) {
        return {
            ...argument.toJSON(),
            type: Argument_1.ArgumentType[argument.type],
            attachment: this.value
        };
    }
}
exports.AttachmentType = AttachmentType;
