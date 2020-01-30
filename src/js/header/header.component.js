import { Component } from 'rxcomp';

export default class HeaderComponent extends Component {

	onInit() {
		this.menu = null;
	}

	toggleMenu($event) {
		this.menu = this.menu !== $event ? $event : null;
		this.pushChanges();
	}

	onDropped(id) {
		console.log('HeaderComponent.onDropped', id);
	}

}

HeaderComponent.meta = {
	selector: 'header',
};
