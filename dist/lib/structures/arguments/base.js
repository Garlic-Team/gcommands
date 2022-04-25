"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageArgumentTypeBase = void 0;
const Util_1 = require("../../util/Util");
const Argument_1 = require("../Argument");
class MessageArgumentTypeBase {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    validate(content) {
        Util_1.Util.throwError('Validate method is not implemented!', this.constructor.name);
        return true;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    resolve(argument) {
        Util_1.Util.throwError('Resolve method is not implemented!', this.constructor.name);
    }
    static async createArgument(type, guild) {
        switch (type) {
            case Argument_1.ArgumentType.BOOLEAN: {
                const { BooleanType } = await Promise.resolve().then(() => __importStar(require('./Boolean')));
                return new BooleanType();
            }
            case Argument_1.ArgumentType.CHANNEL: {
                const { ChannelType } = await Promise.resolve().then(() => __importStar(require('./Channel')));
                return new ChannelType(guild);
            }
            case Argument_1.ArgumentType.INTEGER: {
                const { IntegerType } = await Promise.resolve().then(() => __importStar(require('./Integer')));
                return new IntegerType();
            }
            case Argument_1.ArgumentType.MENTIONABLE: {
                const { MentionableType } = await Promise.resolve().then(() => __importStar(require('./Mentionable')));
                return new MentionableType(guild);
            }
            case Argument_1.ArgumentType.NUMBER: {
                const { NumberType } = await Promise.resolve().then(() => __importStar(require('./Number')));
                return new NumberType();
            }
            case Argument_1.ArgumentType.ROLE: {
                const { RoleType } = await Promise.resolve().then(() => __importStar(require('./Role')));
                return new RoleType(guild);
            }
            case Argument_1.ArgumentType.STRING: {
                const { StringType } = await Promise.resolve().then(() => __importStar(require('./String')));
                return new StringType();
            }
            case Argument_1.ArgumentType.USER: {
                const { UserType } = await Promise.resolve().then(() => __importStar(require('./User')));
                return new UserType(guild);
            }
            case Argument_1.ArgumentType.ATTACHMENT: {
                const { AttachmentType } = await Promise.resolve().then(() => __importStar(require('./Attachment')));
                return new AttachmentType();
            }
        }
    }
}
exports.MessageArgumentTypeBase = MessageArgumentTypeBase;
