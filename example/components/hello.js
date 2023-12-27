const { Component, ComponentType } = require('../../dist');

new Component({
	name: 'hello',
	type: [ComponentType.BUTTON],
	run: ctx => {
		return ctx.reply(`Hello again ${ctx.user.username}!`);
	},
});

new (class extends Component {
	constructor() {
		super({
			name: 'hello',
			type: [ComponentType.BUTTON],
		});
	}

	run(ctx) {
		return ctx.reply(`Hello again ${ctx.user.username}!`);
	}
})();
