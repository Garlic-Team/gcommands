export function ResolveValidationErrorLocate(array: Array<string>) {
	array = array.filter(item => typeof item === 'string');
	return `(${array.join(' -> ') || 'unknown'})`;
}
