const {Command, CommandType, Argument, ArgumentType} = require('../../dist');

new Command('autocomplete', {
    description: 'The autocomplete command',
    type: [CommandType.SLASH],
    arguments: [
        new Argument('subcommand', {
            description: 'Subcommand',
            type: ArgumentType.SUB_COMMAND,
            options: [
                new Argument('string', {
                    description: 'String input',
                    type: ArgumentType.STRING,
                    run: (ctx) => {
                        ctx.respond([
                            {
                                name: 'Red',
                                value: 'red',
                            }
                        ]);
                    }
                }),
            ]
        })
    ],
    run: async (ctx) => {
        await ctx.reply({content: ctx.arguments.getString('string')});
    },
    onError: (ctx) => {
        return ctx.reply('This command sucks.');
    }
});