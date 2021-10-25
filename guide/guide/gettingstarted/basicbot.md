# Making a basic bot

## Create Application

First, you need to create an application in Discord's Developer Portal. Head to the [Applications Page](https://discord.com/developers/applications) and press the `New Application` button. A popup will appear asking to enter the application's name. You can name it whatever you want.

![New Application](https://gcommands.js.org/guide/createapp.png)

Go to the `Bot` section on the left and click `Add Bot`. It'll ask you for confirmation (you cannot delete the bot afterwards). Just click on `Yes, do it!`, after you're done contemplating your life choices.

![Add Bot](https://gcommands.js.org/guide/addbot.png)

And your bot was successfully created! You can now invite the bot to your server.  
Go to the `OAuth2` tab and select the `bot` scope. You can also scroll down a bit, and select whatever permissions you want.

![OAuth2](https://gcommands.js.org/guide/oauth2.png)

## Getting the bot token

A token is something like a password, which every Discord user has. You can use it to login to your bot.

Go back to the `Bot` page, and press the `Copy Token` button. The token will be copied to your clipboard. You can also `Click to Reveal Token`.

![Token](https://gcommands.js.org/guide/token.png)

::: warning
Tokens should never be shared with anyone! A token gives complete access to a bot, which can be abused badly.
:::

::: tip
In case you forgot your token, or someone else has got your token, the best way is to regenerate it using the `Regenerate` button.
:::

## Writing code

Let's actually start writing code!  
Create your main file and call it something like `index.js`.  
Then, paste this code in:

```js
const { GCommandsClient } = require("gcommands");
const { join } = require('path');
const client = new GCommandsClient({
  loader: {
    cmdDir: join(__dirname, 'commands'),
    eventDir: join(__dirname, 'events'),
  },
  language: "english", // english, spanish, portuguese, russian, german, czech, slovak, turkish, polish, indonesian, italian
  command: {
    caseSensitiveCommands: false, // true or false | whether to match the commands' caps
    caseSensitivePrefixes: false, // true or false | whether to match the prefix in message commands
    allowDm: false, // true or false | DM Support
    
    // Slash, context, prefix
    slash: "both", // https://gcommands.js.org/docs/#/docs/main/main/typedef/GCommandsOptionsCommandsSlash
    context: "false", // https://gcommands.js.org/docs/#/docs/main/main/typedef/GCommandsOptionsCommandsContext
    prefix: ".", // for normal commands
  },
  arguments: {
    // Argument prompt deleting and input deleting, there is now a option available to delete the prompt/input for arguments.
    deleteInput: true, // Default false
    deletePrompt: true, // Default false
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

::: warning
`commands.slash` and `commands.context` are default options. Any options set in commands will overwrite these options.
:::

Below are all the available options for [`GCommandsClient`](https://gcommands.js.org/docs/#/docs/main/main/typedef/GCommandsOptions):

| PARAMETER             | REQUIRED | FUNCTIONALITY                                                                                                                                                                                                                                                                                          |
| --------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| loaders.cmdDir                | ✅       | The directory to look for commands in                                                                                                                                                                                                                                                                  |
| loaders.eventDir              | ❌       | The directory to look for events in                                                                                                                                                                                                                                                                    |
| commands.caseSensitiveCommands | ❌       | If set to true, command names will be case sensitive                                                                                                                                                                                                                                                   |
| commands.caseSensitivePrefixes | ❌       | If set to true, prefixes will be case sensitive                                                                                                                                                                                                                                                        |
| language              | ✅       | The default language used to sends messages in                                                                                                                                                                                                                                                         |
| commands.slash        | ✅       | If set to slash, the bot will only register slash commands. If set to message, the bot will only register message commands. If set to both, the bot will register both and if set to false, the bot will not register any.                                                                                                                              |
| commands.context      | ✅       | If set to user, the bot will register user context commands. If set to false, the bot will only register message commands. If set to message, the bot will register message context commands. If set to both, the bot will register both |
| commands.prefix       | ❌       | The prefix the bot will use in message commands                                                                                                                                                                                                                                                        |
| commands.allowDm       | ❌       | DM Support                                                                                                                                                                                                                                                        |
| arguments.deleteInput       | ❌       | Argument input deleting                                                                                                                                                                                                                                                        |
| arguments.deletePrompt       | ❌       | Argument prompt deleting                                                                                                                                                                                                                                                        |
| defaultCooldown       | ❌       | The default cooldown for commands                                                                                                                                                                                                                                                                      |
| database              | ❌       | The database to store guild prefixes, etc. in                                                                                                                                                                                                                                                          |

::: warning
You need to have `discord.js@12+`
:::


::: tip
Use `node .` in the console to start the bot!
:::

For further setup see:

- [Commands](../commands/gettingstarted.md)
- [Database](../database/setup.md)
- [Events](../events/setup.md)

Coding your Bot:

- [Commands](../commands/first.md)
- [Events](../events/create.md)
- [Inhibitors](../other/inhibitor.md)
