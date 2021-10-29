import { Color } from './Color';

export class GError extends Error {
    public message: string;
    public name: string;

    constructor(name: string, message: string) {
        super(message);
        this.message = new Color(`&c${message}`).getText();
        this.name = new Color(`&a${name}`).getText();
    }
}
