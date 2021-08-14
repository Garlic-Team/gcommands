const { MessageComponentTypes } = require('../util/Constants');

/**
 * The BaseMessageComponent
 */
class BaseMessageComponent {
    /**
     * Creates new BaseMessageComponent instance
     * @param {Object} data
     */
    constructor(data) {
        /**
         * The component's type
         * @type {string}
         */
        this.type = MessageComponentTypes[data.type];
    }

    /**
     * Create
     * @param {Object} data
     * @returns {MessageActionRow | MessageButton | MessageSelectMenu | MessageSelectMenuOption}
     */
    static create(data) {
        let component;
        let type = data.type;

        if (typeof type === 'string') type = MessageComponentTypes[type];

        switch (type) {
            case MessageComponentTypes.ACTION_ROW:
                const MessageActionRow = require('./MessageActionRow'); // eslint-disable-line no-case-declarations
                component = new MessageActionRow(data);
                break;
            case MessageComponentTypes.BUTTON:
                const MessageButton = require('./MessageButton'); // eslint-disable-line no-case-declarations
                component = new MessageButton(data);
                break;
            case MessageComponentTypes.SELECT_MENU:
                const MessageSelectMenu = require('./MessageSelectMenu'); // eslint-disable-line no-case-declarations
                component = new MessageSelectMenu(data);
                break;
            case 'SELECT_MENU_OPTION':
                const MessageSelectMenuOption = require('./MessageSelectMenuOption'); // eslint-disable-line no-case-declarations
                component = new MessageSelectMenuOption(data);
                break;
        }
        return component;
    }
}

module.exports = BaseMessageComponent;
