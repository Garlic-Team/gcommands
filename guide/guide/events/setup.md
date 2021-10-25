# Setup

If you want to use event handler with GCommands, just add `eventDir` to `GCommandsClient`

```js
const { GCommandsClient } = require("gcommands");
const { join } = require("path");

const client = new GCommandsClient({
    ...options,
    loader: {
        eventDir: join(__dirname, "events")
    }
})
```

But if you only use the event handler, not GCommands, you have to import `GEvents`

```js
const { GEvents } = require("@gcommands/events");
const { Client } = require("discord.js");
const { join } = require("path");
const client = new Client();

client.on("ready", () => {
    new GEvents(yourDiscordClient, {
        eventDir: join(__dirname, "events")
    })
}) 

client.login("token")
```

Then you just create a file in the `events` folder or you can also create a category.

```js
const { Event } = require("gcommands")

module.exports = class Ping extends Event {
    constructor(client) {
        super(client, {
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
