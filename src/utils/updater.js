const axios = require("axios")

module.exports = {
    __updater: async function() {
        var { Color } = require("../index")
        var version = require("../index").version

        var GCommandsUpdater = await axios.get("https://registry.npmjs.org/gcommands")
        var stableVersion = GCommandsUpdater.data["dist-tags"].latest

        if(stableVersion != version && !version.includes("beta")) {
            console.log(new Color("&d[GCommands Updater] &cPlease update GCommands &ehttps://npmjs.org/package/gcommands").getText())
        } else if(version.includes("beta")) {
            console.log(new Color("&d[GCommands Updater] &cYou have &eBETA &cversion of GCommands &ehttps://gcommands.js.org&c and select dev version.").getText())
        }
    }
}