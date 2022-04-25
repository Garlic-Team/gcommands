"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoles = exports.UserPermissions = void 0;
const tslib_1 = require("tslib");
const Inhibitor_1 = require("./Inhibitor");
const MemberPermissions_1 = require("./MemberPermissions");
const MemberRoles_1 = require("./MemberRoles");
exports.default = Inhibitor_1.Inhibitor;
tslib_1.__exportStar(require("./Inhibitor"), exports);
tslib_1.__exportStar(require("./ChannelOnly"), exports);
tslib_1.__exportStar(require("./ClientPermissions"), exports);
tslib_1.__exportStar(require("./ClientRoles"), exports);
tslib_1.__exportStar(require("./Nsfw"), exports);
tslib_1.__exportStar(require("./Or"), exports);
tslib_1.__exportStar(require("./UserOnly"), exports);
tslib_1.__exportStar(require("./Confirm"), exports);
tslib_1.__exportStar(require("./MemberPermissions"), exports);
tslib_1.__exportStar(require("./MemberRoles"), exports);
/**
 * @description Use MemberPermissions instead of UserPermissions
 * @deprecated
 */
exports.UserPermissions = MemberPermissions_1.MemberPermissions;
/**
 * @description Use MemberRoles instead of UserRoles
 * @deprecated
 */
exports.UserRoles = MemberRoles_1.MemberRoles;
