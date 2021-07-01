// Type definitions for ./src/structures/v13/SelectMenuCollector.js
// Project: [LIBRARY_URL_HERE] 
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]> 
// Definitions: https://github.com/borisyankov/DefinitelyTyped

/**
 * 
 */
 declare interface SelectMenuCollector {
		
	/**
	 * 
	 * @param message 
	 * @param filter 
	 * @param options 
	 */
	new (message : any, filter : any, options : any);
		
	/**
	 * 
	 * @param menu 
	 */
	collect(menu : any): void;
		
	/**
	 * 
	 */
	dispose(): void;
		
	/**
	 * 
	 */
	empty(): void;
		
	/**
	 * 
	 */
	endReason : string;
		
	/**
	 * 
	 * @param message 
	 */
	_handleMessageDeletion(message : any): void;
		
	/**
	 * 
	 * @param channel 
	 */
	_handleChannelDeletion(channel : any): void;
		
	/**
	 * 
	 * @param guild 
	 */
	_handleGuildDeletion(guild : any): void;
		
	/**
	 * 
	 * @param menu 
	 * @return  
	 */
	key(menu : any):  /* error */ any;
}

// Type definitions for ./src/structures/MessageSelectMenuOption.js
// Project: [LIBRARY_URL_HERE] 
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]> 
// Definitions: https://github.com/borisyankov/DefinitelyTyped
declare namespace MessageSelectMenuOption.prototype{
	// MessageSelectMenuOption.prototype.parseEmoji.!ret
	
	/**
	 * 
	 */
	interface ParseEmojiRet {
				
		/**
		 * 
		 */
		animated : boolean;
				
		/**
		 * 
		 */
		name : string;
				
		/**
		 * 
		 */
		id : string;
	}
}

/**
 * The MessageSelectMenuOption class
 */
declare interface MessageSelectMenuOption {
		
	/**
	 * 
	 * @param data 
	 */
	new (data : any);
		
	/**
	 * 
	 * @param data 
	 * @return  
	 */
	setup(data : any): any;
		
	/**
	 * Method to setLabel
	 * @param {String} label
	 * @param label 
	 * @return  
	 */
	setLabel(label : string): /* MessageSelectMenuOption.prototype.+MessageSelectMenuOption */ any;
		
	/**
	 * Method to setValue
	 * @param {String} value
	 * @param value 
	 * @return  
	 */
	setValue(value : string): /* !this */ any;
		
	/**
	 * Method to setValue
	 * @param {String} desc
	 * @param desc 
	 * @return  
	 */
	setDescription(desc : string): /* !this */ any;
		
	/**
	 * Method to setEmoji
	 * @param {String} emoji
	 * @param emoji 
	 * @return  
	 */
	setEmoji(emoji : string): /* !this */ any;
		
	/**
	 * Method to setDefault
	 * @param {Boolean} default
	 * @param def 
	 * @return  
	 */
	setDefault(def : any): /* !this */ any;
		
	/**
	 * Method to toJSON
	 * @return {Object}
	 * @return  
	 */
	toJSON(): any;
		
	/**
	 * 
	 * @param text 
	 * @return  
	 */
	parseEmoji(text : string): MessageSelectMenuOption.prototype.ParseEmojiRet;
	
	/**
	 * 
	 */
	emoji : {
				
		/**
		 * 
		 */
		animated : boolean;
				
		/**
		 * 
		 */
		name : string;
				
		/**
		 * 
		 */
		id : string;
	}
		
	/**
	 * 
	 */
	default : boolean;
}

// Type definitions for ./src/structures/MessageSelectMenu.js
// Project: [LIBRARY_URL_HERE] 
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]> 
// Definitions: https://github.com/borisyankov/DefinitelyTyped

