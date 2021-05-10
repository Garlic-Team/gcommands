module.exports = (client) => {
    client.on("guildMemberUpdate", async(oldMember, newMember) => {
        if(oldMember.premiumSince && newMember.premiumSince) {
            client.emit("guildMemberBoost",
                newUser,
                oldMember.premiumSince,
                newMember.premiumSince
            )
        }

        if(oldMember.premiumSince && !newMember.premiumSince) {
            client.emit("guildMemberUnboost",
                newUser,
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