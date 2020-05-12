import { Component, getContext } from 'rxcomp';
import { combineLatest, fromEvent } from 'rxjs';
import { first, takeUntil, tap } from 'rxjs/operators';
import { STATIC } from '../environment/environment';
import FilterMenuService from '../filter/filter-menu.service';
import HttpService from '../http/http.service';
import ModalService from '../modal/modal.service';

const srcMore = STATIC ? '/tiemme-com/services-bim-modal-more.html' : '/Viewdoc.cshtml?co_id=25206';
const srcHint = STATIC ? '/tiemme-com/services-bim-modal-hint.html' : '/Viewdoc.cshtml?co_id=25207';

const MAX_VISIBLE_ITEMS = 20;

export default class BimLibraryComponent extends Component {

	onInit() {
		this.filters = [];
		this.items = [];
		this.visibleItems = [];
		this.filterService = new FilterMenuService();
		this.maxVisibleItems = MAX_VISIBLE_ITEMS;
		this.busy = false;
		// this.fake__();
		this.load$().pipe(
			first(),
		).subscribe(data => {
			// console.log(data);
			this.filterService.items$(data[0], data[1], (filter) => {
				switch (filter.key) {
					case 'feature':
						filter.filter = (item, value) => {
							return item.features.indexOf(value) !== -1;
						};
						break;
					case 'extension':
						filter.filter = (item, value) => {
							return item.files.find(x => x.fileExtension === value);
						};
						break;
				}
			}).pipe(
				takeUntil(this.unsubscribe$),
			).subscribe(items => {
				this.maxVisibleItems = MAX_VISIBLE_ITEMS;
				this.items = items;
				this.visibleItems = items.slice(0, this.maxVisibleItems);
				this.pushChanges();
				// console.log('BimLibrary01Component.items', items.length);
			});
			this.scroll$().pipe(
				takeUntil(this.unsubscribe$)
			).subscribe();
			this.filters = this.filterService.filters; // data[0].map(x => new FilterMenuItem(x));
			this.pushChanges();
		});
	}

	scroll$() {
		const { node } = getContext(this);
		return fromEvent(window, 'scroll').pipe(
			tap(() => {
				if (this.items.length > this.visibleItems.length && !this.busy) {
					const rect = node.getBoundingClientRect();
					if (rect.bottom < window.innerHeight) {
						this.busy = true;
						this.pushChanges();
						setTimeout(() => {
							this.busy = false;
							this.maxVisibleItems += MAX_VISIBLE_ITEMS;
							this.visibleItems = this.items.slice(0, this.maxVisibleItems);
							this.pushChanges();
						}, 1000);
					}
				}
			})
		);
	}

	load$() {
		return combineLatest(
			HttpService.get$(!STATIC ? '/api/bim/filters' : '/Client/docs/api/bim/filters.json'),
			HttpService.get$(!STATIC ? '/api/bim/files' : '/Client/docs/api/bim/files.json')
		);
	}

	toggleFilter(filter) {
		filter.active = !filter.active;
		this.pushChanges();
	}

	toggleMenuItem(filter, option) {
		if (filter.isMenuItem(option)) {
			option.toggleActive();
			this.pushChanges();
		}
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
			const products = [];
			items.forEach(item => {
				let f = products.find(x => x.id === item.productId);
				if (!f) {
					f = {
						id: item.productId,
						image: item.image,
						code: item.productCode,
						title: item.productName,
						files: [],
						features: [item.category1Id, item.category2Id, item.category3Id],
						image: 'https://tiemmeraccorderie.wslabs.it/' + item.image,
						slug: 'https://tiemmeraccorderie.wslabs.it/it/prodotti/componenti-idraulici/tubi/tubi-multistrato-al-cobrapex/standard/0600/'
					};
					if (item.category4Id) {
						f.features.push(item.category4Id);
					}
					products.push(f);
				}
				if (!f.files.find(x => x.fileName === item.fileName)) {
					f.files.push({
						description: item.description,
						fileName: item.fileName,
						fileExtension: `.${item.fileName.split('.').pop()}`,
						fileSize: 45000,
						url: 'https://tiemmeraccorderie.wslabs.it/media/files/' + item.fileName,
					});
				}
			});
			console.log('products', JSON.stringify(products));
			const families = [];
			items.forEach(item => {
				const f = families.find(x => x.value === item.category4Id);
				if (!f) {
					families.push({
						value: item.category4Id,
						label: this.titleCase__(item.category4Description),
						count: 1,
					});
				} else {
					f.count++;
				}
			});
			families.sort(function(a, b) {
				return (a.count - b.count) * -1;
			});
			console.log('families', JSON.stringify(families.map(x => {
				delete x.count;
				return x;
			})));
			const solutions = [];
			items.forEach(item => {
				const f = solutions.find(x => x.value === item.category3Id);
				if (!f) {
					solutions.push({
						value: item.category3Id,
						label: this.titleCase__(item.category3Description),
						count: 1,
					});
				} else {
					f.count++;
				}
			});
			solutions.sort(function(a, b) {
				return (a.count - b.count) * -1;
			});
			console.log('solutions', JSON.stringify(solutions.map(x => {
				delete x.count;
				return x;
			})));
			const catalogues = [];
			items.forEach(item => {
				const f = catalogues.find(x => x.value === item.category2Id);
				if (!f) {
					catalogues.push({
						value: item.category2Id,
						label: this.titleCase__(item.category2Description),
						count: 1,
					});
				} else {
					f.count++;
				}
			});
			catalogues.sort(function(a, b) {
				return (a.count - b.count) * -1;
			});
			console.log('catalogues', JSON.stringify(catalogues.map(x => {
				delete x.count;
				return x;
			})));
			const departments = [];
			items.forEach(item => {
				const f = departments.find(x => x.value === item.category1Id);
				if (!f) {
					departments.push({
						value: item.category1Id,
						label: this.titleCase__(item.category1Description),
						count: 1,
					});
				} else {
					f.count++;
				}
			});
			departments.sort(function(a, b) {
				return (a.count - b.count) * -1;
			});
			console.log('departments', JSON.stringify(departments.map(x => {
				delete x.count;
				return x;
			})));
			const menu = departments.map(d => {
				const item = {
					value: d.value,
					label: d.label,
					key: 'feature',
					options: catalogues.filter(c => {
						return products.find(p => p.features.indexOf(d.value) !== -1 && p.features.indexOf(c.value) !== -1);
					}).map(c => {
						const item = {
							value: c.value,
							label: c.label,
							key: 'feature',
							options: solutions.filter(s => {
								return products.find(p => p.features.indexOf(d.value) !== -1 && p.features.indexOf(c.value) !== -1 && p.features.indexOf(s.value) !== -1);
							}).map(s => {
								let item = {
									value: s.value,
									label: s.label,
									key: 'feature',
									options: families.filter(f => {
										return products.find(p => p.features.indexOf(d.value) !== -1 && p.features.indexOf(c.value) !== -1 && p.features.indexOf(s.value) !== -1 && p.features.indexOf(f.value) !== -1);
									}).map(f => {
										const item = {
											value: f.value,
											label: f.label
										};
										return item;
									})
								};
								if (item.options.length === 0) {
									item = {
										value: s.value,
										label: s.label
									};
								}
								return item;
							})
						};
						return item;
					})
				};
				return item;
			});
			menu.push({
				"value": null,
				"label": "Estensione",
				"key": "extension",
				"options": [
					{
						"value": ".rte",
						"label": ".rte"
					  },
					{
						"value": ".rfa",
						"label": ".rfa"
					  }
					]
			});
			console.log('menu', JSON.stringify(menu));
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