/**
 * The MessageSelectMenu class
 */
 declare interface MessageSelectMenu {
		
	/**
	 * 
	 * @param data 
	 */
	new (data : any);
		
	/**
	 * 
	 * @param data 
	 * @return  
	 */
	setup(data : any): any;
		
	/**
	 * Method to setDisabled
	 * @param {String} boolean
	 * @param string 
	 * @return  
	 */
	setPlaceholder(string : any): /* MessageSelectMenu.prototype.+MessageSelectMenu */ any;
		
	/**
	 * Method to setMaxValues
	 * @param {Number} int
	 * @param int 
	 * @return  
	 */
	setMaxValues(int : number): /* !this */ any;
		
	/**
	 * Method to setMinValues
	 * @param {Number} int
	 * @param int 
	 * @return  
	 */
	setMinValues(int : number): /* !this */ any;
		
	/**
	 * Method to setID
	 * @param {String} id
	 * @param id 
	 * @return  
	 */
	setID(id : string): /* !this */ any;
		
	/**
	 * Method to addOption
	 * @param {Object} MessageSelectOption
	 * @param option 
	 * @return  
	 */
	addOption(option : any): /* !this */ any;
		
	/**
	 * Method to addOptions
	 * @param {Object} MessageSelectOptions
	 * @param ...options 
	 * @return  
	 */
	addOptions(...options : any): /* !this */ any;
		
	/**
	 * Method to removeOptions
	 * @param {Object} MessageSelectOptions
	 * @param index 
	 * @param deleteCount 
	 * @param ...options 
	 * @return  
	 */
	removeOptions(index : any, deleteCount : any, ...options : any): /* !this */ any;
		
	/**
	 * Method to toJSON
	 * @return {Object}
	 * @return  
	 */
	toJSON(): any;
		
	/**
	 * 
	 */
	options : Array<any>;
		
	/**
	 * 
	 */
	type : number;
		
	/**
	 * 
	 */
	max_values : number;
		
	/**
	 * 
	 */
	min_values : number;
}

// Type definitions for ./src/structures/MessageButton.js
// Project: [LIBRARY_URL_HERE] 
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]> 
// Definitions: https://github.com/borisyankov/DefinitelyTyped
declare namespace MessageButton.prototype{
	// MessageButton.prototype.resolveButton.!ret
	
	/**
	 * 
	 */
	interface ResolveButtonRet {
				
		/**
		 * 
		 */
		disabled : boolean;
				
		/**
		 * 
		 */
		type : number;
	}
}
declare namespace MessageButton.prototype{
	// MessageButton.prototype.parseEmoji.!ret
	
	/**
	 * 
	 */
	interface ParseEmojiRet {
				
		/**
		 * 
		 */
		animated : boolean;
				
		/**
		 * 
		 */
		name : string;
				
		/**
		 * 
		 */
		id : string;
	}
}

/**
 * 
 */
declare var styles : {
		
	/**
	 * 
	 */
	blurple : number;
		
	/**
	 * 
	 */
	gray : number;
		
	/**
	 * 
	 */
	grey : number;
		
	/**
	 * 
	 */
	green : number;
		
	/**
	 * 
	 */
	red : number;
		
	/**
	 * 
	 */
	url : number;
		
	/**
	 * 
	 */
	primary : number;
		
	/**
	 * 
	 */
	secondary : number;
		
	/**
	 * 
	 */
	success : number;
		
	/**
	 * 
	 */
	danger : number;
		
	/**
	 * 
	 */
	link : number;
}

/**
 * The MessageButton class
 */
declare interface MessageButton {
		
	/**
	 * 
	 * @param data 
	 */
	new (data : any);
		
	/**
	 * 
	 * @param data 
	 * @return  
	 */
	setup(data : any): any;
		
	/**
	 * Method to setStyle
	 * @param {String} style
	 * @param style 
	 * @return  
	 */
	setStyle(style : string): /* MessageButton.prototype.+MessageButton */ any;
		
	/**
	 * Method to setLabel
	 * @param {String} label
	 * @param label 
	 * @return  
	 */
	setLabel(label : string): /* !this */ any;
		
	/**
	 * Method to setEmoji
	 * @param {String} emoji
	 * @param emoji 
	 * @return  
	 */
	setEmoji(emoji : string): /* !this */ any;
		
	/**
	 * Method to setDisabled
	 * @param {String} boolean
	 * @param boolean 
	 * @return  
	 */
	setDisabled(boolean : string): /* !this */ any;
		
