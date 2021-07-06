## Classes

<dl>
<dt><a href="#GCommands">GCommands</a></dt>
<dd><p>The main GCommands class</p>
</dd>
<dt><a href="#GCommandsBase">GCommandsBase</a></dt>
<dd><p>The GCommandsBase class</p>
</dd>
<dt><a href="#GCommandsDispatcher">GCommandsDispatcher</a></dt>
<dd><p>The GCommansDispatcher class</p>
</dd>
<dt><a href="#GEvents">GEvents</a></dt>
<dd><p>The GEvents class</p>
</dd>
<dt><a href="#GEventLoader">GEventLoader</a></dt>
<dd><p>The GCommandsEventLoader class</p>
</dd>
<dt><a href="#Color">Color</a></dt>
<dd><p>The Color class</p>
</dd>
<dt><a href="#GCommandsMessage">GCommandsMessage</a> ⇐ <code>Message</code></dt>
<dd><p>The MessageStructure structure</p>
</dd>
<dt><a href="#InteractionEvent">InteractionEvent</a></dt>
<dd><p>The InteractionEvent class</p>
</dd>
<dt><a href="#MessageActionRow">MessageActionRow</a></dt>
<dd><p>The MessageActionRow class</p>
</dd>
<dt><a href="#MessageButton">MessageButton</a></dt>
<dd><p>The MessageButton class</p>
</dd>
<dt><a href="#MessageSelectMenu">MessageSelectMenu</a></dt>
<dd><p>The MessageSelectMenu class</p>
</dd>
<dt><a href="#MessageSelectMenuOption">MessageSelectMenuOption</a></dt>
<dd><p>The MessageSelectMenuOption class</p>
</dd>
</dl>

## Members

<dl>
<dt><a href="#ReturnSystem">ReturnSystem</a></dt>
<dd><p>Return system for slash</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#respond">respond(result)</a> ⇒ <code>Object</code></dt>
<dd><p>Respond</p>
</dd>
<dt><a href="#respond">respond(result)</a> ⇒ <code>Object</code></dt>
<dd><p>Respond</p>
</dd>
<dt><a href="#respond">respond(result)</a> ⇒ <code>Object</code></dt>
<dd><p>Respond</p>
</dd>
</dl>

<a name="GCommands"></a>

## GCommands
The main GCommands class

**Kind**: global class  

