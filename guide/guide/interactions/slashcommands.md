# Slash Commands

You need to invite a bot with `application.commands` scope to get the slash commands to work.  
You must enable slash commands in [`GCommandsClient`](https://gcommands.js.org/docs/#/docs/main/dev/typedef/GCommandsOptionsCommandsSlash)

```js
new GCommandsClient({
  ...options,
  commands: {
    slash: "both",
  },
});
```

When you set `both`, it means that both legal commands and slash commands will work.

| TYPE  | DESCRIPTION   |
| ----- | ------------- |
| both  | Legal + Slash |
| true  | Only slash    |
| false | Only legal    |

Thanks to GCommands you can easily make a legal + slash command in 1 file.

```js
const { Command } = require("gcommands");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "hello",
      description: "hello world",
    });
  }

  async run({ respond }) {
    respond("Hello world!");
  }
};
```

<div is="dis-messages">
    <dis-messages>
        <dis-message profile="gcommands">
            <template #interactions>
                <discord-interaction profile="hyro" :command="true">hello</discord-interaction>
            </template>
            Hello world!
        </dis-message>
    </dis-messages>
    <dis-messages>
        <dis-message profile="izboxo">
            .hello
        </dis-message>
        <dis-message profile="gcommands">
            Hello world!
        </dis-message>
    </dis-messages>
</div>

The `respond` feature is simply amazing. It works for legal commands and slash commands as well.  
The respond function works in exactly the same way as the `channel.send` function but has even more options. You can find them in the [documentation](https://gcommands.js.org/docs/#/docs/main/dev/typedef/GPayloadOptions) or look in the [Additional Features](./beginner/additionalfeatures.md)

::: warning
Don't forget that `ephemeral` property only works on slash commands (interactions).
:::

Wait... How do I do for example userinfo/channelinfo command?

## Getting other parameters

Simple! You just add more things to the run function. For example `member`.  
You can find all the stuff in the [documentation](https://gcommands.js.org/docs/#/docs/main/dev/typedef/CommandRunOptions)

```js
const { Command } = require("gcommands");
const { MessageEmbed } = require("discord.js");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "info",
      description: "guild and channel info",
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

Does this also work for legal commands? Of course!

<div is="dis-messages">
    <dis-messages>
        <dis-message profile="gcommands">
            <template #interactions>
                <discord-interaction profile="hyro" :command="true">info</discord-interaction>
            </template>
            <discord-embed slot="embeds">
                <embed-fields slot="fields">
                    <embed-field title="Server">
                        Name: GCommands
                    </embed-field>
                    <embed-field title="Channel">
                        Name: gcommands-general
                    </embed-field>
                    <embed-field title="Member">
                        Name: GCommands-bot
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
                        Name: GCommands
                    </embed-field>
                    <embed-field title="Channel">
                        Name: gcommands-general
                    </embed-field>
                    <embed-field title="Member">
                        Name: GCommands-bot
                    </embed-field>
                </embed-fields>
            </discord-embed>
        </dis-message>
    </dis-messages>
</div>

For the arguments see [Using Args In Cmd](../arguments/usingargsincmd.md)
