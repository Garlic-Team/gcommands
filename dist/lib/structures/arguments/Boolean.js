"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BooleanType = void 0;
const Argument_1 = require("../Argument");
const base_1 = require("./base");
const truthy = new Set(['true', 't', 'yes', 'y', 'on', 'enable', 'enabled', '1', '+']);
const falsy = new Set(['false', 'f', 'no', 'n', 'off', 'disable', 'disabled', '0', '-']);
class BooleanType extends base_1.MessageArgumentTypeBase {
    validate(content) {
        const yes = truthy.has(content?.toLowerCase());
        const no = falsy.has(content?.toLowerCase());
        if (!yes && !no)
            return false;
        else {
            this.value = yes ? true : false;
            return true;
        }
    }
    resolve(argument) {
        return {
            ...argument.toJSON(),
            type: Argument_1.ArgumentType[argument.type],
            value: this.value
        };
    }
}
exports.BooleanType = BooleanType;
