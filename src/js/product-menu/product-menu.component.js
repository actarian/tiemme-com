import { Component } from 'rxcomp';

export default class ProductMenuComponent extends Component {

	onInit() {
		this.dropdownId = null;
		// console.log('ProductMenuComponent', this.dropdownId);
	}

	onDropdown($event) {
		// console.log('ProductMenuComponent.onDropdown', $event);
		this.dropdownId = $event;
		this.pushChanges();
	}
}

ProductMenuComponent.meta = {
	selector: '[product-menu]',
};
