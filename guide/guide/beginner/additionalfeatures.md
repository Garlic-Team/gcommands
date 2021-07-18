# Additional features

<language lang="en" inline=true>Accessories that may be useful to you.</language>
<language lang="tk" inline=true>Aşağıda verilen bazı özellikler ihtiyacınızı karşılayabilir. </language>

## Slash respond/edit

<language lang="en" inline=true>For example, do you want when you send a command to be sent as a clyde or to disable ping in a certain message?</language>
<language lang="tk" inline=true>Örnek vermek gerekirse bütün mesajını sadece bir kişiye özel hale getirmek veya mesajında mevcut olan etiketlemelerin önüne geçmek ister misin?</language>

<branch version="5.x">

<language lang="en">

```js
const { Command } = require("gcommands")

module.exports = class Ping extends Command {
  constructor(...args) {
    super(...args, {
      name: "ping",
      description: "command ping",
      cooldown: 5,
    })
  }
  async run({client, respond, edit}) {
    respond({
      content: "pong", //or embed object new MessagEmbed().setTitle("a")
      ephemeral: true, //clyde
      allowedMentions: { parse: [], repliedUser: true }, // mentions
      embeds: new MessageEmbed().setTitle("hi"),
      components: new MessageActionRow(), // [actionRow, actionRow2]
      attachments: new MessageAttachment(Buffer.from("he"), "name.txt"), // attachments
      inlineReply: false/true // inline reply
    })

    setTimeout(() => {
      edit({
        content: "pong", //or embed object new MessagEmbed().setTitle("a")
        allowedMentions: { parse: [], repliedUser: true }, // mentions
        embeds: new MessageEmbed().setTitle("hi"),
        components: new MessageActionRow(), // [actionRow, actionRow2]
        attachments: new MessageAttachment(Buffer.from("he"), "name.txt"), // attachments
        edited: false, // update message without (edited)
        messageId: "id of message" // NOT REQUIRED! ONLY IF YOU WANT EDIT OTHER MESSAGE
      })
    }, 2000)
  }
};
```

</language>
<language lang="tk">

```js
const { Command } = require("gcommands")

module.exports = class Ping extends Command {
  constructor(...args) {
    super(...args, {
      name: "ping",
      description: "command ping",
      cooldown: 5,
    })
  }
  async run({client, respond, edit}) {
    respond({
      content: "pong", // Buraya embed koyabilirsiniz. new MessagEmbed().setTitle("a") veya aşağıdaki embeds: kısmına embed koyun.
      ephemeral: true, // Bu mesajın görünürlüğünü değiştirir. Yani mesajınız Clyde'nin gönderdiği mesaj gibi olsun mu?
      allowedMentions: { parse: [], repliedUser: true }, // Etiketlemeler
      embeds: new MessageEmbed().setTitle("selam"),
      components: new MessageActionRow(), // [actionRow, actionRow2] (Burası buton kullanmak isteyenler için ayrıldı.)
      attachments: new MessageAttachment(Buffer.from("he"), "name.txt"), // attachments
      inlineReply: false/true // inline reply
    })

    setTimeout(() => {
      edit({
        content: "pong", // Buraya embed koyabilirsiniz. new MessagEmbed().setTitle("a") veya aşağıdaki embeds: kısmına embed koyun.
        allowedMentions: { parse: [], repliedUser: true }, // mentions
        embeds: new MessageEmbed().setTitle("hi"),
        components: new MessageActionRow(), // [actionRow, actionRow2] (Burası buton kullanmak isteyenler için ayrıldı.)
        attachments: new MessageAttachment(Buffer.from("he"), "name.txt"), // attachments
        edited: false, // update message without (edited)
        messageId: "id of message" // NOT REQUIRED! ONLY IF YOU WANT EDIT OTHER MESSAGE
      })
    }, 2000)
  }
};
```

</language>

</branch>

## Cooldowns

