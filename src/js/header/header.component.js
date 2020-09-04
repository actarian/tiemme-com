import { Component } from 'rxcomp';
import { of } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';
import CssService from '../css/css.service';
import DropdownDirective from '../dropdown/dropdown.directive';
import UserService from '../user/user.service';

export default class HeaderComponent extends Component {

	static state = { menu: null };
	get menu() {
		return HeaderComponent.state.menu;
	}
	set menu(menu) {
		HeaderComponent.state.menu = menu;
		// console.log('toggleMenu', this.menu);
		const body = document.querySelector('body');
		menu ? body.classList.add('fixed') : body.classList.remove('fixed');
		DropdownDirective.dropdown$.next(null);
		this.submenu = null;
	}

	onInit() {
		this.submenu = null;
		this.user = null;
		UserService.user$.pipe(
			takeUntil(this.unsubscribe$)
		).subscribe(user => {
			this.user = user;
			this.pushChanges();
		});
		UserService.me$().pipe(
			catchError(() => of(null)),
			takeUntil(this.unsubscribe$)
		).subscribe(user => {
			console.log('user', user);
		});
		CssService.height$().pipe(
			takeUntil(this.unsubscribe$)
		).subscribe(height => {
			// console.log('HeaderComponent.height$', height);
		});
	}

	onChanges() {
		this.menu = HeaderComponent.state.menu;
		// console.log('HeaderComponent.onChanges', this.menu);
	}

	toggleMenu($event) {
		this.menu = this.menu !== $event ? $event : null;
		this.pushChanges();
	}

	onDropped(id) {
		// console.log('HeaderComponent.onDropped', id);
		this.submenu = id;
		this.pushChanges();
	}

}

HeaderComponent.meta = {
	selector: 'header',
};
