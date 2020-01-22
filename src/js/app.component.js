import { Component, getContext } from 'rxcomp';
import { takeUntil } from 'rxjs/operators';
import DropdownDirective from './dropdown/dropdown.directive';

export default class AppComponent extends Component {

	onInit() {
		const context = getContext(this);
		console.log('context', context);
		this.items = new Array(100).fill(true).map((x, i) => {
			const id = i + 1;
			const title = `Title ${id}`;
			const image = `https://source.unsplash.com/random/700x700?sig=${id}`;
			return { id, title, image };
		});
		DropdownDirective.dropdown$.pipe(
			takeUntil(this.unsubscribe$)
		).subscribe(dropdown => this.dropdownId = dropdown);
	}

	onDropdown(dropdown) {
		console.log('AppComponent', dropdown);
	}

	// onView() { const context = getContext(this); }

	// onChanges() {}

	// onDestroy() {}
}

AppComponent.meta = {
	selector: '[app-component]',
};
