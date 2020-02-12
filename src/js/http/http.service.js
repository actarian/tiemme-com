import { from } from 'rxjs';
import { STATIC } from '../environment/environment';

export default class HttpService {

	static getUrl(url) {
		console.log(url);
		return STATIC && url.indexOf('/') === 0 ? `.${url}.json` : url;
	}

	static http$(method, url, data) {
		const methods = ['POST', 'PUT', 'PATCH'];
		return from(fetch(this.getUrl(url), {
			method: method,
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: methods.indexOf(method) !== -1 ? JSON.stringify(data) : undefined
		}).then(response => {
			return response.json();
		}).catch((error) => console.log('HttpService.http$.error', error))); // !!! catched
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

}
