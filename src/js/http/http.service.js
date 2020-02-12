import { from, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { STATIC } from '../environment/environment';

export default class HttpService {

	static http$(method, url, data) {
		const methods = ['POST', 'PUT', 'PATCH'];
		let response_ = null;
		return from(fetch(this.getUrl(url), {
			method: method,
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: methods.indexOf(method) !== -1 ? JSON.stringify(data) : undefined
		}).then((response) => {
			response_ = response;
			return response.json();
		})).pipe(
			catchError(error => {
				return throwError(this.getError(error, response_));
			})
		);
	}

	static get$(url, data) {
		const query = this.query(data);
		return this.http$('GET', `${url}${query}`);
	}

	static delete$(url) {
		return this.http$('DELETE', url);
	}

	static post$(url, data) {
		return this.http$('POST', url, data);
	}

	static put$(url, data) {
		return this.http$('PUT', url, data);
	}

	static patch$(url, data) {
		return this.http$('PATCH', url, data);
	}

	static query(data) {
		return ''; // todo
	}

	static getUrl(url) {
		// console.log(url);
		return STATIC && url.indexOf('/') === 0 ? `.${url}.json` : url;
	}

	static getError(object, response) {
		let error = {};
		if (!error.statusCode) {
			error.statusCode = response ? response.status : 0;
		}
		if (!error.statusMessage) {
			error.statusMessage = response ? response.statusText : object;
		}
		console.log('HttpService.getError', error, object);
		return error;
	}

}
