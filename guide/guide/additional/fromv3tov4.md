# Updating from v3 to v4
You can use `respond()` and `edit()` in normal/slash command!

```diff
- cmd.requiredRole
+ cmd.userRequiredRoles

- return (in slash cmd)
- run: async(client, slash. etc)
+ respond()
+ edit()
+ ({client, interaction, member, message, guild, channel, respond, edit}, arrayArgs, args)

- new Buttons()
+ new MessageButton()
+ new MessageActionRow()

- args.user [slash args]
+ args[0] [slash args]

+ nodejs15+ support
+ support asynchronous module.exports
+ followup messages
+ more djs v13
+ buttons
+ arrayArgs for slash cmd
+ nsfw parameter

- cooldown: "5"
+ cooldown: "5s"
+ cooldown bypass for owners

+ array support for default/guild prefix
+ cached guild prefixes

- database: {/*etc*/}
+ database: "mongodb://"
 * redis://user:pass@localhost:6379
 * mongodb://user:pass@localhost:27017/dbname
 * sqlite://path/to/database.sqlite
 * postgresql://user:pass@localhost:5432/dbname
 * mysql://user:pass@localhost:3306/dbname
+ dropdowns
+ typings
```

#### Why respond/edit function?
Due to the fact that the respond function facilitates slash return, and due to this function, the command is almost always slash and normal without much change.

```js {6,9,14,17}
const { MessageButton, MessageActionRow } = require("gcommands")

module.exports = {
	name: "test",
	description: "Test",
	expectedArgs: "<user:6:select user>"
	run: async({client, interaction, member, message, guild, channel, respond, edit}, args) => {
		console.log(args[0])
		const button = new MessageButton()
			.setStyle("gray")
			.setLabel("test")
			.setID("custom_id")
			.setEmoji("💚") // or .setEmoji("<:happy:id:>")
			.toJSON()

		const buttonRow = new MessageActionRow().addComponent(button)

		respond({
			content: "My ping is `" + Math.round(client.ws.ping) + "ms`",
			ephemeral: true,
			allowedMentions: { parse: [], repliedUser: true },
			components: buttonRow,
			embeds: new MessageEmbed().setTitle("hi") // content + embed
		})

		setTimeout(() => {
			edit("hi")
		}, 3000)
	}
};
```