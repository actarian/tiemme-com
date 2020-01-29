import ControlComponent from './control.component';

export default class ControlTextComponent extends ControlComponent {

	onInit() {
		this.label = 'label';
		this.required = false;
	}

}

ControlTextComponent.meta = {
	selector: '[control-text]',
	inputs: ['control', 'label'],
	template: /* html */ `
		<div class="group--form">
			<label [innerHTML]="label"></label>
			<input type="text" class="control--text" [formControl]="control" [placeholder]="label" />
		</div>
		<errors-component [control]="control"></errors-component>
	`
};
