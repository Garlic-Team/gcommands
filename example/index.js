// const {GClient} = require('gcommands')!
require('dotenv').config();
const {GClient, Plugins, Logger} = require('../dist');
const {Intents} = require('discord.js');
const path = require('path');

// Search for plugins in node_modules (folder names starting with gcommands-plugin- or @gcommands/plugin-) or plugins folder
Plugins.search(__dirname);

// Set the log level
Logger.setLevel(Logger.TRACE);

const client = new GClient({
	dirs: [
		path.join(__dirname, 'commands'),
		path.join(__dirname, 'components'),
		path.join(__dirname, 'listeners')
	],
	messagePrefix: '!',
	devGuildId: process.env.DEV_SERVER,
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

// See commands/introduce.js (new syntax)
// See commands/class.js (old class syntax)
// See components/introduce.js (new syntax)
// See listeners/ready.js (new syntax)

client.on('error', console.log);
client.on('warn', console.log);

client.login(process.env.token);
