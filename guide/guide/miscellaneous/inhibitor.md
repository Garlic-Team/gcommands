# Inhibitor

<branch version="2.x">

For example, if you want to check if a person is on the blacklist, you must use your own event.<br>
When creating a GCommands constructor, you must add the `ownEvents` parameter.<br>
You can add whatever you want to the events.

```js {3}
new GCommands(client, {
    ...
    ownEvents: true
    ...
})
```

## Normal commands
Now let's see what the event will look like for normal commands.

```js
const {Collection} = require("discord.js")
const {Color} = require("gcommands")

if((client.slash == false) || (client.slash == "both")) {
    client.on('message', async(message) => {
        if (message.author.bot) return;
        if (!message.guild) return;
        var prefix = client.prefix;

        if(client.database.working) {
            if(client.database.type == "mongodb") {
                var guildSettings = require('./node_modules/gcommands/src/models/guild')
                const guild = await guildSettings.findOne({ id: message.guild.id })
                if(!guild || !guild.prefix) prefix = client.prefix
                else prefix = guild.prefix
            } else {
                var guildSettings = client.database.sqlite.get(`guildPrefix_${message.guild.id}`)
                if(!guildSettings) prefix = client.prefix
                else prefix = guildSettings
            }
        }
        if (!message.content.toLowerCase().startsWith(prefix)) return;
    
        const args = message.content.slice(prefix.length).trim().split(/ +/g);
        const cmd = args.shift().toLowerCase();
        
        if (cmd.length === 0) return;

        try {
            var commandos = client.commands.get(cmd);
            if(!commandos) commandos = client.commands.get(client.aliases.get(cmd));

            if (!client.cooldowns.has(cmd)) {
                client.cooldowns.set(cmd, new Collection());
            }
            
            const now = Date.now();
            const timestamps = client.cooldowns.get(cmd);
            const cooldownAmount = (commandos.cooldown ? commandos.cooldown : client.cooldownDefault) * 1000;
            
            if (timestamps.has(message.author.id)) {
                if (timestamps.has(message.author.id)) {
                    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
                
                    if (now < expirationTime) {
                        const timeLeft = (expirationTime - now) / 1000;

                        return message.channel.send(client.cooldownMessage.replace(/{cooldown}/g, timeLeft.toFixed(1)).replace(/{cmdname}/g, cmd))
                    }
                }
            }

            timestamps.set(message.author.id, now);
            setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

            if(commandos.guildOnly) {
                if(message.guild.id != commandos.guildOnly) {
                    return;
                }
            } 

            if(commandos.ownerOnly) {
                if(message.author.id != commandos.ownerOnly) {
                    return;
                }
            }

            if(commandos.requiredPermission) {
                try {
                    if(!message.member.hasPermission(commandos.requiredPermission)) {
                        message.channel.send(commandos.requiredPermissionMessage ? commandos.requiredPermissionMessage : "You don't have permissions!")
                        return;
                    }
                } catch(e) {
                    if(!message.member.permission.has(commandos.requiredPermission)) {
                        message.channel.send(commandos.requiredPermissionMessage ? commandos.requiredPermissionMessage : "You don't have permissions!")
                        return;
                    }
                }
            }

            if(commandos.requiredRole) {
                if(!message.member._roles.includes(commandos.requiredRole)) {
                    message.channel.send(commandos.requiredRoleMessage ? commandos.requiredRoleMessage : "You don't have role!")
                    return;
                }
            }

            commandos.run(client, undefined, message, args)
            client.emit("gDebug", new Color("&d[GCommands Debug] &3User &a" + message.author.id + "&3 used &a" + cmd).getText())
        } catch(e) {
            console.log(e)
            if(client.errorMessage) {
                message.channel.send(client.errorMessage);
            }
        }
    })
}
```

## Slash commands
Now let's see what the event will look like for slash commands.

