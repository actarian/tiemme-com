import { Component } from 'rxcomp';

export default class HeaderComponent extends Component {

	onInit() {
		this.menu = null;
		this.dropdownId = null;
		/*
		DropdownDirective.dropdown$.pipe(
			takeUntil(this.unsubscribe$)
		).subscribe(dropdown => this.dropdownId = dropdown);
		*/
	}

	toggleMenu($event) {
		this.menu = this.menu !== $event ? $event : null;
		this.pushChanges();
	}

	onDropped($event) {
		// console.log('HeaderComponent.onDropped', $event);
		this.dropdownId = $event;
		this.pushChanges();
	}
}

HeaderComponent.meta = {
	selector: 'header',
};
