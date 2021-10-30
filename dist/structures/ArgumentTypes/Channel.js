"use strict";Object.defineProperty(exports,"__esModule",{value:true});exports.ChannelArgument=void 0;var _Constants=require("../../util/Constants");var _Base=require("./Base");class ChannelArgument extends _Base.BaseArgument{constructor(client){super(client,"CHANNEL")}Validate(argument,message,language){const matches=message.content.match(/([0-9]+)/);if(!(matches!==null&&matches!==void 0&&matches[0]))return this.client.languageFile.ARGS_MUST_CONTAIN[language].replace("{argument}",argument.name).replace("{type}","channel");this.value.value=matches[0];const channel=this.client.channels.cache.get(matches[0]);if(!channel)return this.client.languageFile.ARGS_MUST_CONTAIN[language].replace("{argument}",argument.name).replace("{type}","channel");else this.value.channel=channel;if(argument.channel_types&&argument.channel_types.some(type=>type!==_Constants.ChannelType[channel.type]))return this.client.languageFile.ARGS_MUST_CONTAIN[language].replace("{argument}",argument.name).replace("{type}","channel")}resolve(option){if(this.value.channel)option.channel=this.value.channel;return option}}// Fix this later!
exports.ChannelArgument=ChannelArgument;