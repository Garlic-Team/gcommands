const { ButtonStyle } = require('discord.js');
const {
	Command,
	CommandType,
	MessageActionRow,
	MessageButton,
	customId,
} = require('../../dist');

new Command({
	name: 'hello',
	description: 'Says hello!',
	type: [CommandType.SLASH, CommandType.MESSAGE],
	run: ctx => {
		const row = new MessageActionRow().addComponents([
			new MessageButton()
				.setCustomId(customId('hello', ctx.userId))
				.setLabel('Click me!')
				.setStyle(ButtonStyle.Success),
		]);

		return ctx.reply({ content: `Hello ${ctx.username}!`, components: [row] });
	},
});

new (class extends Command {
	constructor() {
		super({
			name: 'hello',
			description: 'Says hello!',
			type: [CommandType.SLASH, CommandType.MESSAGE],
		});
	}

	run(ctx) {
		const row = new MessageActionRow().addComponents([
			new MessageButton()
				.setCustomId(customId('hello', ctx.userId))
				.setLabel('Click me!')
				.setStyle(ButtonStyle.Success),
		]);

		return ctx.reply({ content: `Hello ${ctx.username}!`, components: [row] });
	}
})();
