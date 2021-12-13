export function StringToBoolean(string) {
    const regex = /^\s*(true|1|on)\s*$/i
    return regex.test(string);
}