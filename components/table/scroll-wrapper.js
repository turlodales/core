import '../icons/icon.js';
import './sticky-element.js';
import './table-circle-button.js';
import { css, html, LitElement } from 'lit-element';
import ResizeObserver from 'resize-observer-polyfill/dist/ResizeObserver.es.js';

export default class ScrollWrapper extends LitElement {
	static get properties() {
		return {
			/** Whether this element has a horizontal scrollbar */
			hScrollbar: {
				type: Boolean,
				reflect: true,
				attribute: 'h-scrollbar',
			},

			/** Whether this element is scrolled to the left */
			scrollbarLeft: {
				type: Boolean,
				reflect: true,
				attribute: 'scrollbar-left',
			},

			/** Whether this element is scrolled to the right */
			scrollbarRight: {
				type: Boolean,
				reflect: true,
				attribute: 'scrollbar-right',
			},

			/** The browser doesn't change scroll behavior on RTL. Use for styling buttons and applying mixins on RTL. See scrollRtlReverse and scrollRtlNegative */
			scrollRtlDefault: {
				type: Boolean,
			},
			/** The browser reverses the scrollLeft value on RTL */
			scrollRtlReverse: {
				type: Boolean,
			},
			/** The browser negates the scrollLeft value on RTL */
			scrollRtlNegative: {
				type: Boolean,
			},
			/** The duration for smooth scroll. 0 disables smooth scroll */
			scrollDuration: { type: Number },
			/** The percentage of clientWidth to scroll by on clicking the action buttons */
			scrollAmount: { type: Number },
			/** The icon to use for the start action button (left) */
			startIcon: { type: String },
			/** The icon to use for the end action button (right) */
			endIcon: { type: String },

			isSticky: { type: Boolean, reflect: true, attribute: 'is-sticky' },
			showActions: { type: Boolean, reflect: true, attribute: 'show-actions' },
			needsTable: { type: Boolean, attribute: 'needs-table' },
			checkScrollDeltaValue: { type: Number },
			_stickyIsDisabled: { type: Boolean },
			_role: { type: String }
		};
	}
	static get styles() {
		return css`
			:host {
				display: block;
				width: 100%;
				/* For sticky buttons. Prevents Stickyfill from forcing layout
						changes by setting position itself */
				position: relative;
			}

			.wrapper {
				outline: none;
				overflow-x: auto;
				box-sizing: border-box;
			}

			:host([is-sticky]) .wrapper {
				overflow-x: initial;
			}

			.inner-wrapper {
				/* Used in manager-view */
				/* @apply --d2l-scroll-wrapper-inner;  */
			}

			:host([dir="rtl"][h-scrollbar]) .wrapper,
			:host([h-scrollbar]) .wrapper {
				/* Used in rubrics */
				/* @apply --d2l-scroll-wrapper-h-scroll; */
				border-left: var(--d2l-table-border-overflow);
				border-right: var(--d2l-table-border-overflow);
			}

			:host([is-sticky][h-scrollbar]) .wrapper {
				border-right: none;
			}

			:host([dir="rtl"][scrollbar-right]) .wrapper,
			:host([scrollbar-left]) .wrapper {
				/* Used in rubrics */
				/* @apply --d2l-scroll-wrapper-left; */
				border-left: none;
			}

			:host([dir="rtl"][scrollbar-left]) .wrapper,
			:host([scrollbar-right]) .wrapper {
				/* Used in rubrics */
				/* @apply --d2l-scroll-wrapper-right; */
				border-right: none;
			}

			.action {
				display: inline;
				top: 10px;
			}

			.sticky {
				height: 0;
				/* height of button (40) + distance of button from top (10) + desired spacing (10) */
				margin-bottom: 60px;
				margin-top: -60px;
				overflow: visible;
				display: none;
			}

			:host([dir="rtl"]) .left.action,
			.right.action {
				right: var(--d2l-scroll-wrapper-action-offset, -15px);
				left: auto;
			}

			:host([dir="rtl"]) .right.action,
			.left.action {
				right: auto;
				left: var(--d2l-scroll-wrapper-action-offset, -15px);
			}

			:host([dir="rtl"]) .left,
			.right {
				position: absolute;
				right: 0;
				left: auto;
			}
			:host([dir="rtl"]) .right,
			.left {
				position: absolute;
				left: 0;
				right: auto;
			}

			:host([is-sticky]) .right,
			:host([is-sticky]) .left {
				display: none !important;
			}

			:host([show-actions][h-scrollbar]) .sticky {
				display: block;
			}

			/* Hide the start/end buttons depending on the state */
			:host([show-actions][scrollbar-right]) .right.action,
			:host([show-actions][scrollbar-left]) .left.action {
				display: none;
			}
		`;
	}
	constructor() {
		super();
		this.hScrollbar = false;
		this.scrollbarLeft = true;
		this.scrollbarRight = true;
		this.scrollRtlDefault = false;
		this.scrollRtlReverse = false;
		this.scrollRtlNegative = false;
		this.scrollDuration = 500;
		this.scrollAmount = 0.8;
		this.startIcon = 'd2l-tier1:chevron-left';
		this.endIcon = 'd2l-tier1:chevron-right';
		this.isSticky = false;
		this.needsTable = false;
		/** IE and Edge requires the value to be 1 in some cases **/
		/**
			Background: In some occasions in IE and Edge, there is a
			little deviation in the lowerScrollValue used in checkScrollThresholds for not being 0.
			I have seen it being 1 in IE and Edge. Resulting the scroll arrow icon being shown
			incorrectly when there is no overflow happening in UI.
		**/
		this.checkScrollDeltaValue = 0;
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this.shadowRoot.querySelector('.wrapper').removeEventListener('scroll', this.checkScrollThresholds.bind(this));
		if (this._resizeObserver) {
			this._resizeObserver.disconnect();
			this._resizeObserver = null;
		}
	}

