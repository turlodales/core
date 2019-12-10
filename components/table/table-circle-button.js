import '../colors/colors.js';
import '../icons/icon.js';
import { css, html, LitElement } from 'lit-element';

export default class TableCircleButton extends LitElement {
	static get properties() {
		return {
			/**
			 * Name of icon (ex. [iconset-name:icon-id]) for underlying [Polymer iron-iconset-svg](https://github.com/PolymerElements/iron-iconset-svg)
			 */
			icon: { type: String, reflect: true }
		};
	}
	static get styles() {
		return css`
			:host {
				display: inline-block;
				position: absolute;
			}
			button.d2l-table-circle-button::-moz-focus-inner {
				border: 0;
			}
			button.d2l-table-circle-button {
				background-color: var(--d2l-scroll-wrapper-background-color);
				border: 1px solid var(--d2l-scroll-wrapper-border-color);
				border-radius: 50%;
				box-sizing: content-box;
				cursor: pointer;
				display: inline-block;
				font-family: inherit;
				font-size: inherit;
				height: 18px;
				line-height: 0;
				margin: 0;
				padding: 10px;
				text-decoration: none;
				width: 18px;
			}
			button.d2l-table-circle-button:hover,
			button.d2l-table-circle-button:focus {
				border-color: var(--d2l-color-celestine);
				box-shadow: 0 2px 14px 1px rgba(0,0,0,0.06);
				outline-style: none;
			}
			button.d2l-table-circle-button > d2l-icon {
				transition: color 0.3s ease;
			}
		`;
	}

	render() {
		return html`
			<button class="d2l-table-circle-button" type="button">
				<d2l-icon icon="${this.icon}"></d2l-icon>
			</button>
		`;
	}
}
customElements.define('d2l-table-circle-button', TableCircleButton);
