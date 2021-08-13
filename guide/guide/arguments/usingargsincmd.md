# Using arguments in Commands

Arguments in commands can make a lot of things easier for you. They can be used for ban/kick commands, or even for giving people a hug!

## All Argument Types

```js
const { ArgumentType } = require("gcommands");
ArgumentType.NUMBER; // 10
ArgumentType.MENTIONABLE; // 9
ArgumentType.ROLE; // 8
ArgumentType.CHANNEL; // 7
ArgumentType.USER; // 6
ArgumentType.BOOLEAN; // 5
ArgumentType.INTEGER; // 4
ArgumentType.STRING; // 3
ArgumentType.SUB_COMMAND_GROUP; // 2 | only for slash commands
ArgumentType.SUB_COMMAND; // 1 | only for slash commands
```

## Basic Arguments

Basic arguments (string, int, number, boolean, member, etc.) are used for more simpler commands.
Here's an example with a `hug @user` command:

```js
const { Command, ArgumentType } = require("gcommands");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "hug",
      description: "Hugs someone!",
      slash: "both",
      cooldown: "2s",
      args: [
        {
          name: "user",
          type: ArgumentType.USER,
          description: "The user to hug!",
          prompt: "Who do you want to hug?",
          required: true,
        },
      ],
    });
  }

  run({ author, client, respond }, args) {
    // Fetch the mentioned user
    let user = args[0]
      ? args[0].match(/[0-9]+/g)
        ? client.users.cache.get(args[0].match(/[0-9]+/g)[1]) || author
        : author
      : author;

    // If the user didn't mention anyone/mentioned themselves
    if (user.id === author.id)
      return respond({ content: `**${user.tag}** needs a hug!` });

    // If everything works
    respond({ content: `**${author.tag}** hugs **${user.tag}**, aww!` });
  }
};
```

<div is="dis-messages">
    <dis-messages>
        <dis-message profile="gcommands">
            <template #interactions>
                <discord-interaction profile="hyro" :command="true">hug</discord-interaction>
            </template>
            <b>Hyro#8938</b> needs a hug!
        </dis-message>
        <dis-message profile="gcommands">
            <template #interactions>
                <discord-interaction profile="hyro" :command="true">hug <mention profile="izboxo">iZboxo</mention></discord-interaction>
            </template>
            <b>Hyro#8938</b> hugs <b>iZboxo#2828</b>, aww!
        </dis-message>
    </dis-messages>
    <dis-messages>
        <dis-message profile="izboxo">
            .hug
        </dis-message>
        <dis-message profile="gcommands">
            Who do you want to hug?
        </dis-message>
        <dis-message profile="izboxo">
            <mention profile="hyro">Hyro</mention>
        </dis-message>
        <dis-message profile="gcommands">
            <b>iZboxo#2828</b> hugs <b>Hyro#8938</b>, aww!
        </dis-message>
    </dis-messages>
</div>

or, an example with a `ping` command:

