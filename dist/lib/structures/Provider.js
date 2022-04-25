"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Provider = void 0;
const events_1 = require("events");
const Util_1 = require("../util/Util");
class Provider extends events_1.EventEmitter {
    init() {
        Util_1.Util.throwError('Init method is not implemented!', this.constructor.name);
        return;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    insert(...args) {
        Util_1.Util.throwError('Insert method is not implemented!', this.constructor.name);
        return;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    get(...args) {
        Util_1.Util.throwError('Get method is not implemented!', this.constructor.name);
        return;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    update(...args) {
        Util_1.Util.throwError('Update method is not implemented!', this.constructor.name);
        return;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    delete(...args) {
        Util_1.Util.throwError('Delete method is not implemented!', this.constructor.name);
        return;
    }
}
exports.Provider = Provider;
