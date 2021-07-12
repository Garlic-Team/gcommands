# Working with arguments

<language lang="en">

For example, if you want a command like ban, you need arguments to identify the person.
We will now show an example on the ban command

</language>
<language lang="tk">

Örnek vermek gerekirse, yasaklama komutu yapmak istiyorsun. Yasaklayacağın kişinin bilgilerini almak için argüman kullanmak zorundasın.
Şimdi aşağıda örnek yasaklama komutunu gösterelim.

</language>

## Normal Arguments
<branch version="2.x">

```js
module.exports = {
    name: "ban",
    description: "Ban user",
    requiredPermission: "BAN_MEMBERS",
    slash: false,
    run: async(client, slash, message, args) => {
        if(message) {
            var member = message.mentions.members.last() || message.guild.members.cache.get(args[0]);
            if(!member) return message.inlineReply("Please define valid member!")

            member.ban({reason:"goodbye"});
            message.inlineReply(`User <@${member.id}> banned.`)
            return;
        }
  }
};
```

</branch>
<branch version="3.x">

```js
module.exports = {
    name: "ban",
    description: "Ban user",
    userRequiredPermissions: "BAN_MEMBERS",
    clientRequiredPermissions: "BAN_MEMBERS",
    slash: false,
    run: async(client, slash, message, args) => {
        if(message) {
            var member = message.mentions.members.last() || message.guild.members.cache.get(args[0]);
            if(!member) return message.inlineReply("Please define valid member!")

            member.ban({reason:"goodbye"});
            message.inlineReply(`User <@${member.id}> banned.`)
            return;
        }
  }
};
```

</branch>
<branch version="4.x">

<language lang="en">

```js
module.exports = {
    name: "ban",
    description: "Ban user",
    userRequiredPermissions: "BAN_MEMBERS",
    clientRequiredPermissions: "BAN_MEMBERS",
    slash: false,
    run: async({client, message}, arrayArgs) => {
        if(message) {
            var member = message.mentions.members.last() || message.guild.members.cache.get(arrayArgs[0]);
            if(!member) return message.inlineReply("Please define valid member!")

            member.ban({reason:"goodbye"});
            message.inlineReply(`User <@${member.id}> banned.`)
            return;
        }
  }
};
```

</language>
<language lang="tk">

```js
module.exports = {
    name: "ban",
    description: "Üyeyi yasakla.",
    userRequiredPermissions: "BAN_MEMBERS",
    clientRequiredPermissions: "BAN_MEMBERS",
    slash: false,
    run: async({client, message}, arrayArgs) => {
        if(message) {
            var member = message.mentions.members.last() || message.guild.members.cache.get(arrayArgs[0]);
            if(!member) return message.inlineReply("Lütfen geçerli bir üye belirtin.")

            member.ban({reason:"hoşçakal"});
            message.inlineReply(`<@${member.id}> üyesi yasaklandı.`)
            return;
        }
  }
};
```

</language>

</branch>

## Slash Arguments
<branch version="2.x">

```js
module.exports = {
    name: "ban",
    description: "Ban user",
    expectedArgs: "<user:6:select user>",
    minArgs: 1,
    requiredPermission: "BAN_MEMBERS",
    run: async(client, slash) => {
        var guild = client.guilds.cache.find(guild => guild.id === slash.guild_id)
        var member = guild.members.cache.find(member => member.id === args[0].value.replace(/[!@<>]/g, ''));

        member.ban({reason:"goodbye"});
        return `User <@${member.id}> banned.`
  }
};
```

</branch>
<branch version="3.x">

```js
module.exports = {
    name: "ban",
    description: "Ban user",
    expectedArgs: "<user:6:select user>",
    userRequiredPermissions: "BAN_MEMBERS",
    clientRequiredPermissions: "BAN_MEMBERS",
    minArgs: 1,
    run: async(client, slash, message, args) => {
        var userId = args.user
        var guild = client.guilds.cache.find(guild => guild.id === slash.guild_id)
        var member = guild.members.cache.find(member => member.id === userId.replace(/[!@<>]/g, ''));

        member.ban({reason:"goodbye"});
        return `User <@${member.id}> banned.`
  }
};
```

