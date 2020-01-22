import { Directive, getContext } from 'rxcomp';
import { first, switchMap, takeUntil } from 'rxjs/operators';
import IntersectionService from '../intersection/intersection.service';

export default class AppearDirective extends Directive {

	onChanges() {
		if (!this.appeared) {
			this.appeared = true;
			const { node } = getContext(this);
			IntersectionService.intersection$(node).pipe(
				takeUntil(this.unsubscribe$),
				first(),
			).subscribe(src => {
				node.classList.add('appeared');
			});
		}
	}

}

AppearDirective.meta = {
	selector: '[appear]',
};
