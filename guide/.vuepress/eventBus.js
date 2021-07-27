import Vue from 'vue';
import VueDiscordMessage from 'vue-discord-message';
export default new Vue();

Vue.use(VueDiscordMessage, {
    profiles: {
        gcommands: {
            author: 'GCommands',
            avatar: '/gcommands.png',
            roleColor: '#e67e22',
            bot: true
        },
        hyro: {
            author: 'Hyro',
            avatar: 'https://cdn.discordapp.com/attachments/841244312545001493/869305784037703700/669d6810d1a96befb80ae2e58949f424.png',
            roleColor: '#7289da'
        },
        izboxo: {
            author: 'iZboxo',
            avatar: 'https://cdn.discordapp.com/attachments/841244312545001493/869306808911683595/c20d2e33569968b9b98e6268d31160d5.png',
            roleColor: '#7289da'
        }
    },
});
