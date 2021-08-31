# Creating your first command

Let's say you want a command that simply sends "hello"!

## Giving your command a name

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

## Responding to the command

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
    respond(`Hello ${author}!`);
  }
}
```
