import { from } from 'rxjs';

export default class HttpService {

	static http$(method, url, data) {
		const methods = ['POST', 'PUT', 'PATCH'];
		return from(fetch(url, {
			method: method,
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: methods.indexOf(method) !== -1 ? JSON.stringify(data) : undefined
		}).then(response => {
			return response.json();
		}).catch((error) => console.log('postData$', error)));
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
