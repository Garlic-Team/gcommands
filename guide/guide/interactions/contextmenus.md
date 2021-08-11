# Context Menus

GCommands now also brings context menu support in 1 file with slash + legal commands.  
It's very simple again.  
You must enable context menus in [`GCommandsClient`](https://gcommands.js.org/docs/#/docs/main/dev/typedef/GCommandsOptionsCommandsContext)

```js
new GCommandsClient({
  ...options,
  commands: {
    context: "both",
  },
});
```

When you set `both`, it means that both user commands and message commands will work.

| TYPE    | DESCRIPTION    |
| ------- | -------------- |
| both    | Message + User |
| message | Only message   |
| user    | Only user      |
| false   | Nothing        |

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

![Context Menu](/../../contextmenu.png)

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
