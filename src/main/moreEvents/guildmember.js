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
    })
}