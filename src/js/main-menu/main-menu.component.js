import { Component } from 'rxcomp';

export default class MainMenuComponent extends Component {

	onInit() {
		this.sticky = false;
	}

	onToggleSticky(event) {
		this.sticky = !this.sticky;
		const body = document.querySelector('body');
		this.sticky ? body.classList.add('fixed') : body.classList.remove('fixed');
		this.pushChanges();
	}

	onToggleMenu(event) {
		this.toggle.next('main');
	}

	onSearch(url, query) {
		console.log(query);
		window.location.href = `${url}?txtSiteSearch=${query}`;
	}
}

MainMenuComponent.meta = {
	selector: '[main-menu]',
	outputs: ['toggle'],
};
