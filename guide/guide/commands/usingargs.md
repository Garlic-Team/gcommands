# Using arguments in commands

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
ArgumentType.SUB_COMMAND_GROUP; // 2
ArgumentType.SUB_COMMAND; // 1
```

Learn more about SUB_COMMAND and SUB_COMMAND_GROUP [here](./usingsub.md).

## Basic arguments

### Create a new command with arguments

This is the template command we are going to use.

```javascript
const { Command, ArgumentType } = require("gcommands");

module.exports = class extends Command {
  constructor(client) {
    super(client, {
      name: "hug",
      description: "Hugs someone!",
    });
  }
}
```

Next we need to add the arguments to the command. We can do this by adding the `args` option to the command.

```javascript
args: [
  {
    name: "user", // Set the name of the argument
    type: ArgumentType.USER, // Set the type of the argument
    description: "The user to hug!", // Set the description of the argument
    prompt: "Who do you want to hug?", // Set the prompt for the argument (not required)
    required: true, // Set if the argument is required or not
  },
],
```

This creates a command with the argument "user".

### Using the arguments

Now we need to create the `run()` function.

```javascript
run({ author, client, respond, objectArgs }) {
  // Fetch the mentioned user
  let user = objectArgs.user
    ? objectArgs.user.match(/[0-9]+/g)
      ? client.users.cache.get(objectArgs.user.match(/[0-9]+/g)[0]) || author
      : author
    : author;

  // If the user didn't mention anyone/mentioned themselves
  if (user.id === author.id)
    return respond({ content: `**${user.tag}** needs a hug!` });

  // If everything works
  respond({ content: `**${author.tag}** hugs **${user.tag}**, aww!` });
  }
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

### Resulting code

```javascript

const { Command, ArgumentType } = require("gcommands");

module.exports = class extends Command {
  constructor(client) {
    super(client, {
      name: "hug",
      description: "Hugs someone!",
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

  run({ author, client, respond, args }) {
    let user = objectArgs.user
      ? objectArgs.user.match(/[0-9]+/g)
        ? client.users.cache.get(objectArgs.user.match(/[0-9]+/g)[0]) || author
        : author
      : author;

    if (user.id === author.id)
      return respond({ content: `**${user.tag}** needs a hug!` });

    respond({ content: `**${author.tag}** hugs **${user.tag}**, aww!` });
  }
};
```

## Advanced arguments

### Creating a new command with arguments

This time, we have some advanced stuff.

```javascript
const { ArgumentType, Command } = require("gcommands");
const wait = require("util").promisify(setTimeout);

module.exports = class extends Command {
  constructor(client) {
    super(client, {
      name: "bake",
      description: "Bakes a product!",
      cooldown: "2s",
      args: [
        {
          name: "product",
          type: ArgumentType.STRING,
          description: "The product to bake!",
          prompt: `What would you like to bake? (muffin/cookie)`,
          choices: [
            {
              name: "Chocolate Chip Cookie", // Set the name for the choice
              value: "cookie", // Set the value of the choice
            },
            {
              name: "Chocolate Muffin", // Set the name for the choice
              value: "muffin", // Set the value of the choice
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
}
```
This creates a new command with the "product" and "amount" argument. The "product" argument has 2 values to pick from: "Chocolate Chip Cookie" and "Chocolate Muffin".

### Using the arguments

The `args` can be accesed in the `CommandRunOptions`.

```javascript
async run({ member, respond, edit, objectArgs }) {
  // Cap the amount
  objectArgs.amount =
    parseInt(objectArgs.amount) > 25
      ? 25
      : parseInt(objectArgs.amount) < 0
      ? 0
      : parseInt(objectArgs.amount);

  // Format the user's choices
  let product = `${objectArgs.amount} Delicious ${objectArgs.product.toUpperCase() +
    objectArgs.product.slice(1).toLowerCase()}${objectArgs.amount === 1 ? "" : "s"}`;

  // Send the response
  let m = await respond({
    content: `You decide to bake ${product}. You put it in the oven and wait.`,
  });
  // Wait for the product to "cook"
  await wait(Math.floor(Math.random() * (5000 - 3000)) + 3000);

  // Decide if the product is burnt (50% chance)
  let isBurnt = Math.random() < 0.5;

  // Add a response
  if (isBurnt)
    m.content += `\n\nOh no! Your ${product} ${
      objectArgs.amount === 1 ? "was" : "were"
    } left in the oven for too long and burnt! Try again.`;
  else
    m.content += `\n\nYou successfully baked your ${product} and gave ${
      objectArgs.amount === 1 ? "it" : "them"
    } to your friends. They like it!`;

  // Edit the message
  await edit({ content: m.content });
}
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

### Resulting code

```javascript

const { ArgumentType, Command } = require("gcommands");
const wait = require("util").promisify(setTimeout);

module.exports = class extends Command {
  constructor(client) {
    super(client, {
      name: "bake",
      description: "Bakes a product!",
      cooldown: "2s",
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
          type: ArgumentType.INTEGER,
          description: "The amount of products to bake! You can only bake a maximum of 25 products at once",
          prompt: "How many products would you like to bake? You can only bake maximum of 25 products at once",
          required: true,
        },
      ],
    });
  }
  async run({ member, respond, edit, objectArgs }) {
    objectArgs.amount =
      parseInt(objectArgs.amount) > 25
        ? 25
        : parseInt(objectArgs.amount) < 0
        ? 0
        : parseInt(objectArgs.amount);

    let product = `${objectArgs.amount} Delicious ${objectArgs.product.toUpperCase() +
      objectArgs.product.slice(1).toLowerCase()}${objectArgs.amount === 1 ? "" : "s"}`;

    let m = await respond({
      content: `You decide to bake ${product}. You put it in the oven and wait.`,
    });
    await wait(Math.floor(Math.random() * (5000 - 3000)) + 3000);

    let isBurnt = Math.random() < 0.5;

    if (isBurnt)
      m.content += `\n\nOh no! Your ${product} ${
        objectArgs.amount === 1 ? "was" : "were"
      } left in the oven for too long and burnt! Try again.`;
    else
      m.content += `\n\nYou successfully baked your ${product} and gave ${
        objectArgs.amount === 1 ? "it" : "them"
      } to your friends. They like it!`;

    await edit({ content: m.content });
  }
}
```

