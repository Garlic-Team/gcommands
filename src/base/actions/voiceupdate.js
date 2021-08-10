module.exports = client => {
    client.on('voiceStateUpdate', (oldState, newState) => {
        const newMember = newState.member;

        if (!oldState.channel && newState.channel) {
            client.emit('voiceChannelJoin',
                newMember,
                newState.channel,
            );
        }

        if (oldState.channel && !newState.channel) {
            client.emit('voiceChannelLeave',
                newMember,
                oldState.channel,
            );
        }

        if (oldState.channel && newState.channel && oldState.channel.id !== newState.channel.id) {
            client.emit('voiceChannelSwitch',
                newMember,
                oldState.channel,
                newState.channel,
            );
        }

        if (!oldState.mute && newState.mute) {
            let muteType = newState.selfMute ? 'self-muted' : 'server-muted';
            client.emit('voiceChannelMute',
                newMember,
                muteType,
            );
        }

        if (oldState.mute && !newState.mute) {
            let muteType = oldState.selfMute ? 'self-muted' : 'server-muted';
            client.emit('voiceChannelUnmute',
                newMember,
                muteType,
            );
        }

        if (!oldState.deaf && newState.deaf) {
            let deafType = newState.selfDeaf ? 'self-deafened' : 'server-deafened';
            client.emit('voiceChannelDeafen',
                newMember,
                deafType,
            );
        }

        if (oldState.deaf && !newState.deaf) {
            let deafType = oldState.selfDeaf ? 'self-deafened' : 'server-deafened';
            client.emit('voiceChannelUndeafen',
                newMember,
                deafType,
            );
        }

        if (!oldState.streaming && newState.streaming) {
            client.emit('voiceStreamingStart',
                newMember,
                newState.channel,
            );
        }

        if (oldState.streaming && !newState.streaming) {
            client.emit('voiceStreamingStop',
                newMember,
                newState.channel,
            );
        }
    });
};
