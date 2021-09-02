# Guild Prefix

Guild prefixes are used for users to customize your bot.

```js
// GET

await client.dispatcher.getGuildPrefix("Guild ID");
await guild.getCommandPrefix();

// SET

await client.dispatcher.setGuildPrefix("Guild ID", "prefix");
await guild.setCommandPrefix("prefix");
```