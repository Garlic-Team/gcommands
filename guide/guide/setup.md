# Installing Node.js and GCommands

## Installing Node.js

<language lang="en">

Don't have Node.js yet? Go to their [website](https://nodejs.org) and install it!<br>
Don't have an editor? Check out [VS Code](https://code.visualstudio.com/).

</language>
<language lang="tk">

Hala Node.JS'ye sahip değil misin? Buradan [sitesine](https://nodejs.org) gidip kurulum yapabilirsin.<br>
Hala bir kod editörün yok mu? [VS Code]([link](https://code.visualstudio.com/))'u incele.

</language>

### Installing on Windows

<language lang="en">

If you have a Windows machine, it's as simple as installing any other program. Go to the [Node.js website](https://nodejs.org), download the latest version, open up the downloaded file, and follow the steps on the installer.

</language>
<language lang="tk">

Eğer Windows kullanan makinen varsa kurulum yapmak çok basit. [Node.JS'nin sitesine](https://nodejs.org) gidip oradaki en son sürümü indir ve kurulumu takip et.

</language>

### Installing on macOS

<language lang="en">

If you have a macOS machine, you have a few options. You can go to the [Node.js website](https://nodejs.org), download the latest version, double click the package installer, and follow the instructions. Or you can use a package manager like Homebrew (opens new window) with the command `brew install node`.

</language>
<language lang="tk">

macOS kullanan makinen varsa kurulum yapmak için birden fazla şansın var. Windows'ta olduğu gibi [Node.JS'nin sitesine](https://nodejs.org) gidip son sürümü indirebilirsin veya paket yükleyicilerinden birisini kullanabilirsin. Örnek vermek gerekirse HomeBrew iyi bir seçenek. Şu komutu kullanarak kurulum yap: `brew install node`.

</language>

### Installing on Linux

<language lang="en">

If you have a Linux machine, you may see [this page](https://nodejs.org/en/download/package-manager/) to determine how you should install Node.

::: warning
If you do have Node installed, but have an older version \(i.e. anything below 12.0\), you should upgrade to the latest version. discord.js v12 requires Node 12.0 or higher.
:::

</language>
<language lang="tk">

Linux'a kurulum yapıyorsan [şu sayfayı](https://nodejs.org/en/download/package-manager/) ziyaret etmen iyi olur. 

::: warning
Node.JS kuruluysa ama kurulu olduğu sürüm eski sürümlerinden birisiye bunu güncel hale getirmen iyi olacaktır. Çünkü discord.js V12, Node'nin 12.0 sürümü ve üzerindeki sürümlerde çalışıyor.
:::

</language>

## Installing GCommands

<language lang="en">

Use `npm i gcommands` for download stable version.<br>
Use `npm i github:Garlic-Team/GCommands#dev` for download dev version.<br>
Create a folder with your own name and then create index.js in it

::: warning
If you installing dev version you need has git.
:::

::: danger
Need import GCmmands **before** creating new Discord.Client
:::

</language>
<language lang="tk">

Stabil olan sürümünü kurmak için `npm i gcommands` veya yarn add gcommands komutunu kullanabilirsin..<br>
Eğer geliştirici sürümünü kullanmak istiyorsan `npm i github:Garlic-Team/GCommands#dev` veya `yarn add github:Garlic-Team/GCommands#dev` komutunu kullanabilirsin.<br>
Bir klasör yarat ve içerisine index.js'yi oluştur.

::: warning
Geliştirici sürümünü kullanıyorsan git'e ihtiyacın olacak.
:::

::: danger
new Discord.Client kullanılmadan önce GCommands'ı import etmelisin.
:::

</language>

<branch version="5.x">

<language lang="en">

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
        defaultCooldown: "3s",
        database: "url"
        /* DB SUPPORT
         * redis://user:pass@localhost:6379
         * mongodb://user:pass@localhost:27017/dbname
         * sqlite://path/to/database.sqlite
         * postgresql://user:pass@localhost:5432/dbname
         * mysql://user:pass@localhost:3306/dbname
        */
    })
    
    GCommandsClient.on("debug", (debug)=>{
        console.log(debug)
    })

    console.log("Ready")
})

client.login("token")
```

Below are all the available options.


| PARAMETER        	    | REQUIRED 	 | WHAT IT DOES                                                                                                                                              |
|---------------------- |----------- |---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| cmdDir           	    | ✅        | The directory commands are stored in.                                                                                                                      |
| eventDir         	    | ❌        | The directory events are stored in.                                                                                                                        |
| unkownCommandMessage         	    | ❌        | Send unkown command message                                                                                                                         |
| language         	    | ✅        | All messages in json                                                              |
| slash.slash      	    | ✅        | If set to **true**, only slash commands will execute. If set to **false**, only normal commands will execute. If set to **both**, both types will execute 	|
| slash.prefix     	    | ✅        | Default prefix for normal commands.                                                                                     	                                |
| defaultCooldown 	    | ✅        | Default cooldown for all commands. (in seconds)                                                                                                            |
| shardClusterName 	    | ❌        | Your shard cluster name if you are sharding. Default is "shard"                                                                                                            |
| database    	    | ❌    	   | DB                                                                                                    |

</language>
<language lang="tk">

```js
const { GCommands } = require("gcommands");
const Discord = require("discord.js");

const client = new Discord.Client();

client.on("ready", () => {
    const GCommandsClient = new GCommands(client, {
        cmdDir: "komutlar/", // Komutlarınızın olduğu klasörün ismi.
        eventDir: "events/", // Eventlerinizin olduğu klasörün ismi.
        unkownCommandMessage: false, // true ya da false | Olmayan bir komut kullanıldığında mesaj gönderir.
        language: "english", //english, spanish, portuguese, russian, german, czech, turkish 
        slash: {
           slash: 'both', // true = Sadece eğik çizgi komutları | false = Sadece normal komutlar | both = Her ikisini de destekler.
           prefix: '.' // Normal komutları kullanacaksan bir önek oluştur.
        },
        defaultCooldown: "3s", // Komut bekleme süresi.
        database: "url"
        /* DB SUPPORT
         * redis://user:pass@localhost:6379
         * mongodb://user:pass@localhost:27017/dbname
         * sqlite://path/to/database.sqlite
         * postgresql://user:pass@localhost:5432/dbname
         * mysql://user:pass@localhost:3306/dbname
        */
    })
    
    GCommandsClient.on("debug", (debug)=>{
        console.log(debug)
    })

    console.log("Hazır!")
})

client.login("tokeniniz_buraya")
```

Aşağıda kullanabileceğin bütün ayarlar mevcut.


| PARAMETRE          	    | ZORUNLULUK   	 | NE İŞ YAPAR?                                                                                            |
|---------------------- |----------- |---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| cmdDir           	    | ✅        | Komutların depolandığı klasörün ismi.                                                                                                                      |
| eventDir         	    | ❌        | Eventlerin depolandığı klasörün ismi.                                                                                                                        |
| unkownCommandMessage         	    | ❌        | Botta ekli olmayan bir komut yazıldığında hata mesajı.                                                                                                                         |
| language         	    | ✅        | JSON içerisinde olan bütün diller.                                                              |
| slash.slash      	    | ✅        | Eğer **true** ayarlanırsa sadece eğik çizgi komutları, **false** olarak ayarlanırsa sadece normal komutları veya both olarak ayarlanırsa her iki komut türünü de kullanabilirsin. 	|
| slash.prefix     	    | ✅        | Normal komutlar için önek.                                                                                     	                                |
| defaultCooldown 	    | ✅        | Bütün komutlarda geçerli olan bekleme süresi. (Saniye cinsinden.)                                                                                                            |
| shardClusterName 	    | ❌        | Shard işlemi uyguluyorsan Shard Cluster adı. Varsayılan ad "shard".                                                                                                            |
| database    	    | ❌    	   | DB                                                             

</language>

</branch>

<language lang="en">

::: warning
You need to have discord.js version **atleast** v12
:::

</language>
<language lang="tk">

::: warning
Discord.JS'nin en az V12 sürümünü kullanıyor olman gerek
:::

</language>