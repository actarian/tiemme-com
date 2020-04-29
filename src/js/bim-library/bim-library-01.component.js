import { Component } from 'rxcomp';
import { first, takeUntil } from 'rxjs/operators';
import { STATIC } from '../environment/environment';
import { FilterMode } from '../filter/filter-item';
import FilterService from '../filter/filter.service';
import HttpService from '../http/http.service';
import ModalService from '../modal/modal.service';

const srcMore = STATIC ? '/tiemme-com/services-bim-modal-more.html' : '/Viewdoc.cshtml?co_id=25206';
const srcHint = STATIC ? '/tiemme-com/services-bim-modal-hint.html' : '/Viewdoc.cshtml?co_id=25207';

export default class BimLibrary01Component extends Component {

	onInit() {
		const items = window.files || [];
		const filters = window.filters || {};
		const initialParams = window.params || {};
		filters.departments.mode = FilterMode.OR;
		filters.catalogues.mode = FilterMode.OR;
		// filters.extensions.mode = FilterMode.OR;
		const filterService = new FilterService(filters, initialParams, (key, filter) => {
			switch (key) {
				case 'extensions':
					filter.filter = (item, value) => {
						return item.files.find(x => x.fileExtension === value);
					};
					break;
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
			// console.log('BimLibrary01Component.items', items.length);
		});
		this.filterService = filterService;
		this.filters = filterService.filters;
		this.visibleFilters = {
			departments: filterService.filters.departments
		};
		this.fake__();
	}

	openMore(event) {
		event.preventDefault();
		ModalService.open$({ src: srcMore, data: null }).pipe(
			takeUntil(this.unsubscribe$)
		).subscribe(event => {
			// console.log('BimLibrary01Component.onRegister', event);
		});
	}

	openHint(event) {
		event.preventDefault();
		ModalService.open$({ src: srcHint, data: null }).pipe(
			takeUntil(this.unsubscribe$)
		).subscribe(event => {
			// console.log('BimLibrary01Component.onRegister', event);
		});
	}

	toggleFilter(filter) {
		Object.keys(this.filters).forEach(key => {
			const f = this.filters[key];
			if (f === filter) {
				f.active = !f.active;
			} else {
				f.active = false;
			}
		});
		this.pushChanges();
	}

	fake__() {
		HttpService.get$('/api/bim/excel').pipe(
			first()
		).subscribe(items => {
			const products = [];
			items.forEach(item => {
				let product = products.find(x => x.id === item.productId);
				if (!product) {
					product = {
						id: item.productId,
						image: item.image,
						code: item.productCode,
						title: item.productName,
						abstract: item.description,
						files: [],
						features: [item.category1Id, item.category2Id],
						slug: 'https://tiemmeraccorderie.wslabs.it/it/prodotti/componenti-idraulici/tubi/tubi-multistrato-al-cobrapex/standard/0600/'
					};
					products.push(product);
				}
				if (!product.files.find(x => x.fileName === item.fileName)) {
					product.files.push({
						fileName: item.fileName,
						fileExtension: `.${item.fileName.split('.').pop()}`,
						fileSize: 45000,
						url: 'https://tiemmeraccorderie.wslabs.it/media/files/' + item.fileName,
					});
				}
			});
			console.log(JSON.stringify(products));
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
			const menu = {
				id: 'menu',
				title: 'Area',
				items: departments.map(d => {
					const item = {
						id: d.value,
						label: d.label,
						title: 'Catalogo',
						items: catalogues.filter(c => {
							return products.find(p => p.features.indexOf(d.value) !== -1 && p.features.indexOf(c.value) !== -1);
						}).map(c => {
							const item = {
								id: c.value,
								label: c.label,
								title: 'Prodotto',
								items: products.filter(p => {
									return p.features.indexOf(c.value) !== -1;
								}).map(p => {
									const item = {
										id: p.id,
										label: p.title,
									};
									return item;
								})
							};
							return item;
						})
					};
					return item;
				})
			};
			console.log(JSON.stringify(menu));
		});
	}

	titleCase__(str) {
		return str.toLowerCase().split(' ').map(function(word) {
			return (word.charAt(0).toUpperCase() + word.slice(1));
		}).join(' ');
	}

}

BimLibrary01Component.meta = {
	selector: '[bim-library-01]',
};
