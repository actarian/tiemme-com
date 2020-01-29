import { Component } from 'rxcomp';
import { FormControl, FormGroup, Validators } from 'rxcomp-form';
import { tap } from 'rxjs/operators';

export default class WorkWithUsComponent extends Component {

	onInit() {

		const data = window.data || {
			interests: []
		};

		const form = new FormGroup({
			firstName: new FormControl(null, Validators.RequiredValidator()),
			lastName: new FormControl(null, Validators.RequiredValidator()),
			email: new FormControl(null, [Validators.RequiredValidator(), Validators.EmailValidator()]),
			telephone: new FormControl(null, Validators.RequiredValidator()),
			experience: null,
			company: new FormControl(null),
			interests: new FormControl(null, Validators.RequiredValidator()),
			introduction: new FormControl(null),
			privacy: new FormControl(null, Validators.RequiredTrueValidator()),
			curricula: new FormControl(null, Validators.RequiredValidator()),
		});

		const controls = form.controls;
		controls.interests.options = data.interests;
		this.controls = controls;

		form.changes$.pipe(
			tap(changes => {
				console.log('WorkWithUsComponent.form.changes$', changes, form.valid);
			})
		).subscribe((changes) => {
			this.pushChanges();
		});

		this.form = form;
	}

	onSubmit() {
		this.form.touched = true;
		if (this.form.valid) {
			console.log('WorkWithUsComponent.onSubmit', this.form.value);
			this.form.submitted = true;
			// this.form.reset();
		}
	}

}

WorkWithUsComponent.meta = {
	selector: '[work-with-us]',
};
