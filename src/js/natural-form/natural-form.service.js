import { BehaviorSubject } from 'rxjs';
import { STATIC } from '../environment/environment';

export default class NaturalFormService {

	static get values() {
		const values = {};
		const form = this.form;
		Object.keys(this.form).forEach(key => {
			values[key] = form[key].value;
		});
		return values;
	}

	static set form(form) {
		this.form$.next(form);
	}

	static get form() {
		return this.form$.getValue();
	}

	static get phrase() {
		const form = this.form;
		// console.log('NaturalFormService.set phrase form', form);
		let action = form.action.options.find(x => x.id === form.action.value);
		if (!action) {
			action = form.action.options[0];
		}
		return action.phrase;
	}

	static get title() {
		let phrase = this.phrase;
		const form = this.form;
		Object.keys(form).forEach(key => {
			let label;
			const filter = this.form[key];
			let value = filter.value;
			const items = filter.options || [];
			if (filter.multiple) {
				value = value || [];
				if (value.length) {
					label = value.map(v => {
						const item = items.find(x => x.id === v || x.name === v);
						return item ? item.name : '';
					}).join(', ');
				} else {
					label = filter.label;
				}
			} else {
				const item = items.find(x => x.id === value || x.name === value);
				if (item) {
					label = item.name;
				} else {
					label = filter.label;
				}
			}
			phrase = phrase.replace(`$${key}$`, label);
		});
		return phrase;
	}

	static get clubProfileUrl() {
		return this.form.club.profileUrl;
	}

	static get clubModalUrl() {
		return STATIC ? '/tiemme-com/club-modal.html' : this.form.club.modalUrl;
	}

	static next(form) {
		this.form = form || this.form; // setter & getter
	}

}

NaturalFormService.form$ = new BehaviorSubject(window.naturalForm || {}); // !!! static
