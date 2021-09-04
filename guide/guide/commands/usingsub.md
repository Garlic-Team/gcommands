# Using subcommands

## Setting up the subcommand

This is the tempate command we are going to use.

```js
const { Command, ArgumentType } = require('gcommands');

module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: 'perms',
            description: 'Permissions for a user or role',
        });
    }
}
```

Next we need to create the subcommand. For this example we will need the argument "target" in both subcommands.

```js
args: [
    {
        name: 'user',
        description: 'View permissions of a user',
        type: ArgumentType.SUB_COMMAND,
        options: [
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
        options: [
            {
                name: 'target',
                description: 'The role to target',
                type: ArgumentType.ROLE,
                required: true,
            }
        ]
    }
]
```

This creates a command with the "user" and "role" subcommand. The subcommands both have the argument "target".

## Using the subcommand

Next we want to get the permissions of a role of member. We start by checking if the "role" or "user" subcommand is used.

```js
run({ respond, guild, args, objectArgs, member }) {
    if (objectArgs.user) {
        member = objectArgs.user.target
            ? objectArgs.user.target.match(/[0-9]+/g)
                ? guild.members.cache.get(objectArgs.user.target.match(/[0-9]+/g)[0]) || member
                : member
            : member;

        const perms = member.permissions.toArray()
            .join(', ')
            .replaceAll('_', ' ')
            .toLowerCase();

        respond({ content: perms });

    } else if (objectArgs.role) {
        const role = objectArgs.role.target
            ? objectArgs.role.target.match(/[0-9]+/g)
                ? guild.roles.cache.get(objectArgs.role.target.match(/[0-9]+/g)[0]) || null
                : null
            : null;

        if (!role) return respond({ content: 'Could not find that role' });

        const perms = role.permissions.toArray()
            .join(', ')
            .replaceAll('_', ' ')
            .toLowerCase();

        respond({ content: perms });
    }
}
```

<div is="dis-messages">
    <dis-messages>
        <dis-message profile="gcommands">
            <template #interactions>
                <discord-interaction profile="hyro" :command="true">perms</discord-interaction>
            </template>
            create instant invite, manage channels, add reactions, stream, send messages, embed links, attach files, read message history, mention everyone, use external emojis, connect, speak, use vad, change nickname, use application commands, request to speak
        </dis-message>
    </dis-messages>
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
            create instant invite, kick members, ban members, administrator, manage channels, manage guild, add reactions, view audit log, priority speaker, stream, view channel, send messages, send tts messages, manage messages, embed links, attach files, read message history, mention everyone, use external emojis, view guild insights, connect, speak, mute members, deafen members, move members, use vad, change nickname, manage nicknames, manage roles, manage webhooks, manage emojis and stickers, use application commands, request to speak, manage threads, use public threads, use private threads, use external stickers
        </dis-message>
    </dis-messages>
</div>

## Resulting code

```js
const { Command, ArgumentType } = require('gcommands');

module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: 'perms',
            description: 'Permissions for a user or role',
            args: [
                {
                    name: 'user',
                    description: 'View permissions of a user',
                    type: ArgumentType.SUB_COMMAND,
                    options: [
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
                    options: [
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
    run({ respond, guild, args, objectArgs, member }) {
        if (objectArgs.user) {
            member = objectArgs.user.target
                ? objectArgs.user.target.match(/[0-9]+/g)
                    ? guild.members.cache.get(objectArgs.user.target.match(/[0-9]+/g)[0]) || member
                    : member
                : member;

            const perms = member.permissions.toArray()
                .join(', ')
                .replaceAll('_', ' ')
                .toLowerCase();

            respond({ content: perms });

        } else if (objectArgs.role) {
            const role = objectArgs.role.target
                ? objectArgs.role.target.match(/[0-9]+/g)
                    ? guild.roles.cache.get(objectArgs.role.target.match(/[0-9]+/g)[0]) || null
                    : null
                : null;

            if (!role) return respond({ content: 'Could not find that role' });

            const perms = role.permissions.toArray()
                .join(', ')
                .replaceAll('_', ' ')
                .toLowerCase();

            respond({ content: perms });
        }
    }
}
```



