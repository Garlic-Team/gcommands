# Database

## Setup
First, you need to add a database parameter to `GCommandsClient` with one of the following options:

```
redis://user:pass@localhost:6379
mongodb://user:pass@localhost:27017/dbname
sqlite://path/to/database.sqlite
postgresql://user:pass@localhost:5432/dbname
mysql://user:pass@localhost:3306/dbname
```

You must replace `user`, `pass` and `dbname` with your parameters.

::: danger
If you have mongodb from their site and the connection uri has `+srv` for mongodb, you must choose an older version `2.2.12` for it to work.
:::

For example, this is what the final database addition will look like:
```js
new GCommandsClient({
    ...options
    database: "sqlite://db/gcommands.sqlite"
})
```

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