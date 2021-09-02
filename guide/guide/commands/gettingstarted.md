# Getting started

## Commands Directory

We can set the path to the commands directory by using `path`.

::: note The `path` package is already installed. :::
```js
const { join } = require('path');

new GCommandsClient({
    ...options,
    cmdDir: join(__dirname + 'commands'),
});
```

## Commands options

We can set options for the commands like this.

::: note `slash` must be one of: "both", "true" (slash only) or "false" (message only) :::

```js
new GCommandsClient({
    ...options,
    commands: {
        slash: "both",
        prefix: ".",
    }
});
```
