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

Let's actually start writing code! If you still setup anything else, head to [Setup](../setup.md).  
Create your main file and call it something like `index.js`.  
Then, paste this code in:

```js
const { Intents } = require("discord.js");
const { GCommandsClient } = require("gcommands");
const client = new GCommandsClient({
  cmdDir: "commands/",
  eventDir: "events/",
  caseSensitiveCommands: false, // true or false | whether to match the commands' caps
  caseSensitivePrefixes: false, // true or false | whether to match the prefix in message commands
  unkownCommandMessage: false, // true or false | send unkownCommand Message
  language: "english", // english, spanish, portuguese, russian, german, czech, slovak, turkish, polish, indonesian, italian
  commands: {
    slash: "both", //true = slash only, false = only normal, both = slash and normal
    context: "false", // https://gcommands.js.org/docs/#/docs/main/dev/typedef/GCommandsOptionsCommandsContext
    prefix: ".", // for normal commands
  },
  defaultCooldown: "3s",
  database: "url",
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES]
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

::: tip
Use `node .` in the console to start the bot!
:::

Coding your Bot:

- [Commands](../arguments/usingargsincmd.md)
- [Database](../beginner/database.md)
