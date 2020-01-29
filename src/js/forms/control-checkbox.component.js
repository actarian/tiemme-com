import ControlComponent from './control.component';

export default class ControlCheckboxComponent extends ControlComponent {

	onInit() {
		this.label = 'label';
	}

}

ControlCheckboxComponent.meta = {
	selector: '[control-checkbox]',
	inputs: ['control', 'label'],
	template: /* html */ `
		<div class="group--form--checkbox">
			<label><input type="checkbox" class="control--checkbox" [formControl]="control" [value]="true"/><span [innerHTML]="label"></span></label>
		</div>
		<errors-component [control]="control"></errors-component>
	`
};
