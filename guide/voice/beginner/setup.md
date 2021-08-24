# Installing Node.js and @gcommands/voice

## Installing Node.js

Don't have Node.js yet? Go to [NodeJS.org](https://nodejs.org) and install it!
Don't have an editor? Check out [Visual Studio Code](https://code.visualstudio.com).

### Installing on Windows

If you have a Windows OS, it's as simple as installing any other program. Go to the [Node.js website](https://nodejs.org), download the latest version, open the download file, and follow the steps in the installer.

### Installing on macOS

If you have macOS, you have a two options. You can:

- go to the [Node.js website](https://nodejs.org), download the latest version, open the download file, and follow the steps in the installer.
- use a package manager like [Homebrew](https://brew.sh)

### Installing on Linux

If you have a Linux OS, you should go to [this page](https://nodejs.org/en/download/package-manager/), to determine how to install Node.

::: warning
Make sure you upgrade to the needed Node.js version for discord.js.

- **discord.js@13** requires `NodeJS@16+`
  :::

## Installing @gcommands/voice

Use `npm i @gcommands/voice` to download the latest stable version.  

```js
const { Client } = require("discord.js");
const { AudioPlayerStatus } = require("@discordjs/voice");
const { GVoice } = require("@gcommands/voice");
const client = new Client({intents: ["GUILDS","GUILD_MESSAGES"]})

new GVoice();
client.on("ready", () => {
    const channel = client.channels.cache.get("VOICE/STAGE CHANNEL ID");

    const connection = channel.join();
    const stream = await ytdl('https://www.youtube.com/watch?v=ipK7vQ8gEZw', { filter: 'audioonly' });

    const player = connection.play(stream);

    player.on(AudioPlayerStatus.Playing, () => client.guilds.cache.get("747526604116459691").me.voice.setSuppressed(false));
    player.on(AudioPlayerStatus.Idle, () => connection.destroy());
});

client.login("TOKEN");
```

::: warning
You need to have `discord.js@13+`
:::

## Dependencies

When using `@gcommands/voice` you must have:
- Opus encoding library 
  - [@discordjs/opus](https://github.com/discordjs/opus)
  - [opusscript](https://github.com/abalabahaha/opusscript/)
- FFmpeg – allows you to play a range of media (e.g. MP3s).
  - [ffmpeg](https://ffmpeg.org/) - install and add to your system environment
  - [ffmpeg-static](https://www.npmjs.com/package/ffmpeg-static) - to install FFmpeg via `npm i ffmpeg-static`
- [@disordjs/voice](https://npmjs.org/@discordjs/voice)
