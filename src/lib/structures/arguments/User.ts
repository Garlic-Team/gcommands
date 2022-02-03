import type { Message } from 'discord.js';

export class User {
    validate(message: Message) {
        const content = message.content;
        const matches = content.match(/([0-9]+)/);

        if (!matches) return {
            success: false
        }

        return {
            success: true,
            value: message.client.users.cache.get(matches[0])
        }
    }
}