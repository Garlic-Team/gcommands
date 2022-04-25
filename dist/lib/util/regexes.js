"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mentionableRegexp = exports.channelRegexp = exports.roleRegexp = exports.userRegexp = void 0;
exports.userRegexp = /^(?:<@!?)?([0-9]+)>?$/;
exports.roleRegexp = /^(?:<@&)?([0-9]+)>?$/;
exports.channelRegexp = /^(?:<#)?([0-9]+)>?$/;
exports.mentionableRegexp = /^(?:<@!?)?(?:<@&?)?([0-9]+)>?$/;
