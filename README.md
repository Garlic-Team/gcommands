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

If you updating from 2.x to 3.x check https://gcommands.js.org/guide/additional/fromv2tov3.html

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
const GCommandsClient = new GCommands(client, {
    cmdDir: "commands",
    eventDir: "events", //when you want event handler
    language: "czech", //english, spanish, portuguese, russian, german, czech, slovak,
    unkownCommandMessage: true, //send unkown command message true/false
    slash: {
        slash: 'both', //true = slash only, false = only normal, both = slash and normal
        prefix: '.' 
    },
    defaultCooldown: 3,
    database: {
        type: "mongodb", //sqlite/mongodb
        url: "mongodb+srv://" //mongourl
    }
})

GCommandsClient.on('debug', (debug) => {console.log(debug)});
})

client.login("token")
```