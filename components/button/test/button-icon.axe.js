import '../button-icon.js';
import { expect, fixture, html, oneEvent } from '@open-wc/testing';

describe('d2l-button-icon', () => {

	it('normal', async() => {
		const el = await fixture(html`<d2l-button-icon icon="tier1:gear" text="Icon Button"></d2l-button-icon>`);
		await expect(el).to.be.accessible();
	});

	it('disabled', async() => {
		const el = await fixture(html`<d2l-button-icon disabled icon="tier1:gear" text="Icon Button"></d2l-button-icon>`);
		await expect(el).to.be.accessible();
	});

	it('disabled-tooltip', async() => {
		const el = await fixture(html`<d2l-button-icon disabled disabled-tooltip="tooltip text" icon="tier1:gear" text="Icon Button"></d2l-button-icon>`);
		await expect(el).to.be.accessible();
	});

	it('focused', async() => {
		const el = await fixture(html`<d2l-button-icon icon="tier1:gear" text="Icon Button"></d2l-button-icon>`);
		setTimeout(() => el.shadowRoot.querySelector('button').focus());
		await oneEvent(el, 'focus');
		await expect(el).to.be.accessible();
	});

});
