"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Listeners = exports.ListenerManager = void 0;
const Listener_1 = require("../structures/Listener");
const discord_js_1 = require("discord.js");
const Logger_1 = require("../util/logger/Logger");
const Container_1 = require("../structures/Container");
class ListenerManager extends discord_js_1.Collection {
    register(listener) {
        if (listener instanceof Listener_1.Listener) {
            if (this.has(listener.name)) {
                this.get(listener.name).unregister();
                if (!this.get(listener.name)?.reloading)
                    Logger_1.Logger.warn('Overwriting listener', listener.name);
            }
            if (Container_1.container.client)
                listener.load();
            this.set(listener.name, listener);
            Logger_1.Logger.emit(Logger_1.Events.LISTENER_REGISTERED, listener);
            Logger_1.Logger.debug('Registered listener', listener.name, 'listening to', listener.event);
        }
        else
            Logger_1.Logger.warn('Listener must be a instance of Listener');
        return this;
    }
    unregister(name) {
        const { client } = Container_1.container;
        const listener = this.get(name);
        if (listener) {
            this.delete(name);
            if (client) {
                const maxListeners = client.getMaxListeners();
                if (maxListeners !== 0)
                    client.setMaxListeners(maxListeners - 1);
                listener.ws
                    ? client.ws.off(listener.event, listener._run)
                    : client.off(listener.event, listener._run);
            }
            Logger_1.Logger.emit(Logger_1.Events.LISTENER_UNREGISTERED, listener);
            Logger_1.Logger.debug('Unregistered listener', listener.name, 'listening to', listener.event);
        }
        return listener;
    }
    load() {
        this.forEach((listener) => listener.load());
    }
}
exports.ListenerManager = ListenerManager;
exports.Listeners = new ListenerManager();
