"use strict";Object.defineProperty(exports,"__esModule",{value:true});exports.StringArgument=void 0;var _Base=require("./Base");class StringArgument extends _Base.BaseArgument{/**
     * The StringArgumentType class
     */constructor(client){super(client,"STRING")}validate(argument,message,language){var _argument$choices;const choice=(_argument$choices=argument.choices)===null||_argument$choices===void 0?void 0:_argument$choices.find(ch=>ch.name.toLowerCase()===message.content);if(argument.choices&&!choice)return this.client.languageFile.ARGS_CHOICES[language].replace("{choices}",argument.choices.map(opt=>`\`${opt.name}\``).join(", "));else if(choice)this.value.value=choice.value;else this.value.value=message.content}}exports.StringArgument=StringArgument;