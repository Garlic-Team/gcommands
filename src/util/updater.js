const axios = require("axios")
const { writeFileSync, readFileSync } = require("fs")
const { version } = require('discord.js');

module.exports = {
    /**
     * Internal method to update
     * @returns {void}
     * @private
    */
    __updater: async function() {
        var { Color } = require("../index")
        var version = require("../index").version

        var GCommandsUpdater = await axios.get("https://registry.npmjs.org/gcommands")
        var stableVersion = GCommandsUpdater.data["dist-tags"].latest

        if(stableVersion != version && !version.includes("dev")) {
            console.log(new Color("&d[GCommands Updater] &cPlease update GCommands &ehttps://npmjs.org/package/gcommands").getText())
        } else if(version.includes("dev")) {
            console.log(new Color("&d[GCommands Updater] &cYou have &eDEV &cversion of GCommands &ehttps://gcommands.js.org&c and select dev version.").getText())
        }
    },

    checkDjsVersion: function(needVer) {
        var ver = parseInt(version.split("")[0] + version.split("")[1]);
        if(ver == parseInt(needVer)) {
            return true;
        } else {
            return false;
        }
    }
}