	/**
	 * Method to setURL
	 * @param {String} url
	 * @param url 
	 * @return  
	 */
	setURL(url : string): /* !this */ any;
		
	/**
	 * Method to setID
	 * @param {String} id
	 * @param id 
	 * @return  
	 */
	setID(id : string): /* !this */ any;
		
	/**
	 * Method to toJSON
	 * @return {Object}
	 * @return  
	 */
	toJSON(): any;
		
	/**
	 * 
	 * @param style 
	 * @return  
	 */
	resolveStyle(style : any): any;
		
	/**
	 * 
	 * @param data 
	 * @return  
	 */
	resolveButton(data : any): MessageButton.prototype.ResolveButtonRet;
		
	/**
	 * 
	 * @param text 
	 * @return  
	 */
	parseEmoji(text : string): MessageButton.prototype.ParseEmojiRet;
		
	/**
	 * 
	 */
	disabled : boolean;
		
	/**
	 * 
	 */
	type : number;
	
	/**
	 * 
	 */
	emoji : {
				
		/**
		 * 
		 */
		animated : boolean;
				
		/**
		 * 
		 */
		name : string;
				
		/**
		 * 
		 */
		id : string;
	}
}

// Type definitions for ./src/structures/MessageActionRow.js
// Project: [LIBRARY_URL_HERE] 
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]> 
// Definitions: https://github.com/borisyankov/DefinitelyTyped

/**
 * The MessageActionRow class
 */
 declare interface MessageActionRow {
		
	/**
	 * 
	 * @param data 
	 */
	new (data : any);
		
	/**
	 * 
	 * @param data 
	 * @return  
	 */
	setup(data : any): any;
		
	/**
	 * Method to addComponent
	 * @param {MessageButton} MessageButton
	 * @param component 
	 * @return  
	 */
	addComponent(component : any): /* MessageActionRow.prototype.+MessageActionRow */ any;
		
	/**
	 * Method to addComponents
	 * @param {MessageButton} MessageButton
	 * @param components 
	 * @return  
	 */
	addComponents(components : any): /* !this */ any;
		
	/**
	 * Method to removeOptions
	 * @param {Object} MessageButton
	 * @param index 
	 * @param deleteCount 
	 * @param ...options 
	 * @return  
	 */
	removeComponents(index : any, deleteCount : any, ...options : any): /* !this */ any;
		
	/**
	 * Method to toJSON
	 * @return {Object}
	 * @return  
	 */
	toJSON(): any;
		
	/**
	 * 
	 */
	type : number;
		
	/**
	 * 
	 */
	components : Array<any>;
}

// Type definitions for ./src/structures/InteractionEvent.js
// Project: [LIBRARY_URL_HERE] 
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]> 
// Definitions: https://github.com/borisyankov/DefinitelyTyped
declare namespace InteractionEvent.prototype{
	// InteractionEvent.prototype.edit.!0
	
	/**
	 * 
	 */
	interface Edit0 {
				
		/**
		 * 
		 */
		components : Array</* InteractionEvent.prototype.edit.!0.components */ any>;
				
		/**
		 * 
		 */
		embeds : Array</* [string */ any> | /* InteractionEvent.prototype.edit.!0.embeds] */ any;
				
		/**
		 * 
		 */
		content : string;
				
		/**
		 * 
		 */
		attachments : Array</* InteractionEvent.prototype.edit.!0.attachments */ any>;
	}
}
declare namespace InteractionEvent.prototype{
	// InteractionEvent.prototype.slashRespond.!0
	
	/**
	 * 
	 */
	interface SlashRespond0 {
				
		/**
		 * 
		 */
		components : Array</* InteractionEvent.prototype.slashRespond.!0.components */ any>;
				
		/**
		 * 
		 */
		embeds : Array</* InteractionEvent.prototype.slashRespond.!0.embeds */ any>;
				
		/**
		 * 
		 */
		attachments : Array</* InteractionEvent.prototype.slashRespond.!0.attachments */ any>;
	}
}
declare namespace InteractionEvent.prototype{
	// InteractionEvent.prototype.slashRespond.!ret
	
	/**
	 * 
	 */
	interface SlashRespondRet {
				
