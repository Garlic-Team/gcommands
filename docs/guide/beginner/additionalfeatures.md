# Additional features

<language lang="en" inline=true>Accessories that may be useful to you.</language>
<language lang="tk" inline=true>Aşağıda verilen bazı özellikler ihtiyacınızı karşılayabilir. </language>

## Slash respond/edit

<language lang="en" inline=true>For example, do you want when you send a command to be sent as a clyde or to disable ping in a certain message?</language>
<language lang="tk" inline=true>Örnek vermek gerekirse bütün mesajını sadece bir kişiye özel hale getirmek veya mesajında mevcut olan etiketlemelerin önüne geçmek ister misin?</language>

<branch version="2.x">

```js
module.exports = {
    name: "ping",
    description: "command ping",
    cooldown: 5,
    run: async(client, slash, message, args) => {
      return {
        content: "pong", //or embed object new Discord.MessagEmbed().setTitle("a")
        ephemeral: true, //clyde
        allowedMentions: { parse: [], repliedUser: true }
      }
  }
};
```

</branch>
<branch version="3.x">

```js
module.exports = {
    name: "ping",
    description: "command ping",
    cooldown: 5,
    run: async(client, slash, message, args) => {
      return {
        content: "pong", //or embed object new Discord.MessagEmbed().setTitle("a")
        ephemeral: true, //clyde
        allowedMentions: { parse: [], repliedUser: true }
      }
  }
};
```

</branch>
<branch version="4.x">

<language lang="en">

