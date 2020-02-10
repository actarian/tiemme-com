import { Component, getContext } from 'rxcomp';
import { fromEvent } from 'rxjs';
import { filter, map, takeUntil, tap } from 'rxjs/operators';
import DropdownDirective from '../dropdown/dropdown.directive';

export default class NaturalFormControlComponent extends Component {

	onInit() {
		// console.log('NaturalFormControlComponent.onInit');
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

	onChanges() {
		if (!this.filter.value) {
			const firstId = this.filter.options[0].id;
			this.filter.value = this.filter.multiple ? [firstId] : firstId;
		}
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
		const items = this.filter.options || [];
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
		// console.log('setOption', item);
		if (this.filter.multiple) {
			this.filter.value = this.filter.value || [];
			const index = this.filter.value.indexOf(item.id);
			if (index !== -1) {
				if (this.filter.value.length > 1) {
					this.filter.value.splice(index, 1);
				}
			} else {
				this.filter.value.push(item.id);
			}
		} else {
			this.filter.value = item.id;
			DropdownDirective.dropdown$.next(null);
		}
		this.change.next(this.filter);
		this.pushChanges();
	}

	hasOption(item) {
		if (this.filter.multiple) {
			const values = this.filter.value || [];
			return values.indexOf(item.id) !== -1;
		} else {
			return this.filter.value === item.id;
		}
	}

	onDropped(id) {
		// console.log('NaturalFormControlComponent.onDropped', id);
	}

	getLabel() {
		let value = this.filter.value;
		const items = this.filter.options || [];
		console.log(value, this.filter);
		if (this.filter.multiple) {
			value = value || [];
			if (value.length) {
				return value.map(v => {
					const item = items.find(x => x.id === v || x.name === v);
					return item ? item.name : '';
				}).join(', ');
			} else {
				return this.labels.select;
			}
		} else {
			const item = items.find(x => x.id === value || x.name === value);
			if (item) {
				return item.name;
			} else {
				return this.labels.select;
			}
		}
	}

	onDropped($event) {
		// console.log($event);
		this.dropped = $event === this.dropdownId;
	}

}

NaturalFormControlComponent.meta = {
	selector: '[natural-form-control]',
	inputs: ['filter', 'label'],
	outputs: ['change'],
	template: /* html */ `
		<span [dropdown]="dropdownId" dropdown-trigger=".label" (dropped)="onDropped($event)">
			<span class="label" [innerHTML]="getLabel()"></span>
			<svg class="icon icon--caret-right"><use xlink:href="#caret-right"></use></svg>
		</span>
		<div class="dropdown" [dropdown-item]="dropdownId">
			<div class="category" [innerHTML]="label"></div>
			<ul class="nav--dropdown" [class]="{ multiple: filter.multiple }">
				<li *for="let item of filter.options" (click)="setOption(item)"><span [class]="{ active: hasOption(item) }" [innerHTML]="item.name"></span></li>
			</ul>
		</div>
	`
};
