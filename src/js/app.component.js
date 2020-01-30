import { Component } from 'rxcomp';
import { takeUntil } from 'rxjs/operators';
import DropdownDirective from './dropdown/dropdown.directive';

export default class AppComponent extends Component {

	onInit() {
		// const context = getContext(this);
		// console.log('context', context);
		DropdownDirective.dropdown$.pipe(
			takeUntil(this.unsubscribe$)
		).subscribe(dropdownId => this.dropdownId = dropdownId);
	}

	onDropped(dropdown) {
		console.log('AppComponent.onDropped', dropdown);
	}

	// onView() { const context = getContext(this); }

	// onChanges() {}

	// onDestroy() {}
}

AppComponent.meta = {
	selector: '[app-component]',
};
