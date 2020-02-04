import { BehaviorSubject } from 'rxjs';

export const FilterMode = {
	EXACT: 'exact',
	AND: 'and',
	OR: 'or',
};

export default class FilterItem {

	constructor(filter) {
		this.change$ = new BehaviorSubject();
		this.mode = FilterMode.EXACT;
		this.values = [];
		if (filter) {
			Object.assign(this, filter);
		}
	}

	filter(item, value) {
		return item.options.indexOf(value) !== -1;
	}

	match(item) {
		let match;
		if (this.mode === FilterMode.OR) {
			match = false;
			this.values.forEach(value => {
				match = match || this.filter(item, value);
			});
		} else {
			match = true;
			this.values.forEach(value => {
				match = match && this.filter(item, value);
			});
		}
		return match;
	}

	getLabel() {
		if (this.mode === FilterMode.EXACT) {
			return this.placeholder || this.label;
		} else {
			return this.label;
		}
	}

	has(item) {
		return this.values.indexOf(item.value) !== -1;
	}

	set(item) {
		const index = this.values.indexOf(item.value);
		if (index === -1) {
			this.values.push(item.value);
		}
		if (this.mode === FilterMode.EXACT) {
			this.placeholder = item.label;
		}
		console.log('FilterItem.set', item);
		this.change$.next(item.value);
	}

	remove(item) {
		const index = this.values.indexOf(item.value);
		if (index !== -1) {
			this.values.splice(index, 1);
		}
		if (this.mode === FilterMode.EXACT) {
			const first = this.options[0];
			this.placeholder = first.label;
		}
		console.log('FilterItem.remove', item);
		this.change$.next(item.value);
	}

	toggle(item) {
		if (this.mode === FilterMode.EXACT) {
			this.values = [];
		}
		if (this.has(item)) {
			this.remove(item);
		} else {
			this.set(item);
		}
	}

}
