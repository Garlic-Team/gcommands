module.exports = {
    name: "ban",
    description: "Ban user",
    expectedArgs: "<user:6:select user>",
    userRequiredPermissions: "BAN_MEMBERS",
    clientRequiredPermissions: "BAN_MEMBERS",
    guildOnly: "747526604116459691",
    run: async(client, slash, message, args) => {
        var userId = args.user
        var guild = client.guilds.cache.find(guild => guild.id === slash.guild_id)
        var member = guild.members.cache.find(member => member.id === userId);

        return `User <@${member.id}> banned.`
  }
};