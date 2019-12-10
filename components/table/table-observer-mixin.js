export default superclass => class extends superclass {
	static get properties() {
		return {
			__localObserver: { type: Object }
		};
	}

	constructor() {
		super();
		this.__localObserver = null;
	}

	firstUpdated() {
		super.firstUpdated();
		// observes children being added/removed from <slot>
		this.__localObserver = new MutationObserver((() => {
			this.dispatchEvent(new CustomEvent('d2l-table-local-observer', {bubbles: true, composed: true}));
		}));
		this.__localObserver.observe(this.querySelector('.d2l-table'), {
			subtree: true,
			childList: true
		});
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		if (this.__localObserver !== null) {
			this.__localObserver.disconnect();
			this.__localObserver = null;
		}
	}
};
