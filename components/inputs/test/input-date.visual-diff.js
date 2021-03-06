import { getRect, getRectTooltip, open, reset } from './input-helper.js';
import puppeteer from 'puppeteer';
import VisualDiff from '@brightspace-ui/visual-diff';

describe('d2l-input-date', () => {

	const visualDiff = new VisualDiff('input-date', __dirname);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser, { viewport: { width: 800, height: 900 } });
		await page.goto(`${visualDiff.getBaseUrl()}/components/inputs/test/input-date.visual-diff.html`, { waitUntil: ['networkidle0', 'load'] });
		await page.bringToFront();
	});

	after(async() => await browser.close());

	[
		'disabled',
		'empty-text',
		'label',
		'label-hidden',
		'placeholder',
		'required',
		'value'
	].forEach((name) => {
		it(name, async function() {
			const rect = await visualDiff.getRect(page, `#${name}`);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});
	});

	it('value-focus', async function() {
		await page.$eval('#value', (elem) => {
			elem.focus();
			elem._inputTextFocusShowTooltip = true;
		});
		const rect = await getRectTooltip(page, '#value');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('empty-text-focus', async function() {
		await page.$eval('#empty-text', (elem) => elem.focus());
		const rect = await visualDiff.getRect(page, '#empty-text');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	describe('localization', () => {

		after(async() => {
			await page.evaluate(() => document.querySelector('html').setAttribute('lang', 'en'));
		});

		[
			'ar',
			'da',
			'de',
			'en',
			'es',
			'fr',
			'ja',
			'ko',
			'nl',
			'pt',
			'sv',
			'tr',
			'zh',
			'zh-tw'
		].forEach((lang) => {
			it(`${lang} empty`, async function() {
				await page.evaluate(lang => {
					const input = document.querySelector('#placeholder');
					return new Promise((resolve) => {
						input.addEventListener('d2l-localize-behavior-language-changed', resolve, { once: true });
						document.querySelector('html').setAttribute('lang', lang);
					});
				}, lang);
				const rect = await visualDiff.getRect(page, '#placeholder');
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});

			it(`${lang} value`, async function() {
				const rect = await visualDiff.getRect(page, '#value');
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});
		});
	});

	describe('calendar dropdown', () => {
		before(async() => {
			await page.reload();
		});

		it('disabled does not open', async function() {
			await page.$eval('#disabled', (elem) => {
				const input = elem.shadowRoot.querySelector('d2l-input-text');
				const e = new Event(
					'mouseup',
					{ bubbles: true, composed: true }
				);
				input.dispatchEvent(e);
			});
			const rect = await getRect(page, '#disabled');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		describe('with min and max', () => {
			afterEach(async() => {
				await reset(page, '#min-max');
			});

			it('open', async function() {
				await open(page, '#min-max');
				const rect = await getRect(page, '#min-max');
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});

			it('open with enter', async function() {
				await page.$eval('#min-max', (elem) => {
					const input = elem.shadowRoot.querySelector('d2l-input-text');
					const eventObj = document.createEvent('Events');
					eventObj.initEvent('keydown', true, true);
					eventObj.keyCode = 13;
					input.dispatchEvent(eventObj);
				});

				const rect = await getRect(page, '#min-max');
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});

			describe('out of range date typed', () => {
				// min-value="2018-02-13" max-value="2018-02-27"
				before(async() => {
					await page.$eval('#min-max', (elem) => {
						const input = elem.shadowRoot.querySelector('d2l-input-text');
						input.value = '10/12/2017';
						const e = new Event(
							'change',
							{ bubbles: true, composed: false }
						);
						input.dispatchEvent(e);
					});
				});

				describe('behavior', () => {
					beforeEach(async() => {
						await page.$eval('#min-max', (elem) => {
							elem.blur();
						});
					});

					afterEach(async() => {
						await reset(page, '#min-max');
					});

					it('focus', async function() {
						await page.$eval('#min-max', (elem) => {
							const input = elem.shadowRoot.querySelector('d2l-input-text');
							input.focus();
						});
						const rect = await getRectTooltip(page, '#min-max');
						await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
					});

					it('open', async function() {
						await page.$eval('#min-max', (elem) => {
							const input = elem.shadowRoot.querySelector('d2l-input-text');
							const e = new Event(
								'mouseup',
								{ bubbles: true, composed: true }
							);
							input.dispatchEvent(e);
						});
						const rect = await getRect(page, '#min-max');
						await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
					});

					it('open with enter', async function() {
						await page.$eval('#min-max', (elem) => {
							const input = elem.shadowRoot.querySelector('d2l-input-text');
							const eventObj = document.createEvent('Events');
							eventObj.initEvent('keydown', true, true);
							eventObj.keyCode = 13;
							input.dispatchEvent(eventObj);
						});
						const rect = await getRect(page, '#min-max');
						await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
					});

					it('open then tab', async function() {
						await page.$eval('#min-max', (elem) => {
							const input = elem.shadowRoot.querySelector('d2l-input-text');
							const e = new Event(
								'mouseup',
								{ bubbles: true, composed: true }
							);
							input.dispatchEvent(e);
						});
						await page.waitForTimeout(100);
						await page.keyboard.press('Tab');
						const rect = await getRect(page, '#min-max');
						await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
					});
				});

				describe('behavior on key interaction', () => {
					describe('value before min', () => {
						it('left arrow', async function() {
							await page.$eval('#min-max', (elem) => {
								const input = elem.shadowRoot.querySelector('d2l-input-text');
								const eventObj = document.createEvent('Events');
								eventObj.initEvent('keydown', true, true);
								eventObj.keyCode = 13;
								input.dispatchEvent(eventObj);
							});
							await page.keyboard.press('ArrowLeft');
							const rect = await getRect(page, '#min-max');
							await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
						});

						it('right arrow', async function() {
							await page.$eval('#min-max', (elem) => {
								const input = elem.shadowRoot.querySelector('d2l-input-text');
								const eventObj = document.createEvent('Events');
								eventObj.initEvent('keydown', true, true);
								eventObj.keyCode = 13;
								input.dispatchEvent(eventObj);
							});
							await page.keyboard.press('ArrowRight');
							const rect = await getRect(page, '#min-max');
							await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
						});
					});

					describe('value before min same year', () => {
						before(async() => {
							await page.$eval('#min-max', (elem) => {
								const input = elem.shadowRoot.querySelector('d2l-input-text');
								input.value = '01/02/2018';
							});
						});

						it('left arrow', async function() {
							await page.$eval('#min-max', (elem) => {
								const input = elem.shadowRoot.querySelector('d2l-input-text');
								const eventObj = document.createEvent('Events');
								eventObj.initEvent('keydown', true, true);
								eventObj.keyCode = 13;
								input.dispatchEvent(eventObj);
							});
							await page.keyboard.press('ArrowLeft');
							const rect = await getRect(page, '#min-max');
							await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
						});

						it('right arrow', async function() {
							await page.$eval('#min-max', (elem) => {
								const input = elem.shadowRoot.querySelector('d2l-input-text');
								const eventObj = document.createEvent('Events');
								eventObj.initEvent('keydown', true, true);
								eventObj.keyCode = 13;
								input.dispatchEvent(eventObj);
							});
							await page.keyboard.press('ArrowRight');
							const rect = await getRect(page, '#min-max');
							await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
						});
					});

					describe('value after max', () => {
						before(async() => {
							await page.$eval('#min-max', (elem) => {
								const input = elem.shadowRoot.querySelector('d2l-input-text');
								input.value = '01/12/2019';
							});
						});

						after(async() => {
							await page.$eval('#min-max', (elem) => {
								elem.blur();
							});
						});

						it('left arrow', async function() {
							await page.$eval('#min-max', (elem) => {
								const input = elem.shadowRoot.querySelector('d2l-input-text');
								const eventObj = document.createEvent('Events');
								eventObj.initEvent('keydown', true, true);
								eventObj.keyCode = 13;
								input.dispatchEvent(eventObj);
							});
							await page.keyboard.press('ArrowLeft');
							const rect = await getRect(page, '#min-max');
							await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });

						});

						it('right arrow', async function() {
							await page.$eval('#min-max', (elem) => {
								const input = elem.shadowRoot.querySelector('d2l-input-text');
								const eventObj = document.createEvent('Events');
								eventObj.initEvent('keydown', true, true);
								eventObj.keyCode = 13;
								input.dispatchEvent(eventObj);
							});
							await page.keyboard.press('ArrowRight');
							const rect = await getRect(page, '#min-max');
							await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
						});
					});
				});

			});
		});

		describe('with placeholder', () => {
			afterEach(async() => {
				await reset(page, '#placeholder');
			});

			it('open', async function() {
				await open(page, '#placeholder');
				const rect = await getRect(page, '#placeholder');
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});

			it('open with enter', async function() {
				await page.$eval('#placeholder', (elem) => {
					const input = elem.shadowRoot.querySelector('d2l-input-text');
					const eventObj = document.createEvent('Events');
					eventObj.initEvent('keydown', true, true);
					eventObj.keyCode = 13;
					input.dispatchEvent(eventObj);
				});

				const rect = await getRect(page, '#placeholder');
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});
		});

		describe('with value', () => {
			before(async() => {
				await page.reload();
			});

			afterEach(async() => {
				await reset(page, '#value');
			});

			it('open', async function() {
				await open(page, '#value');
				const rect = await getRect(page, '#value');
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});

			it('tab on open', async function() {
				await open(page, '#value');
				await page.keyboard.press('Tab');
				const rect = await getRect(page, '#value');
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});

			it('click date', async function() {
				await open(page, '#value');
				await page.$eval('#value', (elem) => {
					const calendar = elem.shadowRoot.querySelector('d2l-calendar');
					const date = calendar.shadowRoot.querySelector('td[data-date="8"] button');
					date.click();
				});
				const rect = await visualDiff.getRect(page, '#value');
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});

			it('set to today', async function() {
				await page.$eval('#value', (elem) => {
					const button = elem.shadowRoot.querySelector('d2l-button-subtle[text="Set to Today"]');
					button.click();
				});
				const rect = await visualDiff.getRect(page, '#value');
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});

			it('clear', async function() {
				await page.$eval('#value', (elem) => {
					const button = elem.shadowRoot.querySelector('d2l-button-subtle[text="Clear"]');
					button.click();
				});
				const rect = await visualDiff.getRect(page, '#value');
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});

			it('opens then changes month then closes then reopens', async function() {
				// open
				await open(page, '#value');

				// change month
				await page.$eval('#value', (elem) => {
					const calendar = elem.shadowRoot.querySelector('d2l-calendar');
					const button = calendar.shadowRoot.querySelector('d2l-button-icon[text="Show January"]');
					button.click();
				});

				// close
				await reset(page, '#value');

				// re-open
				await open(page, '#value');

				const rect = await getRect(page, '#value');
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});

			it('open with click after text input', async function() {
				await page.$eval('#value', (elem) => {
					const input = elem.shadowRoot.querySelector('d2l-input-text');
					input.value = '01/10/2030';
					const e = new Event(
						'mouseup',
						{ bubbles: true, composed: true }
					);
					input.dispatchEvent(e);
				});
				const rect = await getRect(page, '#value');
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});

			it('open with click after empty text input', async function() {
				await page.$eval('#value', (elem) => {
					const input = elem.shadowRoot.querySelector('d2l-input-text');
					input.value = '';
					const e = new Event(
						'mouseup',
						{ bubbles: true, composed: true }
					);
					input.dispatchEvent(e);
				});
				const rect = await getRect(page, '#value');
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});

			it('open with enter after text input', async function() {
				await page.$eval('#value', (elem) => {
					const input = elem.shadowRoot.querySelector('d2l-input-text');
					input.value = '11/21/2031';
					const eventObj = document.createEvent('Events');
					eventObj.initEvent('keydown', true, true);
					eventObj.keyCode = 13;
					input.dispatchEvent(eventObj);
				});
				const rect = await getRect(page, '#value');
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});

			it('open with enter after empty text input', async function() {
				await page.$eval('#value', (elem) => {
					const input = elem.shadowRoot.querySelector('d2l-input-text');
					input.value = '';
					const eventObj = document.createEvent('Events');
					eventObj.initEvent('keydown', true, true);
					eventObj.keyCode = 13;
					input.dispatchEvent(eventObj);
				});
				const rect = await getRect(page, '#value');
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});

			it('open with down arrow after text input', async function() {
				await page.$eval('#value', (elem) => {
					const input = elem.shadowRoot.querySelector('d2l-input-text');
					input.value = '08/30/2032';
					const eventObj = document.createEvent('Events');
					eventObj.initEvent('keydown', true, true);
					eventObj.keyCode = 40;
					input.dispatchEvent(eventObj);
				});
				const rect = await getRect(page, '#value');
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});

			it('open with down arrow after empty text input', async function() {
				await page.$eval('#value', (elem) => {
					const input = elem.shadowRoot.querySelector('d2l-input-text');
					input.value = '';
					const eventObj = document.createEvent('Events');
					eventObj.initEvent('keydown', true, true);
					eventObj.keyCode = 40;
					input.dispatchEvent(eventObj);
				});
				const rect = await getRect(page, '#value');
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});

			it('open then close', async function() {
				// test to confirm that when focus returns to the input on close the tooltip does not appear
				await page.$eval('#value', (elem) => {
					const input = elem.shadowRoot.querySelector('d2l-input-text');
					const eventObj = document.createEvent('Events');
					eventObj.initEvent('keydown', true, true);
					eventObj.keyCode = 13;
					input.dispatchEvent(eventObj);
				});
				await page.$eval('#value', (elem) => {
					const eventObj = document.createEvent('Events');
					eventObj.initEvent('keyup', true, true);
					eventObj.keyCode = 27;
					elem.dispatchEvent(eventObj);
				});
				const rect = await visualDiff.getRect(page, '#value');
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});
		});

		describe('required', () => {
			before(async() => {
				await page.reload();
			});

			afterEach(async() => {
				await reset(page, '#required');
			});

			it('required focus then blur', async function() {
				await page.$eval('#required', (elem) => elem.focus());
				await page.$eval('#required', (elem) => elem.blur());
				const rect = await visualDiff.getRect(page, '#required');
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});

			it('required focus then blur then fix', async function() {
				await page.$eval('#required', (elem) => elem.focus());
				await page.$eval('#required', (elem) => elem.blur());
				await page.$eval('#required', (elem) => {
					elem.value = '2020-01-01';
					const e = new Event(
						'change',
						{ bubbles: true, composed: false }
					);
					elem.dispatchEvent(e);
				});
				const rect = await visualDiff.getRect(page, '#required');
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});

			it('open required with enter after empty text input', async function() {
				await page.$eval('#required-value', (elem) => {
					const input = elem.shadowRoot.querySelector('d2l-input-text');
					input.value = '';
					const eventObj = document.createEvent('Events');
					eventObj.initEvent('keydown', true, true);
					eventObj.keyCode = 13;
					input.dispatchEvent(eventObj);
				});
				const rect = await getRect(page, '#required-value');
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
				await reset(page, '#required-value');
			});
		});
	});

	describe('skeleton', () => {
		[
			'label',
			'label-hidden'
		].forEach((name) => {
			before(async() => {
				await page.reload();
			});

			it(name, async function() {
				await page.$eval(`#${name}`, (elem) => elem.skeleton = true);
				const rect = await visualDiff.getRect(page, `#${name}`);
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});
		});
	});

});