```js
const {Collection,APIMessage,MessageEmbed} = require("discord.js")
const {Color} = require("gcommands")

if((client.slash) || (client.slash == "both")) {
    client.ws.on('INTERACTION_CREATE', async (interaction) => {
        try {
            var commandos = client.commands.get(interaction.data.name);
            if (!client.cooldowns.has(interaction.data.name)) {
                client.cooldowns.set(interaction.data.name, new Collection());
            }
            
            const now = Date.now();
            const timestamps = client.cooldowns.get(interaction.data.name);
            const cooldownAmount = (commandos.cooldown ? commandos.cooldown : client.cooldownDefault) * 1000;
            
            if (timestamps.has(interaction.member.user.id)) {
                if (timestamps.has(interaction.member.user.id)) {
                    const expirationTime = timestamps.get(interaction.member.user.id) + cooldownAmount;
                
                    if (now < expirationTime) {
                        const timeLeft = (expirationTime - now) / 1000;
                        client.api.interactions(interaction.id, interaction.token).callback.post({
                            data: {
                                type: 4,
                                data: {
                                    flags: 64,
                                    content: client.cooldownMessage.replace(/{cooldown}/g, timeLeft.toFixed(1)).replace(/{cmdname}/g, interaction.data.name)
                                }
                            }
                        });
                        return;
                    }
                }
            }

            timestamps.set(interaction.member.user.id, now);
            setTimeout(() => timestamps.delete(interaction.member.user.id), cooldownAmount);

            if(commandos.ownerOnly) {
                if(interaction.member.user.id != commandos.ownerOnly) {
                    return;
                }
            }

            if(commandos.requiredPermission) {
                try {
                    if(!client.guilds.cache.get(interaction.guild_id).members.cache.get(interaction.member.user.id).hasPermission(commandos.requiredPermission)) {
                        client.api.interactions(interaction.id, interaction.token).callback.post({
                            data: {
                                type: 4,
                                data: {
                                    flags: 64,
                                    content: commandos.requiredPermissionMessage ? commandos.requiredPermissionMessage : "You don't have permissions!"
                                }
                            }
                        });
                        return;
                    }
                } catch(e) {
                    if(!client.guilds.cache.get(interaction.guild_id).members.cache.get(interaction.member.user.id).permission.has(commandos.requiredPermission)) {
                        client.api.interactions(interaction.id, interaction.token).callback.post({
                            data: {
                                type: 4,
                                data: {
                                    flags: 64,
                                    content: commandos.requiredPermissionMessage ? commandos.requiredPermissionMessage : "You don't have permissions!"
                                }
                            }
                        });
                        return;
                    } 
                }
            }

            if(commandos.requiredRole) {
                if(!interaction.member.roles.includes(commandos.requiredRole)) {
                    client.api.interactions(interaction.id, interaction.token).callback.post({
                        data: {
                            type: 4,
                            data: {
                                flags: 64,
                                content: commandos.requiredRoleMessage ? commandos.requiredRoleMessage : "You don't have role!"
                            }
                        }
                    }); 
                    return;
                }
            }

            try {
                var result = await commandos.run(client, interaction)
                var data = {
                    content: result,
                    allowedMentions: { parse: [], repliedUser: true }
                }

                if (typeof result === 'object') {
                    if(typeof result == "object" && !result.content) {
                        const embed = new MessageEmbed(result)
                        data = await createAPIMessage(client, interaction, embed)
                    }
                    else if(result.ephemeral == true && typeof result.content != "object") {
                        data = {
                            content: result.content,
                            allowedMentions: { parse: [], repliedUser: true },
                            flags: 64
                        }
                    } else if(typeof result.content == "object" && result.ephemeral == true) {
                        const embed = new MessageEmbed(result.content)
                        data = await createAPIMessage(client, interaction, embed)
                    } else if(typeof result.content == "object" ) {
                        const embed = new MessageEmbed(result.content)
                        data = await createAPIMessage(client, interaction, embed)
                    } else {
                        data = {
                            content: result.content,
                            allowedMentions: { parse: [], repliedUser: true },
                        }
                    }
                }

                client.api.interactions(interaction.id, interaction.token).callback.post({
                    data: {
                    type: 4,
                    data
                    },
                })
            } catch(e) {
                client.emit("gDebug", new Color("&d[GCommands Debug] &3Check &ahttps://gcommands.js.org/#/errors/slash &eOR IGNOR").getText())
                commandos.run(client, interaction);
            }
            this.client.emit("gDebug", new Color("&d[GCommands Debug] &3User &a" + interaction.member.user.id + "&3 used &a" + interaction.data.name).getText())
        }catch(e) {
            if(client.errorMessage) {
                client.api.interactions(interaction.id, interaction.token).callback.post({
                    data: {
                        type: 4,
                        data: {
                            content: client.errorMessage
                        }
                    }
                });
            }
        }
    })
}

async function createAPIMessage(client, interaction, content) {
    const apiMessage = await APIMessage.create(client.channels.resolve(interaction.channel_id), content)
    .resolveData()
    .resolveFiles();

    return { ...apiMessage.data, files: apiMessage.files };
}
```

</branch>

<branch version="3.x">

For example, if you want to check if a person is on the blacklist, you must use addInhibitor.<br>
You need put code to ready event!

```js
client.dispatcher.addInhibitor((cmd, slash, message) => {
    if(message && message.author.id == "126454") {
        message.channel.send("blacklisted")
        return false; // stop run cmd
    }

    if(slash && slash.member.user.id == "126454") {
        client.api.interactions(slash.id, slash.token).callback.post({
            data: {
                type: 4,
                data: {
                    flags: 64,
                    content: "blacklisted"
                }
            }
        });
        return false; // stop run cmd
    }
})
```

</branch>

<branch version="4.x">

For example, if you want to check if a person is on the blacklist, you must use addInhibitor.<br>
You need put code to ready event!


```js
client.dispatcher.addInhibitor((cmd, {message, member, guild, channel, respond, edit}) => {
        if(member.id == "126454") {
            respond("blacklisted")
            return false;
        }
})
```    

```js
client.dispatcher.addInhibitor((interaction, {message, member, guild, channel, respond, edit}) => {
    if(interaction.isCommand()) {
        if(member.id == "126454") {
            respond("blacklisted")
            return false;
        }
    }

    if(interaction.isButton() || interaction.isMenu()) {
        if(member.id == "126454") {
            interaction.reply.send({content:"blacklisted", ephemeral: true})
            return false;
        }
    }
})
```
    
::: danger
The second option is for [GCommands v4.4.0 (dev build)](https://github.com/Garlic-Team/GCommands/pull/30)
:::
    
</branch>
