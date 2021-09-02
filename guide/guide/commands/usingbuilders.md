# Using the command builders

## The CommandOptionsBuilder

The `CommandOptionsBuilder` can be used to create CommandOptions, like the name or description of a command.

```js
const { Command, CommandOptionsBuilder } = require("gcommands");

module.exports = class extends Command {
    constructor(client) {
        super(client, new CommandOptionsBuilder()
            .setName('example')
            .setDescription('This is a example')
            .setCooldown('2s')
            .setContext(false)
            // And all other options
        );
    }
};
```

## The CommandArgsOptionBuilder

The `CommandArgsOptionBuilder` can be used to create new arguments.

```js
const { Command, ArgumentType, CommandOptionsBuilder, CommandArgsOptionBuilder } = require("gcommands");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, new CommandOptionsBuilder()
            // Add one argument
            .addArg(new CommandArgsOptionBuilder()
                .setName('message')
                .setDescription('The example message')
                .setPrompt('What is your example message?')
                .setRequired(true)
                .setType(ArgumentType.STRING)
            )
            // Add a array of arguments
            .addArgs([
                new CommandArgsOptionBuilder()
                .setName('message')
                .setDescription('The example message')
                .setPrompt('What is your example message?')
                .setRequired(true)
                .setType(ArgumentType.STRING),
            ])
        );
    }
};
```

## The CommandArgsChoiceOptionBuilder

The `CommandArgsChoiceBuilder` can be used to create new argument choices.

```js
const { Command, ArgumentType, CommandOptionsBuilder, CommandArgsOptionBuilder, CommandArgsChoiceBuilder } = require("gcommands");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, new CommandOptionsBuilder()
            .addArg(new CommandArgsOptionBuilder()
                // Add one choice
                .addChoice(new CommandArgsChoiceBuilder()
                    .setName('true')
                    .setValue(true)
                )
                // Add a array of choices
                .addChoices([
                    new CommandArgsChoiceBuilder()
                        .setName('true')
                        .setValue(true),
                ])
            )
        );
    }
};
```