# Slash Commands

You need to invite a bot with `application.commands` scope to get the slash commands to work.  
You must enable slash commands in `GCommandsClient`

```js
new GCommandsClient({
  /* ... */
  commands: {
    slash: "both",
  },
});
```

| TYPE  | DESCRIPTION     |
| ----- | --------------- |
| both  | Message + Slash |
| true  | Only slash      |
| false | Only message    |

Here's an example with both message and slash commands

```js
const { Command } = require("gcommands");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "hello",
      description: "Says hello to you!",
    });
  }

  async run({ respond, author }) {
    respond(`Hello, **${author.tag}**!`);
  }
};
```

<div is="dis-messages">
    <dis-messages>
        <dis-message profile="gcommands">
            <template #interactions>
                <discord-interaction profile="hyro" :command="true">hello</discord-interaction>
            </template>
            Hello, <b>Hyro#8938</b>!
        </dis-message>
    </dis-messages>
    <dis-messages>
        <dis-message profile="izboxo">
            .hello
        </dis-message>
        <dis-message profile="gcommands">
            Hello, <b>iZboxo#2828</b>!
        </dis-message>
    </dis-messages>
</div>

The `respond` function allows you to send responses with message, slash and context menu commands.  
The respond function works the same way as `TextBasedChannel.send` function but has more options. You can find them [here](https://gcommands.js.org/docs/#/docs/main/dev/typedef/GPayloadOptions), or look in [Additional Features](./additionalfeatures.md)

::: warning
Don't forget that `ephemeral` property only works on slash commands (interactions).
:::

Here's an example with a `info` command:

```js
const { Command } = require("gcommands");
const { MessageEmbed } = require("discord.js");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "info",
      description: "Guild, channel and member info",
    });
  }

  async run({ respond, member, channel, guild }) {
    let embed = new MessageEmbed()
      .addField("Server", `Name: ${guild.name}`)
      .addField("Channel", `Name: ${channel.name}`)
      .addField("Member", `Name: ${member.user.username}`);

    respond(embed);
  }
};
```

This command also automatically works with message commands!

<div is="dis-messages">
    <dis-messages>
        <dis-message profile="gcommands">
            <template #interactions>
                <discord-interaction profile="hyro" :command="true">info</discord-interaction>
            </template>
            <discord-embed slot="embeds">
                <embed-fields slot="fields">
                    <embed-field title="Server">
                        Name: Garlic Team - Imagine a garlic
                    </embed-field>
                    <embed-field title="Channel">
                        Name: chat
                    </embed-field>
                    <embed-field title="Member">
                        Name: Hyro
                    </embed-field>
                </embed-fields>
            </discord-embed>
        </dis-message>
    </dis-messages>
    <dis-messages>
        <dis-message profile="izboxo">
            .hello
        </dis-message>
        <dis-message profile="gcommands">
            <discord-embed slot="embeds">
                <embed-fields slot="fields">
                    <embed-field title="Server">
                        Name: Garlic Team - Imagine a garlic
                    </embed-field>
                    <embed-field title="Channel">
                        Name: chat
                    </embed-field>
                    <embed-field title="Member">
                        Name: Hyro
                    </embed-field>
                </embed-fields>
            </discord-embed>
        </dis-message>
    </dis-messages>
</div>

Also see:

- [Arguments](./usingargsincmd.md)
