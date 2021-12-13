const {Command, CommandType, MessageActionRow, MessageButton, CustomId} = require('../../dist');

new Command('hello', {
	description: 'Says hello!',
	type: [CommandType.SLASH, CommandType.MESSAGE],
	run: (ctx) => {
		const row = new MessageActionRow().addComponents([
			new MessageButton()
				.setCustomId(CustomId('hello', ctx.userId))
				.setLabel('Click me!')
				.setStyle('SUCCESS')
		]);

		return ctx.reply({content: `Hello ${ctx.username}!`, components: [row]});
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
		const row = new MessageActionRow().addComponents([
			new MessageButton()
				.setCustomId(CustomId('hello', ctx.userId))
				.setLabel('Click me!')
				.setStyle('SUCCESS')
		]);

		return ctx.reply({content: `Hello ${ctx.username}!`, components: [row]});
	}
};
