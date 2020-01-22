import { fromEvent, of } from 'rxjs';
import { filter, finalize, first, map } from 'rxjs/operators';

export default class ImageService {

	static worker() {
		if (!this.worker_) {
			this.worker_ = new Worker('./js/workers/image.service.worker.js');
		}
		return this.worker_;
	}

	static load$(src) {
		if ('Worker' in window) {
			const worker = this.worker();
			worker.postMessage(src);
			return fromEvent(worker, 'message').pipe(
				// tap(event => console.log(src, event.data.src)),
				filter(event => event.data.src === src),
				map(event => {
					const url = URL.createObjectURL(event.data.blob);
					// URL.revokeObjectURL(url);
					return url;
				}),
				first(),
				finalize(url => {
					URL.revokeObjectURL(url);
				})
			);
		} else {
			return of(src);
		}
	}

}