		/**
		 * 
		 * @param filter 
		 * @param options 
		 */
		createButtonCollector(filter : any, options : any): void;
				
		/**
		 * 
		 * @param filter 
		 * @param options 
		 */
		awaitButtons(filter : any, options : any): void;
				
		/**
		 * 
		 * @param filter 
		 * @param options 
		 */
		createSelectMenuCollector(filter : any, options : any): void;
				
		/**
		 * 
		 * @param filter 
		 * @param options 
		 */
		awaitSelectMenus(filter : any, options : any): void;
				
		/**
		 * 
		 */
		delete(): void;
	}
}
declare namespace InteractionEvent.prototype{
	// InteractionEvent.prototype.slashEdit.!ret
	
	/**
	 * 
	 */
	interface SlashEditRet {
				
		/**
		 * 
		 * @param filter 
		 * @param options 
		 */
		createButtonCollector(filter : any, options : any): void;
				
		/**
		 * 
		 * @param filter 
		 * @param options 
		 */
		awaitButtons(filter : any, options : any): void;
				
		/**
		 * 
		 * @param filter 
		 * @param options 
		 */
		createSelectMenuCollector(filter : any, options : any): void;
				
		/**
		 * 
		 * @param filter 
		 * @param options 
		 */
		awaitSelectMenus(filter : any, options : any): void;
				
		/**
		 * 
		 */
		delete(): void;
				
		/**
		 * 
		 */
		client : any;
	}
}
declare namespace InteractionEvent.prototype.reply{
	// InteractionEvent.prototype.reply.send.!0
	
	/**
	 * 
	 */
	interface Send0 {
		
		/**
		 * 
		 */
		components : {
		}
		
		/**
		 * 
		 */
		embeds : {
		}
		
		/**
		 * 
		 */
		attachments : {
		}
	}
}

/**
 * The InteractionEvent class
 */
declare interface InteractionEvent {
		
	/**
	 * 
	 * @param client 
	 * @param data 
	 */
	new (client : any, data : any);
		
	/**
	 * Method to defer
	 * @param {Boolean} ephemeral
	 * @param ephemeral 
	 */
	defer(ephemeral : boolean): void;
		
	/**
	 * Method to think
	 * @param {Boolean} ephemeral
	 * @param ephemeral 
	 */
	think(ephemeral : boolean): void;
		
	/**
	 * Method to edit
	 * @param {Object} options
	 * @param result 
	 */
	edit(result : InteractionEvent.prototype.Edit0): void;
	
	/**
	 * 
	 */
	reply : {
				
		/**
		 * Method to replySend
		 * @param {Object} options
		 * @param result 
		 */
		send(result : InteractionEvent.prototype.reply.Send0): void;
				
		/**
		 * Method to replyEdit
		 * @param {Object} options
		 * @param result 
		 */
		edit(result : any): void;
	}
		
	/**
	 * 
	 * @param result 
	 * @return  
	 */
	slashRespond(result : InteractionEvent.prototype.SlashRespond0): InteractionEvent.prototype.SlashRespondRet;
		
	/**
	 * 
	 * @param result 
	 * @return  
	 */
	slashEdit(result : /* InteractionEvent.prototype.edit.!0 */ any): InteractionEvent.prototype.SlashEditRet;
		
	/**
	 * Method to isSelectMenu
	 * @return  
	 */
	isSelectMenu(): boolean;
		
	/**
	 * Method to isButton
	 * @return  
	 */
	isButton(): boolean;
}

// Type definitions for ./src/base/GEvents.js
// Project: [LIBRARY_URL_HERE] 
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]> 
// Definitions: https://github.com/borisyankov/DefinitelyTyped

/**
 * The GEvents class
 */
 declare interface GEvents {
		
	/**
	 * 
	 * @param GCommandsClient 
	 * @param options 
	 */
	new (GCommandsClient : any, options : any);
		
	/**
	 * Internal method to loadEventsFiles
	 * @returns {void}
	 * @private
	 * @return  
	 */
	__loadEventFiles(): any;
		
	/**
	 * Internal method to loadEvents
	 * @returns {void}
	 * @private
	 * @return  
	 */
	__loadEvents(): any;
}

