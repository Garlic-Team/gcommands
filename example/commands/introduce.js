const {Argument, ArgumentType, Command, CommandType, CustomId, MessageActionRow, MessageButton} = require('../../dist');

// You can still use classes, but you will need to put the "new" keyword front of it
new Command('introduce', {
	description: 'Introduce yourself',
	type: [CommandType.SLASH, CommandType.CONTEXT_USER],
	arguments: [
		new Argument('name', {
			description: 'Your name',
			type: ArgumentType.STRING,
			required: true,
		})
	],
	run: (ctx) => {
		// const name = ctx.arguments.array[0]?.username || ctx.arguments.array[0];
		// const name = ctx.arguments.object.user?.username || ctx.arguments.object.name;
		const name = ctx.arguments.getUser('user')?.username || ctx.arguments.getString('name');

		const row = new MessageActionRow().addComponents([
			new MessageButton()
				.setCustomId(CustomId('introduce', name, ctx.userId))
				.setLabel('Click me!')
				.setStyle('SUCCESS'),
		]);

		return ctx.reply({content: `Hello ${name}! I am ${ctx.client.user.username}.`, components: [row]});
	},
	// Called when an error occurs during the execution of run()
	onError: (ctx) => {
		return ctx.reply('I dont think I want to introduce myself to you.');
	}
});
