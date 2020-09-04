import { Component, getContext } from 'rxcomp';
import { takeUntil } from 'rxjs/operators';
import { STATIC } from './environment/environment';
import HeaderComponent from './header/header.component';
import LocationService from './location/location.service';
import ModalService, { ModalResolveEvent } from './modal/modal.service';
import UserService from './user/user.service';

const src = STATIC ? '/tiemme-com/club-modal.html' : '/Viewdoc.cshtml?co_id=23649';

export default class AppComponent extends Component {

	onInit() {
		const { node } = getContext(this);
		node.classList.remove('hidden');
		// console.log('context', context);
		UserService.user$.pipe(
			takeUntil(this.unsubscribe$)
		).subscribe(user => {
			// console.log('AppComponent.user$', user);
			this.user = user;
			this.pushChanges();
		});
		setTimeout(() => {
			this.parseQueryString();
		}, 500);
	}

	onDropped(id) {
		// console.log('AppComponent.onDropped', id);
	}

	onToggleMenu(event) {
		HeaderComponent.state.menu = HeaderComponent.state.menu !== event ? event : null;
		this.pushChanges();
	}

	parseQueryString() {
		const action = LocationService.get('action');
		switch (action) {
			case 'login':
				this.openLogin();
				break;
			case 'register':
				this.openRegister();
				break;
		}
	}

	openLogin() {
		this.openLoginRegisterModal(1);
	}

	openRegister() {
		this.openLoginRegisterModal(2);
	}

	openLoginRegisterModal(view = 1) {
		ModalService.open$({ src: src, data: { view } }).pipe(
			takeUntil(this.unsubscribe$)
		).subscribe(event => {
			// console.log('RegisterOrLoginComponent.onRegister', event);
			if (event instanceof ModalResolveEvent) {
				UserService.setUser(event.data);
			}
		});
	}

	// onView() { const context = getContext(this); }

	// onChanges() {}

	// onDestroy() {}
}

AppComponent.meta = {
	selector: '[app-component]',
};
