<div align="center">
    <h1><b>GCommands</b></h1>
  <p>
    <a href="https://www.npmjs.com/package/gcommands"><img src="https://img.shields.io/npm/v/gcommands?maxAge=3600" alt="NPM version" /></a>
    <a href="https://www.npmjs.com/package/gcommands"><img src="https://img.shields.io/npm/dt/gcommands?maxAge=3600" alt="NPM downloads" /></a>
    <a href="https://www.codefactor.io/repository/github/garlic-team/gcommands/overview/dev"><img src="https://www.codefactor.io/repository/github/garlic-team/gcommands/badge/dev" alt="Code Raiting" /></a>
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

# Dev Build
npm install Garlic-Team/GCommands#dev
yarn install Garlic-Team/GCommands#dev
```

If you're updating from 4.x to 5.x, check https://gcommands.js.org/guide/additional/fromv4tov5.html

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
        database: "url"
        /* DB SUPPORT
         * redis://user:pass@localhost:6379
         * mongodb://user:pass@localhost:27017/dbname
         * sqlite://path/to/database.sqlite
         * postgresql://user:pass@localhost:5432/dbname
         * mysql://user:pass@localhost:3306/dbname
        */
    })

    gc.on("debug", (debug)=>{console.log(debug)})
    gc.on("log", (log)=>{console.log(log)})
})

client.login("bot token")
```

### ✍ | Examples
You can find everything in the [guide](https://gcommands.js.org/guide/) and [docs](https://gcommands.js.org/docs/).<br>
Join our [discord server](https://discord.gg/AjKJSBbGm2), if you need help or have any questions.

### 👥 | Contact
<a href="https://discord.gg/AjKJSBbGm2"><img src="https://discord.com/api/guilds/833628077556367411/widget.png?style=banner1"></a>
