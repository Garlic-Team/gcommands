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

<div is="discord-messages">
    <discord-messages>
        <dis-message profile="gcommands">
            <mention profile="hyro">Hyro</mention> <mention>everyone</mention> <mention type="role">Dev</mention> <b>with mentions</b>
        </dis-message>
        <dis-message profile="gcommands">
            @Hyro @everyone @Dev <b>without mentions</b>
        </dis-message>
    </discord-messages>
</div>
