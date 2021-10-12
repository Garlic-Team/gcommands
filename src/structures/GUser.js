const { User } = require('discord.js');

/**
 * The GUser class
 * @extends User
 */
class GUser {
    constructor() {
        Object.defineProperties(User.prototype, {
            getData: {
                value: async function(options = {}) {
                    const data = await this.client.dispatcher.getUserData(this.id, options);
                    if (data) this.data = data;
                    return data;
                },
            },
        });
    }

    /* eslint-disable no-empty-function */

    /**
     * Method to getData
     * @param {object} options
     * @returns {object}
    */
    getData() { }
}

module.exports = GUser;
