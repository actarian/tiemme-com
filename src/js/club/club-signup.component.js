import { Component } from 'rxcomp';
import { FormControl, FormGroup, FormValidator, Validators } from 'rxcomp-form';
import { takeUntil } from 'rxjs/operators';
import HttpService from '../http/http.service';

export default class ClubSignupComponent extends Component {

	onInit() {

		this.http = HttpService;

		const data = window.data || {
			roles: [],
			countries: [],
			provinces: [],
		}

		const form = new FormGroup({
			firstName: new FormControl(null, Validators.RequiredValidator()),
			lastName: new FormControl(null, Validators.RequiredValidator()),
			company: new FormControl(null, Validators.RequiredValidator()),
			role: null,
			country: new FormControl(null, Validators.RequiredValidator()),
			province: new FormControl(null, this.RequiredSelect('province')),
			address: new FormControl(null, Validators.RequiredValidator()),
			zipCode: new FormControl(null, Validators.RequiredValidator()),
			city: new FormControl(null, Validators.RequiredValidator()),
			telephone: new FormControl(null, Validators.RequiredValidator()),
			fax: null,
			email: new FormControl(null, [Validators.RequiredValidator(), Validators.EmailValidator()]),
			username: new FormControl(null, [Validators.RequiredValidator()]),
			password: new FormControl(null, [Validators.RequiredValidator()]),
			passwordConfirm: new FormControl(null, [Validators.RequiredValidator(), this.MatchValidator('password')]),
			privacy: new FormControl(null, Validators.RequiredTrueValidator()),
			newsletter: null,
		});

		const controls = form.controls;
		controls.role.options = data.roles;
		controls.country.options = data.countries;
		controls.province.options = [];
		this.controls = controls;

		form.changes$.pipe(
			takeUntil(this.unsubscribe$)
		).subscribe((changes) => {
			// console.log('ClubSignupComponent.form.changes$', changes, form.valid);
			const provinces = data.provinces.filter(province => {
				return String(province.idstato) === String(changes.country);
			});
			controls.province.options = provinces;
			console.log(this.form);
			this.pushChanges();
		});

		this.form = form;
	}

	test() {
		this.form.patch({
			firstName: 'Jhon',
			lastName: 'Appleseed',
			company: 'Websolute',
			role: this.controls.role.options[0].id,
			country: this.controls.country.options[0].id,
			address: 'Strada della Campanara',
			zipCode: '15',
			city: 'Pesaro',
			telephone: '00390721411112',
			email: 'jhonappleseed@gmail.com',
			username: 'username',
			password: 'password',
			passwordConfirm: 'password',
			privacy: true,
		});
	}

	RequiredSelect(fieldName) {
		return new FormValidator((value) => {
			const field = this.form ? this.form.get(fieldName) : null;
			if (!value || !field) {
				return null;
			}
			return field.options.length > 0 && (value == null || value.length === 0) ? { required: true } : null;
		});
	}

	MatchValidator(fieldName) {
		return new FormValidator((value) => {
			const field = this.form ? this.form.get(fieldName) : null;
			if (!value || !field) {
				return null;
			}
			return value !== field.value ? { match: { value: value, match: field.value } } : null;
		});
	}

	onSubmit() {
		const valid = Object.keys(this.form.errors).length === 0;
		// console.log('ClubSignupComponent.onSubmit', 'form.valid', valid);
		if (valid) {
			// console.log('ClubSignupComponent.onSubmit', this.form.value);
			this.form.submitted = true;
			this.http.post$('/WS/wsUsers.asmx/Register', this.form.value)
				.subscribe(response => {
					console.log('ClubSignupComponent.onSubmit', response);
					this.signUp.next(this.form.value); // change to response!!!
					// this.form.reset();
				})
		} else {
			this.form.touched = true;
		}
	}

	onLogin() {
		this.login.next();
	}

}

ClubSignupComponent.meta = {
	selector: '[club-signup]',
	outputs: ['signUp', 'login'],
};
