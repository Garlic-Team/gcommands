import { Color } from './Color';

export class GError extends Error {
    public id: string;
    public message: string;

    constructor(id: string, message: string) {
        super(message);
        this.id = id;
        this.message = new Color(`&c${message}`).getText();
    }
}
