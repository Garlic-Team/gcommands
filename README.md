<div align="center">
    <h1>G Commands</h1>
</div>

---

Installation
```
npm install gcommands
```

DEV build
```
npm install github:Garlic-Team/GCommands#dev
```

### Support
 - https://gcommands.js.org
 - https://discord.gg/AjKJSBbGm2

How to use?<br>
index.js
```js
const { GCommands } = require("gcommands");
const Discord = require("discord.js");

const client = new Discord.Client();

client.on("ready", () => {
    new GCommands(client, {
        cmdDir: "commands",
        eventDir: "events", //when you want event handler
        slash: {
           slash: 'both', //true = slash only, false = only normal, both = slash and normal
           prefix: '.' 
        },
        cooldown: {
            default: 3
        },
        database: {
            type: "mongodb", //sqlite/mongodb
            url: "mongodb+srv://" //mongourl
        }
    })
})

client.on("gDebug", (debug) => {console.log(debug)})

client.login("token")
```