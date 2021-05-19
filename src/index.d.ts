import { Client } from 'discord.js'

export class GCommands {
    constructor(client: Client, {
        cmdDir: string,
        eventDir: string,
        language: string,
        unkownCommandMessage: boolean,
        slash: {
            slash: string,
            prefix: string
        },
        defaultCooldown: integer,
        database: {
            type: string,
            url: string
        }
    })
} 

export class Buttons {
    constructor({buttons:object})
}