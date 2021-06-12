module.exports = (client) => {
    client.on("guildMemberUpdate", async(oldMember, newMember) => {
        if(oldMember.premiumSince && newMember.premiumSince) {
            client.emit("guildMemberBoost",
                newMember,
                oldMember.premiumSince,
                newMember.premiumSince
            )
        }

        if(oldMember.premiumSince && !newMember.premiumSince) {
            client.emit("guildMemberUnboost",
                newMember,
                oldMember.premiumSince,
                newMember.premiumSince
            )
        }

        if (oldMember.nickname != newMember.nickname) {
            client.emit('guildMemberNicknameUpdate',
                newMember,
                oldMember.nickname,
                newMember.nickname
            );
        }

        if((oldMember.nickname == newMember.nickname) && (newMember.lastMessageID == null) && (newMember.lastMessageChannelID == null) && (oldMember.premiumSince == newMember.premiumSince) && (oldMember._roles.length == 0) && (newMember._roles.length == 0)) {
            client.emit('guildMemberAcceptRules',
                newMember
            );
        }
    })
}