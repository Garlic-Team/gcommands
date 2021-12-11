const {Component, ComponentType} = require('../../dist');

new Component('introduce', {
	type: [ComponentType.BUTTON],
	run: (ctx) => {
		ctx.reply(`Hello again ${ctx.arguments[0]}!`);
	},
	onError: (ctx) => {
		ctx.reply(`I dont want to say hello to you ${ctx.arguments[0]}`);
	}
});
