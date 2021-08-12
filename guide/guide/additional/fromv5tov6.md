# Updating from v5 to v6

## Changes in v6

```diff
+ multi character prefix
+ usage parameters
+ Number argument type
+ mentionable argument type for message commands

[-] Command
+ command.channelThreadOnly // djs v13+ only
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
+ interaction.setCustomID

[-] Translations

+ indonesian
+ italian

[-] GCommands

- new GCommands
+ new GCommandsClient

- GCommandsOptions.slash
+ GCommandsOptions.commands

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
