// const {GClient} = require('gcommands')!
require('dotenv').config();
const {GClient} = require('../dist');
const {Intents} = require('discord.js');
const path = require('path');

// Search for plugins in node_modules (folder names starting with gcommands-plugin-) or plugins folder
GClient.gplugins.search(__dirname);

// Alternative for setting options in client (mainly for plugins):
/*
GClient.registerDirectories([
	path.join(__dirname, 'commands'),
	path.join(__dirname, 'components'),
	path.join(__dirname, 'listeners')
]);
GClient.setMessagePrefix('!');
GClient.setDevServer(process.env.DEV_SERVER);
GClient.setCooldown('30s');
*/


const client = new GClient({
	dirs: [
		path.join(__dirname, 'commands'),
		path.join(__dirname, 'components'),
		path.join(__dirname, 'listeners')
	],
	messagePrefix: '!',
	devGuildId: process.env.DEV_SERVER,
	cooldown: '30s',
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

// See commands/introduce.js
// See components/introduce.js
// See listeners/ready.js

// Plugins Example
// See plugins/basicListeners/

client.on('error', console.log);
client.on('warn', console.log);

client.login(process.env.token);
