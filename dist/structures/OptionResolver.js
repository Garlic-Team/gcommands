"use strict";Object.defineProperty(exports,"__esModule",{value:true});exports.OptionResolver=void 0;var _errors=require("discord.js/src/errors");class OptionResolver{constructor(client,options,resolved){var _this$_hoistedOptions,_this$_hoistedOptions2;Object.defineProperty(this,"client",{value:client});this._group=null;this._subcommand=null;this._hoistedOptions=options;// Hoist subcommand group if present
if(((_this$_hoistedOptions=this._hoistedOptions[0])===null||_this$_hoistedOptions===void 0?void 0:_this$_hoistedOptions.type)==="SUB_COMMAND_GROUP"){this._group=this._hoistedOptions[0].name;this._hoistedOptions=this._hoistedOptions[0].options??[]}// Hoist subcommand if present
if(((_this$_hoistedOptions2=this._hoistedOptions[0])===null||_this$_hoistedOptions2===void 0?void 0:_this$_hoistedOptions2.type)==="SUB_COMMAND"){this._subcommand=this._hoistedOptions[0].name;this._hoistedOptions=this._hoistedOptions[0].options??[]}Object.defineProperty(this,"data",{value:Object.freeze([...options])});Object.defineProperty(this,"resolved",{value:Object.freeze(resolved)})}get(name,required=false){const option=this._hoistedOptions.find(opt=>opt.name===name);if(!option){if(required){throw new _errors.TypeError("COMMAND_INTERACTION_OPTION_NOT_FOUND",name)}return null}return option}_getTypedOption(name,type,properties,required){const option=this.get(name,required);if(!option){return null}else if(option.type!==type){throw new _errors.TypeError("COMMAND_INTERACTION_OPTION_TYPE",name,option.type,type)}else if(required&&properties.every(prop=>option[prop]===null||typeof option[prop]==="undefined")){throw new _errors.TypeError("COMMAND_INTERACTION_OPTION_EMPTY",name,option.type)}return option}getSubcommand(required=true){if(required&&!this._subcommand){throw new _errors.TypeError("COMMAND_INTERACTION_OPTION_NO_SUB_COMMAND")}return this._subcommand}getSubcommandGroup(required=true){if(required&&!this._group){throw new _errors.TypeError("COMMAND_INTERACTION_OPTION_NO_SUB_COMMAND_GROUP")}return this._group}getBoolean(name,required=false){const option=this._getTypedOption(name,"BOOLEAN",["value"],required);return(option===null||option===void 0?void 0:option.value)??null}getChannel(name,required=false){const option=this._getTypedOption(name,"CHANNEL",["channel"],required);return(option===null||option===void 0?void 0:option.channel)??null}getString(name,required=false){const option=this._getTypedOption(name,"STRING",["value"],required);return(option===null||option===void 0?void 0:option.value)??null}getInteger(name,required=false){const option=this._getTypedOption(name,"INTEGER",["value"],required);return(option===null||option===void 0?void 0:option.value)??null}getNumber(name,required=false){const option=this._getTypedOption(name,"NUMBER",["value"],required);return(option===null||option===void 0?void 0:option.value)??null}getUser(name,required=false){const option=this._getTypedOption(name,"USER",["user"],required);return(option===null||option===void 0?void 0:option.user)??null}getMember(name,required=false){const option=this._getTypedOption(name,"USER",["member"],required);return(option===null||option===void 0?void 0:option.member)??null}getRole(name,required=false){const option=this._getTypedOption(name,"ROLE",["role"],required);return(option===null||option===void 0?void 0:option.role)??null}getMentionable(name,required=false){const option=this._getTypedOption(name,"MENTIONABLE",["user","member","role"],required);return(option===null||option===void 0?void 0:option.member)??(option===null||option===void 0?void 0:option.user)??(option===null||option===void 0?void 0:option.role)??null}getMessage(name,required=false){const option=this._getTypedOption(name,"_MESSAGE",["message"],required);return(option===null||option===void 0?void 0:option.message)??null}getFocused(getFull=false){const focusedOption=this._hoistedOptions.find(option=>option.focused);if(!focusedOption)throw new _errors.TypeError("AUTOCOMPLETE_INTERACTION_OPTION_NO_FOCUSED_OPTION");return getFull?focusedOption:focusedOption.value}}exports.OptionResolver=OptionResolver;