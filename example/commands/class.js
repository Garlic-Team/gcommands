const {Command, CommandType, CommandContext} = require('../../dist');

// Example of class command
class Class extends Command {
    constructor() {
        super('class', {
            description: 'Class command',
            type: [CommandType.SLASH, CommandType.MESSAGE]
        })
    }

    /**
     * @param {CommandContext} ctx 
     */
    run(ctx) {
        ctx.reply('Hello, I\'m in class!')
    }
}

module.exports = new Class();