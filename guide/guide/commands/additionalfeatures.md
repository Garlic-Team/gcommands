# Additional Features

Here's all the list of additional features in commands.
We recommend that you also take a look at the [documentation](https://gcommands.js.org/docs/#/docs/main/main/typedef/CommandOptions).

## Command Respond/Edit

```js
const { Command, MessageActionRow } = require("gcommands");
const { MessageEmbed } = require("discord.js");

module.exports = class extends Command {
  constructor(client) {
    super(client, {
      name: "ping",
      description: "Shows the bot's ping",
    });
  }

  async run({ respond, edit }) {
    respond({
      content: "I'm too lazy to make an actual ping command", // content accepts string, number, MessageEmbed
      ephemeral: true, // makes the message only visible for the user
      allowedMentions: {}, // allowedMentions, more here: https://discord.js.org/#/docs/main/stable/typedef/MessageMentionOptions
      embeds: new MessageEmbed()
        .setAuthor("hi")
        .setTitle("TOP TEXT")
        .setDescription("BOTTOM TEXT"),
      components: new MessageActionRow(), // MessageActionRow, [MessageActionRow, MessageActionRow]
      attachments: new MessageAttachment(
        Buffer.from("me when\nme when guide"),
        "funny_meme.txt"
      ), // MessageAttachment, [MessageAttachment, MessageAttachment]
      inlineReply: true, // if set to true, the client will reply to the latest message in the channel
    });

    setTimeout(() => {
      edit({
        content: "Yep, still lazy", // content accepts string, number, MessageEmbed
        embeds: new MessageEmbed()
          .setAuthor("hi")
          .setTitle("TOP TEXT")
          .setDescription("BOTTOM TEXT"),
        components: new MessageActionRow(), // MessageActionRow, [MessageActionRow, MessageActionRow]
      });
    }, 2500);
  }
};
```

## Cooldowns

Spam is one of the things you want your bot to avoid. GCommands has added a cooldown parameter for commands:

```js {8}
const { Command } = require("gcommands");

module.exports = class extends Command {
  constructor(client) {
    super(client, {
      name: "ping",
      description: "Shows the bot's ping",
      cooldown: "1s", // String | can also be: 1m, 1h, 1d, ...
    });
  }

  async run(/* ... */) {
    // ...
  }
};
```

## Categories

Categories can help you find commands more easily.
You can either:

- add the `category` parameter to your command:

```js {9}
const { Command } = require("gcommands");

module.exports = class extends Command {
  constructor(client) {
    super(client, {
      name: "ping",
      description: "Shows the bot's ping",
      cooldown: "1s",
      category: "Utilities", // String
    });
  }

  async run(/* ... */) {
    // ...
  }
};
```

- put your command in a folder:

```{2}
cmdDir/
  Utilities/
    ping.js
```

::: warning
Keep in mind, categories are case sensitive!
:::

## Aliases

Aliases can help users find your command more easily, or just save them a few words. [**More about Aliases in Slash Commands**](https://github.com/discord/discord-api-docs/issues/2323#issuecomment-761137779)

```js {10}
const { Command } = require("gcommands");

module.exports = class extends Command {
  constructor(client) {
    super(client, {
      name: "ping",
      description: "Shows the bot's ping",
      aliases: ["pong", "pingpong"],
      cooldown: "1s",
      category: "Utilities", // String
    });
  }

  async run(/* ... */) {
    // ...
  }
};
```

## UserPermissions

GCommands has also added a `userRequiredPermissions` key to commands, so you can save a few lines of, checking for permissions.

```js {11}
const { Command } = require("gcommands");

module.exports = class extends Command {
  constructor(client) {
    super(client, {
      name: "ping",
      description: "Shows the bot's ping",
      aliases: ["pong", "pingpong"],
      cooldown: "1s",
      category: "Utilities",
      userRequiredPermissions: "ADMINISTRATOR", // Permission, [Permission, Permission]
    });
  }

  async run(/* ... */) {
    // ...
  }
};
```

## ClientRequiredPermissions

Along with `userRequiredPermissions`, GCommands has also added a `clientRequiredPermissions` key, to check if your client has a specific permissions

```js {12}
const { Command } = require("gcommands");

module.exports = class extends Command {
  constructor(client) {
    super(client, {
      name: "ping",
      description: "Shows the bot's ping",
      aliases: ["pong", "pingpong"],
      cooldown: "1s",
      category: "Utilities",
      userRequiredPermissions: "ADMINISTRATOR",
      clientRequiredPermissions: "ADMINISTRATOR", // Permission, [Permission, Permission]
    });
  }

  async run(/* ... */) {
    // ...
  }
};
```

## UserRequiredRoles

The `userRequiredRoles` property only allows members who have a specific role to run the command

```js {13}
const { Command } = require("gcommands");

module.exports = class extends Command {
  constructor(client) {
    super(client, {
      name: "ping",
      description: "Shows the bot's ping",
      aliases: ["pong", "pingpong"],
      cooldown: "1s",
      category: "Utilities",
      userRequiredPermissions: "ADMINISTRATOR",
      clientRequiredPermissions: "ADMINISTRATOR",
      userRequiredRoles: ["69", "420"], // [Snowflake, Snowflake]
    });
  }

  async run(/* ... */) {
    // ...
  }
};
```

## GuildOnly

This property makes the command only create/work on a specific guildId. This is recommended for server-specific bots, or just for testing.

```js {14}
const { Command } = require("gcommands");

module.exports = class extends Command {
  constructor(client) {
    super(client, {
      name: "ping",
      description: "Shows the bot's ping",
      aliases: ["pong", "pingpong"],
      cooldown: "1s",
      category: "Utilities",
      userRequiredPermissions: "ADMINISTRATOR",
      clientRequiredPermissions: "ADMINISTRATOR",
      userRequiredRoles: ["69", "420"],
      guildOnly: "123", // Snowflake
    });
  }

  async run(/* ... */) {
    // ...
  }
};
```

## UserOnly

This property only allows a specific user(s) to run the command.

```js {15}
const { Command } = require("gcommands");

module.exports = class extends Command {
  constructor(client) {
    super(client, {
      name: "ping",
      description: "Shows the bot's ping",
      aliases: ["pong", "pingpong"],
      cooldown: "1s",
      category: "Utilities",
      userRequiredPermissions: "ADMINISTRATOR",
      clientRequiredPermissions: "ADMINISTRATOR",
      userRequiredRoles: ["69", "420"],
      guildOnly: "123",
      userOnly: "456", // Snowflake, [Snowflake, Snowflake]
    });
  }

  async run(/* ... */) {
    // ...
  }
};
```

## ChannelOnly

This property makes the command only be runnable in a specific channel(s).

```js {16}
const { Command } = require("gcommands");

module.exports = class extends Command {
  constructor(client) {
    super(client, {
      name: "ping",
      description: "Shows the bot's ping",
      aliases: ["pong", "pingpong"],
      cooldown: "1s",
      category: "Utilities",
      userRequiredPermissions: "ADMINISTRATOR",
      clientRequiredPermissions: "ADMINISTRATOR",
      userRequiredRoles: ["69", "420"],
      guildOnly: "123",
      userOnly: "456",
      channelOnly: "789", // Snowflake, [Snowflake, Snowflake]
    });
  }

  async run(/* ... */) {
    // ...
  }
};
```

## NSFW

~~This property makes the commad send a hent-~~ This property makes the command only runnable in NSFW channels.

```js {17}
const { Command } = require("gcommands");

module.exports = class extends Command {
  constructor(client) {
    super(client, {
      name: "ping",
      description: "Shows the bot's ping",
      aliases: ["pong", "pingpong"],
      cooldown: "1s",
      category: "Utilities",
      userRequiredPermissions: "ADMINISTRATOR",
      clientRequiredPermissions: "ADMINISTRATOR",
      userRequiredRoles: ["69", "420"],
      guildOnly: "123",
      userOnly: "456",
      channelOnly: "789",
      nsfw: false, // Boolean
    });
  }

  async run(/* ... */) {
    // ...
  }
};
```