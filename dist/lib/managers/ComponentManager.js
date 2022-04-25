"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Components = exports.ComponentManager = void 0;
const discord_js_1 = require("discord.js");
const Component_1 = require("../structures/Component");
const Logger_1 = require("../util/logger/Logger");
const Container_1 = require("../structures/Container");
class ComponentManager extends discord_js_1.Collection {
    register(component) {
        if (component instanceof Component_1.Component) {
            if (this.has(component.name) && !this.get(component.name)?.reloading)
                Logger_1.Logger.warn('Overwriting component', component.name);
            if (Container_1.container.client)
                component.load();
            this.set(component.name, component);
            Logger_1.Logger.emit(Logger_1.Events.COMPONENT_REGISTERED, component);
            Logger_1.Logger.debug('Registered component', component.name);
        }
        else
            Logger_1.Logger.warn('Component must be a instance of Component');
        return this;
    }
    unregister(componentName) {
        const component = this.get(componentName);
        if (component) {
            this.delete(componentName);
            Logger_1.Logger.emit(Logger_1.Events.COMPONENT_UNREGISTERED, component);
            Logger_1.Logger.debug('Unregistered component', component.name);
        }
        return component;
    }
    load() {
        this.forEach((component) => component.load());
    }
}
exports.ComponentManager = ComponentManager;
exports.Components = new ComponentManager();
