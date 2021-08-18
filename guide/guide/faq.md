# FAQ

#### Q: I keep getting the error `.guild is not defined`

A: GCommands (and discord.js) requires you to have the [GUILD_MEMBERS and PRESENCE](https://discord.com/developers/docs/topics/gateway#gateway-intents) intents enabled in your bot.

#### Q: What are all the objects in the first argument of a command?

A: Simple.

```js
return {
  client,
  bot, // alias of client
  message, // only in message commands
  member,
  author,
  guild,
  interaction, // only in slash commands
  channel,
  respond,
  edit,
};
```

#### Q: I keep getting the error `403 Missing Access`

A: If you want a guild-only command, you need to put the correct guildId in the command and invite the `application.commands` bot to the server. If you don't do that, you will get this error. 

For global commands the same thing, only you won't get the error.
