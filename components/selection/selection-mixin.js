import { RtlMixin } from '../../mixins/rtl-mixin.js';

const keyCodes = {
	DOWN: 40,
	LEFT: 37,
	RIGHT: 39,
	UP: 38
};

export class SelectionInfo {

	constructor(keys, state) {
		if (!keys) keys = [];
		if (!state) state = SelectionInfo.states.none;
		this._keys = keys;
		this._state = state;
	}

	get keys() {
		return this._keys;
	}

	get state() {
		return this._state;
	}

	static get states() {
		return {
			none: 'none',
			some: 'some',
			all: 'all'
		};
	}

}

export const SelectionMixin = superclass => class extends RtlMixin(superclass) {

	static get properties() {
		return {
			/**
			 * Whether the selection control is limited to single selection.
			 */
			selectionSingle: { type: Boolean, attribute: 'selection-single' }
		};
	}

	constructor() {
		super();
		this.selectionSingle = false;
		this._selectionObservers = new Map();
		this._selectionSelectables = new Map();
	}

	connectedCallback() {
		super.connectedCallback();
		if (this.selectionSingle) this.addEventListener('keydown', this._handleRadioKeyDown);
		if (this.selectionSingle) this.addEventListener('keyup', this._handleRadioKeyUp);
		this.addEventListener('d2l-selection-change', this._handleSelectionChange);
		this.addEventListener('d2l-selection-select-all-change', this._handleSelectionSelectAllChange);
		this.addEventListener('d2l-selection-observer-subscribe', this._handleSelectionObserverSubscribe);
		this.addEventListener('d2l-selection-input-subscribe', this._handleSelectionInputSubscribe);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		if (this.selectionSingle) this.removeEventListener('keydown', this._handleRadioKeyDown);
		if (this.selectionSingle) this.removeEventListener('keyup', this._handleRadioKeyUp);
		this.removeEventListener('d2l-selection-change', this._handleSelectionChange);
		this.removeEventListener('d2l-selection-select-all-change', this._handleSelectionSelectAllChange);
		this.removeEventListener('d2l-selection-observer-subscribe', this._handleSelectionObserverSubscribe);
		this.removeEventListener('d2l-selection-input-subscribe', this._handleSelectionInputSubscribe);
	}

	getSelectionInfo() {
		const keys = [];
		this._selectionSelectables.forEach(selectable => {
			if (selectable.selected) keys.push(selectable.key);
		});

		let state = SelectionInfo.states.none;
		if (keys.length > 0) {
			if (keys.length === this._selectionSelectables.size) state = SelectionInfo.states.all;
			else state = SelectionInfo.states.some;
		}

		return new SelectionInfo(keys, state);
	}

	unsubscribeObserver(target) {
		this._selectionObservers.delete(target);
	}

	unsubscribeSelectable(target) {
		this._selectionSelectables.delete(target);
		this._updateSelectionObservers();
	}

	_handleRadioKeyDown(e) {
		// check composed path for radio (e.target could be d2l-list-item or other element due to retargeting)
		if (!e.composedPath()[0].classList.contains('d2l-selection-input-radio')) return;
		if (e.keyCode >= keyCodes.LEFT && e.keyCode <= keyCodes.DOWN) {
			e.stopPropagation();
			e.preventDefault();
		}
	}

	_handleRadioKeyUp(e) {
		// check composed path for radio (e.target could be d2l-list-item or other element due to retargeting)
		if (!e.composedPath()[0].classList.contains('d2l-selection-input-radio')) return;
		if (e.keyCode < keyCodes.LEFT || e.keyCode > keyCodes.DOWN) return;

		const selectables = Array.from(this._selectionSelectables.values());
		let currentIndex = selectables.findIndex(selectable => selectable.selected);
		if (currentIndex === -1) currentIndex = 0;
		let newIndex;

		if ((this._dir !== 'rtl' && e.keyCode === keyCodes.RIGHT)
			|| (this._dir === 'rtl' && e.keyCode === keyCodes.LEFT)
			|| e.keyCode === keyCodes.DOWN) {
			if (currentIndex === selectables.length - 1) newIndex = 0;
			else newIndex = currentIndex + 1;
		} else if ((this._dir !== 'rtl' && e.keyCode === keyCodes.LEFT)
			|| (this._dir === 'rtl' && e.keyCode === keyCodes.RIGHT)
			|| e.keyCode === keyCodes.UP) {
			if (currentIndex === 0) newIndex = selectables.length - 1;
			else newIndex = currentIndex - 1;
		}
		selectables[newIndex].selected = true;
		selectables[newIndex].focus();
	}

	_handleSelectionChange(e) {
		if (this.selectionSingle && e.detail.selected) {
			const target = e.composedPath().find(elem => elem.tagName === 'D2L-SELECTION-INPUT');
			this._selectionSelectables.forEach(selectable => {
				if (selectable.selected && selectable !== target) selectable.selected = false;
			});
		}
		this._updateSelectionObservers();
	}

	_handleSelectionInputSubscribe(e) {
		e.stopPropagation();
		e.detail.provider = this;
		const target = e.composedPath()[0];
		if (this._selectionSelectables.has(target)) return;
		this._selectionSelectables.set(target, target);
	}

	_handleSelectionObserverSubscribe(e) {
		e.stopPropagation();
		e.detail.provider = this;
		const target = e.composedPath()[0];
		if (this._selectionObservers.has(target)) return;
		this._selectionObservers.set(target, target);
		this._updateSelectionObservers();
	}

	_handleSelectionSelectAllChange(e) {
		const checked = e.detail.checked;
		this._selectionSelectables.forEach(selectable => selectable.selected = checked);
		this._updateSelectionObservers();
	}

	_updateSelectionObservers() {
		if (!this._selectionObservers || this._selectionObservers.size === 0) return;

		// debounce the updates for select-all case
		if (this._updateObserversRequested) return;

		this._updateObserversRequested = true;
		setTimeout(() => {
			const info = this.getSelectionInfo();
			this._selectionObservers.forEach(observer => observer.selectionInfo = info);
			this._updateObserversRequested = false;
		}, 0);
	}

};
