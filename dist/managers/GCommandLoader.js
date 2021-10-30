"use strict";Object.defineProperty(exports,"__esModule",{value:true});exports.GCommandLoader=void 0;var fs=_interopRequireWildcard(require("fs"));var path=_interopRequireWildcard(require("path"));var _Command=require("../structures/Command");var _Color=require("../structures/Color");var _GError=require("../structures/GError");var _Constants=require("../util/Constants");var _util=require("../util/util");function _getRequireWildcardCache(nodeInterop){if(typeof WeakMap!=="function")return null;var cacheBabelInterop=new WeakMap;var cacheNodeInterop=new WeakMap;return(_getRequireWildcardCache=function(nodeInterop){return nodeInterop?cacheNodeInterop:cacheBabelInterop})(nodeInterop)}function _interopRequireWildcard(obj,nodeInterop){if(!nodeInterop&&obj&&obj.__esModule){return obj}if(obj===null||typeof obj!=="object"&&typeof obj!=="function"){return{default:obj}}var cache=_getRequireWildcardCache(nodeInterop);if(cache&&cache.has(obj)){return cache.get(obj)}var newObj={};var hasPropertyDescriptor=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var key in obj){if(key!=="default"&&Object.prototype.hasOwnProperty.call(obj,key)){var desc=hasPropertyDescriptor?Object.getOwnPropertyDescriptor(obj,key):null;if(desc&&(desc.get||desc.set)){Object.defineProperty(newObj,key,desc)}else{newObj[key]=obj[key]}}}newObj.default=obj;if(cache){cache.set(obj,newObj)}return newObj}const base="https://discord.com/api/v9/";class GCommandLoader{constructor(client){this.client=client;this.clientId=client.user.id;this.dir=this.client.options.loader.cmdDir;this.autoCategory=this.client.options.loader.autoCategory;this.loadFromCache=this.client.options.loader.loadFromCache;this.defaultType=this.client.options.commands.defaultType;this.load()}async load(){await this.loadFiles(this.dir)}async loadFiles(dir){for await(const fsDirent of fs.readdirSync(dir,{withFileTypes:true})){const rawFileName=fsDirent.name;const fileType=path.extname(rawFileName);const fileName=path.basename(rawFileName,fileType);if(fsDirent.isDirectory()){await this.loadFiles(path.join(dir,rawFileName));continue}else if(![".js",".ts"].includes(fileType)){continue}let file=await Promise.resolve(`${path.join(dir,rawFileName)}`).then(s=>_interopRequireWildcard(require(s)));if(file.default)file=file.default;else if(!file.name)file=Object.values(file)[0];if((0,_util.isClass)(file)){file=new file(this.client);if(!(file instanceof _Command.Command))throw new _GError.GError("[COMMAND]",`Command ${fileName} doesnt belong in Commands.`)}file._path=`${dir}/${fileName}${fileType}`;if(this.autoCategory&&!file.category){const category=dir.replace(`${this.dir}/`,"");if(category&&category!==this.dir)file.category=category.split("/").join(" ")}this.client.commands.set(file.name,file);if(file&&file.aliases&&Array.isArray(file.aliases))file.aliases.forEach(alias=>this.client.aliases.set(alias,file.name));this.client.emit(_Constants.InternalEvents.LOG,new _Color.Color(`&d[GCommands] &aLoaded (File): &e➜   &3${fileName}`).getText())}}/**
    Private async loadSlashCommands() {
        const keys = Array.from(this.client.commands.keys());
        this.__deleteNonExistCommands(keys);

        for (const commandName of keys) {
            const cmd = this.client.commands.get(commandName);

            let url = `${base}${Routes.applicationCommands(this.clientId)}`;

            const loadSlashCommand = async (guildOnly?: Snowflake) => {
                if (this.loadFromCache) {
                    let ifAlready;
                    if (guildOnly) ifAlready = (await __getAllCommands(this.client, guildOnly)).filter(c => c.name === cmd.name && c.type === 1);
                    else ifAlready = (await this._allGlobalCommands).filter(c => c.name === cmd.name && c.type === 1);

                    if (ifAlready.length > 0 && ((ifAlready[0].default_permission === false && ((Object.values(cmd)[10] || Object.values(cmd)[12]) !== undefined)) || (ifAlready[0].default_permission === true && ((Object.values(cmd)[10] || Object.values(cmd)[12]) === undefined))) && ifAlready[0].description === cmd.description && JSON.stringify(comparable(cmd.args)) === JSON.stringify(comparable(ifAlready[0].options))) { // eslint-disable-line max-len
                        this.client.emit(InternalEvents.LOG, new Color(`&d[GCommands] &aLoaded from cache (Slash): &e➜   &3${cmd.name}`).getText());
                        return;
                    }
                }

                const config = {
                    method: 'POST',
                    headers: {
                        Authorization: `Bot ${this.client.token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: cmd.name,
                        description: cmd.description,
                        options: cmd.args || [],
                        type: 1,
                        default_permission: guildOnly ? (Object.values(cmd)[10] || Object.values(cmd)[12]) === undefined : true,
                        channel_types: cmd.channelTypeOnly || null,
                    }),
                    url,
                };

                hyttpo.request(config)
                    .then(() => this.client.emit(InternalEvents.LOG, new Color(`&d[GCommands] &aLoaded (Slash): &e➜   &3${cmd.name}`).getText()))
                    .catch(error => {
                        this.client.emit(InternalEvents.LOG, new Color(`&d[GCommands] ${error?.status === 429 ? `&aWait &e${ms(error.data.retry_after * 1000)}` : ''} &c${error.status} ${error.data.message} &e(${cmd.name})`).getText());

                        if (error) {
                            if (error.status === 429) {
                                setTimeout(() => {
                                    this.__tryAgain(cmd, config, 'Slash');
                                }, (error.data.retry_after) * 1000);
                            } else {
                                this.client.emit(InternalEvents.DEBUG, new Color([
                                    '&a----------------------',
                                    '  &d[GCommands Debug] &3',
                                    `&aCode: &b${error.data.code}`,
                                    `&aMessage: &b${error.data.message}`,
                                    '',
                                    `${error.data.errors ? '&aErrors:' : '&a----------------------'}`,
                                ]).getText());

                                if (error.data.errors) {
                                    getAllObjects(this.client, error.data.errors);

                                    this.client.emit(InternalEvents.DEBUG, new Color([
                                        `&a----------------------`,
                                    ]).getText());
                                }
                            }
                        }
                    });
            };

            if (cmd.guildOnly) {
                if (typeof cmd.guildOnly === 'string') {
                    url = `${base}${Routes.applicationGuildCommands(this.clientId, cmd.guildOnly)}`;
                    await loadSlashCommand(cmd.guildOnly);
                } else {
                    for (const guildOnly of cmd.guildOnly) {
                        if (!guildOnly) {
                            await loadSlashCommand();
                            continue;
                        }
                        url = `${base}${Routes.applicationGuildCommands(this.clientId, guildOnly)}`;
                        await loadSlashCommand(guildOnly);
                    }
                }
            } else { await loadSlashCommand(); }
        }
    }
    */}exports.GCommandLoader=GCommandLoader;