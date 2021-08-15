# More Events

GCommands has added some events to help you with coding.  
Here's all of them:

## Channel

```js
client.on(
  "guilChannelPermissionsUpdate",
  (newChannel, oldPermissions, newPermissions) => {
    console.log(oldPermissions, newPermissions);
  }
);
client.on("guildChannelTopicUpdate", (newChannel, oldTopic, newTopic) => {
  console.log(oldTopic, newTopic);
});
client.on("guildChannelNSFWUpdate", (newChannel, oldNsfw, newNsfw) => {
  console.log(oldNsfw, newNsfw);
});
client.on("guildChannelTypeUpdate", (newChannel, oldType, newType) => {
  console.log(oldType, newType);
});
client.on(
  "guildChannelUserLimitUpdate",
  (newChannel, oldUserLimit, newUserLimit) => {
    console.log(oldUserLimit, newUserLimit);
  }
);
client.on("guildChannelBitrateUpdate", (newChannel, oldBitrate, newBitrate) => {
  console.log(oldBitrate, newBitrate);
});
```

## GuildMember

```js
client.on("guildMemberBoost", (newMember, oldPremiumSince, newPremiumSince) => {
  console.log(oldPremiumSince, newPremiumSince);
});
client.on(
  "guildMemberUnboost",
  (newMember, oldPremiumSince, newPremiumSince) => {
    console.log(oldPremiumSince, newPremiumSince);
  }
);
client.on(
  "guildMemberNicknameUpdate",
  (newMember, oldNickname, newNickname) => {
    console.log(oldNickname, newNickname);
  }
);
client.on("guildMemberAcceptShipScreening", (member) => {
  console.log(member);
});
```

## Guild

```js
client.on("guildBoostLevelUp", (guild, oldPremiumTier, newPremiumTier) => {
  console.log(oldPremiumTier, newPremiumTier);
});
client.on("guildBoostLevelDown", (guild, oldPremiumTier, newPremiumTier) => {
  console.log(oldPremiumTier, newPremiumTier);
});
client.on("guildRegionUpdate", (guild, oldRegion, newRegion) => {
  console.log(oldRegion, newRegion);
});
client.on("guildBannerUpdate", (guild, oldBanner, newBanner) => {
  console.log(oldBanner, newBanner);
});
client.on("guildAfkChannelUpdate", (guild, oldAfkChannel, newAfkChannel) => {
  console.log(oldAfkChannel, newAfkChannel);
});
client.on("guildVanityURLUpdate", (guild, oldVanityCode, newVanityCode) => {
  console.log(oldVanityCode, newVanityCode);
});
client.on("guildFeaturesUpdate", (guild, oldFeatures, newFeatures) => {
  console.log(oldFeatures, newFeatures);
});
client.on("guildAcronymUpdate", (guild, oldNameAcronym, newNameAcronym) => {
  console.log(oldNameAcronym, newNameAcronym);
});
client.on("guildOwnerUpdate", (guild, oldOwnerID, newOwnerID) => {
  console.log(oldOwnerID, newOwnerID);
});
client.on(
  "guildMaximumMembersUpdate",
  (guild, oldMaximumMembers, newMaximumMembers) => {
    console.log(oldMaximumMembers, newMaximumMembers);
  }
);
client.on("guildPartnerUpdate", (guild, oldPartnered, newPartnered) => {
  console.log(oldPartnered, newPartnered);
});
client.on("guildVerifyUpdate", (guild, oldVerified, newVerified) => {
  console.log(oldVerified, newVerified);
});
client.on("commandPrefixChange", (guild, prefix) => {
  console.log(prefix);
});
client.on("guildLanguageChange", (guild, language) => {
  console.log(language);
});
```

## Role

```js
client.on("rolePositionUpdate", (guild, oldRawPosition, newRawPosition) => {
  console.log(oldRawPosition, newRawPosition);
});
client.on("rolePermissionsUpdate", (guild, oldBitfield, newBitfield) => {
  console.log(oldBitfield, newBitfield);
});
```

## User

```js
client.on("userAvatarUpdate", (user, oldAvatar, newAvatar) => {
  console.log(oldAvatar, newAvatar);
});
client.on("userUsernameUpdate", (user, oldUsername, newUsername) => {
  console.log(oldUsername, newUsername);
});
client.on(
  "userDiscriminatorUpdate",
  (user, oldDiscriminator, newDiscriminator) => {
    console.log(oldDiscriminator, newDiscriminator);
  }
);
client.on("userFlagsUpdate", (user, oldFlags, newFlags) => {
  console.log(oldFlags, newFlags);
});
```

## Voice

```js
client.on("voiceChannelJoin", (member, voiceChannel) => {
  console.log(voiceChannel);
});
client.on("voiceChannelLeave", (member, voiceChannel) => {
  console.log(voiceChannel);
});
client.on("voiceChannelSwitch", (member, oldVoiceChannel, newVoiceChannel) => {
  console.log(oldVoiceChannel, newVoiceChannel);
});
client.on("voiceChannelMute", (member, muteType) => {
  console.log(muteType); // muteType: self-muted | server-muted
});
client.on("voiceChannelUnmute", (member, muteType) => {
  console.log(muteType); // muteType: self-muted | server-muted
});
client.on("voiceChannelDeafen", (member, muteType) => {
  console.log(muteType); // muteType: self-deafened | server-deafened
});
client.on("voiceChannelUndeafen", (member, muteType) => {
  console.log(muteType); // muteType: self-deafened | server-deafened
});
client.on("voiceStreamingStart", (member, voiceChannel) => {
  console.log(voiceChannel);
});
client.on("voiceStreamingStop", (member, voiceChannel) => {
  console.log(voiceChannel);
});
```

## Interactions

```js
client.on("selectMenu", (menu) => {
  console.log(menu);
});
client.on("clickButton", (button) => {
  console.log(button);
});
```

## Commands
```js
client.on("commandExecute", (command, member) => {
  console.log(command, member);
});
client.on("commandError", (command, member, error) => {
  console.log(command, member, error);
});
```
