import { Component } from 'rxcomp';
import { takeUntil } from 'rxjs/operators';
import UserService from '../user/user.service';

export default class ReservedAreaComponent extends Component {

	onInit() {
		UserService.me$().pipe(
			takeUntil(this.unsubscribe$)
		).subscribe(user => {
			this.user = user;
		});
	}

	doLogout(event) {
		UserService.logout$().subscribe(() => {
			this.user = null;
			window.location.href = '/';
		});
	}

}

ReservedAreaComponent.meta = {
	selector: '[reserved-area]',
};
