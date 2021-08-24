# Example

```js
const { Client } = require("discord.js");
const { AudioPlayerStatus } = require("@discordjs/voice");
const { GVoice } = require("@gcommands/voice");
const client = new Client({intents: ["GUILDS","GUILD_MESSAGES"]})

new GVoice();
client.on("ready", () => {
    const guild = client.guilds.cache.get("GUILD ID")
    const channel = client.channels.cache.get("VOICE/STAGE CHANNEL ID");

    const connection = channel.join();
    const stream = await ytdl('https://www.youtube.com/watch?v=ipK7vQ8gEZw', { filter: 'audioonly' });

    const player = connection.play(stream);

    player.on(AudioPlayerStatus.Playing, () => guild.me.voice.setSuppressed(false));
    player.on(AudioPlayerStatus.Idle, () => connection.destroy());
});

client.login("TOKEN");
```

As you can see, it's simple. Be sure to check out `@discordjs/voice` [documentation](https://discordjs.github.io/voice/modules.html) and [guide](https://discordjs.guide/voice/).