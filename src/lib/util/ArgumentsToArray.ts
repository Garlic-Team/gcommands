export function ArgumentsToArray(options) {
	const args = [];

	const check = (option) => {
		if (!option) return;

		args.push(option.value);

		if (option.options) {
			for (let o = 0; o < option.options.length; o++) {
				check(option.options[o]);
			}
		}
	};

	if (Array.isArray(options)) {
		for (let o = 0; o < options.length; o++) {
			check(options[o]);
		}
	} else {
		check(options);
	}

	return args;
}
