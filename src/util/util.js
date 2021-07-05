module.exports = {
    resolveString(data) {
        if (typeof data === 'string') return data;
        if (Array.isArray(data)) return data.join('\n');
        return String(data);
    },

    msToSeconds(ms) {
        let seconds = ms / 1000;
        return seconds;
    },

    parseEmoji(text) {
        if (text.includes('%')) text = decodeURIComponent(text);
        if (!text.includes(':')) return { animated: false, name: text, id: null };
        const m = text.match(/<?(?:(a):)?(\w{2,32}):(\d{17,19})?>?/);
        if (!m) return null;
        return { animated: Boolean(m[1]), name: m[2], id: m[3] || null };
    }
}