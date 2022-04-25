"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.confirm = void 0;
const discord_js_1 = require("discord.js");
const customId_1 = require("./customId");
async function confirm(ctx, options = {}) {
    const id = (0, customId_1.customId)('confirm', ctx.userId);
    const button = new discord_js_1.MessageButton().setCustomId(id).setLabel('Confirm').setStyle('DANGER');
    if (typeof options.button?.label === 'string')
        button.setLabel(options.button.label);
    if (typeof options.button?.style === 'string')
        button.setStyle(options.button.style);
    if (typeof options.button?.emoji === 'string')
        button.setEmoji(options.button.emoji);
    const row = new discord_js_1.MessageActionRow().addComponents([button]);
    const messageContent = {
        content: typeof options.message === 'function' ? options.message(ctx) : options.message || 'Are you sure?',
        components: [row],
        ephemeral: options.ephemeral,
    };
    ctx.deferred ? await ctx.editReply(messageContent) : await ctx.reply(messageContent);
    const filter = (interaction) => {
        return interaction.customId === id && interaction.user.id === ctx.userId;
    };
    const result = await ctx.channel
        ?.awaitMessageComponent({
        filter,
        time: options.time || 10000,
        componentType: 'BUTTON',
    })
        ?.catch(() => {
        return undefined;
    });
    if (result instanceof discord_js_1.ButtonInteraction)
        result.deferUpdate();
    return result !== undefined;
}
exports.confirm = confirm;
