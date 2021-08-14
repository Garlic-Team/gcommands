const { default: axios } = require('axios');
const ifDjsV13 = require('../../util/util').checkDjsVersion('13');

module.exports = client => {
    client.on('guildMemberUpdate', async (oldMember, newMember) => {
        if (oldMember.premiumSince && newMember.premiumSince) {
            client.emit('guildMemberBoost',
                newMember,
                oldMember.premiumSince,
                newMember.premiumSince,
            );
        }

        if (oldMember.premiumSince && !newMember.premiumSince) {
            client.emit('guildMemberUnboost',
                newMember,
                oldMember.premiumSince,
                newMember.premiumSince,
            );
        }

        if (oldMember.nickname !== newMember.nickname) {
            client.emit('guildMemberNicknameUpdate',
                newMember,
                oldMember.nickname,
                newMember.nickname,
            );
        }

        if ((oldMember.nickname === newMember.nickname) && (newMember.lastMessageID === null) && (newMember.lastMessageChannelID === null) && (oldMember.premiumSince === newMember.premiumSince) && (oldMember._roles.length === 0) && (newMember._roles.length === 0)) {
            let url = `https://discord.com/api/v9/guilds/${newMember.guild.id}/members/${newMember.user.id}`;

            let config = {
                method: 'GET',
                headers: {
                    Authorization: `Bot ${client.token}`,
                    'Content-Type': 'application/json',
                },
                url,
            };

            let response;
            if (!ifDjsV13) response = (await axios(config)).data;
            else response = { pending: newMember.pending };

            if (response.pending) return;

            client.emit('guildMemberAcceptShipScreening',
                newMember,
            );
        }
    });
};
