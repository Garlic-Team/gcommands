# Interactions
If you want you can use event interaction and there detect if there is a dropdown/button.

#### Functions
| Function | Description | Returns |
|-- |-- | -- |
| reply | The reply function, see below | [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
| think | The bot will reply with "Thinking..."
| edit | The bot will edit the interaction **DEPRECATED** (use button/menu.message.edit)
| defer | The bot will reply with nothing

```js
button/menu.defer() //nothing
button/menu.think() //the reply is "Thinking..."
button/menu.edit("hello")
```

#### Reply
| Function | Description |
|-- |-- | -- |
| send | Send a reply
| edit | Edit the reply
| fetch | Fetch the reply

```js
button/menu.reply.send({
    content: "hi", // or MessageEmbed()
    components: []
})

button/menu.reply.edit({
    content: "hi", // or MessageEmbed()
    components: []
})
```

<branch version="2.x">

::: danger
You need to have gcommands version **atleast** v4
:::

</branch>
<branch version="3.x">

::: danger
You need to have gcommands version **atleast** v4
:::

</branch>


## Buttons
If you want buttons in your messages, you've come to the right place!

::: warning
You can have maximum:
- five `ActionRows` per message
- five buttons within an `ActionRow` 
- can't have a button with a `SelectMenu` in a certain `ActionRow`
:::

### Send Button
The following steps will work for both normal and slash command.

```js
const { MessageButton, MessageActionRow } = require("gcommands")

const button = new MessageButton()
  .setStyle("red")
  .setLabel("pog")
  .setID("redbutton")
  .setDisabled()
  .setEmoji("💚") // or .setEmoji("<:name:id>"), not required
  .toJSON()

const buttonEdited = new MessageButton().setStyle("gray").setLabel("poag").setID("redbutton").toJSON()
const buttonURL = new MessageButton().setStyle("url").setLabel("po").setURL("https://thedevelopers.tk").toJSON()

const buttonRow = new MessageActionRow()
    .addComponent(button)
    .addComponent(buttonURL)

const buttonRow2 = new MessageActionRow()
    .addComponent(buttonEdited)

respond({
  content: "hi with buttons",
  components: buttonRow, // 1 button
  components: [buttonRow, buttonRow2] // 2 rows
})

edit({
  content: "hello",
  components: buttonRow, // 1 button
  components: [buttonRow, buttonRow2] // 2 rows
})
```

#### Sending buttons to other channel/dm
```js
let msg = await channel.send({
  content: "hi with buttons",
  components: buttonRow, // 1 button
  components: [buttonRow, buttonRow2] // 2 rows
})

msg.edit({
  content: "hello",
  components: buttonRow, // 1 button
  components: [buttonRow, buttonRow2] // 2 rows
})

// dm
let msg = await member.send({
  content: "hi with buttons",
  components: buttonRow, // 1 button
  components: [buttonRow, buttonRow2] // 2 rows
})

msg.edit({
  content: "hello",
  components: buttonRow, // 1 button
  components: [buttonRow, buttonRow2] // 2 rows
})
```

### Handling buttons
Here we will show how you can detect if someone has clicked the button!
The following steps will work for both normal and slash command.

```js
client.on("clickButton", (button) => {
    console.log(button, button.id)
    const buttonEdit = new MessageButton().setStyle("gray").setLabel("poag").setID("redbutton").setDisabled().toJSON()
    const buttonRow = new MessageActionRow()
        .addComponent(buttonEdit)

    button.message.edit({
      autoDefer: true, // if false use button.defer()
      content: "hi",
      components: buttonRow, // 1 button
      components: [buttonRow, buttonRow2] // 2 rows
      edited: false // show (edited)
    })

    // new message (reply)
    button.reply.send({
        content: "a",
        components: buttonRow
    })

    setTimeout(() => {
        button.reply.edit({
            content: "ab",
            components: buttonRow
        })
    }, 2000)
})
```

### Collectors
```js
var msg = await respond({
    content: new MessageEmbed().setTitle("a"),
    components: buttonRow
})

const filter = (button) => button.clicker.user.id === member.id;
const collector = msg.createButtonCollector(filter, { max: 1, time: 60000, errors: ['time'] });

collector.on('collect', async(b) => {
    console.log(b)
});
collector.on('end', collected => console.log(`Collected ${collected.size} items`));
```

### Await Buttons
```js
var msg = await respond({
    content: new MessageEmbed().setTitle("a"),
    components: buttonRow
})

const filter = (button) => button.clicker.user.id === member.id;
const collector = await msg.awaitButtons(filter, { max: 1, time: 60000, errors: ['time'] });

console.log(`${member.user.tag} clicked the pog button!`);
```

| STYLES   	|  ALIASES     | MessageButton        	|
|---------	| ----  | ----------------	|
| BLURPLE 	|  PRIMARY  |`.setStyle()`    	|
| GRAY    	|  SECONDARY  |`.setLabel()`    	|
| GREEN   	|  SUCCESS  |`.setID()`       	|
| RED     	|  DANGER  |`.setURL()`      	|
| URL     	|  LINK  |`.setDisabled()` 	|
|      	    |    |`.setEmoji("emoji")` 	|

::: warning
Only `URL` buttons can have a url. `URL` buttons can **not** have a `custom_id`. `URL` buttons also do not send an interaction event when clicked.
:::

## Select Menu
If you want menus in your messages, you've come to the right place!

<img src="https://discord.com/assets/0845178564ed70a6c657d9b40d1de8fc.png" width="450px;">

::: warning
You can have maximum:
- one `SelectMenu` per `ActionRow`
:::

### Send Menus
The following steps will work for both normal and slash command.

```js
const { MessageSelectMenu, MessageSelectMenuOption, MessageActionRow } = require("gcommands")

const dropdownOption = new MessageSelectMenuOption()
  .setDescription("test")
  .setLabel("label1")
  .setValue("dropdown_label_1")
  .setEmoji("💚") // or .setEmoji("<:name:id>"), not required
  .setDefault()

const dropdownOption2 = new MessageSelectMenuOption()
  .setDescription("test")
  .setLabel("label2")
  .setValue("dropdown_label_2")
  .setEmoji("💚") // or .setEmoji("<:name:id>"), not required

const dropdownOption3 = new MessageSelectMenuOption()
  .setDescription("test")
  .setLabel("POGASDJOA")
  .setValue("dropdown_label_3")
  .setEmoji("💚") // or .setEmoji("<:name:id>"), not required

const dropdown = new MessageSelectMenu()
  .setID("dropdown_1")
  .setMaxValues(3) // not required
  .setMinValues(2)
  .setPlaceholder("hehe")
  .addOptions([
    dropdownOption, dropdownOption2, dropdownOption3
  ])

const actionRow = new MessageActionRow()
    .addComponent(dropdown)

respond({
  content: "hi with buttons",
  components: actionRow, // 1 button
  components: [actionRow, actionRow] // 2 rows
})

edit({
  content: "hello",
  components: actionRow, // 1 button
  components: [actionRow, actionRow] // 2 rows
})
```

#### Sending menus to other channel/dm
```js
let msg = await channel.send({
  content: "hi with menu",
  components: actionRow, // 1 button
  components: [actionRow, actionRow] // 2 rows
})

msg.edit({
  content: "hello",
  components: actionRow, // 1 button
  components: [actionRow, actionRow] // 2 rows
})

// dm
let msg = await member.send({
  content: "hi with menu",
  components: actionRow, // 1 button
  components: [actionRow, actionRow] // 2 rows
})

msg.edit({
  content: "hello",
  components: actionRow, // 1 button
  components: [actionRow, actionRow] // 2 rows
})
```

### Handling menus
Here we will show how you can detect if someone has used the menu!
The following steps will work for both normal and slash command.

```js
client.on("selectMenu", (menu) => {
  console.log(menu, menu.id, menu.values)
  const dropdownOption = new MessageSelectMenuOption()
    .setDescription("test")
    .setLabel("a")
    .setValue("aa")
    .setDefault(false)

  const dropdownOption2 = new MessageSelectMenuOption()
    .setDescription("test")
    .setLabel("POGASDJO")
    .setValue("aaAAA")
    .setDefault(false)

  const dropdownOption3 = new MessageSelectMenuOption()
    .setDescription("test")
    .setLabel("POGASDJOA")
    .setValue("aaAAAA")
    .setDefault(false)

  const dropdown = new MessageSelectMenu()
    .setID("dropdown_1")
    .setMaxValues(3) // not required
    .setMinValues(2)
    .setPlaceholder("hehe")
    .addOptions([
      dropdownOption, dropdownOption2, dropdownOption3
    ])

  const buttonRow = new MessageActionRow()
      .addComponent(dropdown)

  menu.message.edit({
    content: "hi",
    components: actionRow, // 1 menu
    components: [actionRow, actionRow2] // 2 rows
    edited: false // show (edited)
  })

  // new message (reply)
  menu.reply.send({
      content: "a",
      components: actionRow
  })

  setTimeout(() => {
      menu.reply.edit({
          content: "ab",
          components: actionRow
      })
  }, 2000)
})
```

### Collectors
```js
var msg = await respond({
    content: new MessageEmbed().setTitle("a"),
    components: actionRow
})

const filter = (menu) => menu.clicker.user.id === member.id;
const collector = msg.createSelectMenuCollector(filter, { max: 1, time: 60000, errors: ['time'] });

collector.on('collect', async(menu) => {
    console.log(menu)
});
collector.on('end', collected => console.log(`Collected ${collected.size} items`));
```

### Await Select Menus
```js
var msg = await respond({
    content: new MessageEmbed().setTitle("a"),
    components: actionRow
})

const filter = (menu) => menu.clicker.user.id === member.id;
const collector = await msg.awaitSelectMenus(filter, { max: 1, time: 60000, errors: ['time'] });

console.log(`${member.user.tag} select the pog menu!`);
```
