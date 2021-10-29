# Creating a component

You can create components simular too commands. A component must be a class extending from the `Component` class.

```js
const { Component } = require("gcommands");

module.exports = class extends Component {};

//or
const { Component } = require("gcommands");

class Message extends Component {};

module.exports = Message;
```

We can set the `name` (customid name, string or regExp), `type` and `userRequiredPermissions`.

It is recommended to use the `CustomId` class for creating custom id's like this:
```js
const { CustomId, Button } = require("gcommands");

const customId = new CustomId({ name: "hello", ids: [author.id] }); // This will create a custom id looking like this: hello-{some_id}

new Button().setCustomId(customId.get())
```

The array of ids specified above will be extracted from the customId and given to the component run function as `args`. You can also use your own customId (string or regex).

```js
const { Component } = require("gcommands");

module.exports = class extends Component {
    constructor(client) {
        super(client, {
            name: "hello",
            type: "BUTTON",
            userRequiredPermissions: ["MANAGE_MESSAGES"],
        })
    }
};
```

Next we add the run function.

```js
async run(interaction, args) {
    return interaction.reply("Hello!");
}
```

## Resulting code

```js
const { Component } = require("gcommands");

module.exports = class extends Component {
    constructor(client) {
        super(client, {
            name: "hello",
            type: "BUTTON",
            userRequiredPermissions: ["MANAGE_MESSAGES"],
        })
    }
    async run(interaction, args) {
        return interaction.reply("Hello!");
    }
}
};
```
