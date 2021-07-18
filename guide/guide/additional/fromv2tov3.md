# Updating from v2 to v3
Version gcommands v3 adds new features!

::: danger
Need import GCmmands **before** creating new Discord.Client
:::

```diff
[-] GCommands Options

- cooldown.default
+ defaultCooldown

- cmd.requiredPermission
+ cmd.userRequiredPermissions
+ cmd.clientRequiredPermissions

- client.user.setGuildPrefix
- client.user.getGuildPrefix
+ client.dispatcher.setGuildPrefix(prefix, id)
+ client.dispatcher.getGuildPrefix()

+ guild.getCommandPrefix()
+ guild.setCommandPrefix(prefix)

- client.on("gDebug")
+ new GCommands().on("debug")

- errorMessage
+ unkownCommandMessage: true/false

- cooldown.message: "Please wait {cooldown} more second(s) before reusing the \`{cmdname}\` command."
- commandos.requiredRoleMessage
- commandos.requiredPermissionMessage
+ language: "czech", //english, spanish, portuguese, russian, german, czech
+ ownLanguageFile: require("./message.json")
```

## Custom Language
Do you want to customize the messages for you? So just do the following things.

```js
new GCommands(client, {
    language: "czech", //english, spanish, portuguese, russian, german, czech
    ownLanguageFile: require("./message.json") // no required
})
```

```diff
[-] GCommands Options

- cooldown.message: "Please wait {cooldown} more second(s) before reusing the \`{cmdname}\` command."
- errorMessage: "Unkown command"
- commandos.requiredRoleMessage
- commandos.requiredPermissionMessage
+ language: "czech", //english, spanish, portuguese, russian, german, czech
+ ownLanguageFile: require("./message.json")
+ unkownCommandMessage: true/false
```

Create a message.json where you can then put this:
```json
{
    "MISSING_PERMISSIONS": {
		"english": "You must have the {PERMISSION} permission in order to use this command.",
		"spanish": "Debe tener el permiso {PERMISSION} para poder utilizar este comando.",
		"portuguese": "Você precisa ter a permissão {PERMISSION} para utilizar este comando.",
		"russian": "У вас должно быть право {PERMISSION}, чтобы использовать эту команду. ",
		"german": "Du benötigst die Berechtigung {PERMISSION}, um diesen Befehl nutzen zu können.",
        "czech": "Chybí ti {PERMISSION} oprávnění k použití tohoto příkazu.",
		"slovak": "Chýba ti {PERMISSION} oprávnenie k použitiu tohoto príkazu."
    },
    "MISSING_CLIENT_PERMISSIONS": {
		"english": "The client must have {PERMISSION} permission to use this command.",
		"spanish": "Para usar este comando, el cliente debe tener el permiso {PERMISSION}.",
		"portuguese": "O cliente deve ter permissão {PERMISSION} para usar este comando.",
		"russian": "Чтобы использовать эту команду, клиент должен иметь полномочия {PERMISSION}.",
		"german": "Der Client benötigt die Berechtigung {PERMISSION}, um diesen Befehl verwenden zu können.",
        "czech": "Client musí mít {PERMISSION} oprávnění k použití tohoto příkazu.",
		"slovak": "Client musí mať {PERMISSION} oprávnenia k použitiu tohoto príkazu."
    },
	"MISSING_ROLES": {
		"english": "You do not have the required roles to use this command! You need one of the following: {ROLES}",
		"spanish": "¡No tienes los roles necesarios para usar este comando! Necesita uno de los siguientes: {ROLES}",
		"portuguese": "Você não tem o cargo necessário para usar este comando! Você precisa de um dos seguintes: {ROLES}",
		"russian": "У вас нет необходимых ролей для использования этой команды! Вам понадобится одно из следующего: {ROLES}",
		"german": "Sie haben nicht die erforderlichen Rollen, um diesen Befehl zu verwenden! Sie benötigen eine der folgenden Möglichkeiten: {ROLES}",
        "czech": "Nemáš potřebné role na použití tohoto příkazu! Potřebuješ jednu z: {ROLES}",
		"slovak": "Nemáš potrebné role na použitie tohito príkazu! Potrebuješ jednu z: {ROLES}"
	},
	"COOLDOWN": {
		"english": "You must wait {COOLDOWN} before using that command again.",
		"spanish": "Debe esperar {COOLDOWN} antes de usar ese comando nuevamente.",
		"portuguese": "Você precisa esperar {COOLDOWN} antes de usar este comando novamente.",
		"russian": "Вы должны подождать {COOLDOWN} перед использованием данной команды снова.",
		"german": "Du musst {COOLDOWN} warten, bevor du diesen Befehl erneut nutzen kannst.",
        "czech": "Počkej {COOLDOWN}, než použiješ příkaz znova.",
		"slovak": "Počkaj {COOLDOWN}, skôr ako použiješ príkaz znova."
	},
	"UNKNOWN_COMMAND": {
		"english": "Could not find command {COMMAND}!",
		"spanish": "¡No se pudo encontrar el comando {COMMAND}!",
		"portuguese": "Não foi possível encontrar o comando {COMMAND}!",
		"russian": "Не удалось найти команду {COMMAND}!",
		"german": "Konnte den Befehl {COMMAND} nicht finden!",
		"czech": "Příkaz {COMMAND} nebyl nalezen!",
		"slovak": "Príkaz {COMMAND} nebol nájdený!"
	}
}
```

