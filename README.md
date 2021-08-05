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
  <p>
    <a href="https://ko-fi.com/H2H05FNRL"><img src="https://garlic-team.github.io/GarMod/sources/support-ko-fi.svg" height="30" /></a>
    <a href="https://github.com/Garlic-Team/GCommands"><img src="https://garlic-team.github.io/GarMod/sources/open-source.svg" height="30" /></a>
    <img src="https://forthebadge.com/images/badges/made-with-javascript.svg" height="30" />
  </p>
</div>

---

### 📂 | Installation
```sh
npm install gcommands
yarn install gcommands

# Dev Build
npm install gcommands@dev
yarn install gcommands@dev
```

If you're updating from 4.x to 5.x, check https://gcommands.js.org/guide/guide/additional/fromv4tov5.html

### 📜 | Setup
```js
const { GCommandsClient } = require("gcommands")
const client = GCommandsClient({
   cmdDir: "commands/",
   eventDir: "events/",
   language: "english",
   unkownCommandMessage: false,
   slash: {
      slash: "both",
      prefix: "."
   },
   database: "url"
});

client
   .on("log", console.log)

client.login("bot token")
```

### ✍ | Examples
You can find everything in the [guide](https://gcommands.js.org/guide/) and [docs](https://gcommands.js.org/docs/).<br>
Join our [discord server](https://discord.gg/AjKJSBbGm2), if you need help or have any questions.

### 👥 | Contact
<a href="https://discord.gg/AjKJSBbGm2"><img src="https://discord.com/api/guilds/833628077556367411/widget.png?style=banner1"></a>
