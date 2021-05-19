const Color = require("./color/Color");

/**
 * The Buttons class
 * @class Buttons
 */
module.exports = class Buttons {

    /**
     * Creates new Buttons instance
     * @param {ButtonsOptions} options 
    */
    constructor(options = {}) {
        if (!options.buttons) {
            options.buttons = [];
        }

        if (!Array.isArray(options.buttons)) {
            return console.log(new Color("&d[GCommands] &cThe buttons must be array.",{json:false}).getText());
        }

        var buttons = [];
        var styles = ['blupurple', 'grey', 'green', 'red', 'url'];

        options.buttons.forEach((x, i) => {
            if (!x.style) x.style = 'blupurple';

            if (!styles.includes(x.style)) {
                return console.log(new Color(`&d[GCommands] &c#${i} button has invalid style, recived ${x.style}`,{json:false}).getText());
            }

            if (!x.label) {
                return console.log(new Color(`&d[GCommands] &c#${i} don't has label!`,{json:false}).getText());
            }

            if (typeof (x.label) !== 'string') x.label = String(x.label);

            if (x.style === 'url') {
                if (!x.url) {
                    return console.log(new Color(`&d[GCommands] &cIf the button style is "url", you must provide url`,{json:false}).getText());
                }
            } else {
                if (!x.id) {
                    return console.log(new Color(`&d[GCommands] &cIf the button style is not "url", you must provide custom id`,{json:false}).getText());
                }
            }

            var style;

            if (x.style === 'blupurple') {
                style = 1;
            } else if (x.style === 'grey') {
                style = 2;
            } else if (x.style === 'green') {
                style = 3;
            } else if (x.style === 'red') {
                style = 4;
            } else if (x.style === 'url') {
                style = 5;
            }

            var data = {
                type: 2,
                style: style,
                label: x.label,
                custom_id: x.id || null,
                url: x.url || null
            }

            buttons.push(data);
        })

        return buttons;
  }
}