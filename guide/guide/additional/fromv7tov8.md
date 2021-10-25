# Updating from v7 to v8

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
