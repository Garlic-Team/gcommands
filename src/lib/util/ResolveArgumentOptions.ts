export function ResolveArgumentOptions(options) {
	for (const [key, value] of Object.entries(options)) {
		const option = key.match(/[A-Z]/g)?.[0] ? key.replace(key.match(/[A-Z]/g)[0], `_${key.match(/[A-Z]/g)[0].toLowerCase()}`) : key;

		if (option !== key) {
			delete options[key];

			options[option] = value;
		}
	}

	return options;
}