// Type definitions for ./src/managers/GEventLoader.js
// Project: [LIBRARY_URL_HERE] 
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]> 
// Definitions: https://github.com/borisyankov/DefinitelyTyped
declare namespace GEventLoader.prototype{
	// GEventLoader.prototype.slashRespond.!2
	
	/**
	 * 
	 */
	interface SlashRespond2 {
				
		/**
		 * 
		 */
		components : Array</* GEventLoader.prototype.slashRespond.!2.components */ any>;
				
		/**
		 * 
		 */
		embeds : Array</* GEventLoader.prototype.slashRespond.!2.embeds */ any>;
				
		/**
		 * 
		 */
		attachments : Array</* GEventLoader.prototype.slashRespond.!2.attachments */ any>;
	}
}
declare namespace GEventLoader.prototype{
	// GEventLoader.prototype.slashEdit.!1
	
	/**
	 * 
	 */
	interface SlashEdit1 {
				
		/**
		 * 
		 */
		components : Array</* GEventLoader.prototype.slashEdit.!1.components */ any>;
				
		/**
		 * 
		 */
		embeds : Array</* [string */ any> | /* GEventLoader.prototype.slashEdit.!1.embeds] */ any;
				
		/**
		 * 
		 */
		content : string;
				
		/**
		 * 
		 */
		attachments : Array</* GEventLoader.prototype.slashEdit.!1.attachments */ any>;
	}
}
declare namespace GEventLoader.prototype{
	// GEventLoader.prototype.getSlashArgs.!0
	type GetSlashArgs0 = Array<any>;
}
declare namespace GEventLoader.prototype{
	// GEventLoader.prototype.getSlashArgs2.!0
	type GetSlashArgs20 = Array<any>;
}
declare namespace GEventLoader.prototype{
	// GEventLoader.prototype.getSlashArgs2.!ret
	
	/**
	 * 
	 */
	interface GetSlashArgs2Ret {
	}
}
declare namespace GEventLoader.prototype{
	// GEventLoader.prototype.inhibit.!0
	
	/**
	 * 
	 */
	interface Inhibit0 {
				
		/**
		 * 
		 */
		clientRequiredPermissions : Array</* GEventLoader.prototype.inhibit.!0.clientRequiredPermissions */ any>;
				
		/**
		 * 
		 */
		userRequiredPermissions : Array</* GEventLoader.prototype.inhibit.!0.userRequiredPermissions */ any>;
				
		/**
		 * 
		 */
		userRequiredRoles : Array</* GEventLoader.prototype.inhibit.!0.userRequiredRoles */ any>;
				
		/**
		 * 
		 */
		userRequiredRole : Array</* GEventLoader.prototype.inhibit.!0.userRequiredRole */ any>;
	}
}
declare namespace GEventLoader.prototype{
	// GEventLoader.prototype.inhibit.!1
	
	/**
	 * 
	 */
	interface Inhibit1 {
				
		/**
		 * 
		 * @param result 
		 * @return  
		 */
		respond(result : any): /* GEventLoader.prototype.Inhibit1.+Promise */ any;
				
		/**
		 * 
		 * @param result 
		 * @return  
		 */
		edit(result : any): /* GEventLoader.prototype.Inhibit1.+Promise */ any;
	}
}
declare namespace GEventLoader.prototype{
	// GEventLoader.prototype.slashRespond.!ret
	
	/**
	 * 
	 */
	interface SlashRespondRet {
				
		/**
		 * 
		 */
		createButtonCollector : /* Promise.:t.createButtonCollector */ any;
				
		/**
		 * 
		 */
		awaitButtons : /* Promise.:t.awaitButtons */ any;
				
		/**
		 * 
		 */
		createSelectMenuCollector : /* Promise.:t.createSelectMenuCollector */ any;
				
		/**
		 * 
		 */
		awaitSelectMenus : /* Promise.:t.awaitSelectMenus */ any;
				
		/**
		 * 
		 */
		delete : /* Promise.:t.delete */ any;
	}
}
declare namespace GEventLoader.prototype{
	// GEventLoader.prototype.slashEdit.!ret
	
