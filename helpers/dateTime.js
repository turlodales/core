import { convertUTCToLocalDateTime, getDateTimeDescriptor } from '@brightspace-ui/intl/lib/dateTime.js';

// val is an object containing year, month, date
export function formatDateInISO(val) {
	if (!val
		|| !Object.prototype.hasOwnProperty.call(val, 'year')
		|| !Object.prototype.hasOwnProperty.call(val, 'month')
		|| !Object.prototype.hasOwnProperty.call(val, 'date')
	) {
		throw new Error('Invalid input: Expected input to be object containing year, month, and date');
	}

	let month = val.month,
		date = val.date;
	if (val.month.toString().length < 2) month = `0${month}`;
	if (val.date.toString().length < 2) date = `0${date}`;
	return `${val.year}-${month}-${date}`;
}

// val is an object containing hours, minutes, seconds
export function formatTimeInISO(val) {
	if (!val
		|| !Object.prototype.hasOwnProperty.call(val, 'hours')
		|| !Object.prototype.hasOwnProperty.call(val, 'minutes')
		|| !Object.prototype.hasOwnProperty.call(val, 'seconds')
	) {
		throw new Error('Invalid input: Expected input to be object containing hours, minutes, and seconds');
	}

	let hours = val.hours,
		minutes = val.minutes,
		seconds = val.seconds;
	if (hours.toString().length < 2) hours = `0${hours}`;
	if (minutes.toString().length < 2) minutes = `0${minutes}`;
	if (seconds.toString().length < 2) seconds = `0${seconds}`;
	return `${hours}:${minutes}:${seconds}`;
}

export function getDateFromDateObj(val) {
	return new Date(val.year, parseInt(val.month) - 1, val.date);
}

export function getDateFromISODate(val) {
	if (!val) return null;
	const date = parseISODate(val);

	return getDateFromDateObj(date);
}

let dateTimeDescriptor = null;
export function getDateTimeDescriptorShared(refresh) {
	if (!dateTimeDescriptor || refresh) dateTimeDescriptor = getDateTimeDescriptor();
	return dateTimeDescriptor;
}

export function getToday() {
	const val = new Date().toISOString();
	const dateTime = parseISODateTime(val);
	return convertUTCToLocalDateTime(dateTime);
}

export function parseISODate(val) {
	if (!val) return null;
	const re = /([0-9]{4})-([0-9]{2})-([0-9]{2})/;
	const match = val.match(re);
	if (!match || match.length !== 4) {
		throw new Error('Invalid input: Expected format is YYYY-MM-DD');
	}
	return {
		year: parseInt(match[1]),
		month: parseInt(match[2]), // month starts at 1
		date: parseInt(match[3])
	};
}

export function parseISODateTime(val) {
	if (!val) return null;
	const re = /([0-9]{4})-([0-9]{2})-([0-9]{2})T([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2})/;
	const match = val.match(re);
	if (!match || match.length !== 7) {
		throw new Error('Invalid input: Expected format is YYYY-MM-DDTHH:mm:ss.sssZ');
	}

	return {
		year: parseInt(match[1]),
		month: parseInt(match[2]), // month starts at 1
		date: parseInt(match[3]),
		hours: parseInt(match[4]),
		minutes: parseInt(match[5]),
		seconds: parseInt(match[6])
	};
}

export function parseISOTime(val) {
	if (!val) return null;
	const re = /^([0-9]{1,2}):([0-9]{2}):([0-9]{2})?$/;
	const match = val.match(re);
	if (!match || match.length !== 4) {
		throw new Error('Invalid input: Expected format is HH:MM:SS');
	}
	return {
		hours: parseInt(match[1]),
		minutes: parseInt(match[2]),
		seconds: parseInt(match[3])
	};
}
