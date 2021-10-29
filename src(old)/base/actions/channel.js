module.exports = client => {
    client.on('channelUpdate', (oldChannel, newChannel) => {
        if (oldChannel.permissionOverwrites !== newChannel.permissionOverwrites) {
            client.emit('guildChannelPermissionsUpdate',
                newChannel,
                oldChannel.permissionOverwrites,
                newChannel.permissionOverwrites,
            );
        }

        if (oldChannel.type === 'text' && oldChannel.topic !== newChannel.topic) {
            client.emit('guildChannelTopicUpdate',
                newChannel,
                oldChannel.topic,
                newChannel.topic,
            );
        }

        if (oldChannel.type === 'text' && oldChannel.nsfw !== newChannel.nsfw) {
            client.emit('guildChannelNSFWUpdate',
                newChannel,
                oldChannel.nsfw,
                newChannel.nsfw,
            );
        }

        if (oldChannel.type !== newChannel.type) {
            client.emit('guildChannelTypeUpdate',
                newChannel,
                oldChannel.type,
                newChannel.type,
            );
        }

        if (oldChannel.type === 'voice' && oldChannel.userLimit !== newChannel.userLimit) {
            client.emit('guildChannelUserLimitUpdate',
                newChannel,
                oldChannel.userLimit,
                newChannel.userLimit,
            );
        }

        if (oldChannel.type === 'voice' && oldChannel.bitrate !== newChannel.bitrate) {
            client.emit('guildChannelBitrateUpdate',
                newChannel,
                oldChannel.bitrate,
                newChannel.bitrate,
            );
        }
    });
};
