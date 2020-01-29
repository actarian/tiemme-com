import ControlComponent from './control.component';

export default class ControlEmailComponent extends ControlComponent {

	onInit() {
		this.label = 'label';
	}

}

ControlEmailComponent.meta = {
	selector: '[control-email]',
	inputs: ['control', 'label'],
	template: /* html */ `
		<div class="group--form">
			<label [innerHTML]="label"></label>
			<input type="text" class="control--text" [formControl]="control" [placeholder]="label" required email />
		</div>
		<errors-component [control]="control"></errors-component>
	`
};
