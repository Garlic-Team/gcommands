module.exports = {
    resolveString(data) {
        if (typeof data === 'string') return data;
        if (Array.isArray(data)) return data.join('\n');
        return String(data);
    },

    msToSeconds(ms) {
        let seconds = ms / 1000;
        return seconds;
    }
}