# Updating from v5 to v6

## Before you start
v6 requires discord.js v12 or v13, so make sure you have these versions of discord.js and not others.  
  
If you already have djs v12 or v13 use `npm i gcommands`.  
You can make sure you have gcommands using `npm list gcommands`. If you still have v5 then use `npm uninstall gcommands` and then reinstall.

## Context Menus
v6 now supports context menus!  
Refer to the [context menus](./../interactions/contextmenus.md) section of this guide to get started.

## Arguments
v6 now supports all arguments except `SUB_COMMNAD` & `SUB_COMMAND_GROUP` for legal commands, also supports `NUMBER` type for slash commands.  
Refer to the [arguments](./../arguments/usingargsincmd.md) section of this guide to get started.

## Commonly used methods that changed

### GCommands
The `new GCommands` is deprecated, and should already use the `new GCommandsClient` which will automatically create a discord.js client and make the code prettier.  
`GCommandsClient` accepts [gcommands settings](https://gcommands.js.org/docs/#/docs/main/dev/typedef/GCommandsOptions) and also [discord.js client](https://discord.js.org/#/docs/main/stable/typedef/ClientOptions) settings. 

#### GCommandsOptions#slash
`GCommandsOptions#slash` has been replaced with `GCommandsOptions#commands` to support context menus.

#### GCommandsOptions#language
New languages `indonesian`, `italian` have been added.

### Interactions
`<Interaction>.id` has been replaced with `<Interaction.customId>`. The `<Interaction>.id` is currently the discord interaction id, not the customId.  
`<ButtonInteraction/SelectMenuInteraction>.clicker` is deprecated, `<Interaction>.member/user` is used.  

### Message Components
`<MessageComponent>.setID()` is deprecated, `<MessageComponent>.setCustomId()` is used.

#### Handling
The `createButtonCollector, createSelectMenuCollector, awaitButtons and awaitSelectMenus` are deprecated and only `createMessageComponentCollector, awaitMessageComponents` are used and then you use `interaction.isSelectMenu()` for example when [filtering](https://gcommands.js.org/docs/#/docs/main/dev/class/GInteraction?scrollTo=isApplication).

### Command
Added the ability to reload a command without restarting the bot using `<Command>.reload(), client.gcommands.get("name").reload()`.  
The option to use the `usage` parameter in commands has been added.  
You can detect if there is a channel thread, using `channelThreadOnly`.  
Legal commands support the optional arguments.

::: warning
`channelThreadOnly` only works with djs v13.
:::

```js
const { GCommandsClient } = require("gcommands")

const client = new GCommandsClient({
    ...options
})

client
    .on("log", console.log)
    .on("debug", console.log)

client.login("token")
```

## Other Additionals & Fixes

### GPayload#options
Fixed `GPayload#options#inlineReply` option.  
A `stickers` option has been added that allows you to send a sticker in a message.

### GCommandsClient
Added events `commandExecute` and `commandError`.

#### GCommandsOptions#prefix
Fixed a `prefix` option that didn't allow to have multiple character prefixes.  

### diff
```diff
+ multi character prefix
+ Number argument type
+ mentionable argument type for message commands

[-] Command
+ command.channelThreadOnly // djs v13+ only
+ command.usage
+ command.reload()

[-] Interaction

- interaction.clicker
+ interaction.member
+ interaction.user

- interaction.id
+ interaction.customId
- interaction.discordId
+ interaction.id

- interaction.setID
+ interaction.setCustomId

[-] Translations

+ indonesian
+ italian

[-] GCommands

- new GCommands
+ new GCommandsClient

- GCommandsOptions.slash
+ GCommandsOptions.commands

[-] GCommands v7
+ GCommandsOptions.cmdDir - need provide path, __dirname + "/commands"
+ GCommandsOptions.eventDir - need provide path, __dirname + "/events"

[-] Collectors

- createButtonCollector
- createSelectMenuCollector
+ createMessageComponentCollector
- awaitButtons
- awaitSelectMenus
+ awaitMessageComponents
```

## More Changes

- [Context Menus](../interactions/contextmenus.md)
