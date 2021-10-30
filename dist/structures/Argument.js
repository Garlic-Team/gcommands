"use strict";Object.defineProperty(exports,"__esModule",{value:true});exports.Argument=void 0;var _discord=require("discord.js");var _Constants=require("../util/Constants");var _index=require("./ArgumentTypes/index");class Argument{constructor(client,argument,options){var _this$argument;this.client=client;this.isNotDm=options.isNotDm;this.language=options.language;this.argument=this.determineArgument(argument.type);this.name=argument.name;this.type=(_this$argument=this.argument)===null||_this$argument===void 0?void 0:_this$argument.type;this.required=argument.required;this.choices=argument.choices;this.subcommands=argument.subcommands}async collect(message,prompt){if(message.author.bot)return;if(!this.type)return false;if(!prompt)prompt=this.client.languageFile.ARGS_PROMPT[this.language].replace("{argument}",this.name);const wait=this.client.options.arguments.wait;const getComponents=disabled=>{const components=[new _discord.MessageActionRow().addComponents([new _discord.MessageButton().setLabel("Cancel").setStyle("DANGER").setCustomId(`argument_cancel_${message.id}_${this.name}`).setDisabled(disabled),!this.required?new _discord.MessageButton().setLabel("Skip").setStyle("PRIMARY").setCustomId(`argument_skip_${message.id}_${this.name}`).setDisabled(disabled):undefined])];if(this.type==="boolean"){components[1]=new _discord.MessageActionRow().addComponents([new _discord.MessageButton().setLabel("True").setStyle("SUCCESS").setCustomId(`argument_true_${message.id}_${this.name}`).setDisabled(disabled),new _discord.MessageButton().setLabel("False").setStyle("DANGER").setCustomId(`argument_false_${message.id}_${this.name}`).setDisabled(disabled)])}if(this.choices&&Array.isArray(this.choices)&&this.choices[0]){const menu=new _discord.MessageSelectMenu().setPlaceholder("Select a choice").setMaxValues(1).setMinValues(1).setCustomId(`argument_choice_${message.id}_${this.name}`).setDisabled(disabled);for(const choice of this.choices){menu.addOptions([{label:choice.name,value:choice.value}])}components[1]=new _discord.MessageActionRow().addComponents([menu])}if(this.subcommands&&Array.isArray(this.subcommands)&&this.subcommands[0]){const menu=new _discord.MessageSelectMenu().setPlaceholder("Select a subcommand").setMaxValues(1).setMinValues(1).setCustomId(`argument_subcommand_${message.id}_${this.name}`).setDisabled(disabled);for(const subcommand of this.subcommands){menu.addOptions([{label:subcommand.name,value:subcommand.name}])}components[1]=new _discord.MessageActionRow().addComponents([menu])}return components.reverse()};if(!this.required)prompt+=`\n${this.client.languageFile.ARGS_OPTIONAL[this.language]}`;if(["SUB_COMMAND","SUB_COMMAND_GROUP"].includes(this.type)&&this.subcommands)prompt=this.client.languageFile.ARGS_COMMAND[this.language].replace("{choices}",this.subcommands.map(sc=>`\`${sc.name}\``).join(", "));const msgReply=await message.reply({content:prompt,components:getComponents(false)});const messageCollectorfilter=msg=>msg.author.id===message.author.id;const componentsCollectorfilter=i=>i.user.id===message.author.id&&i.message&&i.message.id===msgReply.id&&i.customId.includes(message.id)&&i.customId.includes(this.name);const collectors=[message.channel.awaitMessages({filter:messageCollectorfilter,max:1,time:wait,errors:["TIME"]}),message.channel.awaitMessageComponent({filter:componentsCollectorfilter,componentType:"BUTTON",time:wait+1}),message.channel.awaitMessageComponent({filter:componentsCollectorfilter,componentType:"SELECT_MENU",time:wait+1})];let content;const responses=await Promise.race(collectors).catch();if(!responses||responses instanceof _discord.Collection&&responses.size===0){return"timelimit"}const resFirst=responses instanceof _discord.Collection?responses.first():responses;if(resFirst instanceof(_discord.ButtonInteraction||_discord.SelectMenuInteraction)){resFirst.deferUpdate().catch();if(resFirst.isSelectMenu()){content=resFirst.values[0]}else{content=resFirst.customId.split("_")[1]}}if(this.client.options.arguments.deletePrompt)await msgReply.delete();else await msgReply.edit({content:msgReply.content,components:getComponents(true)});if(this.client.options.arguments.deleteInput){if(message.channel instanceof _discord.BaseGuildTextChannel){if(resFirst instanceof _discord.Message){if(this.isNotDm&&!(resFirst instanceof(_discord.ButtonInteraction||_discord.SelectMenuInteraction))&&message.channel.permissionsFor(this.client.user.id).has("MANAGE_MESSAGES"))await resFirst.delete()}}}if(!this.required&&content==="skip")return"skip";else if(content==="cancel")return"cancel";const invalid=await this.argument.validate(this,{content:content.toLowerCase(),guild:resFirst.guild},this.language);if(invalid){return this.collect(message,invalid)}return this.argument.get()}determineArgument(type){if(type===_Constants.ArgumentType.SUB_COMMAND)return new _index.SubCommandArgument(this.client);if(type===_Constants.ArgumentType.SUB_COMMAND_GROUP)return new _index.SubCommandGroupArgument(this.client);if(type===_Constants.ArgumentType.STRING)return new _index.StringArgument(this.client);if(type===_Constants.ArgumentType.INTIGER)return new _index.IntegerArgument(this.client);if(type===_Constants.ArgumentType.BOOLEAN)return new _index.BooleanArgument(this.client);if(this.isNotDm&&type===_Constants.ArgumentType.USER)return new _index.UserArgument(this.client);if(this.isNotDm&&type===_Constants.ArgumentType.CHANNEL)return new _index.ChannelArgument(this.client);if(this.isNotDm&&type===_Constants.ArgumentType.ROLE)return new _index.RoleArgument(this.client);if(this.isNotDm&&type===_Constants.ArgumentType.MENTIONABLE)return new _index.MentionableArgument(this.client);if(type===_Constants.ArgumentType.NUMBER)return new _index.NumberArgument(this.client);return undefined}}exports.Argument=Argument;