<language lang="en" inline=true>Spam is something you generally want to avoid–especially if one of your commands requires calls to other APIs or takes a bit of time to build/send. Cooldowns are also a very common feature bot developers want to integrate into their projects, so let's get started on that!</language>
<language lang="tk" inline=true>Spam kaçınmak isteyeceğiniz durumlardan birisidir. Eğer komutunuz başka bir API'den bilgi alıyorsa veya inşa ediyorsa arka arkaya komut kullanmanın önüne geçmek zorundasınız. Bekleme süreleri ayrıca geliştiricilerin botlarına eklemek istedikleri özelliklerin başında gelir. Hadi başlayalım!</language>

<language lang="en" inline=true>Add a `cooldown` key to one of your commands. This determines how long the user will have to wait (in seconds) before using this specific command again.</language>
<language lang="tk" inline=true>Herhangi bir komuta `cooldown` anahtarı ekleyin. Bu anahtar komutun kullanıldıktan sonra ne kadar süre içinde tekrar o üyenin komutu kullanabileceğini belirler.</language>

```js {8}
const { Command } = require("gcommands")

module.exports = class Ping extends Command {
  constructor(...args) {
    super(...args, {
      name: "ping",
      description: "command ping",
      cooldown: "5s",
    })
  }

  async run(/*etc*/) {
    // ...
  }
};
```

## Categories

<language lang="en" inline=true>You can have all the commands in the `cmdDir` folder that you specified. If you want more order, just create another folder in this folder and put commands in it.</language>
<language lang="tk" inline=true>Bütün komutları `cmdDir` klasörü içerisine koymanız gerektiğini söylemiştik. Eğer daha fazlasını isterseniz bu klasörün içersinde yeni klasörler açarak komutlarınızı kategorilere ayırabilirsiniz.</language>

## Aliases

<language lang="en" inline=true>If you want the command to be able to be executed from multiple commands. Just add the `aliases` parameter.</language>
<language lang="tk" inline=true>Komutunuzu başka adlarla da çalıştırmak isterseniz `aliases` parametresini eklemeniz yeterli olacak.</language>

```js {8}
const { Command } = require("gcommands")

module.exports = class Ban extends Command {
  constructor(...args) {
    super(...args, {
      name: "ban",
      description: "user ban",
      aliases: ["banuser","userban"],
    })
  }

  async run(/*etc*/) {
        // ...
  }
};
```

## UserPermissions

<branch version="5.x">

<language lang="en" inline=true>Add a `userRequiredPermissions` key to your existing command options. We will use the 'ban' command to example.</language>
<language lang="tk" inline=true>`userRequiredPermissions` anahtarını herhangi bir komuta ekleyelim. Bu komutu kullanan üyenin hangi yetkilerinin olması gerektiğini belirler. </language>

```js {8}
const { Command } = require("gcommands")

module.exports = class Ban extends Command {
  constructor(...args) {
    super(...args, {
      name: "ban",
      description: "user ban",
      userRequiredPermissions: "ADMINISTRATOR", //["ADMINISTRATOR","MANAGE_GUILD"]
    })
  }

  async run(/*etc*/) {
        // ...
  }
};
```

</branch>

## ClientRequiredPermissions

<branch version="5.x">

<language lang="en">

Add a `clientRequiredPermissions` key to your existing command options. We will use the 'ban' command to example.
It determines if the bot has permissions and if so it executes the command.

</language>
<language lang="tk">

`clientRequiredPermissions` anahtarını herhangi bir komuta ekleyelim. Bu botun o sunucuda hangi yetkilerinin olması gerektiğini belirler.
It determines if the bot has permissions and if so it executes the command.

</language>

```js {8}
const { Command } = require("gcommands")

module.exports = class Ban extends Command {
  constructor(...args) {
    super(...args, {
      name: "ban",
      description: "user ban",
      clientRequiredPermissions: "ADMINISTRATOR", //["ADMINISTRATOR","MANAGE_GUILD"]
    })
  }

  async run(/*etc*/) {
        // ...
  }
};
```

</branch>

## userRequiredRoles
<branch version="5.x">

