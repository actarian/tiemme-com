import { fromEvent, of } from 'rxjs';
import { filter, finalize, first, map } from 'rxjs/operators';
import { STATIC } from '../environment/environment';

const PATH = STATIC ? './' : '/Client/docs/';

let UID = 0;

export default class ImageService {

	static worker() {
		if (!this.worker_) {
			this.worker_ = new Worker(`${PATH}js/workers/image.service.worker.js`);
		}
		return this.worker_;
	}

	static load$(src) {
		if (!('Worker' in window) || src.indexOf('blob:') === 0) {
			return of(src);
		}
		const id = ++UID;
		const worker = this.worker();
		worker.postMessage({ src, id });
		return fromEvent(worker, 'message').pipe(
			filter(event => event.data.src === src),
			map(event => {
				const url = URL.createObjectURL(event.data.blob);
				return url;
			}),
			first(),
			finalize(url => {
				worker.postMessage({ id });
				URL.revokeObjectURL(url);
			})
		);
	}
}
