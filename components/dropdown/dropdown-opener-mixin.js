export const DropdownOpenerMixin = superclass => class extends superclass {

	static get properties() {
		return {
			isDropdownOpener: {
				type: Boolean
			},
			noAutoOpen: {
				type: Boolean,
				reflect: true
			},
			disabled: {
				type: Boolean,
				reflect: true
			}
		};
	}

	constructor() {
		super();
		this.isDropdownOpener = true;
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);

		const opener = this.getOpenerElement();
		const content = this.__getContentElement();
		if (!opener) {
			return;
		}
		opener.setAttribute('aria-haspopup', 'true');
		opener.addEventListener('keypress', this.__onKeyPress.bind(this));
		opener.addEventListener('mouseup', this.__onMouseUp.bind(this));
		opener.setAttribute('aria-expanded', (content && content.opened || false).toString());
	}

	/**
	 * Gets the opener element (required by d2l-dropdown behavior).
	 * @return {HTMLElement}
	 */
	getOpenerElement() {
		return this;
	}

	/**
	 * Toggles the visible state of the dropdown. If open, it will close, and vice versa.
	 * @param {Boolean} applyFocus Whether focus should be automatically move to first focusable upon opening.
	 */
	toggleOpen(applyFocus) {
		if (this.disabled) {
			return;
		}

		const content = this.__getContentElement();
		if (!content) {
			return;
		}
		content.toggleOpen(applyFocus);
	}

	__onKeyPress(e) {
		if (e.keyCode !== 13) {
			return;
		}
		if (this.noAutoOpen) {
			return;
		}
		this.toggleOpen(true);
	}

	__onMouseUp() {
		if (this.noAutoOpen) {
			return;
		}
		this.toggleOpen(false);
	}

	__getContentElement() {
		return this.shadowRoot.querySelector('slot').assignedNodes().find(
			node => node.nodeType === 1 && node.nodeName === 'D2L-DROPDOWN-CONTENT'
		);
	}
};
