// components
export interface CustomFile extends File {
	path?: string;
	preview?: string;
	lastModifiedDate?: Date;
}

export default function getFileData(file: CustomFile | string, index?: number) {
	if (typeof file === "string") {
		return {
			key: index ? `${file}-${index}` : file,
			preview: file,
		};
	}

	return {
		key: index ? `${file.name}-${index}` : file.name,
		name: file.name,
		size: file.size,
		path: file.path,
		type: file.type,
		preview: file.preview,
		lastModified: file.lastModified,
		lastModifiedDate: file.lastModifiedDate,
	};
}
