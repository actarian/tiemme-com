import { Component } from 'rxcomp';
import { takeUntil } from 'rxjs/operators';
import DropdownDirective from './dropdown/dropdown.directive';

export default class AppComponent extends Component {

	onInit() {
		// const context = getContext(this);
		// console.log('context', context);
		DropdownDirective.dropdown$.pipe(
			takeUntil(this.unsubscribe$)
		).subscribe(dropdown => this.dropdownId = dropdown);
	}

	onDropdown(dropdown) {
		console.log('AppComponent.onDropdown', dropdown);
	}

	// onView() { const context = getContext(this); }

	// onChanges() {}

	// onDestroy() {}
}

AppComponent.meta = {
	selector: '[app-component]',
};