	firstUpdated() {
		super.firstUpdated();
		this.shadowRoot.querySelector('.wrapper').addEventListener('scroll', this.checkScrollThresholds.bind(this));
		this._resizeObserver = this._resizeObserver || new ResizeObserver(entries => {
			for (let i = 0; i < entries.length; i++) {
				this.checkScrollbar();
			}
		});
		const htmlElem = document.documentElement;
		this._resizeObserver.observe(htmlElem);
	}

	attributeChangedCallback(name, oldval, newval) {
		super.attributeChangedCallback();
		if ((name === 'h-scrollbar' || name === 'scrollbar-left' || name === 'scrollbar-right') &&
			oldval !== newval) {
			this._calculateRTL();
		}
	}

	render() {
		return html`
			<d2l-sticky-element class="sticky" ?disabled="${this._stickyIsDisabled}">
				<d2l-table-circle-button class="left action" icon="${this.startIcon}" @click="${this.handleTapLeft}" tabindex="-1" aria-hidden="true" type="button"></d2l-table-circle-button>
				<d2l-table-circle-button class="right action" icon="${this.endIcon}" @click="${this.handleTapRight}" tabindex="-1" aria-hidden="true" type="button"></d2l-table-circle-button>
			</d2l-sticky-element>
			<div id="wrapper" class="wrapper">
				<div class="inner-wrapper" role="${this._role}"><slot></slot></div>
			</div>
		`;
	}

	get isRtl() {
		return this._calculateRTL();
	}

	_calculateRTL() {
		let isRTL = false;

		if (this.querySelector('[dir="rtl"] *')) {
			isRTL = true;
		} else {
			try {
				isRTL = !!this.querySelector(':host-context([dir="rtl"]) *');
			} catch (e) {
				isRTL = false;
			}
		}

		if (isRTL) {
			this._checkRTLScrollType();
		}

		return isRTL;
	}

	_checkRTLScrollType() {
		const scrollType = getScrollType();

		this.scrollRtlDefault = scrollType === 'default';
		this.scrollRtlReverse = scrollType === 'reverse';
		this.scrollRtlNegative = scrollType === 'negative';
	}

	/* Scrolls to the left. Right when dir=rtl */
	handleTapLeft() {
		const scrollDistance = this.shadowRoot.querySelector('.wrapper').clientWidth * this.scrollAmount;
		this.scrollDistance(-scrollDistance, true);
	}

	/* Scrolls to the right. Left when dir=rtl */
	handleTapRight() {
		const scrollDistance = this.shadowRoot.querySelector('.wrapper').clientWidth * this.scrollAmount;
		this.scrollDistance(scrollDistance, true);
	}

