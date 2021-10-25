# Message Components

::: danger
**DEPRECATED** Check official djs guide: [Buttons](https://discordjs.guide/interactions/buttons.html) [Select Menus](https://discordjs.guide/interactions/select-menus.html#component-collectors) 
:::

Buttons send an event when clicked.

::: warning
You can have a maximum of:

- 5 `ActionRow`s per message
- 5 `MessageButton`s per `ActionRow`
  :::

## Handling Buttons

### createMessageComponentCollector

```js
const { MessageActionRow, MessageButton } = require("gcommands");

let row = new MessageActionRow().addComponents([
  new MessageButton()
    .setLabel("Primary (Blurple)")
    .setCustomId("blurple")
    .setStyle("PRIMARY"),

  new MessageButton()
    .setLabel("Secondary (Gray)")
    .setCustomId("gray")
    .setStyle("SECONDARY"),

  new MessageButton()
    .setLabel("Danger (Red)")
    .setCustomId("red")
    .setStyle("DANGER"),
]);

let msg = await channel.send({
  content: "Press a button!",
  components: row,
});
let filter = (interaction) =>
  interaction.isButton() && interaction.author.id === author.id;
let collector = msg.createMessageComponentCollector(filter, {
  max: 3,
  time: 120000,
});

collector.on("collect", (btn) => {
  btn.reply.send({
    content: `${btn.user.toString()}, you clicked ${btn.customId}!`,
  });
});
collector.on("end", (btn) => {
  msg.reply({
    content: `Time ran out!`,
  });
});
```

<div is="dis-messages">
  <dis-messages>
    <dis-message profile="gcommands">
      Press a button!
      <template #actions>
        <discord-buttons>
          <discord-button type="primary">Primary (Blurple)</discord-button>
          <discord-button type="secondary">Secondary (Gray)</discord-button>
          <discord-button type="danger">Danger (Red)</discord-button>
        </discord-buttons>
      </template>
    </dis-message>
    <dis-message profile="gcommands">
      <template #interactions>
          <discord-interaction profile="gcommands">Press a button!</discord-interaction>
      </template>
      <mention profile="hyro" :highlight="true">Hyro</mention>, you clicked blurple!
    </dis-message>
    <dis-message profile="gcommands">
      <template #interactions>
          <discord-interaction profile="gcommands">Press a button!</discord-interaction>
      </template>
      <mention profile="hyro" :highlight="true">Hyro</mention>, you clicked gray!
    </dis-message>
    <dis-message profile="gcommands">
      <template #interactions>
          <discord-interaction profile="gcommands">Press a button!</discord-interaction>
      </template>
      <mention profile="hyro" :highlight="true">Hyro</mention>, you clicked red!
    </dis-message>
    <dis-message profile="gcommands">
      <template #interactions>
          <discord-interaction profile="gcommands">Press a button!</discord-interaction>
      </template>
      Time ran out!
    </dis-message>
  </dis-messages>
</div>

### awaitMessageComponents

```js
const { MessageActionRow, MessageButton } = require("gcommands");

let row = new MessageActionRow().addComponents([
  new MessageButton()
    .setLabel("Primary (Blurple)")
    .setCustomId("blurple")
    .setStyle("PRIMARY"),

  new MessageButton()
    .setLabel("Secondary (Gray)")
    .setCustomId("gray")
    .setStyle("SECONDARY"),

  new MessageButton()
    .setLabel("Danger (Red)")
    .setCustomId("red")
    .setStyle("DANGER"),
]);

let msg = await respond({
  content: "Press a button!",
  components: row,
});
let filter = (interaction) =>
  interaction.isButton() && interaction.author.id === author.id;
let clicked = await msg.awaitMessageComponents(filter, {
  max: 3,
  time: 120000,
});

if (clicked.size === 0)
  return msg.reply({
    content: "You didn't click any button :(",
  });

msg.reply({
  content: `You clicked: ${clicked
    .first()
    .map((btn) => btn.id)
    .join(", ")}!`,
});
```

<div is="dis-messages">
  <dis-messages>
    <dis-message profile="gcommands">
      Press a button!
      <template #actions>
        <discord-buttons>
          <discord-button type="primary">Primary (Blurple)</discord-button>
          <discord-button type="secondary">Secondary (Gray)</discord-button>
          <discord-button type="danger">Danger (Red)</discord-button>
        </discord-buttons>
      </template>
    </dis-message>
    <dis-message profile="gcommands">
      <template #interactions>
          <discord-interaction profile="gcommands">Press a button!</discord-interaction>
      </template>
      You didn't click any button :(
    </dis-message>
  </dis-messages>
  <dis-messages>
    <dis-message profile="gcommands">
      Press a button!
      <template #actions>
        <discord-buttons>
          <discord-button type="primary">Primary (Blurple)</discord-button>
          <discord-button type="secondary">Secondary (Gray)</discord-button>
          <discord-button type="danger">Danger (Red)</discord-button>
        </discord-buttons>
      </template>
    </dis-message>
    <dis-message profile="gcommands">
      <template #interactions>
          <discord-interaction profile="gcommands">Press a button!</discord-interaction>
      </template>
      You clicked: blurple, gray, red!
    </dis-message>
  </dis-messages>
</div>

## Functions

| FUNCTION | DESCRIPTION                                                                             | RETURNS                        |
| -------- | --------------------------------------------------------------------------------------- | ------------------------------ |
| reply    | Inline replies to a MessageComponent, just like `message.reply`                         | Promise <​MessageInteraction​> |
| think    | The interaction will respond with "Thinking". This can later by resolved by `.edit()`   | undefined                      |
| edit     | Edits the interaction. **DEPRECATED** (use `MessageComponent.message.edit`)             | Promise <​MessageInteraction​> |
| defer    | Resolves the interaction, makes it so it won't respond with a "This interaction failed" | undefined                      |

### reply

```js
MessageInteraction.reply.send({
  content: "Hi!",
});
```

<div is="dis-messages">
  <dis-messages>
    <dis-message profile="gcommands">
      MessageInteraction.reply
      <template #actions>
        <discord-buttons>
          <discord-button type="primary">Click Me!</discord-button>
        </discord-buttons>
      </template>
    </dis-message>
    <dis-message profile="gcommands">
      <template #interactions>
          <discord-interaction profile="gcommands">MessageInteraction.reply</discord-interaction>
      </template>
      Hi!
    </dis-message>
  </dis-messages>
</div>

### think

```js
MessageInteraction.think();
```

<div is="dis-messages">
  <dis-messages>
    <dis-message profile="gcommands">
      MessageInteraction.think
      <template #actions>
        <discord-buttons>
          <discord-button type="primary">Click Me!</discord-button>
        </discord-buttons>
      </template>
    </dis-message>
  </dis-messages>
  <dis-messages>
    <dis-message profile="gcommands">
      MessageInteraction.think
      <template #actions>
        <discord-buttons>
          <discord-button type="primary" :disabled="true">Click Me!</discord-button>
        </discord-buttons>
        <i>GCommands is thinking...</i>
      </template>
    </dis-message>
  </dis-messages>
</div>

### edit

```js
MessageInteraction.edit({
  content: "Edited!",
  components: new MessageActionRow().addComponent(
    new MessageButton()
      .setID("clicked_button")
      .setLabel("Clicked!")
      .setStyle("SECONDARY")
      .setDisabled(true)
  ),
});
```

<div is="dis-messages">
  <dis-messages>
    <dis-message profile="gcommands">
      MessageInteraction.edit
      <template #actions>
        <discord-buttons>
          <discord-button type="primary">Click Me!</discord-button>
        </discord-buttons>
      </template>
    </dis-message>
  </dis-messages>
  <dis-messages>
    <dis-message profile="gcommands">
      Edited!
      <template #actions>
        <discord-buttons>
          <discord-button type="secondary" :disabled="true">Clicked!</discord-button>
        </discord-buttons>
      </template>
    </dis-message>
  </dis-messages>
</div>

```js
MessageInteraction.defer();
```

## Button Functions

| FUNCTION         | REQUIRED | DESCRIPTION                                                                            |
| ---------------- | -------- | -------------------------------------------------------------------------------------- |
| `.setStyle()`    | ✅       | Sets the color of the button                                                           |
| `.setLabel()`    | ✅       | Sets the text on the button                                                            |
| `.setID()`       | ❓       | Sets the custom id for the button (not required for `URL` buttons)                     |
| `.setURL()`      | ❌       | Sets the `URL` for the button (automatically sets style to `LINK`)                     |
| `.setDisabled()` | ❌       | Sets the disabled state of the button (`true`/`false`/`null`)                          |
| `.setEmoji()`    | ❌       | Sets the emoji for the button. Only one of `.setLabel()` and `.setEmoji()` is required |

| STYLE     | ALIAS   |
| --------- | ------- |
| PRIMARY   | BLURPLE |
| SECONDARY | GRAY    |
| SUCCESS   | GREEN   |
| DANGER    | RED     |
| LINK      | URL     |

# Select Menu

Messages can also have Select/Dropdown Menus

<img src="/../../selectmenu.png" width="450px;">

::: warning
You can have a maximum of:

- 1 `SelectMenu` per `ActionRow`
- `SelectMenu`s and `MessageButton`s cannot mix in an `ActionRow`
  :::

```js
const {
  MessageSelectMenu,
  MessageSelectOption,
  MessageActionRow,
} = require("gcommands");

let dropdown = new MessageSelectMenu()
  .setID("example_dropdown")
  .setMaxValues(1)
  .setMinValue(1)
  .setPlaceholder("Pick something!")
  .addOptions([
    new MessageSelectOption()
      .setLabel("Cereal, Milk")
      .setDecription("The cereal comes before the milk!")
      .setValue("cerealmilk")
      .setDefault(),
    new MessageSelectOption()
      .setLabel("Milk, Cereal")
      .setDecription("The milk comes before the cereal!")
      .setValue("milkcereal")
      .setDefault(),
  ]);
let row = new MessageActionRow().addComponent(dropdown);

respond({
  content: "Pick one!",
  components: row,
});
```

## Select Menu Functions

| FUNCTION            | REQUIRED | DESCRIPTION                                                          |
| ------------------- | -------- | -------------------------------------------------------------------- |
| `.setPlaceholder()` | ❌       | Sets the placeholder text of the Dropdown Menu                       |
| `.setMaxValues()`   | ❌       | Sets the max amount of selected options                              |
| `.setMinValues()`   | ✅       | Sets the min amount of selected options                              |
| `.setID()`          | ✅       | Sets the custom id of the Dropdown Menu                              |
| `.setDisabled()`    | ❌       | Sets the disabled state of the Dropdown Menu (`true`/`false`/`null`) |

### Option

| FUNCTION            | REQUIRED | DESCRIPTION                                                     |
| ------------------- | -------- | --------------------------------------------------------------- |
| `.setLabel()`       | ✅       | Sets the text on the option                                     |
| `.setValue()`       | ✅       | Sets the ID of the option                                       |
| `.setDisabled()`    | ❌       | Sets the disabled state of the option (`true`/`false`/`null`)   |
| `.setDescription()` | ❌       | Sets the description of the option                              |
| `.setEmoji()`       | ❌       | Sets the emoji of the option                                    |
| `.setDefault()`     | ❌       | If set to true, this option will be the default selected option |
