const {Command, CommandType} = require('../../dist');

new Command('hello', {
	description: 'Says hello!',
	type: [CommandType.SLASH, CommandType.MESSAGE],
	run: (ctx) => {
		return ctx.reply(`Hello ${ctx.username}!`);
	}
});

new class extends Command {
	constructor() {
		super('hello-class', {
			description: 'Says hello!',
			type: [CommandType.SLASH, CommandType.MESSAGE],
		});
	}

	run(ctx) {
		return ctx.reply(`Hello ${ctx.username}!`);
	}
};