```js
const { Command } = require("gcommands");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "ping",
      description: "Checks the bot's latency",
      slash: "both",
      cooldown: "2s",
    });
  }

  run({ client, respond, interaction, message }, args) {
    let ping =
      Date.now() - (interaction ? interaction.createdAt : message.createdAt);
    respond({
      content: `**My Ping:** **\`${ping}ms\`**\n**WS Ping:** **\`${client.ws.ping}ms\`**`,
      ephemeral: true,
    });
  }
};
```

<div is="dis-messages">
    <dis-messages :ephemeral="true">
        <dis-message profile="gcommands" :ephemeral="true">
            <template #interactions>
                <discord-interaction profile="hyro" :command="true" :ephemeral="true">ping</discord-interaction>
            </template>
            <b>My Ping:</b> <b><code>100ms</code></b><br/>
            <b>WS Ping:</b> <b><code>15ms</code></b>
        </dis-message>
    </dis-messages>
    <dis-messages>
        <dis-message profile="izboxo">
            .ping
        </dis-message>
        <dis-message profile="gcommands">
            <b>My Ping:</b> <b><code>84ms</code></b><br/>
            <b>WS Ping:</b> <b><code>20ms</code></b>
        </dis-message>
    </dis-messages>
</div>

## Advanced Arguments

Advanced arguments (sub command, string.choices, sub command group, etc.) are used for more advanced commands.
Here's an example with a `bake {muffin/cookie} {amount}` command:

```js
const { ArgumentType, Command } = require("gcommands");
const wait = require("util").promisify(setTimeout);

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "bake",
      description: "Bakes a product!",
      slash: "both",
      cooldown: "2s,
      args: [
        {
          name: "product",
          type: ArgumentType.STRING,
          description: "The product to bake!",
          prompt: `What would you like to bake? (muffin/cookie)`,
          choices: [
            {
              name: "Chocolate Chip Cookie",
              value: "cookie",
            },
            {
              name: "Chocolate Muffin",
              value: "muffin",
            },
          ],
          required: true,
        },
        {
          name: "amount",
          type: ArgumentType.INTEGER, // Integer only allows full numbers
          description:
            "The amount of products to bake! You can only bake a maximum of 25 products at once",
          prompt:
            "How many products would you like to bake? You can only bake a maximum of 25 products at once",
          required: true,
        },
      ],
    });
  }

  async run({ member, respond, edit }, args) {
    // Cap the amount
    args[1] =
      parseInt(args[1]) > 25
        ? 25
        : parseInt(args[1]) < 0
        ? 0
        : parseInt(args[1]);

    // Format the user's choices
    let product = `${args[1]} Delicious ${args[0][0].toUpperCase() +
      args[0].slice(1).toLowerCase()}${args[1] === 1 ? "" : "s"}`;

    // Send the response
    let m = await respond({
      content: `You decide to bake ${product}. You put it in the oven and wait...`,
    });
    // Wait for the product to "cook"
    await wait(Math.floor(Math.random() * (5000 - 3000)) + 3000);

    // Decide if the product is burnt (50% chance)
    let isBurnt = Math.random() < 0.5;

    // Add a response
    if (isBurnt)
      m.content += `\n\nOh no! Your ${product} ${
        args[1] === 1 ? "was" : "were"
      } left in the oven for too long and burnt! Try again.`;
    else
      m.content += `\n\nYou successfully baked your ${product} and gave ${
        args[1] === 1 ? "it" : "them"
      } to your friends. They like it!`;

    // Edit the message
    await edit({ content: m.content });
  }
};
```

<div is="dis-messages">
    <dis-messages>
        <dis-message profile="gcommands" edited=true>
            <template #interactions>
                <discord-interaction profile="izboxo" :command="true">bake Chocolate Chip Cookie 15</discord-interaction>
            </template>
            You decide to bake 15 Delicious Cookies. You put it in the oven and wait...<br/>
            <br/>Oh no! Your 15 Delicious Cookies were left in the oven for too long and burnt! Try again.
        </dis-message>
        <dis-message profile="gcommands" edited=true>
            <template #interactions>
                <discord-interaction profile="izboxo" :command="true">bake Chocolate Muffin 1</discord-interaction>
            </template>
            You decide to bake 1 Delicious Cookie. You put it in the oven and wait...<br/>
            <br/>You successfully baked your 1 Delicious Cookie and give it to your friends. They loved it! 
        </dis-message>
    </dis-messages>
    <dis-messages>
        <dis-message profile="hyro">
            .bake cookie 30
        </dis-message>
        <dis-message profile="gcommands" edited=true>
            You decide to bake 25 Delicious Cookies. You put them in the oven and wait...<br/>
            <br/>Oh no! Your 25 Delicious Cookies were left in the oven for too long and burnt! Try again.
        </dis-message>
        <dis-message profile="hyro">
            .bake muffin 1
        </dis-message>
        <dis-message profile="gcommands" edited=true>
            You decide to bake 1 Delicious Muffin. You put them in the oven and wait...<br/>
            <br/>You successfully baked your 1 Delicious Muffin and gave it to your friends. They loved it! 
        </dis-message>
    </dis-messages>
</div>

::: tip
If you want to know how to use `SUB_COMMAND` and `SUB_COMMAND_GROUP` argument types, go [here](https://discord.com/developers/docs/interactions/slash-commands#example-walkthrough)
:::
