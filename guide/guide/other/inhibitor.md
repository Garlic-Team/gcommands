# Inhibitor

Inhibitors always run before the command itself.  
Here is a blacklist example:

```js
let blacklist = (await client.database.get("blacklist")) || [];

client.dispatcher.addInhibitor((client, { respond, message, interaction, author }) => {
  if ((message) && blacklist.includes(author.id)) {
    respond({
      content: "You are blacklisted from using this bot!",
      ephemeral: true,
    });
    return false;
  } else if (
    interaction &&
    interaction.isMessageComponent() &&
    blacklist.includes(author.id)
  ) {
    interaction.reply.send({
      content: "You are blacklisted from interacting with this bot!",
      ephemeral: true,
    });
    return false;
  }

  return true;
});
```

<div is="dis-messages">
  <dis-messages :ephemeral="true">
    <dis-message profile="gcommands">
      <template #interactions>
        <discord-interaction profile="hyro" :command="true" :ephemeral="true">ping</discord-interaction>
      </template>
      You are blacklisted from using this bot!
    </dis-message>
  </dis-messages>
  <dis-messages>
    <dis-message profile="gcommands">
      Press for free bobux!!!!!!!
      <template #actions>
        <discord-buttons>
          <discord-button type="success">BOBUX!</discord-button>
        </discord-buttons>
      </template>
    </dis-message>
  </dis-messages>
  <dis-messages :ephemeral="true">
    <dis-message profile="gcommands">
      <template #interactions>
        <discord-interaction profile="hyro" :ephemeral="true">Press for free bobux!!!!!!!</discord-interaction>
      </template>
      You are blacklisted from interacting with this bot!
    </dis-message>
  </dis-messages>
  <dis-messages>
    <dis-message profile="gcommands">
      <template #interactions>
        <discord-interaction profile="izboxo">Press for free bobux!!!!!!!</discord-interaction>
      </template>
      Virus activated.
    </dis-message>
  </dis-messages>
</div>

```js
let blacklist = (await client.database.get("blacklist")) || [];

client.dispatcher.addInhibitor((client, { respond, interaction, message, author }) => {
  if (
    interaction &&
    interaction.isMessageComponent() &&
    blacklist.includes(author.id)
  ) {
    respond({
      content: `You are blacklisted from ${
        interaction.isButton() ? "pressing buttons" : "filling select menus"
      } from this bot!`,
      ephemeral: true,
    });
    return false;
  }

  return true;
});
```

<div is="dis-messages">
  <dis-messages :ephemeral="true">
    <dis-message profile="gcommands">
      <template #interactions>
        <discord-interaction profile="gcommands" :ephemeral="true">Fill out this menu!</discord-interaction>
      </template>
      You are blacklisted from filling select menus from this bot!
    </dis-message>
    <dis-message profile="gcommands">
      <template #interactions>
        <discord-interaction profile="gcommands" :ephemeral="true">Press this button!</discord-interaction>
      </template>
      You are blacklisted from filling pressing buttons from this bot!
    </dis-message>
  </dis-messages>
</div>
