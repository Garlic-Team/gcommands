# Using subcommands

## Setting up the subcommand
```javascript
const { Command, ArgumentType } = require('gcommands');

module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: 'perms',
            description: 'Permissions for a user or role',
            context: false,
            args: [
                {
                    name: 'user',
                    description: 'View permissions of a user',
                    type: ArgumentType.SUB_COMMAND,
                    args: [
                        {
                            name: 'target',
                            description: 'The user to target',
                            type: ArgumentType.USER,
                        }
                    ]
                },
                {
                    name: 'role', // Set the name of the subcommand
                    description: 'View permissions of a role', // Set the description of the subcommand
                    type: ArgumentType.SUB_COMMAND,
                    args: [
                        {
                            name: 'target',
                            description: 'The role to target',
                            type: ArgumentType.ROLE,
                            required: true,
                        }
                    ]
                }
            ]
        });
    }
}
```
## Using the subcommand
```javascript
```javascript
module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: 'perms',
            description: 'Permissions for a user or role',
            context: false,
            args: [
                {
                    name: 'user',
                    description: 'View permissions of a user',
                    type: ArgumentType.SUB_COMMAND,
                    args: [
                        {
                            name: 'target',
                            description: 'The user to target',
                            type: ArgumentType.USER,
                        }
                    ]
                },
                {
                    name: 'role',
                    description: 'View permissions of a role',
                    type: ArgumentType.SUB_COMMAND,
                    args: [
                        {
                            name: 'target',
                            description: 'The role to target',
                            type: ArgumentType.ROLE,
                            required: true,
                        }
                    ]
                }
            ]
        });
    }
    run({ respond, guild, args, subcommands, member }) {
        if (subcommands[0] === 'user') {
            member = args[0]
                ? args[0].match(/[0-9]+/g)
                    ? guild.members.cache.get(args[0].match(/[0-9]+/g)[0]) || member
                    : member
                : member;

            const perms = member.permissions.toArray().join(', ');

            respond({ content: perms });

        } else if (subcommands[0] === 'role') {
            const role = args[0]
                ? args[0].match(/[0-9]+/g)
                    ? guild.roles.cache.get(args[0].match(/[0-9]+/g)[0]) || null
                    : null
                : null;

            if (!role) return respond({ content: 'Could not find that role' });

            const perms = role.permissions.toArray().join(', ');

            respond({ content: perms });
        }
    }
}
```
<div is="dis-messages">
    <dis-messages>
        <dis-message profile="izboxo">
            .perms
        </dis-message>
        <dis-message profile="gcommands">
            Please select one of the following subcommands: user, role.
        </dis-message>
        <dis-message profile="izboxo">
            user
        </dis-message>
        <dis-message profile="gcommands">
            Please define argument target
        </dis-message>
        <dis-message profile="izboxo">
            <mention profile="hyro">Hyro</mention>
        </dis-message>
        <dis-message profile="gcommands">
            CREATE_INSTANT_INVITE, KICK_MEMBERS, BAN_MEMBERS, ADMINISTRATOR, MANAGE_CHANNELS, MANAGE_GUILD, ADD_REACTIONS, VIEW_AUDIT_LOG, PRIORITY_SPEAKER, STREAM, VIEW_CHANNEL, SEND_MESSAGES, SEND_TTS_MESSAGES, MANAGE_MESSAGES, EMBED_LINKS, ATTACH_FILES, READ_MESSAGE_HISTORY, MENTION_EVERYONE, USE_EXTERNAL_EMOJIS, VIEW_GUILD_INSIGHTS, CONNECT, SPEAK, MUTE_MEMBERS, DEAFEN_MEMBERS, MOVE_MEMBERS, USE_VAD, CHANGE_NICKNAME, MANAGE_NICKNAMES, MANAGE_ROLES, MANAGE_WEBHOOKS, MANAGE_EMOJIS_AND_STICKERS, USE_APPLICATION_COMMANDS, REQUEST_TO_SPEAK, MANAGE_THREADS, USE_PUBLIC_THREADS, USE_PRIVATE_THREADS, USE_EXTERNAL_STICKERS
        </dis-message>
    </dis-messages>
</div>
