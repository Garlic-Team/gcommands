# Setup

If you want to use the component handler with GCommands, just add `componentDir` to `GCommandsClient`

```js
const { GCommandsClient } = require("gcommands");
const { join } = require("path");

const client = new GCommandsClient({
    ...options,
    loader: {
       componentDir: join(__dirname, "components")
    }
})
```

But if you only use the component handler, not GCommands, you have to import `@gcommmands/components`

```js
const { GComponents } = require("@gcommands/components");
const { Client } = require("discord.js");
const { join } = require("path");
const client = new Client();

new GComponents(client, { dir: join(__dirname, "components") })
```

Then you just create a file in the `components` folder or you can also create a category.

```js
const { Component } = require('@gcommands/components');

module.exports = class extends Component {
    constructor(client) {
        super(client, {
            name: 'hello',
            type: 'BUTTON',
        })
    }
    run(interaction, args) {
        return interaction.reply('Hello!');
    }
}
```
