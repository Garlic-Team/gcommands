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

```js {7}
respond({
    content: "hello",
    allowedMentions = { parse: ["users","roles","everyone"] };
})

<channel>.send({
    content: "hello",
    allowedMentions = { parse: ["users","roles","everyone"] };
})
```