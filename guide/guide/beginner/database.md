# Database

## Guild Prefix

<language lang="en">

Guild Prefix is ​​used so that the guild can set whatever prefix it wants.
If you still haven't done your database setup, it's easy! Just head to [Database Setup](./basicbot.md) section.

</language>
<language lang="tk">

GCommands sunucu öneklerini destekliyor. Yani sunucular botta hangi öneki kullanmak isterlerse onu kullanabiliyorlar. Bunu yapmadan önce botta veritabanı ayarlamak zorundasın. Nasıl ayarlanacağını bilmiyorsan [buradaki sayfaya](./basicbot.md) giderek ayarlama kılavuzunu okuyabilirsin.

</language>

### How to get guild prefix?
It's very simple! Just use this.

<branch version="5.x">

```js
client.dispatcher.getGuildPrefix("id of guild/Sunucunun ID'si.")
guild.getCommandPrefix()
```

</branch>

### How to set guild prefix?
It's very simple! Just use this.

<branch version="5.x">

```js
client.dispatcher.setGuildPrefix("guild id/Sunucu ID'si","prefix/ön ek")
guild.setCommandPrefix("prefix/önek")
```

</branch>

## Guild Language

<language lang="en">

Guild Prefix is ​​used so that the guild can set whatever language it wants.
If you still haven't done your database setup, it's easy! Just head to [Database Setup](./basicbot.md) section.

</language>

### How to get guild language?
It's very simple! Just use this.

<branch version="5.x">

```js
client.dispatcher.getGuildLanguage("id of guild/Sunucunun ID'si.")
guild.getLanguage()
```

</branch>

### How to set guild language?
It's very simple! Just use this.

<branch version="5.x">

```js
client.dispatcher.setGuildLanguage("guild id/Sunucu ID'si", "language")
guild.setLanguage("language")
```

</branch>