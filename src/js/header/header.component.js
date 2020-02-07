import { Component } from 'rxcomp';
import { takeUntil } from 'rxjs/operators';
import UserService from '../user/user.service';

export default class HeaderComponent extends Component {

	onInit() {
		this.menu = null;
		this.submenu = null;
		UserService.user$.pipe(
			takeUntil(this.unsubscribe$)
		).subscribe(user => {
			this.user = user;
			this.pushChanges();
		});
	}

	toggleMenu($event) {
		this.menu = this.menu !== $event ? $event : null;
		this.submenu = null;
		this.pushChanges();
	}

	onDropped(id) {
		console.log('HeaderComponent.onDropped', id);
		this.submenu = id;
		this.pushChanges();
	}

}

HeaderComponent.meta = {
	selector: 'header',
};
