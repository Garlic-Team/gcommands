"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NumberType = void 0;
const Argument_1 = require("../Argument");
const base_1 = require("./base");
class NumberType extends base_1.MessageArgumentTypeBase {
    validate(content) {
        if (!isNaN(Number(content))) {
            this.value = content;
            return true;
        }
        else
            return false;
    }
    resolve(argument) {
        return {
            ...argument.toJSON(),
            type: Argument_1.ArgumentType[argument.type],
            value: this.value
        };
    }
}
exports.NumberType = NumberType;