	/**
	 * 
	 */
	interface SlashEditRet {
				
		/**
		 * 
		 */
		createButtonCollector : /* Promise.:t.createButtonCollector */ any;
				
		/**
		 * 
		 */
		awaitButtons : /* Promise.:t.awaitButtons */ any;
				
		/**
		 * 
		 */
		createSelectMenuCollector : /* Promise.:t.createSelectMenuCollector */ any;
				
		/**
		 * 
		 */
		awaitSelectMenus : /* Promise.:t.awaitSelectMenus */ any;
				
		/**
		 * 
		 */
		delete : /* Promise.:t.delete */ any;
	}
}

/**
 * The GCommandsEventLoader class
 */
declare interface GEventLoader {
		
	/**
	 * 
	 * @param GCommandsClient 
	 */
	new (GCommandsClient : any);
		
	/**
	 * Internal method to messageEvent
	 * @returns {void}
	 * @private
	 * @return  
	 */
	messageEvent(): any;
		
	/**
	 * Internal method to slashEvent
	 * @returns {void}
	 * @private
	 * @return  
	 */
	slashEvent(): any;
		
	/**
	 * Internal method to loadMoreEvents
	 * @returns {void}
	 * @private
	 * @return  
	 */
	loadMoreEvents(): any;
		
	/**
	 * 
	 * @param channel 
	 * @param interaction 
	 * @param result 
	 * @return  
	 */
	slashRespond(channel : any, interaction : any, result : GEventLoader.prototype.SlashRespond2): GEventLoader.prototype.SlashRespondRet;
		
	/**
	 * 
	 * @param interaction 
	 * @param result 
	 * @return  
	 */
	slashEdit(interaction : any, result : GEventLoader.prototype.SlashEdit1): GEventLoader.prototype.SlashEditRet;
		
	/**
	 * Internal method to getSlashArgs
	 * @returns {object}
	 * @param options 
	 * @return  
	 */
	getSlashArgs(options : GEventLoader.prototype.GetSlashArgs0): Array</*!0.value*/ any>;
		
	/**
	 * 
	 * @param options 
	 * @return  
	 */
	getSlashArgs2(options : GEventLoader.prototype.GetSlashArgs20): GEventLoader.prototype.GetSlashArgs2Ret;
		
	/**
	 * Internal method to inhivit
	 * @returns {object}
	 * @param cmd 
	 * @param data 
	 * @return  
	 */
	inhibit(cmd : GEventLoader.prototype.Inhibit0, data : GEventLoader.prototype.Inhibit1): any;
}

/**
 * 
 */
declare namespace GEventLoader{
	
	/**
	 * 
	 */
	interface Promise {
		
		/**
		 * 
		 */
		t : {
						
			/**
			 * 
			 * @param filter 
			 * @param options 
			 */
			createButtonCollector(filter : any, options : any): void;
						
			/**
			 * 
			 * @param filter 
			 * @param options 
			 */
			awaitButtons(filter : any, options : any): void;
						
			/**
			 * 
			 * @param filter 
			 * @param options 
			 */
			createSelectMenuCollector(filter : any, options : any): void;
						
			/**
			 * 
			 * @param filter 
			 * @param options 
			 */
			awaitSelectMenus(filter : any, options : any): void;
						
			/**
			 * 
			 */
			delete(): void;
		}
	}
}

// Type definitions for ./src/managers/GDatabaseLoader.js
// Project: [LIBRARY_URL_HERE] 
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]> 
// Definitions: https://github.com/borisyankov/DefinitelyTyped

/**
 * 
 */
 declare interface GDatabaseLoader {
		
	/**
	 * 
	 * @param GCommandsClient 
	 */
	new (GCommandsClient : any);
		
	/**
	 * Internal method to dbLoad
	 * @returns {boolean}
	 * @private
	 * @return  
	 */
	__loadDB(): boolean;
		
	/**
	 * 
	 */
	__guildConfig(): void;
}

// Type definitions for ./src/base/GCommandsDispatcher.js
// Project: [LIBRARY_URL_HERE] 
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]> 
// Definitions: https://github.com/borisyankov/DefinitelyTyped

