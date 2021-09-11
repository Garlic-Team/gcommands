# Creating a event

You can create events simular too commands. A event must be a class extending from the `Event` class.

```js
const { Event } = require("gcommands")

module.exports = class extends Event {};

//or
const { Event } = require("gcommands")

class Message extends Event {};

module.exports = Message;
```

We can set the `name` (event), `once` and `ws`. You can also use the `EventOptionsBuilder` explained [here](./usingbuilder.md)

```js
const { Event } = require("gcommands")

module.exports = class extends Event {
    constructor(client) {
        super(client, {
            name: "messageCreate",
            once: false,
            ws: false
        })
    }
};
```

Next we add the run function.

```js
async run(client, message) {
    console.log(`${message.author.tag} -> ${message.content}`)
}
```

## Resulting code

```js
const { Event } = require("gcommands")

module.exports = class extends Event {
    constructor(client) {
        super(client, {
            name: "messageCreate",
            once: false,
            ws: false
        })
    }

    async run(client, message) {
        console.log(`${message.author.tag} -> ${message.content}`)
    }
};
```
