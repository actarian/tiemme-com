import { Component } from 'rxcomp';
import { FormControl, FormGroup, Validators } from 'rxcomp-form';
import { takeUntil } from 'rxjs/operators';
import HttpService from '../http/http.service';

/*
Mail
La mail di recap presenterà i dati inseriti dall’utente e come oggetto “Richiesta Informazioni commerciali”

Generazione Mail
•	Romania > tiemmesystems@tiemme.com
•	Spagna > tiemmesistemas@tiemme.com
•	Grecia > customerservice.gr@tiemme.com
•	Albania, Kosovo, Serbia, Montenegro, Bulgaria > infobalkans@tiemme.com
•	Tutti gli altri > info@tiemme.com
*/

export default class RequestInfoCommercialComponent extends Component {

	onInit() {

		this.http = HttpService;
		this.submitted = false;

		const data = window.data || {
			roles: [],
			interests: [],
			countries: [],
			provinces: []
		};

		const form = new FormGroup({
			checkRequest: window.labels.antiforgery,
			firstName: new FormControl(null, Validators.RequiredValidator()),
			lastName: new FormControl(null, Validators.RequiredValidator()),
			email: new FormControl(null, [Validators.RequiredValidator(), Validators.EmailValidator()]),
			company: new FormControl(null, Validators.RequiredValidator()),
			role: new FormControl(null, Validators.RequiredValidator()),
			interests: new FormControl(null, Validators.RequiredValidator()),
			country: new FormControl(null, Validators.RequiredValidator()),
			province: new FormControl(null, Validators.RequiredValidator()),
			message: null,
			checkField: '',
			privacy: new FormControl(null, Validators.RequiredTrueValidator()),
			newsletter: null,
			scope: 'www.website.com',
		});

		const controls = form.controls;
		controls.role.options = data.roles;
		controls.interests.options = data.interests;
		controls.country.options = data.countries;
		controls.province.options = [];
		this.controls = controls;

		form.changes$.pipe(
			takeUntil(this.unsubscribe$)
		).subscribe((changes) => {
			// console.log('RequestInfoCommercialComponent.form.changes$', changes, form.valid);
			const provinces = data.provinces.filter(province => {
				return String(province.idstato) === String(changes.country);
			});
			controls.province.options = provinces;
			controls.province.disabled = provinces.length === 0;
			this.pushChanges();
		});

		this.form = form;
	}

	test() {
		this.form.patch({
			firstName: 'Jhon',
			lastName: 'Appleseed',
			email: 'jhonappleseed@gmail.com',
			company: 'Websolute',
			role: this.controls.role.options[0].id,
			interests: this.controls.interests.options[0].id,
			country: this.controls.country.options[0].id,
			privacy: true,
			checkRequest: window.labels.antiforgery,
			checkField: ''
		});
	}

	reset() {
		this.form.reset();
	}

	onSubmit() {
		// console.log('RequestInfoCommercialComponent.onSubmit', 'form.valid', valid);
		if (this.form.valid) {
			// console.log('RequestInfoCommercialComponent.onSubmit', this.form.value);
			this.form.submitted = true;
			this.http.post$('/WS/wsUsers.asmx/Contact', { data: this.form.value })
				.subscribe(response => {
					console.log('RequestInfoCommercialComponent.onSubmit', response);
					this.form.reset();
					this.submitted = true;
				})
		} else {
			this.form.touched = true;
		}
	}

}

RequestInfoCommercialComponent.meta = {
	selector: '[request-info-commercial]',
};
