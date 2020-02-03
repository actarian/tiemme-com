import { Component } from 'rxcomp';
import { FormControl, FormGroup, Validators } from 'rxcomp-form';
import { takeUntil } from 'rxjs/operators';
import HttpService from '../http/http.service';

export default class WorkWithUsComponent extends Component {

	onInit() {

		this.http = HttpService;

		const data = window.data || {
			departments: []
		};

		const form = new FormGroup({
			firstName: new FormControl(null, Validators.RequiredValidator()),
			lastName: new FormControl(null, Validators.RequiredValidator()),
			email: new FormControl(null, [Validators.RequiredValidator(), Validators.EmailValidator()]),
			telephone: new FormControl(null, Validators.RequiredValidator()),
			experience: null,
			company: new FormControl(null),
			department: new FormControl(null, Validators.RequiredValidator()),
			introduction: new FormControl(null),
			privacy: new FormControl(null, Validators.RequiredTrueValidator()),
			curricula: new FormControl(null, Validators.RequiredValidator()),
		});

		const controls = form.controls;
		controls.department.options = data.departments;
		this.controls = controls;

		form.changes$.pipe(
			takeUntil(this.unsubscribe$)
		).subscribe((changes) => {
			// console.log('WorkWithUsComponent.form.changes$', changes, form.valid);
			this.pushChanges();
		});

		this.form = form;
	}

	test() {
		this.form.patch({
			firstName: 'Jhon',
			lastName: 'Appleseed',
			email: 'jhonappleseed@gmail.com',
			telephone: '00390721411112',
			experience: false,
			company: 'Websolute',
			department: this.controls.departments.options[0].id,
			introduction: 'Hi!',
			privacy: true,
			curricula: {},
		});
	}

	reset() {
		this.form.reset();
	}

	onSubmit() {
		// console.log('WorkWithUsComponent.onSubmit', 'form.valid', valid);
		if (this.form.valid) {
			// console.log('WorkWithUsComponent.onSubmit', this.form.value);
			this.form.submitted = true;
			this.http.post$('/WS/wsUsers.asmx/Contact', this.form.value)
				.subscribe(response => {
					console.log('WorkWithUsComponent.onSubmit', response);
					this.form.reset();
				})
		} else {
			this.form.touched = true;
		}
	}

}

WorkWithUsComponent.meta = {
	selector: '[work-with-us]',
};
