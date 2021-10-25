# Updating from v7 to v8
For starters, discord.js v12 support has been removed

## GCommandsOptions

### loader

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

#### deleteInput & deletePrompt
Added support for deleting prompts and input

## Command

### args
Args are no longer arrays, but they are https://discord.js.org/#/docs/main/stable/class/CommandInteractionOptionResolver
