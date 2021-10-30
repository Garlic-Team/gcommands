import { MessageActionRow, MessageAttachment, MessageEmbed, Sticker } from 'discord.js';
import { GCommandsClient } from '../base/GCommandsClient';
import { Color } from '../structures/Color';
import { InternalEvents } from './Constants';

class Util {
    static isClass(input: unknown) {
        return typeof input === 'function' &&
        typeof input.prototype === 'object' &&
        input.toString().substring(0, 5) === 'class';
    }

    static resolveString(input: unknown) {
        if (typeof input === 'string') return input;
        if (Array.isArray(input)) return input.join('\n');
        return String(input);
    }

    static getAllObjects(client: GCommandsClient, ob: object) {
        if (typeof ob !== 'object') return;
        for (const v of Object.values(ob)) {
            if (Array.isArray(v)) {
                Util.getAllObjects(client, v[0]);
            } else if (typeof v === 'object') {
                Util.getAllObjects(client, v);
            } else {
                client.emit(InternalEvents.DEBUG, new Color([
                    `&b${v}`,
                ]).getText());
            }
        }
    }

    static resolveMessageOptions(options) {
        if (!options) return {};

        const embeds = [];
        const components = [];
        const files = [];
        const stickers = [];

        if (!Array.isArray(options)) options = [options];

        options.forEach(option => {
            if (option instanceof MessageEmbed) {
                return embeds.push(option);
            } else if (option instanceof MessageAttachment) {
                return files.push(option);
            } else if (option instanceof MessageActionRow) {
                return components.push(option);
            } else if (option instanceof Sticker) {
                return stickers.push(option);
            }
        });

        if (embeds.length === 0 && components.length === 0 && files.length === 0 && stickers.length === 0) return options[0];

        return {
            embeds: embeds.length !== 0 ? embeds : undefined,
            components: components.length !== 0 ? components : undefined,
            files: files.length !== 0 ? files : undefined,
            stickers: stickers.length !== 0 ? stickers : undefined,
        };
    }

    static inhibit(client, data: () => boolean) {
		for (const inhibitor of client.inhibitors) {
			const inhibit = inhibitor(data);
			return inhibit;
		}
		return null;
    }

    static comparable(o) {
        return (typeof o !== 'object' || !o) ? o : (Object.keys(o).sort().reduce((c, key) => (c[key] = Util.comparable(o[key]), c), {})); // eslint-disable-line no-return-assign, no-sequences
    }

    static unescape(a: string, b?: string, c?: string): string {
        a = a.split(b || '-')
            .map(x => x[0].toUpperCase() + x.slice(1).toLowerCase()) // eslint-disable-line comma-dangle
            .join(c || ' ');

        return a;
    }

    static async __deleteCmd(client, commandId: number, guildId = undefined) {
        try {
            const app = client.api.applications(client.user.id);
            if (guildId) {
                app.guilds(guildId);
            }

            await app.commands(commandId).delete();
        } catch (e) {
            return null;
        }
    }

    static async __getAllCommands(client, guildId = undefined) {
        try {
            const app = client.api.applications(client.user.id);
            if (guildId) {
                app.guilds(guildId);
            }

            const commands = await app.commands.get();
            if (commands) return commands;
            else return [];
        } catch { return []; }
    }
}

export default Util;