## Own Events
For example, if you want to check if a person is on the blacklist, you must use addInhibitor.<br>
You need put code to ready event!

```diff
[-] GCommands Option
- ownEvents: true

[-] GCommands Function (put to on ready event)
+ client.dispatcher.addInhibitor((cmd, slash, message) => {})
+ client.dispatcher.removeInhibitor((cmd, slash, message) => {})
```

```js
client.dispatcher.addInhibitor((cmd, slash, message) => {
    if(message && message.author.id == "126454") {
        message.channel.send("blacklisted")
        return false; // stop run cmd
    }

    if(slash && slash.member.user.id == "126454") {
        client.api.interactions(slash.id, slash.token).callback.post({
            data: {
                type: 4,
                data: {
                    flags: 64,
                    content: "blacklisted"
                }
            }
        });
        return false; // stop run cmd
    }
})
```

## Sub Command + Sub Command Group

```diff
* Deprecated options:
	- cmd.subCommand
	- cmd.subCommandGroup

* Stable options:
	+ cmd.expectedArgs
```

Example:
```js
const { SlashCommand } = require("gcommands")

module.exports = {
	name: "test",
	aliases: ["ccc"],
	description: "Test",
	expectedArgs: [
        {
            name: "user",
            description: "Get or edit permissions for a user",
            type: SlashCommand.SUB_COMMAND_GROUP,
            options: [
                {
                    name: "get",
                    description: "Get permissions for a user",
                    type: SlashCommand.SUB_COMMAND,
                    options: [
                        {
                            name: "user",
                        	description: "The user to get",
                            type: SlashCommand.USER,
                            required: true
                        }
                    ]
                },
                {
                    name: "edit",
                    description: "Edit permissions for a user",
                    type: SlashCommand.SUB_COMMAND
                }
            ]
        },
        {
            name: "role",
            description: "Get or edit permissions for a role",
            type: SlashCommand.SUB_COMMAND_GROUP,
            options: [
                {
                    name: "get",
                    description: "Get permissions for a role",
                    type: SlashCommand.SUB_COMMAND,
                    options: [
                        {
                            name: "role",
                        	description: "The role to get",
                            type: SlashCommand.ROLE,
                            required: true
                        }
                    ]
                },
                {
                    name: "edit",
                    description: "Edit permissions for a role",
                    type: SlashCommand.SUB_COMMAND
                }
            ]
        }
	],
	run: async(client, slash, message, args) => {
		console.log(args)
		return 'hi'
	}
};
```