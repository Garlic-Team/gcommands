# Mentions

Toggling certain mentions on/off.  
You can parse specific mention types in `allowedMentions.parse`

Here's the list:

- users
- roles
- everyone

You can also whitelist specific User/Role ID's.

Example:

```js
respond({
  content: `Pong, <@491999008106217473>!`,
  allowedMentions: { parse: [], users: ["491999008106217473"] },
});
channel.send({
  content: `Pong, <@491999008106217473>!`,
  allowedMentions: { parse: [] },
});
channel.send({
  content: `Pong, <@491999008106217473>!`,
  allowedMentions: { parse: ["users"] },
});
```

<div is="dis-messages">
    <dis-messages>
        <dis-message profile="gcommands">
            Pong, <mention profile="hyro" :highlight="true">Hyro</mention>!</b>
        </dis-message>
        <dis-message profile="gcommands">
            Pong, <mention profile="hyro">Hyro</mention>!</b>
        </dis-message>
        <dis-message profile="gcommands">
            Pong, <mention profile="hyro" :highlight="true">Hyro</mention>!</b>
        </dis-message>
    </dis-messages>
</div>
