# FAQ

#### I keep getting error `.guild` is undefined
A: GCommands needs you to have [GUILD_MEMBERS](https://discord.com/developers/docs/topics/gateway#gateway-intents) intents enabled in the [Discord Developers Portal](https://discord.com/developers).

#### How do I send a message in a slash command?
A: Slash commands don't have [GCommandsMessage](https://gcommands.js.org/docs/#GCommandsMessage) (message object) so you have to use the [respond](https://gcommands.js.org/guide/beginner/additionalfeatures.html#slash-respond-edit) function you import in run functions. The advantage is that the  [respond](https://gcommands.js.org/guide/beginner/additionalfeatures.html#slash-respond-edit) function can also be used with normal commands, so you can easily make a slash+normal command. 

```js
async run({respond}) {
    respond("hello")
}
```

#### How do I get the author of a message/channel in a slash command?
A: Just import the channel, member functions into respond and then you can simply use this. Member returns a [GuildMember](https://discord.js.org/#/docs/main/stable/class/GuildMember) object.

```js
async run({member, channel}) {
    member.send("hello")
}
```