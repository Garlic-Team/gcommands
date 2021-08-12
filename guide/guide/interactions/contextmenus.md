# Context Menus

GCommands also brings context menu support with slash and legal commands.  
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
  constructor(...args) {
    super(...args, {
      name: "parse",
      slash: false,
    });
  }

  async run({ respond, interaction }, arrayArgs, objectArgs) {
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
  constructor(...args) {
    super(...args, {
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

  run({ client, interaction, client, channel }, args, objectArgs) {
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
    }

    respond(
      content: [
        `**User:** ${client.users.cache.get(objectArgs.user).username}`,
        `**Channel:** ${
          channel.messages.cache.get(objectArgs.message).content
        }`,
      ].join("\n"),
      ephemeral: true
    );
  }
};
```

## How do I make a slash + legal + context menus command?

Simple.

```js
const { Command, ArgumentType } = require("gcommands");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "parse",
      description: "parse user/message info",
      args: [
        {
          name: "message",
          description: "messageinfo",
          type: ArgumentType.STRING,
          required: true,
        },
        {
          name: "user",
          description: "userinfo",
          type: ArgumentType.USER,
          required: true,
        },
      ],
    });
  }

  async run({ respond, channel, guild, interaction }, arrayArgs, objectArgs) {
    if (interaction.isContextMenu()) {
      if (objectArgs.user) {
        respond(`Name: ${objectArgs.user.username}`);
      } else if (objectArgs.message) {
        respond(`Message: ${objectArgs.message.content}`);
      }

      return;
    }

    respond(
      [
        `User: ${guild.members.cache.get(objectArgs.user).user.username}`,
        `Message: ${channel.messages.cache.get(objectArgs.message).content}`,
      ].join("\n")
    );
  }
};
```

Why do I have to make a distinction there as to whether it's a context menu or not?  
For the sake of argument. Context menu already returns the user/member/message in the arguments, not just the ID.

<img src="/../../contextmenu.png" width="450px;">

<div is="dis-messages">
    <dis-messages>
        <dis-message profile="izboxo">
            Cool!
        </dis-message>
        <dis-message profile="gcommands">
            <template #interactions>
                <discord-interaction profile="hyro" :command="true">parse</discord-interaction>
            </template>
            Message: Cool!
        </dis-message>
    </dis-messages>
    <dis-messages>
        <dis-message profile="hyro">
            .parse 875024081022513233 802848778142089227
        </dis-message>
        <dis-message profile="gcommands">
            User: iZboxo<br>
            Message: Cool!
        </dis-message>
    </dis-messages>
</div>

::: warning
Note that the context menu does not accept any arguments.
:::
