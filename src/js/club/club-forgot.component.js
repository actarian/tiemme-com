import { Component } from 'rxcomp';
import { FormControl, FormGroup, Validators } from 'rxcomp-form';
import { takeUntil } from 'rxjs/operators';
import HttpService from '../http/http.service';

export default class ClubForgotComponent extends Component {

	onInit() {

		this.http = HttpService;

		const form = new FormGroup({
			email: new FormControl(null, [Validators.RequiredValidator(), Validators.EmailValidator()]),
		});

		const controls = form.controls;
		this.controls = controls;

		form.changes$.pipe(
			takeUntil(this.unsubscribe$)
		).subscribe((changes) => {
			// console.log('ClubForgotComponent.form.changes$', changes, form.valid);
			this.pushChanges();
		});

		this.form = form;
	}

	test() {
		this.form.patch({
			email: 'jhonappleseed@gmail.com',
		});
	}

	onSubmit() {
		const valid = Object.keys(this.form.errors).length === 0;
		// console.log('ClubForgotComponent.onSubmit', 'form.valid', valid);
		if (valid) {
			// console.log('ClubForgotComponent.onSubmit', this.form.value);
			this.form.submitted = true;
			this.http.post$('/WS/wsUsers.asmx/Login', this.form.value)
				.subscribe(response => {
					console.log('ClubForgotComponent.onSubmit', response);
					this.sent.next(true);
					// this.form.reset();
				})
		} else {
			this.form.touched = true;
		}
	}

	onLogin() {
		this.login.next();
	}

	onRegister() {
		this.register.next();
	}

}

ClubForgotComponent.meta = {
	selector: '[club-forgot]',
	outputs: ['sent', 'login', 'register'],
};
