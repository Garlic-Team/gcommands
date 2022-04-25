"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutocompleteContext = void 0;
const Context_1 = require("./Context");
class AutocompleteContext extends Context_1.Context {
    constructor(client, options) {
        super(client, options);
        this.interaction = options.interaction;
        this.command = options.command;
        this.commandName = options.command.name;
        this.argument = options.argument;
        this.argumentName = options.argument.name;
        this.value = options.value;
        this.respond = options.respond;
        this.type = 'AUTOCOMPLETE';
    }
}
exports.AutocompleteContext = AutocompleteContext;
