import { Component } from 'rxcomp';

export default class MainMenuComponent extends Component {

	onInit() {
		this.sticky = false;
	}

	onToggleSticky(event) {
		this.sticky = !this.sticky;
		this.pushChanges();
	}
}

MainMenuComponent.meta = {
	selector: '[main-menu]',
};
