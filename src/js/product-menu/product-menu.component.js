import { Component } from 'rxcomp';

export default class ProductMenuComponent extends Component {

	onInit() {
		this.id = null;
		/*
		DropdownDirective.dropdown$.pipe(
			takeUntil(this.unsubscribe$)
		).subscribe(id => {
			this.id = id;
			// console.log('ProductMenuComponent', this.id);
		});
		*/
	}

	/*
	onDropdown(event) {
		// console.log('ProductMenuComponent.onDropdown', event);
		this.id = event;
		this.pushChanges();
	}
	*/

	onClick(id) {
		// console.log('ProductMenuComponent.onClick', id);
		if (this.id !== id) {
			this.id = id;
			this.pushChanges();
		}
	}

	onClickOutside(id) {
		// console.log('ProductMenuComponent.onClickOutside', id);
		if (this.id === id) {
			this.id = null;
			this.pushChanges();
		}
	}

	isActive(id) {
		// console.log('ProductMenuComponent.isActive', id);
		return this.id === id;
	}
}

ProductMenuComponent.meta = {
	selector: '[product-menu]',
};
