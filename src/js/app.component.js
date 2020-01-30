import { Component } from 'rxcomp';

export default class AppComponent extends Component {

	onInit() {
		// const context = getContext(this);
		// console.log('context', context);
	}

	onDropped(id) {
		console.log('AppComponent.onDropped', id);
	}

	// onView() { const context = getContext(this); }

	// onChanges() {}

	// onDestroy() {}
}

AppComponent.meta = {
	selector: '[app-component]',
};
