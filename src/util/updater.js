const axios = require('axios')
const { version } = require('discord.js');

module.exports = {
    /**
     * Internal method to update
     * @returns {void}
     * @private
    */
    __updater: async function() {
        let { Color } = require('../index')
        let version = require('../index').version

        let GCommandsUpdater = await axios.get('https://registry.npmjs.org/gcommands')
        let stableVersion = GCommandsUpdater.data['dist-tags'].latest

        if(stableVersion !== version && !version.includes('dev')) {
            console.log(new Color('&d[GCommands Updater] &cPlease update GCommands &ehttps://npmjs.org/package/gcommands').getText())
        } else if(version.includes('dev')) {
            console.log(new Color('&d[GCommands Updater] &cYou have &eDEV &cversion of GCommands &ehttps://gcommands.js.org&c and select dev version.').getText())
        }
    },

    /**
     * Internal method to checkDjsVersion
     * @returns {Boolean}
     * @private
    */
    checkDjsVersion: function(needVer) {
        let ver = parseInt(version.split('')[0] + version.split('')[1]);
        if(ver == parseInt(needVer)) {
            return true;
        } else {
            return false;
        }
    }
}