# More Events
If, for example, you do not want to find out from the guildMemberUpdate event that who has changed what, we have a very simple solution. We've added more events to make your job easier.

## GuildMember

### GuildMemberNicknameUpdate
This event will show you the user's old nickname and the new one.

```js
client.on("guildMemberNicknameUpdate", (newMember, oldNick, newNick) => {
    console.log(oldNick, newNick)
})
```

### GuildMemberBoost
This event will show you who boosted your server.

```js
client.on("guildMemberBoost", (newMember, oldPremiumSince, newPremiumSince) => {
    console.log(oldPremiumSince, newPremiumSince)
})
```

### GuildMemberUnBoost
This event will show you who unboosted your server.

```js
client.on("guildMemberUnboost", (newMember, oldPremiumSince, newPremiumSince) => {
    console.log(oldPremiumSince, newPremiumSince)
})
```

### GuildMemberAcceptShipScreening
Shows who accepted the member ship screening.

```js
client.on("guildMemberAcceptShipScreening", (member) => {
    console.log(member)
})
```

## User

### UserAvatarUpdate
Shows a new avatar.

```js
client.on("userAvatarUpdate", (newUser, oldAvatar, newAvatar) => {})
```

### UserUsernameUpdate
Shows the new username.

```js
client.on("userUsernameUpdate", (newUser, oldUsername, newUsername) => {})
```

### UserDiscriminatorUpdate
Shows the new discriminator.

```js
client.on("userDiscriminatorUpdate", (newUser, oldDiscrim, newDiscim) => {})
```

### UserFlagsUpdate
Shows the new flags.

```js
client.on("userFlagsUpdate", (newUser, oldFlags, newFlags) => {})
```

## Role

### RolePostionUpdate
Shows the new position.

```js
client.on("rolePositionUpdate", (newRole, oldPosition, newPosition) => {})
```

### RolePermissionsUpdate
Shows the new permissions.

```js
client.on("rolePermissionsUpdate", (newRole, oldPermission, newPermission) => {})
```

## Guild

### GuildBoostLevelUp
It will show the new premiumTier.

```js
client.on("guildBoostLevelUp", (newGuild, oldPremiumTier, newPremiumTier) => {
    console.log(oldPremiumTier, newPremiumTier)
})
```

### GuildBoostLevelDown
It will show the new premiumTier.

```js
client.on("guildBoostLevelDown", (newGuild, oldPremiumTier, newPremiumTier) => {
    console.log(oldPremiumTier, newPremiumTier)
})
```

### GuildRegionUpdate
It will show a new region.

```js
client.on("guildRegionUpdate", (newGuild, oldRegion, newRegion) => {
    console.log(oldRegion, newRegion)
})
```

### GuildBannerUpdate
It will show a new banner.

```js
client.on("guildBannerUpdate", (newGuild, oldBanner, newBanner) => {
    console.log(oldBanner, newBanner)
})
```

### GuildAfkChannelUpdate
It will show a new afk channel.

```js
client.on("guildAfkChannelUpdate", (newGuild, oldAfkChannel, newAfkChannel) => {})
```

### GuildVanityURLUpdate
It will show a new vanity url.

```js
client.on("guildVanityURLUpdate", (newGuild, oldVanity, newVanity) => {})
```

### GuildFeaturesUpdate
It will show a new features.

```js
client.on("guildFeaturesUpdate", (newGuild, oldFeatures, newFeatures) => {})
```

### GuildAcronymUpdate
It will show a new acronym.

```js
client.on("guildAcronymUpdate", (newGuild, oldAcronym, newArconym) => {})
```

### GuildOwnerUpdate
It will show a new server owner.

```js
client.on("guildOwnerUpdate", (newGuild, oldOwner, newOwner) => {})
```

### GuildMaximumMembersUpdate
It will show a new maximumMembers.

```js
client.on("guildMaximumMembersUpdate", (newGuild, oldMaxMembers, newMaxMembers) => {})
```

### GuildPartnerUpdate
Indicates whether the server is a partner or not.

```js
client.on("guildPartnerUpdate", (newGuild, oldPartner, newPartner) => {})
```

### GuildVerifyUpdate
Indicates whether the server is a verified or not.

```js
client.on("guildVerifyUpdate", (newGuild, oldVerified, newVerified) => {})
```

## Voice Channel

### VoiceChannelJoin
Detects if someone has joined the voice.

```js
client.on("voiceChannelJoin", (newChannel, newState) => {})
```

### VoiceChannelLeave
Detects if someone has disconnected from the voice.

```js
client.on("voiceChannelLeave", (newChannel, newState) => {})
```

### VoiceChannelSwitch
Detects if someone has moved to another room.

```js
client.on("voiceChannelSwitch", (channel, oldChannel, newChannel) => {})
```

### VoiceChannelMute
Detects if someone is a muted.

```js
client.on("voiceChannelMute", (newChannel, muteType) => {})
```

### VoiceChannelUnmute
Detects if someone is a unmuted.

```js
client.on("voiceChannelUnmute", (newChannel, muteType) => {})
```

### VoiceChannelDeaf
Detects if someone is a deafened.

```js
client.on("voiceChannelDeaf", (newChannel, deafType) => {})
```

### VoiceChannelUndeaf
Detects if someone is a undeafened.

```js
client.on("voiceChannelUndeaf", (newChannel, deafType) => {})
```

### VoiceStreamingStart
Detects if someone has turned on the stream.

```js
client.on("voiceStreamingStart", (newChannel, channel) => {})
```

### VoiceStreamingStop
Detects if someone has turned off the stream.

```js
client.on("voiceStreamingStop", (newChannel, channel) => {})
```

## GCommands

### Debug
GCommands Debug

```js
GCommandsClient.on("debug", (debug) => console.log(debug))
```

GCommands log (cmd load etc)

```js
GCommandsClient.on("log", (log) => console.log(log))
```

### CommandPrefixChange
When user change command prefix

```js
client.on("commandPrefixChange", (guild, prefix) => {})
```

### GuildLanguageChange
When user change language

```js
client.on("guildLanguageChange", (guild, language) => {})
```

### ClickButton
When user click to button

```js
client.on("clickButton", (button) => {})
```

### SelectMenu
When user select option in dropdown(select) menu

```js
client.on("selectMenu", (button) => {})
```

### ClickButton
When user click to button

```js
client.on("clickButton", (button) => {})
```

### interaction
selectMenu + clickButton events with 
```js
interaction.isSelectMenu()
interaction.isButton()
```

only in djs v12!

```js
client.on("interaction", (interaction) => {})
```