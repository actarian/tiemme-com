import { Component } from 'rxcomp';

export default class MainMenuComponent extends Component {

	onInit() {
		this.sticky = false;
	}

	onToggleSticky(event) {
		this.sticky = !this.sticky;
		this.pushChanges();
	}

	onSearch(url,query) {
		console.log(query);
		window.location.href = `${url}?txtSiteSearch=${query}`;
	}
}

MainMenuComponent.meta = {
	selector: '[main-menu]',
};
