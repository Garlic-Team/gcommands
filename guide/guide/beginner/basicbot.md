# Making a basic bot

## Create Application

<language lang="en">

First, you need to create a bot in Discord's Developer Applications page. Head to [Applications Page](https://discord.com/developers/applications) and hit New Application button. A modal will appear asking you for name, enter the bot name you want and hit Create!

![Create App](https://gcommands.js.org/guide/createapp.png)

Navigate to `Bot` tab on left-pane, then click on `Add Bot`. It will ask you for confirmation, just click on `Yes, do it!`

![Add Bot](https://gcommands.js.org/guide/addbot.png)

And your bot now has a life! Yes, a life! It has successfully become a Discord User.
Now you can go ahead and invite the bot to your server. Now navigate to `OAuth2` tab and scroll down a bit; then select `bot` scope. And optionally, below there you can select permissions to give to bot!

![OAuth2](https://gcommands.js.org/guide/oauth2.png)

</language>
<language lang="tk">

İlk başta Discord Geliştiriciler sayfasından kendimize bir bot oluşturmamız gerekiyor. [Buradan](https://discord.com/developers/applications) aplikasyonlar sayfasına gidip yeni bir tane aplikasyon oluşturmayı denemelisin.

![Create App](https://gcommands.js.org/guide/createapp.png)

Sol taraftan `Bot` kısmına git ve `Bot Ekle` butonuna tıkla. Bu işlemi `Evet bunu yapalım!` butonuna tıklayarak onaylamalısın.

![Add Bot](https://gcommands.js.org/guide/addbot.png)

Sesi duyuyor musun? Botuna hayat verdik! Artık oluşturduğun aplikasyon Discord'un bir üyesi. Botunu artık sunuculara davet edebiliriz ve onun üzerinden işlemleri yapabiliriz. Şimdi yine sol taraftan, `OAuth2` sekmesine gitmelisin. Oraya ulaştığın zaman biraz aşağıya git daha sonrasında şu iki tiki işaretle: `bot` ve `commands`. İstediğin başka yetkiler varsa yine oradan sağlayabilirsin.

![OAuth2](https://gcommands.js.org/guide/oauth2.png)

</language>

## Get bot's token

<language lang="en">

What is a token? It acts like a password for bots to login!

On the `Bot` page itself, there is a `Copy Token` button - go ahead and click on it! Token will be on your clipboard. Alternatively, you can `Click to Reveal Token`.

![Token](https://gcommands.js.org/guide/token.png)

::: warning
Token should **NEVER** be shared with **ANYONE**! Token gives **complete**, yes complete access over bot and can destroy it *badly*.
:::

::: tip
In case you really lost it, best way is to reset it using `Regenerate` button on the same page, this will invalidate any previous token.
:::

</language>
<language lang="tk">

Token de ne ola ki? Token bir çeşit parola işlevi görür. Bu parola olmadan bota bağlantı yapamayız.

Şimdi `Bot` sekmesine tekrar gidelim. Orada artık botumuzun ismini ve diğer özellikleri görebilirsin. Tokenini `Copy` butonu sayesinde kopyala. Dilersen `Tokeni Göster` butonuna basarak tokeni gözünle görebileceğin hale getirebilirsin.

![Token](https://gcommands.js.org/guide/token.png)

::: warning
Tokenini kimseyle **paylaşmamalısın**. Bunun ana sebebi tokenin birisinin eline geçerse botuna zarar verebilir ve istenmeyen sonuçlarla karşılaşabilirsin. 
:::

::: tip
Herhangi bir sorun olursa veya tokenini unutursan `Regenerate` butonuna basarak tekrar bir token yaratabilirsin. Eski tokenin bu durumda işe yaramaz hale gelir.
:::

</language>

## Write Code

<language lang="en">

Let's *actually* start writing code! If you still haven't done your setup, it's easy! Just head to [Setup](../setup.md) section.
Create a file with custom name example index.js

</language>
<language lang="tk">

Hadi kodlama işine girişelim. Hala botlarla ilgili bir klasörün veya yapın yoksa [Kurulum](../setup.md) kısmına giderek kurulum oluşturabilirsin. 
İsmi her şeyden özel olan index.js'yi oluşturarak başlayalım.

</language>

<branch version="5.x">

```js
const { GCommands } = require("gcommands");
const Discord = require("discord.js");

const client = new Discord.Client();

client.on("ready", () => {
    const GCommandsClient = new GCommands(client, {
        cmdDir: "commands/",
        eventDir: "events/",
        unkownCommandMessage: false, // true of false | send unkownCommand Message
        language: "english", //english, spanish, portuguese, russian, german, czech, turkish
        slash: {
           slash: 'both', //true = slash only, false = only normal, both = slash and normal
           prefix: '.' // for normal commands
        },
        defaultCooldown: 3,
        database: "url"
        /* DB SUPPORT
         * redis://user:pass@localhost:6379
         * mongodb://user:pass@localhost:27017/dbname
         * sqlite://path/to/database.sqlite
         * postgresql://user:pass@localhost:5432/dbname
         * mysql://user:pass@localhost:3306/dbname
        */
    })
    
    GCommandsClient.on("log", (log) => {console.log(log)})

    console.log("Ready")
})

client.login("Bot token here")
```

</branch>

<language lang="en">

::: tip
Use `node index.js` in terminal to start bot!
:::

</language>
<language lang="tk">

::: tip
Terminal üzerinden `node index.js` kodunu kullanarak botunu başlatabilirsin!
:::

</language>

## Command Handler

<language lang="en" inline=true>Create the folder you specified as `cmdDir`. For example, `commands` then create `ping.js` file.</language>
<language lang="tk" inline=true>Daha önce `cmdDir`'e belirlemiş olduğun klasörün içerisine komutları yazabiliriz. Örnek vermek gerekirse: yeni bir `komut` oluşturalım. Dosya ismini de `ping.js` koyalım.</language>

<branch version="5.x">

```js
const { Command } = require("gcommands")

module.exports = class Ping extends Command {
  constructor(...args) {
    super(...args, {
        name: "ping",
        description: "Check bot ping"
    })
  }

  async run({respond}) {
        // if slash and normal cmd
        // Eğer normal veya eğik çizgi komutuysa
        respond("pog");
  }
};
```

<div is="discord-messages">
    <dis-messages>
        <dis-message profile="gcommands">
            <template #interactions>
                <discord-interaction profile="hyro" :command="true">ping</discord-interaction>
            </template>
            pong
        </dis-message>
    </dis-messages>
    <dis-messages>
        <dis-message profile="izboxo">
            .ping
        </dis-message>
        <dis-message profile="gcommands">
            pong
        </dis-message>
    </dis-messages>
</div>
    
</branch>

## Event Handler

<language lang="en" inline=true>Create the folder you specified as `eventDir`. For example, `events` then create `message.js` file.</language>
<language lang="tk" inline=true>Daha önce `eventDir`'e belirlemiş olduğun klasörün içerisine eventleri yazabiliriz. Örnek vermek gerekirse: yeni bir `event` oluşturalım. Dosya ismini de `message.js` koyalım.</language>

```js
const { Event } = require("gcommands")

module.exports = class Ping extends Event {
    constructor(...args) {
        super(...args, {
            name: "message",
            once: false,
            ws: false
        })
    }

    async run(client, message) {
        console.log(`${message.author.tag} -> ${message.content}`)
    }
};
```
