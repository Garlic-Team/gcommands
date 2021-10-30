/* eslint-disable no-unused-vars */
export * from '@gcommands/components';
export * from '@gcommands/events';

export * from './base/GCommandsClient';
export * from './structures/Command';

export { LanguageType, CommandType } from './util/Constants';

declare module 'discord.js' {
    export interface Guild {
        data: Record<string, unknown>;
        getData: (options?: { force?: boolean }) => Promise<Record<string, unknown>>;
        setData: (options: object) => Promise<boolean>;
        getCommandPrefix: (options?: { force?: boolean }) => Promise<string>;
        setCommandPrefix: (prefix: string) => Promise<boolean>;
        getLanguage: (options?: { force?: boolean }) => Promise<string>;
        setLanguage: (language: string) => Promise<boolean>;
      }
}