<language lang="en" inline=true>Add a `userRequiredRoles` key to your existing command options. We will use the 'ban' command to example.</language>
<language lang="tk" inline=true>Kodunuza `userRequiredRoles` anahtarını ekleyin. </language>

```js {8}
const { Command } = require("gcommands")

module.exports = class Ban extends Command {
  constructor(...args) {
    super(...args, {
      name: "ban",
      description: "user ban",
      userRequiredRoles: ["MODERATOR ID ROLE","ADMIN ROLE ID"],
    })
  }

  async run(/*etc*/) {
        // ...
  }
};
```

</branch>

## GuildOnly

<language lang="en" inline=true>If you only want the command for a guild, just add the `guildOnly` parameter.</language>
<language lang="tk" inline=true>Sunucuya özel komutlar yapmak istersen tek yapman gereken `guildOnly` anahtarını eklemek olacak.</language>

```js {8}
const { Command } = require("gcommands")

module.exports = class Refresh extends Command {
  constructor(...args) {
    super(...args, {
      name: "refresh",
      description: "refresh",
      guildOnly: "guild id",
    })
  }

  async run(/*etc*/) {
        // ...
  }
};
```

## UserOnly

<language lang="en" inline=true>If you only want the command for a user, just add the `userOnly` parameter.</language>
<language lang="tk" inline=true>Komutu sadece seçilen üyelere özel yapmak istersen `userOnly` komutunu kullanmanız yeterli olur.</language>

```js {8}
const { Command } = require("gcommands")

module.exports = class Eval extends Command {
  constructor(...args) {
    super(...args, {
      name: "eval",
      description: "run code",
      userOnly: "user id", //["user id2", "user id2"]
    })
  }

  async run(/*etc*/) {
        // ...
  }
};
```

## ChannelOnly

<language lang="en" inline=true>If you only want the command for a channel, just add the `channelOnly` parameter.</language>
<language lang="tk" inline=true>Komutun kanala özel çalışmasını isterseniz `channelOnly` anahtarını kullanabilirsiniz.</language>

```js {8}
const { Command } = require("gcommands")

module.exports = class Eval extends Command {
  constructor(...args) {
    super(...args, {
      name: "eval",
      description: "run code",
      channelOnly: "channel id", //["channel id2", "channel id2"]
    })
  }

  async run(/*etc*/) {
        // ...
  }
};
```

<branch version="5.x">

## NSFW

<language lang="en" inline=true>If you only want the command only for a nsfw channel, just add the `nsfw` parameter.</language>
<language lang="tk" inline=true>Komutun sadece NSFW kanallarında kullanılmasını istersen `nsfw` anahtarını eklemen yeterli olacak.</language>

```js {8}
const { Command } = require("gcommands")

module.exports = class Ping extends Command {
  constructor(...args) {
    super(...args, {
      name: "eval",
      description: "run code",
      nsfw: true,
    })
  }
  
  async run(/*etc*/) {
        // ...
  }
};
```

</branch>

## Custom Language File

<language lang="en" inline=true>Do you want to customize the messages for you? So just do the following things.</language>
<language lang="tk" inline=true>Mesajları kendine göre özelleştirmek ister misin? Aşağıdaki yönergeleri takip etmen yeterli.</language>

```js
new GCommands(client, {
    language: "czech", //english, spanish, portuguese, russian, german, czech, turkish
    ownLanguageFile: require("./message.json")
})
```

<language lang="en" inline=true>Create a `message.json` where you can then put this:</language>
<language lang="tk" inline=true>`message.json` adında bir klasör oluşturun ve şunu içerisine yerleştirin:</language>

[language file](https://raw.githubusercontent.com/Garlic-Team/GCommands/main/src/util/message.json)

<language lang="en">

::: tip
If you want support the project. So you can create a pull request to the dev branch where you can then add the new language.
:::

</language>
<language lang="tk">

::: tip
Eğer yeni diller eklemek istersen yeni bir PR oluşturarak bizi destekleyebilirsin. Böylece kendi dilini de eklemiş olursun.
:::

</language>