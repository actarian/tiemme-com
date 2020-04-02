import { Component } from 'rxcomp';
import { first, takeUntil } from 'rxjs/operators';
import { STATIC } from '../environment/environment';
import { FilterMode } from '../filter/filter-item';
import FilterService from '../filter/filter.service';
import HttpService from '../http/http.service';
import ModalService from '../modal/modal.service';

const srcMore = STATIC ? '/tiemme-com/services-bim-modal-more.html' : '/Viewdoc.cshtml?co_id=23649';
const srcHint = STATIC ? '/tiemme-com/services-bim-modal-hint.html' : '/Viewdoc.cshtml?co_id=23649';

export default class BimLibraryComponent extends Component {

	onInit() {
		const items = window.files || [];
		const filters = window.filters || {};
		const initialParams = window.params || {};
		filters.departments.mode = FilterMode.OR;
		filters.catalogues.mode = FilterMode.OR;
		const filterService = new FilterService(filters, initialParams, (key, filter) => {
			switch (key) {
				/*
				case 'languages':
					filter.filter = (item, value) => {
						return item.languages.indexOf(value) !== -1;
					};
					break;
				*/
				default:
					filter.filter = (item, value) => {
						return item.features.indexOf(value) !== -1;
					};
			}
		});
		filterService.items$(items).pipe(
			takeUntil(this.unsubscribe$),
		).subscribe(items => {
			this.items = items;
			this.pushChanges();
			// console.log('BimLibraryComponent.items', items.length);
		});
		this.filterService = filterService;
		this.filters = filterService.filters;
		// this.fake__();
	}

	openMore(event) {
		event.preventDefault();
		ModalService.open$({ src: srcMore, data: null }).pipe(
			takeUntil(this.unsubscribe$)
		).subscribe(event => {
			// console.log('BimLibraryComponent.onRegister', event);
		});
	}

	openHint(event) {
		event.preventDefault();
		ModalService.open$({ src: srcHint, data: null }).pipe(
			takeUntil(this.unsubscribe$)
		).subscribe(event => {
			// console.log('BimLibraryComponent.onRegister', event);
		});
	}

	fake__() {
		HttpService.get$('/api/bim/excel').pipe(
			first()
		).subscribe(items => {
			const departments = [];
			items.forEach(item => {
				const department = departments.find(x => x.value === item.category1Id);
				if (!department) {
					departments.push({
						value: item.category1Id,
						label: this.titleCase__(item.category1Description),
						count: 1,
					});
				} else {
					department.count++;
				}
			});
			departments.sort(function(a, b) {
				return (a.count - b.count) * -1;
			});
			console.log(JSON.stringify(departments.map(x => {
				delete x.count;
				return x;
			})));
			const catalogues = [];
			items.forEach(item => {
				const catalogue = catalogues.find(x => x.value === item.category2Id);
				if (!catalogue) {
					catalogues.push({
						value: item.category2Id,
						label: this.titleCase__(item.category2Description),
						count: 1,
					});
				} else {
					catalogue.count++;
				}
			});
			catalogues.sort(function(a, b) {
				return (a.count - b.count) * -1;
			});
			console.log(JSON.stringify(catalogues.map(x => {
				delete x.count;
				return x;
			})));
			const products = [];
			items.forEach(item => {
				products.push({
					id: item.productId,
					type: 'bim',
					image: item.image,
					code: item.productCode,
					title: item.productName,
					abstract: item.description,
					fileName: item.fileName,
					fileSize: 45000,
					url: 'https://tiemmeraccorderie.wslabs.it/media/files/' + item.fileName,
					features: [item.category1Id, item.category2Id]
				});
			});
			console.log(JSON.stringify(products));
		});
	}

	titleCase__(str) {
		return str.toLowerCase().split(' ').map(function(word) {
			return (word.charAt(0).toUpperCase() + word.slice(1));
		}).join(' ');
	}

}

BimLibraryComponent.meta = {
	selector: '[bim-library]',
};
