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
		console.log('NaturalFormService.set phrase form', form);
		let action = form.action.options.find(x => x.id === form.action.value);
		if (!action) {
			action = form.action.options[0];
		}
		return action.phrase;
	}

	static get title() {
		let title = this.phrase;
		const form = this.form;
		Object.keys(form).forEach(key => {
			const filter = this.form[key];
			const value = filter.value;
			const items = filter.options || [];
			const item = items.find(x => x.id === value || x.name === value);
			if (item) {
				title = title.replace(`$${key}$`, item.name);
			} else {
				title = title.replace(`$${key}$`, filter.label);
			}
		});
		return title;
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
