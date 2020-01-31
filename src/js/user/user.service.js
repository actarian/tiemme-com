import { BehaviorSubject } from 'rxjs';

export default class UserService {

	static setUser(user) {
		this.user$.next(user);
	}

}

UserService.user$ = new BehaviorSubject(null);
