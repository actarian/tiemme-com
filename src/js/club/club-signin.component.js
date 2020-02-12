import { Component } from 'rxcomp';
import { FormControl, FormGroup, Validators } from 'rxcomp-form';
import { takeUntil } from 'rxjs/operators';
import UserService from '../user/user.service';

export default class ClubSigninComponent extends Component {

	onInit() {
		const data = window.data || {
			interests: []
		};

		const form = new FormGroup({
			username: new FormControl(null, Validators.RequiredValidator()),
			password: new FormControl(null, Validators.RequiredValidator()),
			checkRequest: window.antiforgery,
			checkField: ''
		});

		const controls = form.controls;
		this.controls = controls;

		form.changes$.pipe(
			takeUntil(this.unsubscribe$)
		).subscribe((changes) => {
			// console.log('ClubSigninComponent.form.changes$', changes, form.valid);
			this.pushChanges();
		});

		this.form = form;
	}

	test() {
		this.form.patch({
			username: 'username',
			password: 'password',
			checkRequest: window.antiforgery,
			checkField: ''
		});
	}

	reset() {
		this.form.reset();
	}

	onSubmit() {
		// console.log('ClubSigninComponent.onSubmit', 'form.valid', valid);
		if (this.form.valid) {
			// console.log('ClubSigninComponent.onSubmit', this.form.value);
			this.form.submitted = true;
			// HttpService.post$('/api/users/Login', this.form.value)
			UserService.login$(this.form.value)
				.subscribe(response => {
					console.log('ClubSigninComponent.onSubmit', response);
					this.signIn.next(this.form.value); // change to response!!!
					// this.form.reset();
				});
		} else {
			this.form.touched = true;
		}
	}

	onForgot() {
		this.forgot.next();
	}

	onRegister() {
		this.register.next();
	}

}

ClubSigninComponent.meta = {
	selector: '[club-signin]',
	outputs: ['signIn', 'forgot', 'register'],
};