```js
module.exports = {
    name: "ping",
    description: "command ping",
    cooldown: 5,
    run: async({client, respond, edit}) => {
      respond({
        content: "pong", //or embed object new MessagEmbed().setTitle("a")
        ephemeral: true, //clyde
        allowedMentions: { parse: [], repliedUser: true }, // mentions
        embeds: new MessageEmbed().setTitle("hi"),
        components: new MessageActionRow(), // [actionRow, actionRow2]
        attachments: new MessageAttachment(Buffer.from("he"), "name.txt") // attachments
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
module.exports = {
    name: "ping",
    description: "ping komutu.",
    cooldown: 5,
    run: async({client, respond}) => {
      respond({
        content: "pong", // Buraya embed koyabilirsiniz. new MessagEmbed().setTitle("a") veya aşağıdaki embeds: kısmına embed koyun.
        ephemeral: true, // Bu mesajın görünürlüğünü değiştirir. Yani mesajınız Clyde'nin gönderdiği mesaj gibi olsun mu?
        allowedMentions: { parse: [], repliedUser: true }, // Etiketlemeler
        embeds: new MessageEmbed().setTitle("selam"),
        components: new MessageActionRow(), // [actionRow, actionRow2] (Burası buton kullanmak isteyenler için ayrıldı.)
        attachments: new MessageAttachment(Buffer.from("he"), "name.txt") // attachments
      })
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

```js {4}
module.exports = {
    name: "ping",
    description: "command ping",
    cooldown: "5s",
    run: async(/*etc*/) => {
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

```js {4}
module.exports = {
    name: "ban",
    description: "user ban",
    aliases: ["banuser","userban"],
    run: async(/*etc*/) => {
        // ...
  }
};
```

## UserPermissions

<branch version="2.x">

Add a `requiredPermission` key to your existing command options. We will use the 'ban' command to example.

```js {4}
module.exports = {
    name: "ban",
    description: "user ban",
    requiredPermission: "ADMINISTRATOR",
    run: async(/*etc*/) => {
        // ...
  }
};
```

</branch>
<branch version="3.x">

Add a `userRequiredPermissions` key to your existing command options. We will use the 'ban' command to example.

```js {4}
module.exports = {
    name: "ban",
    description: "user ban",
    userRequiredPermissions: "ADMINISTRATOR", //["ADMINISTRATOR","MANAGE_GUILD"]
    run: async(/*etc*/) => {
        // ...
  }
};
```

</branch>
<branch version="4.x">

<language lang="en" inline=true>Add a `userRequiredPermissions` key to your existing command options. We will use the 'ban' command to example.</language>
<language lang="tk" inline=true>`userRequiredPermissions` anahtarını herhangi bir komuta ekleyelim. Bu komutu kullanan üyenin hangi yetkilerinin olması gerektiğini belirler. </language>

```js {4}
module.exports = {
    name: "ban",
    description: "user ban",
    userRequiredPermissions: "ADMINISTRATOR", //["ADMINISTRATOR","MANAGE_GUILD"]
    run: async(/*etc*/) => {
        // ...
  }
};
```

</branch>

## ClientRequiredPermissions

<branch version="3.x">

Add a `clientRequiredPermissions` key to your existing command options. We will use the 'ban' command to example.
It determines if the bot has permissions and if so it executes the command.

```js {4}
module.exports = {
    name: "ban",
    description: "user ban",
    clientRequiredPermissions: "ADMINISTRATOR", //["ADMINISTRATOR","MANAGE_GUILD"]
    run: async(/*etc*/) => {
        // ...
  }
};
```

</branch>
<branch version="4.x">

<language lang="en">

Add a `clientRequiredPermissions` key to your existing command options. We will use the 'ban' command to example.
It determines if the bot has permissions and if so it executes the command.

</language>
<language lang="tk">

`clientRequiredPermissions` anahtarını herhangi bir komuta ekleyelim. Bu botun o sunucuda hangi yetkilerinin olması gerektiğini belirler.
It determines if the bot has permissions and if so it executes the command.

</language>

```js {4}
module.exports = {
    name: "ban",
    description: "user ban",
    clientRequiredPermissions: "ADMINISTRATOR", //["ADMINISTRATOR","MANAGE_GUILD"]
    run: async(/*etc*/) => {
        // ...
  }
};
```

</branch>

## userRequiredRole
<branch version="4.x">

<language lang="en" inline=true>Add a `userRequiredRoles` key to your existing command options. We will use the 'ban' command to example.</language>
<language lang="tk" inline=true>Kodunuza `userRequiredRoles` anahtarını ekleyin. </language>

```js {4}
module.exports = {
    name: "ban",
    description: "user ban",
    userRequiredRoles: ["MODERATOR ID ROLE","ADMIN ROLE ID"],
    run: async(/*etc*/) => {
        // ...
  }
};
```

</branch>
<branch version="2.x">

Add a `requiredRole` key to your existing command options. We will use the 'ban' command to example.

```js {4}
module.exports = {
    name: "ban",
    description: "user ban",
    requiredRole: "MODERATOR ID ROLE",
    run: async(/*etc*/) => {
        // ...
  }
};
```

</branch>
<branch version="3.x">

Add a `requiredRole` key to your existing command options. We will use the 'ban' command to example.

```js {4}
module.exports = {
    name: "ban",
    description: "user ban",
    requiredRole: "MODERATOR ID ROLE",
    run: async(/*etc*/) => {
        // ...
  }
};
```

</branch>

## GuildOnly

<language lang="en" inline=true>If you only want the command for a guild, just add the `guildOnly` parameter.</language>
<language lang="tk" inline=true>Sunucuya özel komutlar yapmak istersen tek yapman gereken `guildOnly` anahtarını eklemek olacak.</language>

```js {4}
module.exports = {
    name: "refresh",
    description: "refresh",
    guildOnly: "guild id",
    run: async(/*etc*/) => {
        // ...
  }
};
```

## UserOnly

<language lang="en" inline=true>If you only want the command for a user, just add the `userOnly` parameter.</language>
<language lang="tk" inline=true>Komutu sadece seçilen üyelere özel yapmak istersen `userOnly` komutunu kullanmanız yeterli olur.</language>

```js {4}
module.exports = {
    name: "eval",
    description: "run code",
    userOnly: "user id", //["user id2", "user id2"]
    run: async(/*etc*/) => {
        // ...
  }
};
```

## ChannelOnly

<language lang="en" inline=true>If you only want the command for a channel, just add the `channelOnly` parameter.</language>
<language lang="tk" inline=true>Komutun kanala özel çalışmasını isterseniz `channelOnly` anahtarını kullanabilirsiniz.</language>

```js {4}
module.exports = {
    name: "eval",
    description: "run code",
    channelOnly: "channel id", //["channel id2", "channel id2"]
    run: async(/*etc*/) => {
        // ...
  }
};
```

<branch version="4.x">

## NSFW

<language lang="en" inline=true>If you only want the command only for a nsfw channel, just add the `nsfw` parameter.</language>
<language lang="tk" inline=true>Komutun sadece NSFW kanallarında kullanılmasını istersen `nsfw` anahtarını eklemen yeterli olacak.</language>

```js {4}
module.exports = {
    name: "eval",
    description: "run code",
    nsfw: true,
    run: async(/*etc*/) => {
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

```json
{
    "MISSING_PERMISSIONS": {
        "english": "You must have the {PERMISSION} permission in order to use this command.",
        "spanish": "Debe tener el permiso {PERMISSION} para poder utilizar este comando.",
        "portuguese": "Você precisa ter a permissão {PERMISSION} para utilizar este comando.",
        "russian": "У вас должно быть право {PERMISSION}, чтобы использовать эту команду. ",
        "german": "Du benötigst die Berechtigung {PERMISSION}, um diesen Befehl nutzen zu können.",
        "czech": "Chybí ti {PERMISSION} oprávnění k použití tohoto příkazu.",
        "slovak": "Chýba ti {PERMISSION} oprávnenie k použitiu tohoto príkazu.",
        "turkish": "Bu komutu kullanabilmek için {PERMISSION} yetkisine sahip olmak zorundasın."
    },
    "MISSING_CLIENT_PERMISSIONS": {
        "english": "The client must have {PERMISSION} permission to use this command.",
        "spanish": "Para usar este comando, el cliente debe tener el permiso {PERMISSION}.",
        "portuguese": "O cliente deve ter permissão {PERMISSION} para usar este comando.",
        "russian": "Чтобы использовать эту команду, клиент должен иметь полномочия {PERMISSION}.",
        "german": "Der Client benötigt die Berechtigung {PERMISSION}, um diesen Befehl verwenden zu können.",
        "czech": "Client musí mít {PERMISSION} oprávnění k použití tohoto příkazu.",
        "slovak": "Client musí mať {PERMISSION} oprávnenia k použitiu tohoto príkazu.",
        "turkish": "Bu komutu kullanabilmek için Client'in {PERMISSION} yetkisine sahip olması gerekiyor."
    },
    "MISSING_ROLES": {
        "english": "You do not have the required roles to use this command! You need one of the following: {ROLES}",
        "spanish": "¡No tienes los roles necesarios para usar este comando! Necesita uno de los siguientes: {ROLES}",
        "portuguese": "Você não tem o cargo necessário para usar este comando! Você precisa de um dos seguintes: {ROLES}",
        "russian": "У вас нет необходимых ролей для использования этой команды! Вам понадобится одно из следующего: {ROLES}",
        "german": "Sie haben nicht die erforderlichen Rollen, um diesen Befehl zu verwenden! Sie benötigen eine der folgenden Möglichkeiten: {ROLES}",
        "czech": "Nemáš potřebné role na použití tohoto příkazu! Potřebuješ jednu z: {ROLES}",
        "slovak": "Nemáš potrebné role na použitie tohito príkazu! Potrebuješ jednu z: {ROLES}",
        "turkish": "Bu komutu kullanabilmek için gerekli rollerden birisine sahip değilsin! Şu rollerden birisine sahip olman gerekiyor: {ROLES}"
    },
    "COOLDOWN": {
        "english": "You must wait {COOLDOWN} before using that command again.",
        "spanish": "Debe esperar {COOLDOWN} antes de usar ese comando nuevamente.",
        "portuguese": "Você precisa esperar {COOLDOWN} antes de usar este comando novamente.",
        "russian": "Вы должны подождать {COOLDOWN} перед использованием данной команды снова.",
        "german": "Du musst {COOLDOWN} warten, bevor du diesen Befehl erneut nutzen kannst.",
        "czech": "Počkej {COOLDOWN}, než použiješ příkaz znova.",
        "slovak": "Počkaj {COOLDOWN}, skôr ako použiješ príkaz znova.",
        "turkish": "Bu komutu kullanabilmek için {COOLDOWN} beklemelisin."
    },
    "UNKNOWN_COMMAND": {
        "english": "Could not find command {COMMAND}!",
        "spanish": "¡No se pudo encontrar el comando {COMMAND}!",
        "portuguese": "Não foi possível encontrar o comando {COMMAND}!",
        "russian": "Не удалось найти команду {COMMAND}!",
        "german": "Konnte den Befehl {COMMAND} nicht finden!",
        "czech": "Příkaz {COMMAND} nebyl nalezen!",
        "slovak": "Príkaz {COMMAND} nebol nájdený!",
        "turkish": "{COMMAND} adındaki komutu bulamadım!"
    },
    "NSFW": {
        "english": "You can only use this command in nsfw channel.",
        "spanish": "Sólo puede utilizar este comando en el canal nsfw.",
        "portuguese": "Só se pode utilizar este comando no canal nsfw.",
        "russian": "Вы можете использовать эту команду только в канале nsfw.",
        "german": "Sie können diesen Befehl nur im nsfw-Kanal verwenden.",
        "czech": "Tento příkaz můžete použít pouze v nsfw.",
        "slovak": "Príkaz môžete využiť iba v nsfw room.",
        "turkish": "Bu komutu sadece nsfw kanalında kullanabilirsiniz."
    }
}
```

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