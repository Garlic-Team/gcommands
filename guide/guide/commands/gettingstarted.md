# Getting started

## Commands Directory

We can set the path to the commands directory by using `path`.

```js
const { join } = require('path');

new GCommandsClient({
    ...options,
    cmdDir: join(__dirname + 'commands'),
});
```

## Commands options

::: warning
You must invite the bot with the `application.commands` scope for slash commands to work.
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
| true  | Only slash      |
| false | Only message    |
