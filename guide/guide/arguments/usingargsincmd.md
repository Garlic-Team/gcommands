# Using arguments in commands
Arguments in commands can make a lot of things easier for you. They can also be useful if you want to do a command such as `!/ban @user`.

##  String arguments
A `string` argument is simply the text after the command name and prefix.  
For the example from the `!/say Hello` command, argument 0 will be `Hello`.  
This system also works for the slash and normal command.

```js
const { Command, ArgumentType } = require("gcommands");

module.exports = class SayCommand extends Command {
    constructor(...args) {
        super(...args, {
            name: "say",
            aliases: ["send"],
            userRequiredPermissions: "MANAGE_MESSAGES",
            args: [
                {
                    name: "text",
                    type: ArgumentType.STRING,
                    description: "text", // only for slash 
                    prompt: "What do you want to send?", // only for normal
                    choices: [
                        {
                            name: "embed",
                            value: "embed"
                        },
                        {
                            name: "link",
                            value: "link"
                        }
                    ]
                    required: true // only slash
                }
            ]
        })
    }

    async run({client, respond}, args) {
        respond(args.join(" "))
    }
}
```

<div is="discord-messages">
    <discord-messages>
        <dis-message profile="gcommands">
            <template #interactions>
                <discord-interaction profile="hyro" :command="true">say hello</discord-interaction>
            </template>
            hello
        </dis-message>
    </discord-messages>
    <discord-messages>
            <dis-message profile="izboxo">
            .say
        </dis-message>
        <dis-message profile="gcommands">
            What do you want to send?
        </dis-message>
        <dis-message profile="izboxo">
            hello
        </dis-message>
        <dis-message profile="gcommands">
            hello
        </dis-message>
    </discord-messages>
</div>

::: tip
If you want to know more about how the `args` object works for `SUB_COMMAND` and `SUB_COMMAND_GROUP` you can take a look [here](https://discord.com/developers/docs/interactions/slash-commands#example-walkthrough).
:::

## All types of arguments:
```js
const { ArgumentType } = require("gcommands")
ArgumentType.STRING
ArgumentType.INTEGER
ArgumentType.BOOLEAN
ArgumentType.USER
ArgumentType.CHANNEL
ArgumentType.ROLE
ArgumentType.MENTIONABLE // only for slash
ArgumentType.SUB_COMMAND_GROUP // only for slash
ArgumentType.SUB_COMMAND // only for slash
```
