import { Directive, getContext } from 'rxcomp';
import { first, switchMap, takeUntil } from 'rxjs/operators';
import ImageService from '../image/image.service';
import IntersectionService from '../intersection/intersection.service';

export default class LazyDirective extends Directive {

	/*
	onInit() {
		const { node } = getContext(this);
		console.log('LazyDirective.onInit', node);
		node.classList.add('init');
	}
	*/

	onChanges() {
		if (!this.lazyed) {
			this.lazyed = true;
			const { node } = getContext(this);
			IntersectionService.intersection$(node)
				.pipe(
					takeUntil(this.unsubscribe$),
					first(),
					// tap(() => console.log('LazyDirective.intersection', node)),
					switchMap(() => ImageService.load$(this.lazy))
				)
				.subscribe(src => {
					// console.log('src', src);
					node.setAttribute('src', src);
					node.classList.add('lazyed');
				});
		}
	}

}

LazyDirective.meta = {
	selector: '[[lazy]],[lazy]',
	inputs: ['lazy']
};
