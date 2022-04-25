"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Listener = void 0;
const ListenerManager_1 = require("../managers/ListenerManager");
const Logger_1 = require("../util/logger/Logger");
const zod_1 = require("zod");
const Container_1 = require("./Container");
const validationSchema = zod_1.z
    .object({
    event: zod_1.z.string(),
    name: zod_1.z.string(),
    once: zod_1.z.boolean().optional(),
    ws: zod_1.z.boolean().optional().default(false),
    fileName: zod_1.z.string().optional(),
    run: zod_1.z.function(),
})
    .passthrough();
class Listener {
    constructor(options) {
        this.reloading = false;
        if (this.run)
            options.run = this.run;
        validationSchema
            .parseAsync({ ...options, ...this })
            .then((options) => {
            this.event = options.event;
            this.name = options.name;
            this.once = options.once;
            this.ws = options.ws;
            this.fileName = options.fileName;
            this.run = options.run;
            ListenerManager_1.Listeners.register(this);
        })
            .catch((error) => {
            Logger_1.Logger.warn(typeof error.code !== 'undefined' ? error.code : '', error.message);
            if (error.stack)
                Logger_1.Logger.trace(error.stack);
        });
    }
    load() {
        const { client } = Container_1.container;
        const maxListeners = client.getMaxListeners();
        if (maxListeners !== 0)
            client.setMaxListeners(maxListeners + 1);
        if (this.ws)
            client.ws[this.once ? 'once' : 'on'](this.event, this._run.bind(this));
        else
            client[this.once ? 'once' : 'on'](this.event, this._run.bind(this));
    }
    unregister() {
        ListenerManager_1.Listeners.unregister(this.name);
    }
    async _run(...args) {
        await Promise.resolve(this.run.call(this, ...args)).catch((error) => {
            Logger_1.Logger.error(typeof error.code !== 'undefined' ? error.code : '', error.message);
            if (error.stack)
                Logger_1.Logger.trace(error.stack);
        });
    }
    async reload() {
        if (!this.fileName)
            return;
        this.reloading = true;
        delete require.cache[require.resolve(this.fileName)];
        await Promise.resolve().then(() => __importStar(require(this.fileName)));
        return ListenerManager_1.Listeners.get(this.name);
    }
}
exports.Listener = Listener;
