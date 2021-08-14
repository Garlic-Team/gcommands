module.exports = client => {
    client.on('userUpdate', (oldUser, newUser) => {
        if (oldUser.displayAvatarURL() !== newUser.displayAvatarURL()) {
            client.emit('userAvatarUpdate',
                newUser,
                oldUser.displayAvatarURL(),
                newUser.displayAvatarURL(),
            );
        }

        if (oldUser.username !== newUser.username) {
            client.emit('userUsernameUpdate',
                newUser,
                oldUser.username,
                newUser.username,
            );
        }

        if (oldUser.discriminator !== newUser.discriminator) {
            client.emit('userDiscriminatorUpdate',
                newUser,
                oldUser.discriminator,
                newUser.discriminator,
            );
        }


        if (oldUser.flags !== newUser.flags) {
            client.emit('userFlagsUpdate',
                newUser,
                oldUser.flags,
                newUser.flags,
            );
        }
    });
};
