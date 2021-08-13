# Installing Node.js and GCommands

## Installing Node.js

Don't have Node.js yet? Go to [NodeJS.org](https://nodejs.org) and install it!
Don't have an editor? Check out [Visual Studio Code](https://code.visualstudio.com).

### Installing on Windows

If you have a Windows OS, it's as simple as installing any other program. Go to the [Node.js website](https://nodejs.org), download the latest version, open the download file, and follow the steps in the installer.

### Installing on macOS

If you have macOS, you have a two options. You can:

- go to the [Node.js website](https://nodejs.org), download the latest version, open the download file, and follow the steps in the installer.
- use a package manager like [Homebrew](https://brew.sh)

### Installing on Linux

If you have a Linux OS, you should go to [this page](https://nodejs.org/en/download/package-manager/), to determine how to install Node.

::: warning
Make sure you upgrade to the needed Node.js version for discord.js.

- **discord.js@12** requires `NodeJS@12+`
- **discord.js@13** requires `NodeJS@16+`
  :::

## Installing GCommands

Use `npm i gcommands` to download the latest stable version.  
Use `npm i gcommands@dev` to install the dev version.

::: danger
You need to import GCommands before importing discord.js
:::

```js
const { GCommandsClient } = require("gcommands");
const client = new GCommandsClient({
  cmdDir: "commands/",
  eventDir: "events/",
  caseSensitiveCommands: false, // true or false | whether to match the commands' caps
  caseSensitivePrefixes: false, // true or false | whether to match the prefix in message commands
  unkownCommandMessage: false, // true or false | send unkownCommand Message
  language: "english", // english, spanish, portuguese, russian, german, czech, slovak, turkish, polish, indonesian, italian
  commands: {
    slash: "both", // https://gcommands.js.org/docs/#/docs/main/dev/typedef/GCommandsOptionsCommandsSlash
    context: "false", // https://gcommands.js.org/docs/#/docs/main/dev/typedef/GCommandsOptionsCommandsContext
    prefix: ".", // for normal commands
  },
  defaultCooldown: "3s",
  database: "url",
  /* DB SUPPORT
   * redis://user:pass@localhost:6379
   * mongodb://user:pass@localhost:27017/dbname
   * sqlite://path/to/database.sqlite
   * postgresql://user:pass@localhost:5432/dbname
   * mysql://user:pass@localhost:3306/dbname
   */
});

client.on("ready", () => {
  console.log("Ready");
});
client.on("debug", console.log); // warning | this also enables the default discord.js debug logging
client.on("log", console.log);

client.login("TOKEN");
```

Below are all the available options for [`GCommandsClient`](https://gcommands.js.org/docs/#/docs/main/dev/typedef/GCommandsOptions):

| PARAMETER             | REQUIRED | FUNCTIONALITY                                                                                                                                                                                                                                                                                          |
| --------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| cmdDir                | ✅       | The directory to look for commands in                                                                                                                                                                                                                                                                  |
| eventDir              | ❌       | The directory to look for events in                                                                                                                                                                                                                                                                    |
| caseSensitiveCommands | ❌       | If set to true, command names will be case sensitive                                                                                                                                                                                                                                                   |
| caseSensitivePrefixes | ❌       | If set to true, prefixes will be case sensitive                                                                                                                                                                                                                                                        |
| unkownCommandMessage  | ❌       | If set to true, the bot will respond with an error message if a command the user tried to use doesn't exist                                                                                                                                                                                            |
| language              | ✅       | The default language used to sends messages in                                                                                                                                                                                                                                                         |
| commands.slash        | ✅       | If set to true, the bot will only register slash commands. If set to false, the bot will only register message commands. If set to both, the bot will register both                                                                                                                                    |
| commands.context      | ✅       | If set to user, the bot will register user context commands. If set to false, the bot will only register message commands. If set to message, the bot will register message context commands. If set to both, the bot will register both |
| commands.prefix       | ❌       | The prefix the bot will use in message commands                                                                                                                                                                                                                                                        |
| defaultCooldown       | ❌       | The default cooldown for commands                                                                                                                                                                                                                                                                      |
| database              | ❌       | The database to store guild prefixes, etc. in                                                                                                                                                                                                                                                          |

::: warning
You need to have `discord.js@12+`
:::
