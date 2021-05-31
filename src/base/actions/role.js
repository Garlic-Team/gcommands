module.exports = (client) => {
    client.on("roleUpdate", async(oldRole, newRole) => {
        if (oldRole.rawPosition !== newRole.rawPosition) {
            client.emit('rolePositionUpdate',
                newRole,
                oldRole.rawPosition,
                newRole.rawPosition
            );
        }

        if (oldRole.permissions.bitfield !== newRole.permissions.bitfield) {
            client.emit('rolePermissionsUpdate',
                newRole,
                oldRole.permissions.bitfield,
                newRole.permissions.bitfield
            );
        }
    })
}