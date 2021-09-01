# Creating your first command

## Creating a new command
Let's start by creating a new file in your commands directory and initializing a new class extending from the `Command` class.

```js
const { Command } = require('gcommands');

module.exports = class extends Command {}

// or
const { Command } = require('gcommands');

class Hello extends Command {}

module.exports = Hello;
```

This creates a new class extending from the `Command` class, and exports it for use.

Next we need to set the `name` and `description` of the command, we can do this by using the `constructor()` and `super()`.
You can also create new `CommandOptions` by using the `CommandOptionsBuilder`, explained [here]().

```javascript
const { Command } = require('gcommands');

module.exports = class extends Command {
  constructor(client) {
    super(client, {
      name: 'hello', // Set the name of the command
      description: 'Hello!', // Set the description of the command
    });
  }
}
```

Now we need to actualy respond to the user. We can do this by creating the `run()` function in our command.

```javascript
const { Command } = require('gcommands');

module.exports = class extends Command {
  constructor(client) {
    super(client, {
      name: 'hello',
      description: 'Hello!',
    });
  }
  run({ respond, author }) {
    respond(`Hello ${author.tag}!`); // Send a response
  }
}
```

<div is="dis-messages">
    <dis-messages>
        <dis-message profile="gcommands">
            <template #interactions>
                <discord-interaction profile="hyro" :command="true">hello</discord-interaction>
            </template>
            Hello <b>Hyro#8938</b>!
        </dis-message>
    </dis-messages>
    <dis-messages>
        <dis-message profile="izboxo">
            .hello
        </dis-message>
        <dis-message profile="gcommands">
            Hello <b>iZboxo#2828</b>!
        </dis-message>
    </dis-messages>
</div>
