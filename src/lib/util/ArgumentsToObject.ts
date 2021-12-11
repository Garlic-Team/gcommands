export function ArgumentsToObject(options) {
	if (!Array.isArray(options)) return {};
	const args = {};

	for (const o of options) {
		if (['SUB_COMMAND', 'SUB_COMMAND_GROUP'].includes(o.type)) {
			args[o.name] = ArgumentsToObject(o.options);
		} else {
			args[o.name] = o.value;
		}
	}

	return args;
}
