# Updating from V6 to V7

## GCommandsOptions

### cmdDir
You now need to give the full path. This can be easily done with `path`.

```javascript
const { join } = require('path'); // You don't have to install this package.

const client = new GCommandsClient({
  ...options,
  cmdDir: join(__dirname, 'commands'),
});
```

### eventDir
You now need to give the full path. This can be easily done with `path`.

```javascript
const { join } = require('path'); // You don't have to install this package.

const client = new GCommandsClient({
  ...options,
  eventDir: join(__dirname, 'events'),
});
```

## Arguments

### SUB_COMMAND and SUB_COMMAND_GROUP
GCommands now supports the SUB_COMMAND and SUB_COMMAND_GROUP type! 

See [here](../commands/usingsub.md) for more information.

### Choices
Choices were fixed for message based commands.
This means that the value of the choice, will be the returned argument.

```javascript
const choices = {
  name: "True", // This will be the option for the user.
  value: true, // This will be the returned argument.
};

// In the command
run({ args }) {
  console.log(args) // [ true ]
}
```

## Commands

### CommandRunOptions
The `args` and `objectArgs` have been moved to the `CommandRunOptions`.

```javascript
run({ args, objectArgs, etc }) {}
```

### Permissions
Slash commands automaticly grey out if the `userRequiredRoles` or `userOnly` requirements are not met.

## Inhibitors
The `args` and `objectArgs` in inhibitors have been moved. You can now acces them like this:

```javascript
client.dispatcher.addInhibitor((interaction, { args, objectArgs, etc }) => {});
```
