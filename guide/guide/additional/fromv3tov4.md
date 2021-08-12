# Updating from v3 to v4

## Changes in v4

```diff
+ NodeJS v15+ support
+ asynchronous run function support
+ followup messages
+ djs v13 support
+ command cooldown bypass for application owners
+ cached guild prefixes
+ dropdowns
+ typings

[-] GCommands

- database: {}
+ database: ""
 * redis://user:pass@localhost:6379
 * mongodb://user:pass@localhost:27017/dbname
 * sqlite://path/to/database.sqlite
 * postgresql://user:pass@localhost:5432/dbname
 * mysql://user:pass@localhost:3306/dbname

[-] Command

- command.requiredRole
+ command.userRequiredRoles

- return
+ respond
+ edit
- run (client, ...)
+ run ({ client }, arrayArgs, args)

+ command.nsfw

- new Buttons()
+ new MessageButton()
+ new MessageActionRow()

- args.user
+ args[0]

- command.cooldown: "5"
+ command.cooldown: "5s"
```

## Using respond/edit

```js {6,7,16,17,18,19,21,22,23,24}
const wait = require("util").promisify(setTimeout);

module.exports = {
  name: "ping",
  description: "Shows the bot's ping!",
  expectedArgs: "<ws:5:Shows the websocket ping>",
  minArgs: 0,
  run: async ({ client, interaction, message, respond, edit }, args) => {
    let sentAt = interaction ? interaction.createdAt : message.createdAt;
    let message;

    if (args[0] === "true" || args[0] === true)
      message = `WebSocket: **\`${client.ws.ping}ms\`**`;
    else message = `Ping: **\`${Date.now() - sentAt}ms\`**`;

    await respond({
      content: "Getting ping...",
      ephemeral: true,
    });
    await wait(1000);
    await edit({
      content: message,
      ephemeral: true,
    });
  },
};
```
