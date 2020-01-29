import { Component } from 'rxcomp';
// import { FormAttributes } from 'rxcomp-form';
// export const FormAttributes = ['untouched', 'touched', 'pristine', 'dirty', 'pending', 'enabled', 'disabled', 'valid', 'invalid', 'submitted'];

export default class ControlComponent extends Component {
	onChanges() {
		/*
		const { node } = getContext(this);
		const control = this.control;
		FormAttributes.forEach(x => {
			if (control[x]) {
				node.classList.add(x);
			} else {
				node.classList.remove(x);
			}
			if (control.errors.required) {
				node.classList.add('required');
			} else {
				node.classList.remove('required');
			}
		});
		*/
	}
}

ControlComponent.meta = {
	selector: '[control]',
	inputs: ['control']
};
