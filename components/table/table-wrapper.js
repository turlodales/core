import '../colors/colors.js';

import './scroll-wrapper.js';
import './table-col-sort-button.js';

import { css, html, LitElement } from 'lit-element/lit-element.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';
import TableObserverMixin from './table-observer-mixin.js';
import { tableStyles } from './table-styles.js';

export default class TableWrapper extends TableObserverMixin(RtlMixin(LitElement)) {
	static get properties() {
		return {
			stickyHeaders: { type: Boolean, reflect: true },
			/* Styling type, possible options are "default" or "light" */
			type: { type: String, reflect: true }
		};
	}
	static get styles() {
		return [ tableStyles, css`
			:host {
				background-color: transparent;
				display: block;
				width: 100%;
				--d2l-table-border-color: var(--d2l-color-mica);
				--d2l-table-header-background-color: var(--d2l-color-regolith);
				--d2l-table-border-overflow: dashed 1px #d3d9e3;
			}
			d2l-scroll-wrapper {
				--d2l-scroll-wrapper-border-color: var(--d2l-color-galena);
				--d2l-scroll-wrapper-background-color: var(--d2l-color-sylvite);
			}
		`];
	}
	constructor() {
		super();
		this.stickyHeaders = false;
		this.type = 'default';
		this.__tableObserver = null;
		this.addEventListener('d2l-table-local-observer', this._handleLocalObserver);
	}

	firstUpdated() {
		super.firstUpdated();
		this._registerTableObserver();
		this._applyClassNames();
	}

	disconnectedCallback() {
		if (this.__tableObserver !== null) {
			this.__tableObserver.disconnect();
			this.__tableObserver = null;
		}
	}

	attributeChangedCallback(name, oldval, newval) {
		super.attributeChangedCallback();
		if (name === 'stickyheaders' && oldval !== newval) {
			this._applyStickyHeaders(newval);
		}
		if (name === 'type' && oldval !== newval) {
			this.type = newval;
		}
	}

	render() {
		return html`
			<d2l-scroll-wrapper show-actions is-sticky="${this.stickyHeaders}">
				<slot id="slot"></slot>
			</d2l-scroll-wrapper>
		`;
	}

	_applyStickyHeaders(val) {
		if (!val) {
			return;
		}
		this._applySubheadingTop();
		this._applyBodyClass();
	}

	_applySubheadingTop() {
		const topHeader = this.querySelector('.d2l-table tr[header]:first-child th:not([rowspan]), .d2l-table thead tr:first-child th:not([rowspan])');
		if (!topHeader) {
			return;
		}

		const ths = this.querySelectorAll('.d2l-table tr[header]:not(:first-child) th, .d2l-table thead tr:not(:first-child) th');
		for (let i = 0; i < ths.length; i++) {
			ths[i].style.top = `${topHeader.clientHeight - 3}px`;
		}
	}

	_applyBodyClass() {
		if (document.body.classList.contains('d2l-table-sticky-headers')) {
			return;
		}

		document.body.classList.add('d2l-table-sticky-headers');
	}

	_applyClassNames() {

		const table = this.querySelector('.d2l-table');
		if (!table) return;

		let firstRow = null;
		let lastRow = null;
		for (let i = 0; i < table.rows.length; i++) {
			if (firstRow === null) {
				firstRow = table.rows[i];
			}
			lastRow = table.rows[i];
		}

		for (let j = 0; j < table.rows.length; j++) {

			const row = table.rows[j];
			row.classList.toggle('d2l-table-row-first', row === firstRow);
			row.classList.toggle('d2l-table-row-last', row === lastRow);

			for (let k = 0; k < row.cells.length; k++) {
				row.cells[k].classList.toggle('d2l-table-cell-first', k === 0);
				row.cells[k].classList.toggle('d2l-table-cell-last', k === row.cells.length - 1);
			}

		}

	}

	_handleLocalObserver() {
		// children have been added/removed from <slot>,
		// try again to register observer on <table> element
		this._registerTableObserver();
	}

	_registerTableObserver() {

		if (this.__tableObserver) return;

		const table = this.querySelector('.d2l-table');
		if (!table) return;

		// any time a mutation occurs, re-calculate class names
		this.__tableObserver = new MutationObserver((() => {
			this._applyClassNames();
		}));

		// observes mutations to <table>'s direct children and also
		// its subtree (rows or cells added/removed to any descendant)
		this.__tableObserver.observe(table, {
			childList: true,
			subtree: true
		});

	}
}
customElements.define('d2l-table-wrapper', TableWrapper);
