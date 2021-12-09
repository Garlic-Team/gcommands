module.exports = client => {
    client.on('threadUpdate', (oldThread, newThread) => {
        if (oldThread.archived !== newThread.archived) {
            client.emit('threadStateUpdate', oldThread, newThread);
        }
        if (oldThread.name !== newThread.name) {
            client.emit('threadNameUpdate', newThread, oldThread.name, newThread.name);
        }
        if (oldThread.locked !== newThread.locked) {
            client.emit('threadLockStateUpdate', oldThread, newThread);
        }
        if (oldThread.rateLimitPerUser !== newThread.rateLimitPerUser) {
            client.emit('threadRateLimitPerUserUpdate', newThread, oldThread.rateLimitPerUser, newThread.rateLimitPerUser);
        }
        if (oldThread.autoArchiveDuration !== newThread.autoArchiveDuration) {
            client.emit('threadAutoArchiveDurationUpdate', newThread, oldThread.autoArchiveDuration, newThread.autoArchiveDuration);
        }
    });
}