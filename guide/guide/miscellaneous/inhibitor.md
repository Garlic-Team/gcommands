# Inhibitor

For example, if you want to check if a person is on the blacklist, you must use addInhibitor.<br>
You need put code to ready event!

```js
client.dispatcher.addInhibitor((interaction, {message, member, guild, channel, respond, edit}) => {
    if(interaction.isCommand()) {
        if(member.id == "126454") {
            respond("blacklisted")
            return false;
        }
    }

    if(interaction.isButton() || interaction.isMenu()) {
        if(member.id == "126454") {
            interaction.reply.send({content:"blacklisted", ephemeral: true})
            return false;
        }
    }
})
```

<div is="discord-messages">
    <dis-messages :ephemeral="true">
        <dis-message profile="gcommands">
            <template #interactions>
                <discord-interaction profile="hyro" 
                :command="true"
                :ephemeral="true"
                >meme</discord-interaction>
            </template>
            blacklited
        </dis-message>
    </dis-messages>
</div>
