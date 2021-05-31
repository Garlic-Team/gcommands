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

        if(stableVersion != version && !version.includes("beta")) {
            console.log(new Color("&d[GCommands Updater] &cPlease update GCommands &ehttps://npmjs.org/package/gcommands").getText())
        } else if(version.includes("beta")) {
            console.log(new Color("&d[GCommands Updater] &cYou have &eBETA &cversion of GCommands &ehttps://gcommands.js.org&c and select dev version.").getText())
        }

        if(stableVersion == "3.1.1") {
            try {readFileSync("./updated.txt")}catch(e){writeFileSync('updated.txt', 'no', function (err) {});}
            if(readFileSync("./updated.txt") == "yes") return;
            const readline = require('readline').createInterface({
                input: process.stdin,
                output: process.stdout
            });

            readline.question(new Color('&d[GComamnds Updater] &cDid you adjust everything that was necessary? More on &ehttps://gcommands.js.org/guide/additional/fromv2tov3.html: &3').getText(), input => {
                if(input == "yes") {
                    writeFileSync('updated.txt', 'yes', function (err) {});
                    console.log(new Color("&d[GCommands Updater] &eOkay :D").getText())
                } else {
                    console.log(new Color('&d[GComamnds Updater] &cCheck https://gcommands.js.org/guide/additional/fromv2tov3.html').getText())
                }
                readline.close();
            })
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