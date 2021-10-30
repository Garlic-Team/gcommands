import { GCommandsClient } from '..';
import { Color } from '../structures/Color';
import { InternalEvents } from './Constants';

export function isClass(input: unknown) {
    return typeof input === 'function' &&
    typeof input.prototype === 'object' &&
    input.toString().substring(0, 5) === 'class';
}

export function resolveString(input: unknown) {
    if (typeof input === 'string') return input;
    if (Array.isArray(input)) return input.join('\n');
    return String(input);
}

export function getAllObjects(client: GCommandsClient, ob: object) {
    if (typeof ob !== 'object') return;
    for (const v of Object.values(ob)) {
        if (Array.isArray(v)) {
            getAllObjects(client, v[0]);
        } else if (typeof v === 'object') {
            getAllObjects(client, v);
        } else {
            client.emit(InternalEvents.DEBUG, new Color([
                `&b${v}`,
            ]).getText());
        }
    }
}
