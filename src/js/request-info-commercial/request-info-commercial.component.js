import { Component } from 'rxcomp';
import { FormControl, FormGroup, Validators } from 'rxcomp-form';
import { tap } from 'rxjs/operators';

export default class RequestInfoCommercialComponent extends Component {

	onInit() {

		const data = window.data || {
			interests: [],
			contactReasons: [],
			contactTypes: [],
			countries: [],
			provinces: [],
		}

		// console.log('RequestInfoCommercialComponent.countries', data.countries);

		/*
		const countries = new FormControl(null, Validators.RequiredValidator());
		countries.options = data.countries;
		*/

		const form = new FormGroup({
			firstName: new FormControl(null, Validators.RequiredValidator()),
			lastName: new FormControl(null, Validators.RequiredValidator()),
			email: new FormControl(null, [Validators.RequiredValidator(), Validators.EmailValidator()]),
			telephone: new FormControl(null, Validators.RequiredValidator()),
			experience: null,
			company: new FormControl(null),
			interests: new FormControl(null, Validators.RequiredValidator()),
			introduction: new FormControl(null),
			privacy: new FormControl(null, Validators.RequiredValidator()),
			curricula: new FormControl(null, Validators.RequiredValidator()),
			/*
			country: new FormControl(null, Validators.RequiredValidator()),
			province: null,
			*/
		});

		const controls = form.controls;
		controls.interests.options = data.interests;
		this.controls = controls;

		/*
		controls.country.options = data.countries;
		controls.province.options = [];
		*/

		/*
		form.patch({
			firstName: 'Jhon',
			lastName: 'Appleseed',
			email: 'jhonappleseed@gmail.com',
			country: 'en-US'
		});
		*/

		form.changes$.pipe(
			tap(changes => {
				console.log('RequestInfoCommercialComponent.form.changes$', changes, form.valid);
				/*
				const provinces = data.provinces.filter(province => {
					return String(province.idstato) === String(changes.country);
				});
				form.get('province').options = provinces;
				console.log(provinces);
				*/
			})
		).subscribe((changes) => {
			this.pushChanges();
		});

		this.form = form;
	}

	onSubmit() {
		this.form.touched = true;
		if (this.form.valid) {
			console.log('RequestInfoCommercialComponent.onSubmit', this.form.value);
			this.form.submitted = true;
			// this.form.reset();
		}
	}

}

RequestInfoCommercialComponent.meta = {
	selector: '[request-info-commercial]',
};
