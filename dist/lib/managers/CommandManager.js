"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Commands = exports.CommandManager = void 0;
const discord_js_1 = require("discord.js");
const Command_1 = require("../structures/Command");
const Logger_1 = require("../util/logger/Logger");
const Container_1 = require("../structures/Container");
class CommandManager extends discord_js_1.Collection {
    register(command) {
        if (command instanceof Command_1.Command) {
            if (this.has(command.name) && !this.get(command.name)?.reloading)
                Logger_1.Logger.warn('Overriding command', command.name);
            if (Container_1.container.client)
                command.load();
            this.set(command.name, command);
            Logger_1.Logger.emit(Logger_1.Events.COMMAND_REGISTERED, command);
            Logger_1.Logger.debug('Registered command', command.name);
        }
        else
            Logger_1.Logger.warn('Command must be a instance of Command');
        return this;
    }
    unregister(commandName) {
        const command = this.get(commandName);
        if (command) {
            this.delete(commandName);
            Logger_1.Logger.emit(Logger_1.Events.COMMAND_UNREGISTERED, command);
            Logger_1.Logger.debug('Unregistered command', command.name);
        }
        return command;
    }
    load() {
        this.forEach((command) => command.load());
    }
}
exports.CommandManager = CommandManager;
exports.Commands = new CommandManager();
