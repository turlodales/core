import { defineCE, expect, fixture, oneEvent } from '@open-wc/testing';
import { html, LitElement } from 'lit-element/lit-element.js';
import { ListItemDragMixin } from '../list-item-drag-mixin.js';

const tag = defineCE(
	class extends ListItemDragMixin(LitElement) {
		render() {
			return html`
				${this._renderDragHandle()}
				${this._renderDragAction()}
			`;
		}
	}
);

describe('ListItemDragMixin', () => {
	it('Sets checked status to undefined when no key is given', async() => {
		const element = await fixture(`<${tag} draggable="true"></${tag}>`);
		expect(element.draggable).to.be.undefined;
	});

	describe('Events', () => {
		let element;
		beforeEach(async() => {
			element = await fixture(`<${tag} key="1234" draggable="true"></${tag}>`);
		});
		it('dispatches "d2l-list-item-position" when area is dragged', async() => {
			setTimeout(() => {
				const dragArea = element.shadowRoot.querySelector('.d2l-list-item-drag');
				dragArea.dispatchEvent(new Event('change'));
			});

			const { detail } = await oneEvent(element, 'd2l-list-item-position');
			expect(detail.detail).to.equal(null);
			expect(detail.bubbles).to.equal(true);
		});

		it('dispatches "d2l-list-item-position" when action area is clicked', async() => {
			setTimeout(() => {
				const actionArea = element.shadowRoot.querySelector('.d2l-list-item-drag-action');
				actionArea.dispatchEvent(new Event('click'));
			});

			const { detail } = await oneEvent(element, 'd2l-list-item-position');
			expect(detail.detail).to.equal(null);
			expect(detail.bubbles).to.equal(true);
		});

	});
});
