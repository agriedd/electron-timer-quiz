

export type TimeObject = {
	value: number,
	label: string,
}

export interface TimeFormat {
	hours: TimeObject,
	minutes: TimeObject,
	seconds: TimeObject,
	ms: TimeObject
}