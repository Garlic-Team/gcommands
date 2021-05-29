const { MessageEmbed } = require("discord.js");

module.exports = {
    name: 'anime',
    description: 'Gives detailed information about an anime from AniList.',
    guildOnly: '810474313245261824',
    minArgs: 1,
    cooldown: 20,
    expectedArgs: [
        {
            name: 'search',
            description: 'Enter anime title',
            type: 3,
            required: true
        }
    ],
    guildOnly: "747526604116459691",
    run: async ({ client, channel, respond }, arrayArgs, args) => {
        const embed = new MessageEmbed();

        if (!true) {
            embed.setColor(colors.red)
                .setDescription(`\u3000Nothing found on "**${args.search}**"`);
            return respond(embed);
        }

        return respond(new MessageEmbed({
            type: 'rich',
            title: 'Death Note',
            description: 'Light Yagami is a genius high school student who is about to learn about life through a book of death. When a bored shinigami, a God of Death, named Ryuk drops a black notepad called a Death Note, Light receives power over life and death with the stroke of a pen. Determined to use this dark gift for the best, Light sets out to rid the world of evil… namely, the people he believes to be evil. Should anyone hold such power?\n' +
              '\n' +
              'The consequences of Light’s actions will set the world ablaze.\n' +
              '\n' +
              '(Source: Viz Media)',
            url: 'https://anilist.co/anime/1535',
            color: 16738177,
            timestamp: null,
            fields: [
              {
                name: 'Streaming and/or Info sites',
                value: '[Hulu](http://www.hulu.com/death-note), [Ntv.co.jp](http://www.ntv.co.jp/deathnote/), [Animelab](https://www.animelab.com/shows/death-note), [Crunchyroll](https://www.crunchyroll.com/death-note), [Vrv.co](https://vrv.co/series/G6QWD3EE6/Death-Note), [Netflix](https://www.netflix.com/title/70204970), [Tubitv](https://tubitv.com/series/1630/death_note), [Vap.co.jp](http://www.vap.co.jp/deathnote/), [Play.hbomax](https://play.hbomax.com/series/urn:hbo:series:GXuFMfQuwD5uSkwEAAAth), [Funimation](https://www.funimation.com/shows/death-note-2/)',
                inline: true
              },
              {
                name: 'You can find out more',
                value: '[AniList](https://anilist.co/anime/1535), [MyAnimeList](https://myanimelist.net/anime/1535)',
                inline: false
              }
            ],
            thumbnail: null,
            image: { url: 'https://img.anili.st/media/1535' },
            video: null,
            author: null,
            provider: null,
            footer: { text: 'Status: Finished, Next Episode: Never', iconURL: undefined },
            files: []
          }));
    }
};