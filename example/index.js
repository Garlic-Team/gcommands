// const {GClient} = require('gcommands')!
const {GClient} = require('../dist');
const {Intents} = require('discord.js');
const path = require('path');

// Search for plugins in node_modules (folder names starting with gcommands-plugin-) or plugins folder
GClient.gplugins.search(__dirname);

const client = new GClient({
	dirs: [
		path.join(__dirname, 'commands'),
		path.join(__dirname, 'components')
	],
	devServer: '801033840059088897',
	cooldown: '30s',
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

// See commands/introduce.js
// See components/introduce.js
// See plugins/basicListeners/

client.on('error', console.log);
client.on('warn', console.log);

client.login('ODAyNTYyNDcxMDU0NDA5NzU4.YAxCiw.gXtzZ3PACzwufZEfSxoPNyAOdU0');
