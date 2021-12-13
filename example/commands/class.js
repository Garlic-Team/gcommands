const {Command, CommandType, CommandContext, UserRolesInhibitor} = require('../../dist');

// Example of class command
class Class extends Command {
    constructor() {
        super('class', {
            description: 'Class command',
            type: [CommandType.SLASH, CommandType.MESSAGE],
            inhibitors: [
                new UserRolesInhibitor(['777805077825060867', '756519579282309130'], true)
            ]
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