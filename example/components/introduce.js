const {Component, ComponentType} = require('../../dist');

// You can still use classes, but you will need to put the "new" keyword front of it
new Component({
	name: 'introduce',
	type: [ComponentType.BUTTON],
	run: (ctx) => {
		ctx.reply(`Hello again ${ctx.arguments[0]}!`);
	},
	onError: (ctx) => {
		ctx.reply(`I dont want to say hello to you ${ctx.arguments[0]}`);
	}
});
