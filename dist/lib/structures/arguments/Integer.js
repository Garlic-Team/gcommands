"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegerType = void 0;
const Argument_1 = require("../Argument");
const base_1 = require("./base");
class IntegerType extends base_1.MessageArgumentTypeBase {
    validate(content) {
        if (Number.isInteger(Number(content))) {
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
exports.IntegerType = IntegerType;
