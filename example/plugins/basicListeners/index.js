const {Plugin} = require('../../../dist');
const path = require('path');

new Plugin('basicListeners', {
	beforeInitialization: async (client) => {
		await client.registerDirectory(path.join(__dirname, 'listeners'));
	}
});