</branch>
<branch version="4.x">

<language lang="en">

```js
module.exports = {
    name: "ban",
    description: "Ban user",
    expectedArgs: "<user:6:select user>",
    userRequiredPermissions: "BAN_MEMBERS",
    clientRequiredPermissions: "BAN_MEMBERS",
    minArgs: 1,
    run: async({client, interaction, respond}, arrayArgs, args) => {
        var userId = arrayArgs[0]
        var guild = client.guilds.cache.find(guild => guild.id === slash.guild_id)
        var member = guild.members.cache.find(member => member.id === userId.replace(/[!@<>]/g, ''));

        member.ban({reason:"goodbye"});
        respond(`User <@${member.id}> banned.`)
  }
};
```

</language>
<language lang="tk">

```js
module.exports = {
    name: "ban",
    description: "Üyeyi yasakla.",
    expectedArgs: "<üye:6:üyeyi seç>",
    userRequiredPermissions: "BAN_MEMBERS",
    clientRequiredPermissions: "BAN_MEMBERS",
    minArgs: 1,
    run: async({client, interaction, respond}, arrayArgs, args) => {
        var userId = arrayArgs[0]
        var guild = client.guilds.cache.find(guild => guild.id === slash.guild_id)
        var member = guild.members.cache.find(member => member.id === userId.replace(/[!@<>]/g, ''));

        member.ban({reason:"hoşçakal"});
        respond(`<@${member.id}> üye yasaklandı.`)
  }
};
```

</language>

</branch>

# Advanced Slash Arguments
All types of arguments:

| TYPE        	| NUMBER 	|
|-------------	|--------	|
| STRING      	| 3      	|
| INTEGER     	| 4      	|
| BOOLEAN     	| 5      	|
| USER        	| 6      	|
| CHANNEL     	| 7      	|
| ROLE        	| 8      	|
| MENTIONABLE 	| 9      	|

Or use
```js
const { SlashCommand } = require("gcommands")
SlashCommand.STRING
SlashCommand.INTEGER
SlashCommand.BOOLEAN
SlashCommand.USER
SlashCommand.CHANNEL
SlashCommand.ROLE
SlashCommand.MENTIONABLE
```

## Without Slash Group

<branch version="2.x">

```js
module.exports = {
    name: "xxx",
    description: "xxx",
    expectedArgs: [
		{
			name: "listoffood", // arg name
			type: 3, // arg type
			description: "select food", // arg description
			required: true, // is required
			choices: [
				{
					name: "Potato", // arg choices 1
					value: "potato" // arg choices 21
				},
				{
					name: "Chocolate", // arg choices 2
					value: "chocolate" // arg choices 2
                }
			]
		},
		{
			name: "user", // arg name
			type: 6, // arg type
			description: "select user who want food", // arg description
			required: false // is required
		}
	],
    run: async(client, slash) => {
        console.log(slash)
        // ...
  }
};
```

</branch>
<branch version="3.x">

```js
module.exports = {
    name: "xxx",
    description: "xxx",
    expectedArgs: [
		{
			name: "listoffood", // arg name
			type: 3, // arg type
			description: "select food", // arg description
			required: true, // is required
			choices: [
				{
					name: "Potato", // arg choices 1
					value: "potato" // arg choices 21
				},
				{
					name: "Chocolate", // arg choices 2
					value: "chocolate" // arg choices 2
                }
			]
		},
		{
			name: "user", // arg name
			type: 6, // arg type
			description: "select user who want food", // arg description
			required: false // is required
		}
	],
    run: async(client, slash) => {
        console.log(slash)
        // ...
  }
};
```

</branch>
<branch version="4.x">

<language lang="en">

