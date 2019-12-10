
import '../icons/icon.js';
import { html, LitElement } from 'lit-element';
export default class TableColSort extends LitElement {
	static get properties() {
		return {
			desc: { type: Boolean },
			icon: { type: String }
		};
	}

	constructor() {
		super();
		this.desc = false;
	}

	get icon() {
		return this.desc ? 'd2l-tier1:arrow-toggle-down' : 'd2l-tier1:arrow-toggle-up';
	}

	render() {
		return html`
			<d2l-icon icon=${this.icon}></d2l-icon>
		`;
	}

}

customElements.define('d2l-table-col-sort', TableColSort);
