# Getting started

## Commands Directory

We can set the path to the commands directory by using `path`.

```js
const { join } = require('path');

new GCommandsClient({
    ...options,
    loader: {
        cmdDir: join(__dirname + 'commands')
    }
});
```

## Commands options

::: warning
You must invite the bot with the `application.commands` scope for slash commands to work.
:::

::: danger
It may take up to 1 hour for global commands to appear. guildOnly commands update instantly, and is advised to be used during development.
:::

We can set options for the commands like this.

```js
new GCommandsClient({
    ...options,
    commands: {
        slash: "both",
        prefix: ".",
    }
});
```

| TYPE  | DESCRIPTION     |
| ----- | --------------- |
| both  | Message + Slash |
| slash  | Only slash      |
| message | Only message    |
| false | None    |
