# Updating from v7 to v8
For starters, discord.js v12 support has been removed

## GCommandsOptions

### loader
The command loading options for GCommands. [Docs](https://gcommands.js.org/docs/#/docs/main/dev/typedef/GCommandsOptionsLoader) 📙

#### cmdDir & eventDir
cmdDir & eventDir have been moved to a place in loader.

```javascript
new GCommandsClient({
  loader: {
    cmdDir: ...,
    eventDir: ...,
  }
})
```

### commands
The command related options for GCommands. [Docs](https://gcommands.js.org/docs/#/docs/main/dev/typedef/GCommandsOptionsCommands) 📙

#### caseSensitivePrefixes & caseSensitiveCommands
caseSensitivePrefixes & caseSensitiveCommands have been moved to a place in commands.

```javascript
new GCommandsClient({
  commands: {
    caseSensitivePrefixes: ...,
    caseSensitiveCommands: ...,
  }
})
```

### allowDm
Support for DMs has been added.

```javascript
new GCommandsClient({
  commands: {
    allowDm: true,
  }
})
```

### arguments
[Docs](https://gcommands.js.org/docs/#/docs/main/dev/typedef/GCommandsOptionsArguments) 📙

#### deleteInput & deletePrompt
Added support for deleting prompts and input

<hr>

## Command
[Docs](https://gcommands.js.org/docs/#/docs/main/dev/class/Command?scrollTo=run) 📙

### args
Arguments are no longer arrays, they are now [CommandInteractionOptionResolver](https://discord.js.org/#/docs/main/stable/class/CommandInteractionOptionResolver) <img src="https://i.imgur.com/3hzpeBf.png" height="15" width="15"> instead.

### arrayArgs
Since [arguments are no longer arrays](#args), you can now use `arrayArgs` to get them with an **array**.

### objectArgs
Since [arguments are no longer arrays](#args), you can now use `objectArgs` to get them with an **object**.

### respond & edit & followUp
MessageOptions (also for Interactions) are now [GPayloadOptions](https://gcommands.js.org/docs/#/docs/main/dev/typedef/GPayloadOptions) 📙 in GCommands. You can use `respond()` like in [discord.js v12](https://discord.js.org/#/docs/main/v12/class/TextChannel?scrollTo=send) <img src="https://i.imgur.com/3hzpeBf.png" height="15" width="15"> (similar to the second and third example).

<hr>

## GComponents
A new component handler for GCommands: GComponents!

```javascript
new GCommandsClient({
  loader: {
    componentDir: ...
  }
})
```

[GComponents docs](https://garlic-team.github.io/GComponents) 📘
