import { Component, getContext } from 'rxcomp';
import { FormAttributes } from 'rxcomp-form';

export default class ControlComponent extends Component {

	onChanges() {
		const { node } = getContext(this);
		const control = this.control;
		FormAttributes.forEach(x => {
			if (control[x]) {
				node.classList.add(x);
			} else {
				node.classList.remove(x);
			}
		});
	}

}

ControlComponent.meta = {
	selector: '[control]',
	inputs: ['control']
};
