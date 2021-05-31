import '../button/button-icon.js';
import '../dropdown/dropdown-button-subtle.js';
import '../dropdown/dropdown-menu.js';
import '../hierarchical-view/hierarchical-view.js';
import '../list/list.js';
import '../list/list-item.js';
import '../menu/menu.js';
import '../menu/menu-item.js';

import { css, html, LitElement } from 'lit-element/lit-element.js';
import { bodyStandardStyles } from '../typography/styles.js';
import { getFirstFocusableDescendant } from '../../helpers/focus.js';
import { LocalizeCoreElement } from '../../lang/localize-core-element.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';

/**
 * A filter component that contains one or more dimensions a user can filter by.
 * This component is in charge of all rendering.
 * @slot - Dimension components used by the filter to construct the different dimensions locally
 * @fires d2l-filter-change - Dispatched when a dimension's value(s) have changed
 */
class Filter extends LocalizeCoreElement(RtlMixin(LitElement)) {

	static get properties() {
		return {
			/**
			 * Disables the dropdown opener for the filter
			 */
			disabled: { type: Boolean, reflect: true },
			_activeDimensionKey: { type: String, attribute: false },
			_dimensions : { type: Array, attribute: false }
		};
	}

	static get styles() {
		return [bodyStandardStyles, css`
			div[slot="header"] {
				padding: 0.9rem 0.3rem;
			}
			.d2l-filter-dimension-header {
				align-items: center;
				display: flex;
			}
			.d2l-filter-dimension-header-text {
				flex-grow: 1;
				padding-right: calc(2rem + 2px);
				text-align: center;
			}
			:host([dir="rtl"]) .d2l-filter-dimension-header-text {
				padding-left: calc(2rem + 2px);
				padding-right: 0;
			}

			.d2l-filter-dimension-set-value-text {
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
		`];
	}

	constructor() {
		super();
		this.disabled = false;
		this._dimensions = [];
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);
		this.addEventListener('d2l-filter-dimension-data-change', this._handleDimensionDataChange);