* [GCommands](#GCommands)
    * [new GCommands(client, options)](#new_GCommands_new)
    * [.cmdDir](#GCommands+cmdDir)
    * [.eventDir](#GCommands+eventDir)
    * [.unkownCommandMessage](#GCommands+unkownCommandMessage)
    * [.autoTyping](#GCommands+autoTyping)
    * [.shardClusterName](#GCommands+shardClusterName)
    * [.database](#GCommands+database)
    * [.prefix](#GCommands+prefix)
    * [.slash](#GCommands+slash)
    * [.defaultCooldown](#GCommands+defaultCooldown)
    * ["debug"](#GCommands+event_debug)
    * ["log"](#GCommands+event_log)

<a name="new_GCommands_new"></a>

### new GCommands(client, options)
The GCommands class


| Param | Type | Description |
| --- | --- | --- |
| client | <code>Object</code> | Discord.js Client |
| options | <code>Object</code> | Options (cmdDir, eventDir etc) |

<a name="GCommands+cmdDir"></a>

### gCommands.cmdDir
CmdDir

**Kind**: instance property of [<code>GCommands</code>](#GCommands)  
**Properties**

| Name | Type |
| --- | --- |
| cmdDir | <code>String</code> | 

<a name="GCommands+eventDir"></a>

### gCommands.eventDir
EventDir

**Kind**: instance property of [<code>GCommands</code>](#GCommands)  
**Properties**

| Name | Type |
| --- | --- |
| eventDir | <code>String</code> | 

<a name="GCommands+unkownCommandMessage"></a>

### gCommands.unkownCommandMessage
unkownCommandMessage

**Kind**: instance property of [<code>GCommands</code>](#GCommands)  
**Properties**

| Name | Type |
| --- | --- |
| unkownCommandMessage | <code>String</code> | 

<a name="GCommands+autoTyping"></a>

### gCommands.autoTyping
AutoTyping

**Kind**: instance property of [<code>GCommands</code>](#GCommands)  
**Properties**

| Name | Type |
| --- | --- |
| autoTyping | <code>Boolean</code> | 

<a name="GCommands+shardClusterName"></a>

### gCommands.shardClusterName
ShardClusterName

**Kind**: instance property of [<code>GCommands</code>](#GCommands)  
**Properties**

| Name | Type |
| --- | --- |
| shardClusterName | <code>String</code> | 

<a name="GCommands+database"></a>

### gCommands.database
database

**Kind**: instance property of [<code>GCommands</code>](#GCommands)  
**Properties**

| Name | Type |
| --- | --- |
| database | <code>Object</code> | 

<a name="GCommands+prefix"></a>

### gCommands.prefix
Prefix

**Kind**: instance property of [<code>GCommands</code>](#GCommands)  
**Properties**

| Name | Type |
| --- | --- |
| prefix | <code>String</code> | 

<a name="GCommands+slash"></a>

### gCommands.slash
Slash

**Kind**: instance property of [<code>GCommands</code>](#GCommands)  
**Properties**

| Name | Type |
| --- | --- |
| slash | <code>String</code> | 

<a name="GCommands+defaultCooldown"></a>

### gCommands.defaultCooldown
defaultCooldown

**Kind**: instance property of [<code>GCommands</code>](#GCommands)  
**Properties**

| Name | Type |
| --- | --- |
| defaultCooldown | <code>Number</code> | 

<a name="GCommands+event_debug"></a>

### "debug"
Debug Event

**Kind**: event emitted by [<code>GCommands</code>](#GCommands)  
**Example**  
```js
client.on('debug', (info) => { console.log(info); });
```
<a name="GCommands+event_log"></a>

### "log"
Log Event

**Kind**: event emitted by [<code>GCommands</code>](#GCommands)  
**Example**  
```js
client.on('log', (info) => { console.log(info); });
```
<a name="GCommandsBase"></a>

## GCommandsBase
The GCommandsBase class

**Kind**: global class  
<a name="GCommandsDispatcher"></a>

## GCommandsDispatcher
The GCommansDispatcher class

**Kind**: global class  

* [GCommandsDispatcher](#GCommandsDispatcher)
    * [.client](#GCommandsDispatcher+client)
    * [.setGuildPrefix()](#GCommandsDispatcher+setGuildPrefix) ⇒ <code>boolean</code>
    * [.getGuildPrefix()](#GCommandsDispatcher+getGuildPrefix) ⇒ <code>String</code>
    * [.getCooldown()](#GCommandsDispatcher+getCooldown) ⇒ <code>String</code>
    * [.setGuildLanguage(guildId, userId, command)](#GCommandsDispatcher+setGuildLanguage) ⇒ <code>boolean</code>
    * [.getGuildLanguage(guildId, userId, command)](#GCommandsDispatcher+getGuildLanguage) ⇒ <code>boolean</code>
    * [.fetchClientApplication()](#GCommandsDispatcher+fetchClientApplication) ⇒ <code>Array</code>
    * [.addInhibitor(inhibitor)](#GCommandsDispatcher+addInhibitor) ⇒ <code>boolean</code>
    * [.removeInhibitor()](#GCommandsDispatcher+removeInhibitor) ⇒ <code>Set</code>
    * [.createButtonCollector(filter, options)](#GCommandsDispatcher+createButtonCollector) ⇒ <code>Collector</code>
    * [.awaitButtons(filter, options)](#GCommandsDispatcher+awaitButtons) ⇒ <code>Collector</code>
    * [.createSelectMenuCollector(filter, options)](#GCommandsDispatcher+createSelectMenuCollector) ⇒ <code>Collector</code>
    * [.awaitSelectMenus(filter, options)](#GCommandsDispatcher+awaitSelectMenus) ⇒ <code>Collector</code>

<a name="GCommandsDispatcher+client"></a>

### gCommandsDispatcher.client
GCommandsDispatcher options

**Kind**: instance property of [<code>GCommandsDispatcher</code>](#GCommandsDispatcher)  
**Properties**

| Name | Type |
| --- | --- |
| client | <code>Object</code> | 

<a name="GCommandsDispatcher+setGuildPrefix"></a>

### gCommandsDispatcher.setGuildPrefix() ⇒ <code>boolean</code>
Internal method to setGuildPrefix

**Kind**: instance method of [<code>GCommandsDispatcher</code>](#GCommandsDispatcher)  
<a name="GCommandsDispatcher+getGuildPrefix"></a>

### gCommandsDispatcher.getGuildPrefix() ⇒ <code>String</code>
Internal method to getGuildPrefix

**Kind**: instance method of [<code>GCommandsDispatcher</code>](#GCommandsDispatcher)  
<a name="GCommandsDispatcher+getCooldown"></a>

### gCommandsDispatcher.getCooldown() ⇒ <code>String</code>
Internal method to getCooldown

**Kind**: instance method of [<code>GCommandsDispatcher</code>](#GCommandsDispatcher)  
<a name="GCommandsDispatcher+setGuildLanguage"></a>

### gCommandsDispatcher.setGuildLanguage(guildId, userId, command) ⇒ <code>boolean</code>
Internal method to setGuildLanguage

**Kind**: instance method of [<code>GCommandsDispatcher</code>](#GCommandsDispatcher)  

| Param | Type |
| --- | --- |
| guildId | <code>Snowflake</code> | 
| userId | <code>Snowflake</code> | 
| command | <code>Object</code> | 

<a name="GCommandsDispatcher+getGuildLanguage"></a>

### gCommandsDispatcher.getGuildLanguage(guildId, userId, command) ⇒ <code>boolean</code>
Internal method to getGuildLanguage

**Kind**: instance method of [<code>GCommandsDispatcher</code>](#GCommandsDispatcher)  

| Param | Type |
| --- | --- |
| guildId | <code>Snowflake</code> | 
| userId | <code>Snowflake</code> | 
| command | <code>Object</code> | 

<a name="GCommandsDispatcher+fetchClientApplication"></a>

### gCommandsDispatcher.fetchClientApplication() ⇒ <code>Array</code>
Internal method to fetchClientApplication

**Kind**: instance method of [<code>GCommandsDispatcher</code>](#GCommandsDispatcher)  
<a name="GCommandsDispatcher+addInhibitor"></a>

### gCommandsDispatcher.addInhibitor(inhibitor) ⇒ <code>boolean</code>
Internal method to addInhibitor

**Kind**: instance method of [<code>GCommandsDispatcher</code>](#GCommandsDispatcher)  

| Param | Type |
| --- | --- |
| inhibitor | <code>function</code> | 

<a name="GCommandsDispatcher+removeInhibitor"></a>

### gCommandsDispatcher.removeInhibitor() ⇒ <code>Set</code>
Internal method to removeInhibitor

**Kind**: instance method of [<code>GCommandsDispatcher</code>](#GCommandsDispatcher)  
<a name="GCommandsDispatcher+createButtonCollector"></a>

### gCommandsDispatcher.createButtonCollector(filter, options) ⇒ <code>Collector</code>
Internal method to createButtonCollector

**Kind**: instance method of [<code>GCommandsDispatcher</code>](#GCommandsDispatcher)  

| Param | Type |
| --- | --- |
| filter | <code>function</code> | 
| options | <code>Object</code> | 

<a name="GCommandsDispatcher+awaitButtons"></a>

### gCommandsDispatcher.awaitButtons(filter, options) ⇒ <code>Collector</code>
Internal method to createButtonCollector

**Kind**: instance method of [<code>GCommandsDispatcher</code>](#GCommandsDispatcher)  

| Param | Type |
| --- | --- |
| filter | <code>function</code> | 
| options | <code>Object</code> | 

<a name="GCommandsDispatcher+createSelectMenuCollector"></a>

### gCommandsDispatcher.createSelectMenuCollector(filter, options) ⇒ <code>Collector</code>
Internal method to createSelectMenuCollector

**Kind**: instance method of [<code>GCommandsDispatcher</code>](#GCommandsDispatcher)  

| Param | Type |
| --- | --- |
| filter | <code>function</code> | 
| options | <code>Object</code> | 

<a name="GCommandsDispatcher+awaitSelectMenus"></a>

### gCommandsDispatcher.awaitSelectMenus(filter, options) ⇒ <code>Collector</code>
Internal method to createButtonCollector

**Kind**: instance method of [<code>GCommandsDispatcher</code>](#GCommandsDispatcher)  

| Param | Type |
| --- | --- |
| filter | <code>function</code> | 
| options | <code>Object</code> | 

<a name="GEvents"></a>

## GEvents
The GEvents class

**Kind**: global class  

* [GEvents](#GEvents)
    * [new GEvents(client, options)](#new_GEvents_new)
    * [.eventDir](#GEvents+eventDir) : <code>GEventsOptions</code>

<a name="new_GEvents_new"></a>

### new GEvents(client, options)
Creates new GEvents instance


| Param | Type |
| --- | --- |
| client | <code>DiscordClient</code> | 
| options | <code>GEventsOptions</code> | 

<a name="GEvents+eventDir"></a>

### gEvents.eventDir : <code>GEventsOptions</code>
GEventsOptions options

**Kind**: instance property of [<code>GEvents</code>](#GEvents)  
**Properties**

| Name | Type |
| --- | --- |
| eventDir | <code>String</code> | 

<a name="GEventLoader"></a>

## GEventLoader
The GCommandsEventLoader class

**Kind**: global class  

* [GEventLoader](#GEventLoader)
    * [new GEventLoader(GCommandsClient)](#new_GEventLoader_new)
    * [.GCommandsClient](#GEventLoader+GCommandsClient)
    * [.getSlashArgs()](#GEventLoader+getSlashArgs) ⇒ <code>object</code>

<a name="new_GEventLoader_new"></a>

### new GEventLoader(GCommandsClient)
Creates new GCommandsEventLoader instance


| Param | Type |
| --- | --- |
| GCommandsClient | <code>GCommandsClient</code> | 

<a name="GEventLoader+GCommandsClient"></a>

### gEventLoader.GCommandsClient
GCommandsEventLoader options

**Kind**: instance property of [<code>GEventLoader</code>](#GEventLoader)  
**Properties**

| Name | Type |
| --- | --- |
| GCommandsClient | <code>Object</code> | 

<a name="GEventLoader+getSlashArgs"></a>

### gEventLoader.getSlashArgs() ⇒ <code>object</code>
Internal method to getSlashArgs

**Kind**: instance method of [<code>GEventLoader</code>](#GEventLoader)  
<a name="Color"></a>

## Color
The Color class

**Kind**: global class  

* [Color](#Color)
    * [new Color(text, options)](#new_Color_new)
    * [.text](#Color+text) : <code>ColorOptions</code>
    * [.getText()](#Color+getText) ⇒ <code>json</code> \| <code>string</code>
    * [.getRGB()](#Color+getRGB) ⇒ <code>json</code> \| <code>string</code>

<a name="new_Color_new"></a>

### new Color(text, options)
Creates new Color instance


| Param | Type |
| --- | --- |
| text | <code>string</code> | 
| options | <code>ColorOptions</code> | 

<a name="Color+text"></a>

### color.text : <code>ColorOptions</code>
Color options

**Kind**: instance property of [<code>Color</code>](#Color)  

| Param | Type |
| --- | --- |
| text | <code>string</code> | 
| json | <code>ColorOptions</code> | 

<a name="Color+getText"></a>

### color.getText() ⇒ <code>json</code> \| <code>string</code>
Internal method to getText

**Kind**: instance method of [<code>Color</code>](#Color)  
<a name="Color+getRGB"></a>

### color.getRGB() ⇒ <code>json</code> \| <code>string</code>
Internal method to getRGB

**Kind**: instance method of [<code>Color</code>](#Color)  
<a name="GCommandsMessage"></a>

## GCommandsMessage ⇐ <code>Message</code>
The MessageStructure structure

**Kind**: global class  
**Extends**: <code>Message</code>  

* [GCommandsMessage](#GCommandsMessage) ⇐ <code>Message</code>
    * [.buttons(content, options)](#GCommandsMessage+buttons) ⇒ <code>Promise</code>
    * [.buttonsEdit(content, options)](#GCommandsMessage+buttonsEdit) ⇒ <code>Promise</code>
    * [.edit(options)](#GCommandsMessage+edit)
    * [.update(options)](#GCommandsMessage+update)
    * [.inlineReply(content, options)](#GCommandsMessage+inlineReply) ⇒ <code>Promise</code>

<a name="GCommandsMessage+buttons"></a>

### gCommandsMessage.buttons(content, options) ⇒ <code>Promise</code>
Method to make buttons

**Kind**: instance method of [<code>GCommandsMessage</code>](#GCommandsMessage)  

| Param | Type |
| --- | --- |
| content | <code>String</code> | 
| options | <code>Object</code> | 

<a name="GCommandsMessage+buttonsEdit"></a>

### gCommandsMessage.buttonsEdit(content, options) ⇒ <code>Promise</code>
Method to buttonsEdit

**Kind**: instance method of [<code>GCommandsMessage</code>](#GCommandsMessage)  

| Param | Type |
| --- | --- |
| content | <code>String</code> | 
| options | <code>Object</code> | 

<a name="GCommandsMessage+edit"></a>

### gCommandsMessage.edit(options)
Method to edit message

**Kind**: instance method of [<code>GCommandsMessage</code>](#GCommandsMessage)  

| Param | Type |
| --- | --- |
| options | <code>Object</code> | 

<a name="GCommandsMessage+update"></a>

### gCommandsMessage.update(options)
Method to update message

**Kind**: instance method of [<code>GCommandsMessage</code>](#GCommandsMessage)  

| Param | Type |
| --- | --- |
| options | <code>Object</code> | 

<a name="GCommandsMessage+inlineReply"></a>

### gCommandsMessage.inlineReply(content, options) ⇒ <code>Promise</code>
Method to inlineReply

**Kind**: instance method of [<code>GCommandsMessage</code>](#GCommandsMessage)  

| Param | Type |
| --- | --- |
| content | <code>String</code> | 
| options | <code>Object</code> | 

<a name="InteractionEvent"></a>

## InteractionEvent
The InteractionEvent class

**Kind**: global class  

* [InteractionEvent](#InteractionEvent)
    * [new InteractionEvent(client, data)](#new_InteractionEvent_new)
    * [.type](#InteractionEvent+type) : <code>Number</code>
    * [.componentType](#InteractionEvent+componentType) : <code>Number</code>
    * ~~[.selectMenuId](#InteractionEvent+selectMenuId)~~
    * ~~[.valueId](#InteractionEvent+valueId)~~
    * [.id](#InteractionEvent+id) : <code>Number</code>
    * [.values](#InteractionEvent+values) : <code>Array</code>
    * [.version](#InteractionEvent+version) : <code>Number</code>
    * [.token](#InteractionEvent+token) : <code>String</code>
    * [.discordID](#InteractionEvent+discordID) : <code>Number</code>
    * [.applicationID](#InteractionEvent+applicationID) : <code>Number</code>
    * [.guild](#InteractionEvent+guild) : <code>Guild</code>
    * [.channel](#InteractionEvent+channel) : <code>TextChannel</code> \| <code>NewsChannel</code> \| <code>DMChannel</code>
    * [.clicker](#InteractionEvent+clicker) : <code>GuildMember</code> \| <code>User</code> \| <code>Number</code>
    * [.message](#InteractionEvent+message) : <code>GMessage</code>
    * [.replied](#InteractionEvent+replied) : <code>boolean</code>
    * [.deferred](#InteractionEvent+deferred) : <code>boolean</code>
    * [.reply](#InteractionEvent+reply)
    * [.defer(ephemeral)](#InteractionEvent+defer)
    * [.think(ephemeral)](#InteractionEvent+think)
    * [.edit(options)](#InteractionEvent+edit)
    * [.update(options)](#InteractionEvent+update)

<a name="new_InteractionEvent_new"></a>

### new InteractionEvent(client, data)
Creates new InteractionEvent instance


| Param | Type |
| --- | --- |
| client | <code>Client</code> | 
| data | <code>Object</code> | 

<a name="InteractionEvent+type"></a>

### interactionEvent.type : <code>Number</code>
type

**Kind**: instance property of [<code>InteractionEvent</code>](#InteractionEvent)  
<a name="InteractionEvent+componentType"></a>

### interactionEvent.componentType : <code>Number</code>
componentType

**Kind**: instance property of [<code>InteractionEvent</code>](#InteractionEvent)  
<a name="InteractionEvent+selectMenuId"></a>

### ~~interactionEvent.selectMenuId~~
***Deprecated***

selectMenuId

**Kind**: instance property of [<code>InteractionEvent</code>](#InteractionEvent)  
<a name="InteractionEvent+valueId"></a>

### ~~interactionEvent.valueId~~
***Deprecated***

selectMenuId

**Kind**: instance property of [<code>InteractionEvent</code>](#InteractionEvent)  
<a name="InteractionEvent+id"></a>

### interactionEvent.id : <code>Number</code>
id

**Kind**: instance property of [<code>InteractionEvent</code>](#InteractionEvent)  
<a name="InteractionEvent+values"></a>

### interactionEvent.values : <code>Array</code>
values

**Kind**: instance property of [<code>InteractionEvent</code>](#InteractionEvent)  
<a name="InteractionEvent+version"></a>

### interactionEvent.version : <code>Number</code>
version

**Kind**: instance property of [<code>InteractionEvent</code>](#InteractionEvent)  
<a name="InteractionEvent+token"></a>

### interactionEvent.token : <code>String</code>
token

**Kind**: instance property of [<code>InteractionEvent</code>](#InteractionEvent)  
<a name="InteractionEvent+discordID"></a>

### interactionEvent.discordID : <code>Number</code>
discordID

**Kind**: instance property of [<code>InteractionEvent</code>](#InteractionEvent)  
<a name="InteractionEvent+applicationID"></a>

### interactionEvent.applicationID : <code>Number</code>
applicationID

**Kind**: instance property of [<code>InteractionEvent</code>](#InteractionEvent)  
<a name="InteractionEvent+guild"></a>

### interactionEvent.guild : <code>Guild</code>
guild

**Kind**: instance property of [<code>InteractionEvent</code>](#InteractionEvent)  
<a name="InteractionEvent+channel"></a>

### interactionEvent.channel : <code>TextChannel</code> \| <code>NewsChannel</code> \| <code>DMChannel</code>
channel

**Kind**: instance property of [<code>InteractionEvent</code>](#InteractionEvent)  
<a name="InteractionEvent+clicker"></a>

### interactionEvent.clicker : <code>GuildMember</code> \| <code>User</code> \| <code>Number</code>
clicker

**Kind**: instance property of [<code>InteractionEvent</code>](#InteractionEvent)  
<a name="InteractionEvent+message"></a>

### interactionEvent.message : <code>GMessage</code>
message

**Kind**: instance property of [<code>InteractionEvent</code>](#InteractionEvent)  
<a name="InteractionEvent+replied"></a>

### interactionEvent.replied : <code>boolean</code>
replied

**Kind**: instance property of [<code>InteractionEvent</code>](#InteractionEvent)  
<a name="InteractionEvent+deferred"></a>

### interactionEvent.deferred : <code>boolean</code>
deferred

**Kind**: instance property of [<code>InteractionEvent</code>](#InteractionEvent)  
<a name="InteractionEvent+reply"></a>

### interactionEvent.reply
Method to reply

**Kind**: instance property of [<code>InteractionEvent</code>](#InteractionEvent)  
<a name="InteractionEvent+defer"></a>

### interactionEvent.defer(ephemeral)
Method to defer

**Kind**: instance method of [<code>InteractionEvent</code>](#InteractionEvent)  

| Param | Type |
| --- | --- |
| ephemeral | <code>Boolean</code> | 

<a name="InteractionEvent+think"></a>

### interactionEvent.think(ephemeral)
Method to think

**Kind**: instance method of [<code>InteractionEvent</code>](#InteractionEvent)  

| Param | Type |
| --- | --- |
| ephemeral | <code>Boolean</code> | 

<a name="InteractionEvent+edit"></a>

### interactionEvent.edit(options)
Method to edit

**Kind**: instance method of [<code>InteractionEvent</code>](#InteractionEvent)  

| Param | Type |
| --- | --- |
| options | <code>Object</code> | 

<a name="InteractionEvent+update"></a>

### interactionEvent.update(options)
Method to update

**Kind**: instance method of [<code>InteractionEvent</code>](#InteractionEvent)  

| Param | Type |
| --- | --- |
| options | <code>Object</code> | 

<a name="MessageActionRow"></a>

## MessageActionRow
The MessageActionRow class

**Kind**: global class  

* [MessageActionRow](#MessageActionRow)
    * [new MessageActionRow(data)](#new_MessageActionRow_new)
    * [.addComponent(cmponent)](#MessageActionRow+addComponent)
    * [.addComponents(components)](#MessageActionRow+addComponents)
    * [.removeComponents(index, deleteCount, ...components)](#MessageActionRow+removeComponents)
    * [.toJSON()](#MessageActionRow+toJSON) ⇒ <code>Object</code>

<a name="new_MessageActionRow_new"></a>

### new MessageActionRow(data)
Creates new MessageActionRow instance


| Param | Type |
| --- | --- |
| data | <code>Object</code> | 

<a name="MessageActionRow+addComponent"></a>

### messageActionRow.addComponent(cmponent)
Method to addComponent

**Kind**: instance method of [<code>MessageActionRow</code>](#MessageActionRow)  

| Param | Type |
| --- | --- |
| cmponent | [<code>MessageButton</code>](#MessageButton) \| [<code>MessageSelectMenu</code>](#MessageSelectMenu) | 

<a name="MessageActionRow+addComponents"></a>

### messageActionRow.addComponents(components)
Method to addComponents

**Kind**: instance method of [<code>MessageActionRow</code>](#MessageActionRow)  

| Param | Type |
| --- | --- |
| components | [<code>Array.&lt;MessageButton&gt;</code>](#MessageButton) \| [<code>Array.&lt;MessageSelectMenu&gt;</code>](#MessageSelectMenu) | 

<a name="MessageActionRow+removeComponents"></a>

### messageActionRow.removeComponents(index, deleteCount, ...components)
Method to removeComponents

**Kind**: instance method of [<code>MessageActionRow</code>](#MessageActionRow)  

| Param | Type |
| --- | --- |
| index | <code>Number</code> | 
| deleteCount | <code>Number</code> | 
| ...components | [<code>Array.&lt;MessageButton&gt;</code>](#MessageButton) \| [<code>Array.&lt;MessageSelectMenu&gt;</code>](#MessageSelectMenu) | 

<a name="MessageActionRow+toJSON"></a>

### messageActionRow.toJSON() ⇒ <code>Object</code>
Method to toJSON

**Kind**: instance method of [<code>MessageActionRow</code>](#MessageActionRow)  
<a name="MessageButton"></a>

## MessageButton
The MessageButton class

**Kind**: global class  

* [MessageButton](#MessageButton)
    * [new MessageButton(data)](#new_MessageButton_new)
    * [.setStyle(style)](#MessageButton+setStyle)
    * [.setLabel(label)](#MessageButton+setLabel)
    * [.setEmoji(emoji)](#MessageButton+setEmoji)
    * [.setDisabled(boolean)](#MessageButton+setDisabled)
    * [.setURL(url)](#MessageButton+setURL)
    * [.setID(id)](#MessageButton+setID)
    * [.toJSON()](#MessageButton+toJSON) ⇒ <code>Object</code>

<a name="new_MessageButton_new"></a>

### new MessageButton(data)
Creates new MessageButton instance


| Param | Type |
| --- | --- |
| data | <code>Object</code> | 

<a name="MessageButton+setStyle"></a>

### messageButton.setStyle(style)
Method to setStyle

**Kind**: instance method of [<code>MessageButton</code>](#MessageButton)  

| Param | Type |
| --- | --- |
| style | <code>String</code> | 

<a name="MessageButton+setLabel"></a>

### messageButton.setLabel(label)
Method to setLabel

**Kind**: instance method of [<code>MessageButton</code>](#MessageButton)  

| Param | Type |
| --- | --- |
| label | <code>String</code> | 

<a name="MessageButton+setEmoji"></a>

### messageButton.setEmoji(emoji)
Method to setEmoji

**Kind**: instance method of [<code>MessageButton</code>](#MessageButton)  

| Param | Type |
| --- | --- |
| emoji | <code>String</code> | 

<a name="MessageButton+setDisabled"></a>

### messageButton.setDisabled(boolean)
Method to setDisabled

**Kind**: instance method of [<code>MessageButton</code>](#MessageButton)  

| Param | Type | Default |
| --- | --- | --- |
| boolean | <code>String</code> | <code>true</code> | 

<a name="MessageButton+setURL"></a>

### messageButton.setURL(url)
Method to setURL

**Kind**: instance method of [<code>MessageButton</code>](#MessageButton)  

| Param | Type |
| --- | --- |
| url | <code>String</code> | 

<a name="MessageButton+setID"></a>

### messageButton.setID(id)
Method to setID

**Kind**: instance method of [<code>MessageButton</code>](#MessageButton)  

| Param | Type |
| --- | --- |
| id | <code>String</code> | 

<a name="MessageButton+toJSON"></a>

### messageButton.toJSON() ⇒ <code>Object</code>
Method to toJSON

**Kind**: instance method of [<code>MessageButton</code>](#MessageButton)  
<a name="MessageSelectMenu"></a>

## MessageSelectMenu
The MessageSelectMenu class

**Kind**: global class  

* [MessageSelectMenu](#MessageSelectMenu)
    * [new MessageSelectMenu(data)](#new_MessageSelectMenu_new)
    * [.setPlaceholder(boolean)](#MessageSelectMenu+setPlaceholder)
    * [.setMaxValues(int)](#MessageSelectMenu+setMaxValues)
    * [.setMinValues(int)](#MessageSelectMenu+setMinValues)
    * [.setID(id)](#MessageSelectMenu+setID)
    * [.addOption(MessageSelectOption)](#MessageSelectMenu+addOption)
    * [.addOptions(MessageSelectOptions)](#MessageSelectMenu+addOptions)
    * [.removeOptions(index, deleteCount, MessageSelectOptions)](#MessageSelectMenu+removeOptions)
    * [.toJSON()](#MessageSelectMenu+toJSON) ⇒ <code>Object</code>

<a name="new_MessageSelectMenu_new"></a>

### new MessageSelectMenu(data)
Creates new MessageSelectMenu instance


| Param | Type |
| --- | --- |
| data | <code>Object</code> | 

<a name="MessageSelectMenu+setPlaceholder"></a>

### messageSelectMenu.setPlaceholder(boolean)
Method to setDisabled

**Kind**: instance method of [<code>MessageSelectMenu</code>](#MessageSelectMenu)  

| Param | Type |
| --- | --- |
| boolean | <code>String</code> | 

<a name="MessageSelectMenu+setMaxValues"></a>

### messageSelectMenu.setMaxValues(int)
Method to setMaxValues

**Kind**: instance method of [<code>MessageSelectMenu</code>](#MessageSelectMenu)  

| Param | Type | Default |
| --- | --- | --- |
| int | <code>Number</code> | <code>1</code> | 

<a name="MessageSelectMenu+setMinValues"></a>

### messageSelectMenu.setMinValues(int)
Method to setMinValues

**Kind**: instance method of [<code>MessageSelectMenu</code>](#MessageSelectMenu)  

| Param | Type | Default |
| --- | --- | --- |
| int | <code>Number</code> | <code>1</code> | 

<a name="MessageSelectMenu+setID"></a>

### messageSelectMenu.setID(id)
Method to setID

**Kind**: instance method of [<code>MessageSelectMenu</code>](#MessageSelectMenu)  

| Param | Type |
| --- | --- |
| id | <code>String</code> | 

<a name="MessageSelectMenu+addOption"></a>

### messageSelectMenu.addOption(MessageSelectOption)
Method to addOption

**Kind**: instance method of [<code>MessageSelectMenu</code>](#MessageSelectMenu)  

| Param | Type |
| --- | --- |
| MessageSelectOption | <code>MessageSelectOption</code> | 

<a name="MessageSelectMenu+addOptions"></a>

### messageSelectMenu.addOptions(MessageSelectOptions)
Method to addOptions

**Kind**: instance method of [<code>MessageSelectMenu</code>](#MessageSelectMenu)  

| Param | Type |
| --- | --- |
| MessageSelectOptions | <code>Array.&lt;MessageSelectOption&gt;</code> | 

<a name="MessageSelectMenu+removeOptions"></a>

### messageSelectMenu.removeOptions(index, deleteCount, MessageSelectOptions)
Method to removeOptions

**Kind**: instance method of [<code>MessageSelectMenu</code>](#MessageSelectMenu)  

| Param | Type |
| --- | --- |
| index | <code>Number</code> | 
| deleteCount | <code>Number</code> | 
| MessageSelectOptions | <code>Array.&lt;MessageSelectOption&gt;</code> | 

<a name="MessageSelectMenu+toJSON"></a>

### messageSelectMenu.toJSON() ⇒ <code>Object</code>
Method to toJSON

**Kind**: instance method of [<code>MessageSelectMenu</code>](#MessageSelectMenu)  
<a name="MessageSelectMenuOption"></a>

## MessageSelectMenuOption
The MessageSelectMenuOption class

**Kind**: global class  

* [MessageSelectMenuOption](#MessageSelectMenuOption)
    * [new MessageSelectMenuOption(data)](#new_MessageSelectMenuOption_new)
    * [.setLabel(label)](#MessageSelectMenuOption+setLabel)
    * [.setValue(value)](#MessageSelectMenuOption+setValue)
    * [.setDescription(desc)](#MessageSelectMenuOption+setDescription)
    * [.setEmoji(emoji)](#MessageSelectMenuOption+setEmoji)
    * [.setDefault(default)](#MessageSelectMenuOption+setDefault)
    * [.toJSON()](#MessageSelectMenuOption+toJSON) ⇒ <code>Object</code>

<a name="new_MessageSelectMenuOption_new"></a>

### new MessageSelectMenuOption(data)
Creates new MessageSelectMenuOption instance


| Param | Type |
| --- | --- |
| data | <code>Object</code> | 

<a name="MessageSelectMenuOption+setLabel"></a>

### messageSelectMenuOption.setLabel(label)
Method to setLabel

**Kind**: instance method of [<code>MessageSelectMenuOption</code>](#MessageSelectMenuOption)  

| Param | Type |
| --- | --- |
| label | <code>String</code> | 

<a name="MessageSelectMenuOption+setValue"></a>

### messageSelectMenuOption.setValue(value)
Method to setValue

**Kind**: instance method of [<code>MessageSelectMenuOption</code>](#MessageSelectMenuOption)  

| Param | Type |
| --- | --- |
| value | <code>String</code> | 

<a name="MessageSelectMenuOption+setDescription"></a>

### messageSelectMenuOption.setDescription(desc)
Method to setValue

**Kind**: instance method of [<code>MessageSelectMenuOption</code>](#MessageSelectMenuOption)  

| Param | Type |
| --- | --- |
| desc | <code>String</code> | 

<a name="MessageSelectMenuOption+setEmoji"></a>

### messageSelectMenuOption.setEmoji(emoji)
Method to setEmoji

**Kind**: instance method of [<code>MessageSelectMenuOption</code>](#MessageSelectMenuOption)  

| Param | Type |
| --- | --- |
| emoji | <code>String</code> | 

<a name="MessageSelectMenuOption+setDefault"></a>

### messageSelectMenuOption.setDefault(default)
Method to setDefault

**Kind**: instance method of [<code>MessageSelectMenuOption</code>](#MessageSelectMenuOption)  

| Param | Type |
| --- | --- |
| default | <code>Boolean</code> | 

<a name="MessageSelectMenuOption+toJSON"></a>

### messageSelectMenuOption.toJSON() ⇒ <code>Object</code>
Method to toJSON

**Kind**: instance method of [<code>MessageSelectMenuOption</code>](#MessageSelectMenuOption)  
<a name="ReturnSystem"></a>

## ReturnSystem
Return system for slash

**Kind**: global variable  

| Param | Type |
| --- | --- |
| client | <code>DiscordClient</code> | 
| interaction | <code>Object</code> | 

**Example**  
```js
return {
     content: "hi",
     ephemeral: true,
     allowedMentions: { parse: [], repliedUser: true }
 }
```
<a name="respond"></a>

## respond(result) ⇒ <code>Object</code>
Respond

**Kind**: global function  

| Param | Type |
| --- | --- |
| result | <code>RespondOptions</code> | 

<a name="respond"></a>

## respond(result) ⇒ <code>Object</code>
Respond

**Kind**: global function  

| Param | Type |
| --- | --- |
| result | <code>RespondOptions</code> | 

<a name="respond"></a>

## respond(result) ⇒ <code>Object</code>
Respond

**Kind**: global function  

| Param | Type |
| --- | --- |
| result | <code>RespondOptions</code> | 

