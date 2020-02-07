import { Component } from 'rxcomp';

export default class NaturalFormComponent extends Component {

	onInit() {
		this.views = {
			NATURAL: 0,
			COMMERCIAL: 1,
			CONTACT: 2,
			NEWSLETTER: 3,
			CLUB: 3,
		};
		this.view = this.views.NATURAL;
		this.filters = window.filters || {};
		this.user = null;
		console.log('NaturalFormComponent.onInit', this.filters);
	}

	onNaturalForm(event) {
		console.log('NaturalFormComponent.onNaturalForm', event);
	}

	onNext(event) {
		this.view = this.views.COMMERCIAL;
		this.pushChanges();
	}
}

NaturalFormComponent.meta = {
	selector: '[natural-form]',
};
