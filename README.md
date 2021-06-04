<div align="center">
    <h1>G Commands</h1>
  <p>
    <a href="https://www.npmjs.com/package/gcommands"><img src="https://img.shields.io/npm/v/gcommands?maxAge=3600" alt="NPM version" /></a>
    <a href="https://www.npmjs.com/package/gcommands"><img src="https://img.shields.io/npm/dt/gcommands?maxAge=3600" alt="NPM downloads" /></a>
  </p>
  <p>
    <a href="https://www.npmjs.com/package/gcommands"><img src="https://nodei.co/npm/gcommands.png?downloads=true&stars=true" alt="NPM Banner"></a>
  </p>
</div>

---

### 📂 | Installation
```sh
npm install gcommands
yarn install gcommands

npm install github:Garlic-Team/GCommands#dev #dev build
```

If you're updating from 3.x to 4.x, check https://gcommands.js.org/guide/additional/fromv3tov4.html

### 📜 | Setup
```js
const { Client } = require("discord.js")
const { GCommands } = require("gcommands")
const client = Client();

client.on("ready", () => {
    const gc = new GCommands(client, {
        cmdDir: "commands/",
        eventDir: "events/",
        language: "english",
        unkownCommandMessage: false,
        slash: {
            slash: "both",
            prefix: "."
        },
        database: {/*read guide*/}
    })

    gc.on("debug", (debug)=>{console.log(debug)})
})

client.login("token")
```

### ✍ | Examples
You can find everything in the [guide](https://gcommands.js.org).<br>
Join our [discord server](https://discord.gg/AjKJSBbGm2), if you need help or have any questions.

### 👥 | Contact
<a href="https://discord.gg/AjKJSBbGm2"><img src="https://discord.com/api/guilds/833628077556367411/widget.png?style=banner1"></a>