		// Prevent these events from bubbling out of the filter
		this.addEventListener('d2l-hierarchical-view-hide-complete', this._stopPropagation);
		this.addEventListener('d2l-hierarchical-view-hide-start', this._stopPropagation);
		this.addEventListener('d2l-hierarchical-view-show-complete', this._stopPropagation);
		this.addEventListener('d2l-hierarchical-view-show-start', this._stopPropagation);
		this.addEventListener('d2l-hierarchical-view-resize', this._stopPropagation);
	}

	render() {
		const header = this._buildHeader();
		const dimensions = this._buildDimensions();

		return html`
			<d2l-dropdown-button-subtle
				@d2l-dropdown-close="${this._handleDropdownClose}"
				@d2l-dropdown-open="${this._stopPropagation}"
				@d2l-dropdown-position="${this._stopPropagation}"
				text="${this.localize('components.filter.filters')}"
				?disabled="${this.disabled}">
				<d2l-dropdown-menu min-width="285" max-width="420" no-padding-header>
					${header}
					<d2l-menu label="${this.localize('components.filter.filters')}">
						${dimensions}
					</d2l-menu>
				</d2l-dropdown-menu>
			</d2l-dropdown-button-subtle>
			<slot @slotchange="${this._handleSlotChange}"></slot>
		`;
	}

	_buildDimension(dimension) {
		let dimensionHTML;
		switch (dimension.type) {
			case 'd2l-filter-dimension-set':
				dimensionHTML = this._createSetDimension(dimension);
				break;
		}
		return html`
			<d2l-hierarchical-view
				@d2l-hierarchical-view-show-complete="${this._handleDimensionShowComplete}"
				@d2l-hierarchical-view-show-start="${this._handleDimensionShowStart}"
				data-key="${dimension.key}">
				${dimensionHTML}
			</d2l-hierarchical-view>
		`;
	}

	_buildDimensions() {
		return this._dimensions.map((dimension) => {
			const builtDimension = this._buildDimension(dimension);
			return html`<d2l-menu-item text="${dimension.text}">
				${builtDimension}
			</d2l-menu-item>`;
		});
	}

	_buildHeader() {
		if (!this._activeDimensionKey) return null;

		const dimensionText = this._dimensions.find(dimension => dimension.key === this._activeDimensionKey).text;
		return html`
			<div slot="header">
				<div class="d2l-filter-dimension-header">
					<d2l-button-icon
						@click="${this._handleDimensionHide}"
						icon="tier1:chevron-left"
						text="${this.localize('components.menu-item-return.returnCurrentlyShowing', 'menuTitle', dimensionText)}">
					</d2l-button-icon>
					<div class="d2l-filter-dimension-header-text d2l-body-standard">${dimensionText}</div>
				</div>
			</div>
		`;
	}

	_createSetDimension(dimension) {
		return html`
			<d2l-list
				@d2l-list-selection-change="${this._handleChangeSetDimension}"
				extend-separators>
				${dimension.values.map(item => html`
					<d2l-list-item
						key="${item.key}"
						selectable
						?selected="${item.selected}"
						slim>
						<div class="d2l-filter-dimension-set-value-text">${item.text}</div>
					</d2l-list-item>
				`)}
			</d2l-list>
		`;
	}

	_dispatchChangeEvent(eventDetail) {
		this.dispatchEvent(new CustomEvent('d2l-filter-change', { bubbles: true, composed: false, detail: eventDetail }));
	}

	_getSlottedNodes(slot) {
		const dimensionTypes = ['d2l-filter-dimension-set'];
		const nodes = slot.assignedNodes({ flatten: true });
		return nodes.filter((node) => node.nodeType === Node.ELEMENT_NODE && dimensionTypes.includes(node.tagName.toLowerCase()));
	}

	_handleChangeSetDimension(e) {
		const dimensionKey = e.composedPath()[0].parentNode.getAttribute('data-key');
		const valueKey = e.detail.key;
		const selected = e.detail.selected;

		this._dispatchChangeEvent({ dimension: dimensionKey, value: { key: valueKey, selected: selected } });
	}

	_handleDimensionDataChange(e) {
		const changes = e.detail.changes;
		const dimension = this._dimensions.find(dimension => dimension.key === e.detail.dimensionKey);
		const value = e.detail.valueKey && dimension.values.find(value => value.key === e.detail.valueKey);
		const toUpdate = value ? value : dimension;

		if (!toUpdate) return;

		let shouldUpdate = false;
		changes.forEach((newValue, prop) => {
			if (toUpdate[prop] !== newValue) {
				toUpdate[prop] = newValue;
				shouldUpdate = true;
			}
		});

		if (shouldUpdate) this.requestUpdate();
	}

	_handleDimensionHide() {
		this.shadowRoot.querySelector(`[data-key="${this._activeDimensionKey}"]`).hide();
		this._activeDimensionKey = null;
	}

	_handleDimensionShowComplete() {
		const dimension = this.shadowRoot.querySelector(`[data-key="${this._activeDimensionKey}"]`);
		const focusable = getFirstFocusableDescendant(dimension);
		if (focusable) {
			focusable.focus();
		}
	}

	_handleDimensionShowStart(e) {
		this._activeDimensionKey = e.detail.sourceView.getAttribute('data-key');
	}

	_handleDropdownClose(e) {
		this._activeDimensionKey = null;
		this._stopPropagation(e);
	}

	_handleSlotChange(e) {
		const dimensionNodes = this._getSlottedNodes(e.target);

		this._dimensions = dimensionNodes.map(dimension => {
			const type = dimension.tagName.toLowerCase();
			const info = {
				key: dimension.key,
				text: dimension.text,
				type: type
			};

			switch (type) {
				case 'd2l-filter-dimension-set': {
					const values = dimension._getValues();
					info.values = values;
					break;
				}
			}

			return info;
		});
	}

	_stopPropagation(e) {
		e.stopPropagation();
	}

}

customElements.define('d2l-filter', Filter);