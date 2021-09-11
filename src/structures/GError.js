const Color = require('./Color');

class GError extends Error {
    constructor(name, message) {
        super(message);
        this.message = new Color(`&c${message}`).getText();
        this.name = new Color(`&a${name}`).getText();
    }
}

module.exports = GError;
