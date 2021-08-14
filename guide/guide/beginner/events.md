# Events

If you want to use event handler with GCommands, just add `eventDir` to `GCommandsClient`

```js
const { GCommandsClient } = require("gcommands");

const client = new GCommandsClient({
    eventDir: "events/"
})
```

But if you only use the event handler, not GCommands, you have to import `GEvents`

```js
const { GEvents } = require("@gcommands/events");
const { Client } = require("discord.js");
const client = new Client();

client.on("ready", () => {
    new GEvents(yourDiscordClient, {
        eventDir: "events/"
    })
}) 

client.login("token")
```

Then you just create a file in the `events` folder or you can also create a category.

```js
const { Event } = require("gcommands")

module.exports = class Ping extends Event {
    constructor(...args) {
        super(...args, {
            name: "message",
            once: false,
            ws: false
        })
    }

    async run(client, message) {
        console.log(`${message.author.tag} -> ${message.content}`)
    }
};
```

**Both:**
```
GCommands-bot/
├── node_modules/
├── events/
    ├── category/
        ├── file.js
    ├── file.js
├── index.js
├── package-lock.json
└── package.json
```

**Categories:**
```
GCommands-bot/
├── node_modules/
├── events/
    ├── category/
        ├── file.js
├── index.js
├── package-lock.json
└── package.json
```

**Without:**
```
GCommands-bot/
├── node_modules/
├── events/
    ├── file.js
├── index.js
├── package-lock.json
└── package.json
```