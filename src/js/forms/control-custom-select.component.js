import { getContext } from 'rxcomp';
import { fromEvent } from 'rxjs';
import { filter, map, takeUntil, tap } from 'rxjs/operators';
import DropdownDirective from '../dropdown/dropdown.directive';
import ControlComponent from './control.component';

export default class ControlCustomSelectComponent extends ControlComponent {

	onInit() {
		this.label = 'label';
		this.labels = window.labels || {};
		this.dropped = false;
		this.dropdownId = DropdownDirective.nextId();
		this.keyboard$().pipe(
			takeUntil(this.unsubscribe$)
		).subscribe(key => {
			// console.log(key);
		});
	}

	keyboard$() {
		const r = /\w/;
		return fromEvent(document, 'keydown').pipe(
			filter(event => this.dropped && event.key.match(r)),
			// tap(event => console.log(event)),
			map(event => event.key.toLowerCase()),
			tap(key => {
				this.scrollToKey(key);
			})
		)
	}

	scrollToKey(key) {
		const items = this.control.options || [];
		let index = -1;
		for (let i = 0; i < items.length; i++) {
			const x = items[i];
			if (x.name.toLowerCase().substr(0, 1) === key) {
				index = i;
				break;
			}
		}
		if (index !== -1) {
			const { node } = getContext(this);
			const dropdown = node.querySelector('.dropdown');
			const navDropdown = node.querySelector('.nav--dropdown');
			const item = navDropdown.children[index];
			dropdown.scroll(0, item.offsetTop);
		}
	}

	setOption(item) {
		this.control.value = item.id;
	}

	onDropped(id) {
		// console.log('ControlCustomSelectComponent.onDropped', id);
	}

	getLabel() {
		const value = this.control.value;
		const items = this.control.options || [];
		const item = items.find(x => x.id === value || x.name === value);
		if (item) {
			return item.name;
		} else {
			return this.labels.select;
		}
	}

	onDropped($event) {
		console.log($event);
		this.dropped = $event === this.dropdownId;
	}

	/*
	onClick(event) {
		const { node } = getContext(this);
		node.querySelector('.dropdown').classList.add('dropped');
	}
	*/

	/*
	onClickOutside(event) {
		const { node } = getContext(this);
		node.querySelector('.dropdown').classList.remove('dropped');
	}
	*/

}

ControlCustomSelectComponent.meta = {
	selector: '[control-custom-select]',
	inputs: ['control', 'label'],
	template: /* html */ `
		<div class="group--form--select" [class]="{ required: control.validators.length }" [dropdown]="dropdownId" (dropped)="onDropped($event)">
			<label [innerHTML]="label"></label>
			<span class="control--select" [innerHTML]="getLabel()"></span>
			<svg class="icon icon--caret-down"><use xlink:href="#caret-down"></use></svg>
			<span class="required__badge">required</span>
		</div>
		<errors-component [control]="control"></errors-component>
		<div class="dropdown" [dropdown-item]="dropdownId">
			<div class="category" [innerHTML]="label"></div>
			<ul class="nav--dropdown">
				<li *for="let item of control.options" (click)="setOption(item)"><span [innerHTML]="item.name"></span></li>
			</ul>
		</div>
	`
	/*  (click)="onClick($event)" (clickOutside)="onClickOutside($event)" */
	/*  <!-- <div class="dropdown" [class]="{ dropped: dropped }"> --> */
};
