<div align="center">
    <h1>G Commands</h1>
</div>

---

Instalaltion
```
npm install gcommands
```

How use?<br>
index.js
```js
const { GCommands } = require("gcommands");
const Discord = require("discord.js");

const client = new Discord.Client();

client.on("ready", () => {
    new GCommands(client, {
        cmdDir: "commands",
        ignoreBots: true,
        errorMessage: "Error :("
    })
})

client.login("token")
```

Example Commands (put to cmdDir)

ping.js
```js
module.exports = {
	name: "ping",
	description: "Check bot ping",
	run: async(client, cmd) => {
		client.api.interactions(cmd.id, cmd.token).callback.post({
			data: {
				type: 4,
				data: {
					content: "My ping is " + Math.round(client.ws.ping) + "ms"
				}
			}
		})
	}
};
```

test.js
```js
module.exports = {
	name: "test",
	description: "Test",
    expectedArgs: "<name>",
    minArgs: 1,
	run: async(client, cmd) => {
		client.api.interactions(cmd.id, cmd.token).callback.post({
			data: {
				type: 4,
				data: {
					content: "My ping is `" + Math.round(client.ws.ping) + "ms`"
				}
			}
		})
	}
};
```