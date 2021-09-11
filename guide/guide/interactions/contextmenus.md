# Context Menus

GCommands also brings context menu support with slash and message commands.  
You must enable context menus in `new GCommandsClient`.

```js
new GCommandsClient({
  /* ... */
  commands: {
    context: "both",
  },
});
```

Here are all the options:

| TYPE    | DESCRIPTION    |
| ------- | -------------- |
| both    | Message + User |
| message | Only message   |
| user    | Only user      |
| false   | Nothing        |

Here's a basic example:

```js
const { Command } = require("gcommands");

module.exports = class extends Command {
  constructor(client) {
    super(client, {
      name: "parse",
      slash: false,
    });
  }

  async run({ respond, interaction, objectArgs }) {
    if (objectArgs.user) {
      respond(`Name: ${objectArgs.user.username}`);
    } else if (objectArgs.message) {
      respond(`Message: ${objectArgs.message.content}`);
    }
  }
};
```

Here's an example with every command type mixed:

```js
const { Command, ArgumentType } = require("gcommands");

module.exports = class extends Command {
  constructor(client) {
    super(client, {
      name: "parse",
      descriptions: "Parses user/message info",
      args: [
        {
          name: "message",
          description: "Message Info",
          type: ArgumentType.STRING,
          required: true,
        },
        {
          name: "user",
          description: "User Info",
          type: ArgumentType.USER,
          required: true,
        },
      ],
    });
  }

  async run({ client, interaction, respond, channel, args, objectArgs }) {
    if (interaction && interaction.isContextMenu()) {
      if (objectArgs.user)
        respond({
          content: `${objectArgs.user.username}`,
          ephemeral: true,
        });
      if (objectArgs.message)
        respond({
          content: `${objectArgs.message.content}`,
          ephemeral: true,
        });

      return;
    }

    respond({
      content: [
        `**User:** ${client.users.cache.get(objectArgs.user).username}`,
        `**Message:** ${
          (await channel.messages.fetch(objectArgs.message)).content
        }`,
      ].join("\n"),
      ephemeral: true
    });
  }
};
```

::: warning
Note that the context menus do not accept any arguments.
:::
