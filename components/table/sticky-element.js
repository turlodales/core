import 'stickyfilljs/dist/stickyfill.min.js';
import { css, html, LitElement } from 'lit-element';

/* global Stickyfill */
export default class StickyElement extends LitElement {
	static get properties() {
		return {
			disabled: { type: Boolean }
		};
	}
	static get styles() {
		return css`
			:host {
				position: -webkit-sticky;
				position: sticky;
				top: 0;
				z-index: 4;
				line-height: 0;
			}
		`;
	}

	attributeChangedCallback(name, oldval, newval) {
		super.attributeChangedCallback();
		if (name === 'disabled' && oldval !== newval) {
			this._updateSticky();
		}
	}

	firstUpdated() {
		super.firstUpdated();
		this._updateSticky();
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		try {
			this._ensureStickyRemoved();
		} catch (e) {
			return;
		}
	}

	render() {
		return html`<slot></slot>`;
	}

	_ensureStickyAdded() {
		if (this._sticky) return;
		this._sticky = Stickyfill.addOne(this);
	}

	_ensureStickyRemoved() {
		if (!this._sticky) return;
		// If remove fails, still unset _sticky.
		const tmp = this._sticky;
		this._sticky = null;
		tmp.remove();
	}

	_updateSticky() {
		/**
		 * Stickyfill requires the component to be attached to the DOM
		 * in order to work. If the component is not attached, the attached
		 * method will handle initialization
		 */
		const sticky = !this.disabled;
		try {
			if (sticky) {
				this._ensureStickyAdded();
			} else {
				this._ensureStickyRemoved();
			}
		} catch (e) {
			return;
		}
	}
}
customElements.define('d2l-sticky-element', StickyElement);
