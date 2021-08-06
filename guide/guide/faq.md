# FAQ

#### Q: I keep getting the error `.guild is not defined`

A: GCommands (and discord.js) requires you to have the [GUILD_MEMBERS and PRESENCE](https://discord.com/developers/docs/topics/gateway#gateway-intents) intents enabled in your bot.

#### Q: What are all the objects in the first argument of a command?

A: Simple.

```js
{
  client,
  bot, // alias of client
  message, // only in message commands
  member,
  author,
  guild,
  interaction, // only in slash commands
  channel,
  respond,
  edit
}
```
