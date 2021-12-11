import {IsClass} from './IsClass';

export function ResolveFile(file: any, fileType: string): any {
	if (fileType === '.ts') return file.default || Object.values(file)[0];
	if (fileType === '.js') {
		if (IsClass(file)) return file;
		else return Object.values(file)[0];
	}

	return file;
}
