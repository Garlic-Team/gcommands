# Using the event builder

The `EventOptionsBuilder` can be used to create EventOptions, like the name of the event.

```js
const { Event, EventOptionsBuilder } = require("gcommands")

module.exports = class extends Event {
    constructor(client) {
        super(client, new EventOptionsBuilder()
            .setName('messageCreate')
            .setOnce(false)
            .setWs(false)
        )
    }
};
```