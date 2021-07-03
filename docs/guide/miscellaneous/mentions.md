# Mentions
Switching off/on mentions.<br>
We will work with the `allowedMentions` parameter.

You can put in the object parse:
 - users
 - roles
 - everyone

For example, if we put only roles in the parse object, the bot will only be able to ping roles.

```js
allowedMentions: {parse: [], repliedUser: true}
```

## InlineReply
The `repliedUser` parameter determines whether the bot should ping the person to whom it responds.

```js {2}
message.inlineReply("hi", {
    allowedMentions: {parse: ["users","roles","everyone"], repliedUser: true}
})
```

## Buttons
For buttons, we specify only the `allowedMentions` parameter.

<branch version="2.x">

```js {5}
message.buttons("Buttons POG", {
    buttons: [
        // ...
    ],
    allowedMentions = { parse: ["users","roles","everyone"] };
})
```

</branch>
<branch version="3.x">

```js {5}
message.buttons("Buttons POG", {
    buttons: [
        // ...
    ],
    allowedMentions = { parse: ["users","roles","everyone"] };
})
```

</branch>
<branch version="4.x">

```js {7}
const { MessageButton } = require("gcommands")
const button = new MessageButton().setStyle("gray").setLabel("test").setID("custom_id").toJSON()
const buttonRow = new MessageActionRow().addComponent(button)

respond({
  content: "hi with buttons",
  components: [buttonRow],
  allowedMentions = { parse: ["users","roles","everyone"] };
})
```

</branch>

## Slash
With the slash command, mentions are automatically turned off when you use return. If you want to turn mentions on you must use:

The `repliedUser` parameter determines whether the bot should ping the person to whom it responds.

<branch version="2.x">

```js
return {
    content: "hi",
    allowedMentions: { parse: ["users","roles","everyone"], repliedUser: true }
}
```

If you don't want any mentions, just use:
```js
return "hi"
```

</branch>
<branch version="3.x">

```js
return {
    content: "hi",
    allowedMentions: { parse: ["users","roles","everyone"], repliedUser: true }
}
```

If you don't want any mentions, just use:
```js
return "hi"
```

</branch>
<branch version="4.x">

```js
respond({
    content: "hi",
    allowedMentions: { parse: ["users","roles","everyone"], repliedUser: true }
})
```

If you don't want any mentions, just use:
```js
respond("hi")
```

</branch>