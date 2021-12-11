const hyttpo = require('hyttpo').default;

module.exports = {
    /**
     * Internal method to check version
     * @returns {void}
     * @private
    */
    __updater: async function() {
        const { Color } = require('../index');
        const version = require('../index').version;

        const GCommandsUpdater = await hyttpo.get('https://registry.npmjs.org/gcommands');
        const stableVersion = GCommandsUpdater.data['dist-tags'].latest;

        if (stableVersion !== version && !version.includes('dev')) {
            console.log(new Color('&d[GCommands Updater] &cPlease update GCommands &ehttps://npmjs.org/package/gcommands').getText());
        } else if (version.includes('dev')) {
            console.log(new Color('&d[GCommands Updater] &cYou have &eDEV &cversion of GCommands &ehttps://gcommands.js.org&c and select dev version.').getText());
        }
    },
};