/**
 * The GCommansDispatcher class
 */
 declare interface GCommandsDispatcher {
		
	/**
	 * 
	 * @param client 
	 */
	new (client : any);
		
	/**
	 * Internal method to setGuildPrefix
	 * @returns {boolean}
	 * @param guildId 
	 * @param prefix 
	 * @return  
	 */
	setGuildPrefix(guildId : any, prefix : any): boolean;
		
	/**
	 * Internal method to getGuildPrefix
	 * @returns {String}
	 * @param guildId 
	 * @param cache 
	 * @return  
	 */
	getGuildPrefix(guildId : any, cache : any): /* !this.client.prefix */ any;
		
	/**
	 * Internal method to getCooldown
	 * @returns {String}
	 * @param guildId 
	 * @param userId 
	 * @param command 
	 * @return  
	 */
	getCooldown(guildId : any, userId : any, command : any): any;
		
	/**
	 * Internal method to setGuildLanguage
	 * @param {Snowflake} guildId
	 * @param {Snowflake} userId
	 * @param {Object} command
	 * @returns {boolean}
	 * @param guildId 
	 * @param lang 
	 * @return  
	 */
	setGuildLanguage(guildId : any, lang : any): boolean;
		
	/**
	 * Internal method to getGuildLanguage
	 * @param {Snowflake} guildId
	 * @param {Snowflake} userId
	 * @param {Object} command
	 * @returns {boolean}
	 * @param guildId 
	 * @param cache 
	 * @return  
	 */
	getGuildLanguage(guildId : any, cache : any): /* !this.client.language */ any;
		
	/**
	 * Internal method to addInhibitor
	 * @param {Function} inhibitor
	 * @returns {boolean}
	 * @param inhibitor 
	 * @return  
	 */
	addInhibitor(inhibitor : Function): boolean;
		
	/**
	 * Internal method to removeInhibitor
	 * @returns {Set}
	 * @param inhibitor 
	 * @return  
	 */
	removeInhibitor(inhibitor : any): Set;
		
	/**
	 * Internal method to createButtonCollector
	 * @param {Function} filter
	 * @param {Object} options
	 * @returns {Collector}
	 * @param msg 
	 * @param filter 
	 * @param options 
	 * @return  
	 */
	createButtonCollector(msg : any, filter : Function, options : any): any;
		
	/**
	 * Internal method to createButtonCollector
	 * @param {Function} filter
	 * @param {Object} options
	 * @returns {Collector}
	 * @param msg 
	 * @param filter 
	 * @param options 
	 * @return  
	 */
	awaitButtons(msg : any, filter : Function, options : any): /* GCommandsDispatcher.prototype.+Promise */ any;
		
	/**
	 * Internal method to createSelectMenuCollector
	 * @param {Function} filter
	 * @param {Object} options
	 * @returns {Collector}
	 * @param msg 
	 * @param filter 
	 * @param options 
	 * @return  
	 */
	createSelectMenuCollector(msg : any, filter : Function, options : any): any;
		
	/**
	 * Internal method to createButtonCollector
	 * @param {Function} filter
	 * @param {Object} options
	 * @returns {Collector}
	 * @param msg 
	 * @param filter 
	 * @param options 
	 * @return  
	 */
	awaitSelectMenus(msg : any, filter : Function, options : any): /* GCommandsDispatcher.prototype.+Promise */ any;
}

// Type definitions for ./src/base/GCommandsBase.js
// Project: [LIBRARY_URL_HERE] 
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]> 
// Definitions: https://github.com/borisyankov/DefinitelyTyped

/**
 * The GCommandsBase class
 */
 declare interface GCommandsBase {
		
	/**
	 * 
	 * @return  
	 */
	new (): GCommandsBase;
}

// Type definitions for ./src/base/GCommands.js
// Project: [LIBRARY_URL_HERE] 
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]> 
// Definitions: https://github.com/borisyankov/DefinitelyTyped
// GCommands.!0

