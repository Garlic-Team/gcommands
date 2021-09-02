# Guild Language

Guild languages are used for users to customize your bot. (as if you didn't already know that)

```js
// GET

await client.dispatcher.getGuildLanguage("Guild ID");
await guild.getLanguage();

// SET

await client.dispatcher.setGuildLanguage("Guild ID", "language");
await guild.setLanguage("language");
```