# What are all the objects in the first argument of a command?

Simple.

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
  args,
  objectArgs
};
```
