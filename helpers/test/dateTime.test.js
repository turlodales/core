import { formatDateInISO, formatTimeInISO, getDateFromDateObj, getDateFromISODate, getToday, parseISODate, parseISODateTime, parseISOTime } from '../dateTime.js';
import { expect } from '@open-wc/testing';
import { getDocumentLocaleSettings } from '@brightspace-ui/intl/lib/common.js';
import sinon from 'sinon';

describe('date-time', () => {
	const documentLocaleSettings = getDocumentLocaleSettings();
	documentLocaleSettings.timezone.identifier = 'America/Toronto';

	describe('formatDateInISO', () => {
		it('should return the correct date', () => {
			const date = {
				year: 2020,
				month: 3,
				date: 1
			};
			expect(formatDateInISO(date)).to.equal('2020-03-01');
		});

		it('should return the correct date', () => {
			const date = {
				year: 2020,
				month: 12,
				date: 20
			};
			expect(formatDateInISO(date)).to.equal('2020-12-20');
		});

		it('should throw when incorrect input', () => {
			expect(() => {
				formatDateInISO('hello');
			}).to.throw('Invalid input: Expected input to be object containing year, month, and date');
		});

		it('should throw when no year', () => {
			expect(() => {
				formatDateInISO({ month: 10, date: 20});
			}).to.throw('Invalid input: Expected input to be object containing year, month, and date');
		});

		it('should throw when no month', () => {
			expect(() => {
				formatDateInISO({ year: 2013, date: 20});
			}).to.throw('Invalid input: Expected input to be object containing year, month, and date');
		});

		it('should throw when no date', () => {
			expect(() => {
				formatDateInISO({ year: 2013, month: 3});
			}).to.throw('Invalid input: Expected input to be object containing year, month, and date');
		});
	});

	describe('formatTimeInISO', () => {
		it('should return the correct time', () => {
			const time = {
				hours: 1,
				minutes: 2,
				seconds: 3
			};
			expect(formatTimeInISO(time)).to.equal('01:02:03');
		});

		it('should return the correct date', () => {
			const time = {
				hours: 11,
				minutes: 22,
				seconds: 33
			};
			expect(formatTimeInISO(time)).to.equal('11:22:33');
		});

		it('should throw when incorrect input', () => {
			expect(() => {
				formatTimeInISO('hello');
			}).to.throw('Invalid input: Expected input to be object containing hours, minutes, and seconds');
		});

		it('should throw when no hours', () => {
			expect(() => {
				formatTimeInISO({ minutes: 10, seconds: 20});
			}).to.throw('Invalid input: Expected input to be object containing hours, minutes, and seconds');
		});

		it('should throw when no minutes', () => {
			expect(() => {
				formatTimeInISO({ hours: 2013, seconds: 20});
			}).to.throw('Invalid input: Expected input to be object containing hours, minutes, and seconds');
		});

		it('should throw when no seconds', () => {
			expect(() => {
				formatTimeInISO({ hours: 2013, minutes: 3});
			}).to.throw('Invalid input: Expected input to be object containing hours, minutes, and seconds');
		});
	});

	describe('getDateFromISODate', () => {
		it('should return the correct date', () => {
			expect(getDateFromISODate('2019-01-30')).to.deep.equal(new Date(2019, 0, 30));
		});

		it('should throw when invalid date format', () => {
			expect(() => {
				getDateFromISODate('2019/01/30');
			}).to.throw('Invalid input: Expected format is YYYY-MM-DD');
		});
	});

	describe('getDateFromDateObj', () => {
		it('should return the correct date', () => {
			const date = {
				year: 2020,
				month: 3,
				date: 1
			};
			expect(getDateFromDateObj(date)).to.deep.equal(new Date(2020, 2, 1));
		});

		it('should throw when invalid date format', () => {
			expect(() => {
				getDateFromDateObj();
			}).to.throw();
		});
	});

	describe('getToday', () => {
		let clock;
		beforeEach(() => {
			const newToday = new Date('2018-02-12T20:00:00Z');
			clock = sinon.useFakeTimers(newToday.getTime());
		});

		afterEach(() => {
			clock.restore();
			documentLocaleSettings.timezone.identifier = 'America/Toronto';
		});

		it('should return expected day in America/Toronto timezone', () => {
			expect(getToday()).to.deep.equal({ year: 2018, month: 2, date: 12, hours: 15, minutes: 0, seconds: 0});
		});

		it('should return expected day in Australia/Eucla timezone', () => {
			documentLocaleSettings.timezone.identifier = 'Australia/Eucla';
			expect(getToday()).to.deep.equal({ year: 2018, month: 2, date: 13, hours: 4, minutes: 45, seconds: 0});
		});
	});

	describe('parseISODate', () => {
		it('should return correct date', () => {
			expect(parseISODate('2019-01-30')).to.deep.equal({year: 2019, month: 1, date: 30});
		});

		it('should throw when invalid date format', () => {
			expect(() => {
				parseISODate('2019/01/30');
			}).to.throw('Invalid input: Expected format is YYYY-MM-DD');
		});
	});

	describe('parseISODateTime', () => {
		it('should return correct date if date and time provided', () => {
			expect(parseISODateTime('2019-10-30T12:10:30.000Z')).to.deep.equal({year: 2019, month: 10, date: 30, hours: 12, minutes: 10, seconds: 30});
		});

		it('should throw when invalid date format', () => {
			expect(() => {
				parseISODateTime('2019/01/30');
			}).to.throw('Invalid input: Expected format is YYYY-MM-DD');
		});
	});

	describe('parseISOTime', () => {
		it('should return correct date if date and time provided', () => {
			expect(parseISOTime('12:10:30')).to.deep.equal({hours: 12, minutes: 10, seconds: 30});
		});

		it('should throw when invalid date format', () => {
			expect(() => {
				parseISOTime('12:00');
			}).to.throw('Invalid input: Expected format is HH:MM:SS');
		});
	});

});