/**
 * The main GCommands class
 */
 declare interface GCommands {
		
	/**
	 * 
	 * @param client 
	 * @param options 
	 * @return  
	 */
	new (client : 0, options : any): GCommands;

	/**
	 * 
	 */
	 slash : boolean;
		
	 /**
	  * 
	  */
	 cooldownDefault : number;
}

// Type definitions for ./src/managers/GCommandLoader.js
// Project: [LIBRARY_URL_HERE] 
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]> 
// Definitions: https://github.com/borisyankov/DefinitelyTyped
declare namespace GCommandLoader.prototype{
	// GCommandLoader.prototype.__tryAgain.!1
	
	/**
	 * 
	 */
	interface __tryAgain1 {
				
		/**
		 * 
		 */
		method : string;
		
		/**
		 * 
		 */
		headers : {
						
			/**
			 * 
			 */
			Authorization : string;
						
			/**
			 * 
			 */
			"Content-Type" : string;
		}
				
		/**
		 * 
		 */
		data : string;
				
		/**
		 * 
		 */
		url : string;
	}
}

/**
 * 
 */
declare interface GCommandLoader {
		
	/**
	 * 
	 * @param GCommandsClient 
	 */
	new (GCommandsClient : any);
		
	/**
	 * Internal method to loadCommands
	 * @returns {void}
	 * @private
	 * @return  
	 */
	__loadCommands(): any;
		
	/**
	 * Internal method to createCommands
	 * @returns {void}
	 * @private
	 * @return  
	 */
	__createCommands(): any;
		
	/**
	 * Internal method to tryAgain
	 * @returns {void}
	 * @private
	 * @param cmd 
	 * @param config 
	 * @return  
	 */
	__tryAgain(cmd : any, config : /* GCommandLoader.prototype.__tryAgain1 */ any): any;
		
	/**
	 * Internal method to deleteAllGlobalCmds
	 * @returns {void}
	 * @private
	 * @return  
	 */
	__deleteAllGlobalCmds(): any;
		
	/**
	 * Internal method to deleteAllGuildCmds
	 * @returns {void}
	 * @private
	 * @return  
	 */
	__deleteAllGuildCmds(): any;
}
// Type definitions for ./src/structures/Color.js
// Project: [LIBRARY_URL_HERE] 
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]> 
// Definitions: https://github.com/borisyankov/DefinitelyTyped

/**
 * The Color class
 */
 declare interface Color {
		
	/**
	 * 
	 * @param text 
	 * @param options 
	 */
	new (text : string, options : any);
		
	/**
	 *      * Internal method to getText
	 *      * @returns {json}
	 * 	 * @returns {string}
	 * @return  
	 */
	getText(): any;	
	/**
	 *      * Internal method to getText
	 *      * @returns {json}
	 * 	 * @returns {string}
	 */
	getText();
		
	/**
	 *      * Internal method to getRGB
	 *      * @returns {json}
	 * 	 * @returns {string}
	 * @return  
	 */
	getRGB(): any;	
	/**
	 *      * Internal method to getRGB
	 *      * @returns {json}
	 * 	 * @returns {string}
	 */
	getRGB();
}

// Type definitions for ./src/structures/v12/ButtonCollector.js
// Project: [LIBRARY_URL_HERE] 
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]> 
// Definitions: https://github.com/borisyankov/DefinitelyTyped

/**
 * 
 */
 declare interface ButtonCollector {
		
	/**
	 * 
	 * @param message 
	 * @param filter 
	 * @param options 
	 */
	new (message : any, filter : any, options : any);
		
	/**
	 * 
	 * @param button 
	 */
	collect(button : any): void;
		
	/**
	 * 
	 */
	dispose(): void;
		
	/**
	 * 
	 */
	empty(): void;
		
	/**
	 * 
	 * @return  
	 */
	endReason(): string;
		
	/**
	 * 
	 * @param message 
	 */
	_handleMessageDeletion(message : any): void;
		
	/**
	 * 
	 * @param channel 
	 */
	_handleChannelDeletion(channel : any): void;
		
	/**
	 * 
	 * @param guild 
	 */
	_handleGuildDeletion(guild : any): void;
		
	/**
	 * 
	 * @param button 
	 * @return  
	 */
	key(button : any):  /* error */ any;
}
