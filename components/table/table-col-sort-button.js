import './table-col-sort.js';
import { css, html, LitElement } from 'lit-element';

export default class TableColSortButton extends LitElement {
	static get properties() {
		return {
			desc: { type: Boolean },
			nosort: { type: Boolean }
		};
	}
	static get styles() {
		return css`
			button::-moz-focus-inner {
				border: 0;
			}
			button {
				font-family: inherit;
				background-color: transparent;
				border: none;
				cursor: pointer;
				display: inline-block;
				font-size: inherit;
				color: inherit;
				letter-spacing: inherit;
				margin: 0;
				padding: 0;
				text-decoration: none;
			}
			button:disabled {
				opacity: 0.5;
			}
			button:hover,
			button:focus {
				outline-style: none;
				text-decoration: underline;
			}
			[hidden] {
				display: none;
			}
		`;
	}
	constructor() {
		super();
		this.nosort = false;
	}

	render() {
		return html`
		<button type="button">
			<slot></slot>
			<d2l-table-col-sort ?hidden="${this.nosort}" ?desc="${this.desc}"></d2l-table-col-sort>
		</button>
		`;
	}

}

customElements.define('d2l-table-col-sort-button', TableColSortButton);