```js
module.exports = {
    name: "xxx",
    description: "xxx",
    expectedArgs: [
		{
			name: "listoffood", // arg name
			type: 3, // arg type
			description: "select food", // arg description
			required: true, // is required
			choices: [
				{
					name: "Potato", // arg choices 1
					value: "potato" // arg choices 21
				},
				{
					name: "Chocolate", // arg choices 2
					value: "chocolate" // arg choices 2
                }
			]
		},
		{
			name: "user", // arg name
			type: 6, // arg type
			description: "select user who want food", // arg description
			required: false // is required
		}
	],
    run: async({client, interaction, respond}) => {
        console.log(interaction)
        // ...
  }
};
```

</language>
<language lang="tk">

```js
module.exports = {
    name: "xxx",
    description: "xxx",
    expectedArgs: [
        {
            name: "yemeklerin-listesi", // argüman ismi
            type: 3, // argüman türü
            description: "yemek seç", // argüman açıklaması
            required: true, // Argümanın zorunlu olup olmadığı
            choices: [
                {
                    name: "Pattis", // argüman seçimi 1
                    value: "pattis" // argüman seçimi 1
                },
                {
                    name: "Çikolata", // argüman seçimi 2
                    value: "çikolata" // argüman seçimi 2
                }
            ]
        },
        {
            name: "üye", // argüman ismi
            type: 6, // argüman tipi
            description: "Yiyeceği isteyen üyeyi seçin.", // argüman açıklaması
            required: false // Argümanın zorunlu olup olmadığı
        }
    ],
    run: async({client, interaction, respond}) => {
        console.log(interaction)
        // ...
  }
};
```

</language>

</branch>

## With Slash Group
<branch version="2.x">

```js
module.exports = {
    name: "xxx",
    description: "xxx",
	subCommandGroup: "user",
	subCommand: [
		{
			name: "get", // sub command name
			description: "get user", // sub command description
			options: [
				{
					name: "user",
					type: 6,
					description: "get user",
					required: false
				}
			]
		}
	],
    run: async(client, slash) => {
        console.log(slash)
        // ...
  }
};
```

</branch>
<branch version="3.x">

```js
module.exports = {
    name: "xxx",
    description: "xxx",
	expectedArgs: [
        {
            name: "user",
            description: "Get or edit permissions for a user",
            type: SlashCommand.SUB_COMMAND_GROUP,
            options: [
                {
                    name: "get",
                    description: "Get permissions for a user",
                    type: SlashCommand.SUB_COMMAND,
                    options: [
                        {
                            name: "user",
                        	description: "The user to get",
                            type: SlashCommand.USER,
                            required: true
                        }
                    ]
                }
            ]
        },
    ],
    run: async(client, slash) => {
        console.log(slash)
        // ...
  }
};
```

</branch>
<branch version="4.x">

<language lang="en">

```js
module.exports = {
    name: "xxx",
    description: "xxx",
	expectedArgs: [
        {
            name: "user",
            description: "Get or edit permissions for a user",
            type: SlashCommand.SUB_COMMAND_GROUP,
            options: [
                {
                    name: "get",
                    description: "Get permissions for a user",
                    type: SlashCommand.SUB_COMMAND,
                    options: [
                        {
                            name: "user",
                        	description: "The user to get",
                            type: SlashCommand.USER,
                            required: true
                        }
                    ]
                }
            ]
        },
    ],
    run: async({client, interaction, respond}) => {
        console.log(interaction)
        // ...
  }
};
```

</language>
<language lang="tk">

```js
module.exports = {
    name: "xxx",
    description: "xxx",
    expectedArgs: [
        {
            name: "üye",
            description: "Üyenin yetkilerini incele.",
            type: SlashCommand.SUB_COMMAND_GROUP,
            options: [
                {
                    name: "elde-et",
                    description: "Yetkilerini elde etmek için komut.",
                    type: SlashCommand.SUB_COMMAND,
                    options: [
                        {
                            name: "üye",
                            description: "Üyeyi seçin.",
                            type: SlashCommand.USER,
                            required: true
                        }
                    ]
                }
            ]
        },
    ],
    run: async({client, interaction, respond}) => {
        console.log(interaction)
        // ...
  }
};
```

</language>

</branch>
