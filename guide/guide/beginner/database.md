# Database

If you still don't have a database, check out [Basic Bot](./basicbot.md)

## Guild Prefix

Guild prefixes are used for users to customize your bot.

```js
// GET

await client.dispatcher.getGuildPrefix("Guild ID");
await guild.getCommandPrefix();

// SET

await client.dispatcher.setGuildPrefix("Guild ID", "prefix");
await guild.setCommandPrefix("prefix");
```

## Guild Language

Guild languages are used for users to customize your bot. (as if you didn't already know that)

```js
// GET

await client.dispatcher.getGuildLanguage("Guild ID");
await guild.getLanguage();

// SET

await client.dispatcher.setGuildLanguage("Guild ID", "language");
await guild.setLanguage("Guild ID", "language");
```