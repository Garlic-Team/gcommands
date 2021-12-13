const {Component, ComponentType} = require('../../dist');

new Component('hello', {
	type: [ComponentType.BUTTON],
	run: (ctx) => {
		return ctx.reply(`Hello again ${ctx.username}!`);
	}
});

new class extends Component {
	constructor() {
		super('hello', {
			type: [ComponentType.BUTTON],
		});
	}

	run(ctx) {
		return ctx.reply(`Hello again ${ctx.username}!`);
	}
};