	/* Scrolls the set distance. positive === right, negative === left. Reversed when dir=rtl */
	scrollDistance(distance, smooth) {
		if (this.isRtl) {
			if (this.scrollRtlReverse) {
				this.scroll(this.shadowRoot.querySelector('.wrapper').scrollLeft + distance, smooth);
			} else {
				this.scroll(this.shadowRoot.querySelector('.wrapper').scrollLeft - distance, smooth);
			}
		} else {
			this.scroll(this.shadowRoot.querySelector('.wrapper').scrollLeft + distance, smooth);
		}
	}

	/* Sets scrollLeft to the argument. Optionally scroll smoothly. Behavior depends when dir=rtl */
	scroll(left, smooth) {
		if (smooth && this.scrollDuration > 0) {
			const easingFn = function easeOutQuad(t, b, c, d) {
				t /= d;
				return -c * t * (t - 2) + b;
			};
			const animationId = Math.random();
			const duration = this.scrollDuration;
			const startTime = Date.now();
			const currentScrollLeft = this.shadowRoot.querySelector('.wrapper').scrollLeft;
			const deltaScrollLeft = left - currentScrollLeft;
			this._currentAnimationId = animationId;
			(function updateFrame() {
				const now = Date.now();
				const elapsedTime = now - startTime;
				if (elapsedTime > duration) {
					this.shadowRoot.querySelector('.wrapper').scrollLeft = left;
				} else if (this._currentAnimationId === animationId) {
					this.shadowRoot.querySelector('.wrapper').scrollLeft = easingFn(elapsedTime, currentScrollLeft, deltaScrollLeft, duration);
					requestAnimationFrame(updateFrame.bind(this));
				}
			}).call(this);
		} else {
			this.shadowRoot.querySelector('.wrapper').scrollLeft = left;
		}
	}

	checkScrollbar() {
		const hScrollbar = Math.abs(this.shadowRoot.querySelector('.wrapper').offsetWidth - this.shadowRoot.querySelector('.wrapper').scrollWidth);

		this.hScrollbar = hScrollbar > 0 && hScrollbar !== this.checkScrollDeltaValue;
		this.checkScrollThresholds();
	}

	checkScrollThresholds() {
		const lowerScrollValue = this.shadowRoot.querySelector('.wrapper').scrollWidth - this.shadowRoot.querySelector('.wrapper').offsetWidth - Math.abs(this.shadowRoot.querySelector('.wrapper').scrollLeft);

		if (this.isRtl && this.scrollRtlDefault) {
			this.scrollbarRight = this.shadowRoot.querySelector('.wrapper').scrollLeft === 0;
			this.scrollbarLeft = lowerScrollValue <= this.checkScrollDeltaValue;
		} else {
			this.scrollbarLeft = this.shadowRoot.querySelector('.wrapper').scrollLeft === 0;
			this.scrollbarRight = lowerScrollValue <= this.checkScrollDeltaValue;
		}
	}

	get _stickyIsDisabled() {
		return this._computeStickyIsDisabled();
	}

	_computeStickyIsDisabled() {
		return Boolean(this.scrollbarLeft) && Boolean(this.scrollbarRight);
	}

	get _role() {
		return this._computeRole();
	}

	_computeRole() {
		return this.needsTable ? 'table' : null;
	}

}

customElements.define('d2l-scroll-wrapper', ScrollWrapper);

const getScrollType = (function() {
	let type;

	try {
		type = sessionStorage.getItem('d2l-scroll-wrapper-rtl-scroll-type');

		if (typeof type !== 'string'
			|| (type !== 'default'
				&& type !== 'reverse'
				&& type !== 'negative'
			)) {
			type = null;
		}
	} catch (e) {
		type = null;
	}

	return function getScrollType() {
		if (type) {
			return type;
		}
		type = 'reverse';
		const div = document.createElement('div');
		div.innerHTML = '<div dir="rtl" style="font-size: 14px; width: 1px; height: 1px; position: absolute; top: -1000px; overflow: scroll">ABCD</div>';
		const definer = div.firstChild;
		document.body.appendChild(div);
		if (definer.scrollLeft > 0) {
			type = 'default';
		} else {
			definer.scrollLeft = 1;
			if (definer.scrollLeft === 0) {
				type = 'negative';
			}
		}
		document.body.removeChild(div);

		try {
			sessionStorage.setItem('d2l-scroll-wrapper-rtl-scroll-type', type);
		} catch (e) { /* noop */ }

		return type;
	};
})();
