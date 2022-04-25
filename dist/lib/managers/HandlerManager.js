"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Handlers = exports.HandlerManager = void 0;
const InteractionCommandHandler_1 = require("../../handlers/InteractionCommandHandler");
const MessageCommandHandler_1 = require("../../handlers/MessageCommandHandler");
const ComponentHandler_1 = require("../../handlers/ComponentHandler");
const CooldownHandler_1 = require("../../handlers/CooldownHandler");
const AutocompleteHandler_1 = require("../../handlers/AutocompleteHandler");
class HandlerManager {
    constructor() {
        this.interactionCommandHandler = InteractionCommandHandler_1.InteractionCommandHandler;
        this.messageCommandHandler = MessageCommandHandler_1.MessageCommandHandler;
        this.componentHandler = ComponentHandler_1.ComponentHandler;
        this.autocompleteHandler = AutocompleteHandler_1.AutocompleteHandler;
        this.cooldownHandler = CooldownHandler_1.CooldownHandler;
    }
    setInteractionCommandHandler(handler) {
        this.interactionCommandHandler = handler;
        return this;
    }
    setMessageCommandHandler(handler) {
        this.messageCommandHandler = handler;
        return this;
    }
    setComponentHandler(handler) {
        this.componentHandler = handler;
        return this;
    }
    setAutocompleteHandler(handler) {
        this.autocompleteHandler = handler;
        return this;
    }
    setCooldownHandler(handler) {
        this.cooldownHandler = handler;
        return this;
    }
}
exports.HandlerManager = HandlerManager;
exports.Handlers = new HandlerManager();
