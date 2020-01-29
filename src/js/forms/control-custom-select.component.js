import ControlComponent from './control.component';

export default class ControlCustomSelectComponent extends ControlComponent {

	onInit() {
		this.label = 'label';
		this.labels = window.labels || {};
		this.dropped = false;
	}

	setOption(item) {
		this.control.value = item.id;
	}

	onDropdown(event) {
		console.log('ControlCustomSelectComponent.onDropdown', event);
	}

	getValue() {
		return this.control.value || this.labels.select;
	}

	onClick(event) {
		console.log('ControlCustomSelectComponent.onClick', event);
		this.dropped = true;
		this.pushChanges();
	}

	onClickOutside(event) {
		console.log('ControlCustomSelectComponent.onClickOutside', event);
		this.dropped = false;
		this.pushChanges();
	}

}

ControlCustomSelectComponent.meta = {
	selector: '[control-custom-select]',
	inputs: ['control', 'label'],
	template: /* html */ `
		<div class="group--form--select" (click)="onClick($event)" (clickOutside)="onClickOutside($event)">
			<label [innerHTML]="label"></label>
			<span class="control--select" [innerHTML]="getValue()"></span>
			<svg class="icon icon--caret-down"><use xlink:href="#caret-down"></use></svg>
		</div>
		<errors-component [control]="control"></errors-component>
		<div class="dropdown" [class]="{ dropped: dropped }">
			<div class="category" [innerHTML]="label"></div>
			<ul class="nav--dropdown">
				<li *for="let item of control.options" (click)="setOption(item)"><span [innerHTML]="item.name"></span></li>
			</ul>
		</div>
	`
};
