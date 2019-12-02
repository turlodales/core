const puppeteer = require('puppeteer');
const VisualDiff = require('@brightspace-ui/visual-diff');

describe('d2l-table', () => {

	const visualDiff = new VisualDiff('table-light', __dirname);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await browser.newPage();
		await page.setViewport({width: 800, height: 800, deviceScaleFactor: 2});
		await page.goto(`${visualDiff.getBaseUrl()}/components/table/test/table-light.visual-diff.html`, {waitUntil: ['networkidle0', 'load']});
		await page.bringToFront();
	});

	after(() => browser.close());

	[
		'footer',
		'caption-only',
		'header-and-footer',
		'header-and-caption',
		'footer-and-caption',
		'header-and-footer-and-caption',
		'header-and-colgroup',
		'footer-and-colgroup',
		'active',
		'selected',
		'selected-and-active',
		'sorting-icons',
		'small-table-header-only',
		'scroll-wrapper-visible',
		'large-table'
	].forEach((name) => {
		it(name, async function() {
			const rect = await visualDiff.getRect(page, `#${name}`);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});
	});

});
