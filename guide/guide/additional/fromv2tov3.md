# Updating from v2 to v3

## Changes in v3

::: danger
You need to import GCommands before importing discord.js
:::

```diff
- cooldown.default
+ defaultCooldown

- cmd.requiredPermission
+ cmd.userRequiredPermissions
+ cmd.clientRequiredPermissions

- client.uset.setGuildPrefix
+ client.dispatcher.setGuildPrefix
+ guild.setCommandPrefix
- client.uset.getGuildPrefix
+ client.dispatcher.getGuildPrefix
+ guild.getCommandPrefix

- client.on("gDebug")
+ GCommands.on("debug")

- errorMessage
+ unknownCommandMessage

- cooldown.message
+ language
+ ownLanguageFile

- commandos.requiredRoleMessage
- commandos.requiredPermissionMessage

[-] Commands

- command.subCommand
- command.subCommandGroup
+ command.expectedArgs
```

## Custom Languages

You can also create your own languages/edit language messages

```js
new GCommands(client, {
  language: "czech", // english, spanish, portuguese, russian, german, czech, slovak, turkish, polish, indonesian, italian
  ownLanguageFile: require("./message.json"), // optional
});
```

Here's the [**default message.json file**](https://raw.githubusercontent.com/Garlic-Team/GCommands/dev/src/util/message.json)

## More Changes

- [Inhibitors](../miscellaneous/inhibitor.md)
- [Arguments](../miscellaneous/usingargsincmd.md)
