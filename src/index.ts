/* eslint-disable no-unused-vars */
export * from '@gcommands/components';
export * from '@gcommands/events';

export * from './base/GCommandsClient';

export { LanguageType, CommandType } from './util/Constants';

declare module 'discord.js' {
    export interface Guild {
        data: Record<string, unknown>;
        getData: (options?: { force?: boolean }) => Promise<Record<string, unknown>>;
        setData: (options: object) => Promise<boolean>;
      }
}
