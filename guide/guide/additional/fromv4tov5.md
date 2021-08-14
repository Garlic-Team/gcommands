# Updating from v4 to v5

## Changes in v5

```diff
+ docs
+ command classes
+ event classes
+ cooldown bypass for app owner/team
+ typings
+ gpayload
+ ginteraction
+ support ws (raw) events
+ normal arguments
+ inhibitors major change

- SlashCommand.
+ CommandType.

+ <interaction>.createdTimestamp
+ interaction.think() in cmd

- client.commands
- client.aliases
- client.events
+ client.gcommands
+ client.galiases
+ client.gevents

- guild.prefix
- guild.language
+ guild.getCommandPrefix()
+ guild.getLanguage()

+ setDisabled() to MessageSelectMenu
```

## Command

```js
const { Command } = require("gcommands");
const wait = require("util").promisify(setTimeout);

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "ping",
      description: "Pongs the bot",
    });
  }

  async run(
    { client, interaction, member, message, guild, channel, respond, edit },
    args
  ) {
    interaction.think();
    await wait(2000);
    edit(`Pong! WS: **${client.ws.ping}ms**`);
  }
};
```

## Event

```js
const { Event } = require("gcommands");

module.exports = class extends Event {
  constructor(...args) {
    super(...args, {
      name: "message",
      once: false,
      ws: false,
    });
  }

  async run(client, message) {
    console.log(message);
  }
};
```

## More Changes

- [Arguments](../arguments/usingargsincmd.md)
