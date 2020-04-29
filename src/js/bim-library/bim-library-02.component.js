import { Component } from 'rxcomp';
import { first, takeUntil } from 'rxjs/operators';
import DropdownDirective from '../dropdown/dropdown.directive';
import { STATIC } from '../environment/environment';
import HttpService from '../http/http.service';
import ModalService from '../modal/modal.service';

const srcMore = STATIC ? '/tiemme-com/services-bim-modal-more.html' : '/Viewdoc.cshtml?co_id=25206';
const srcHint = STATIC ? '/tiemme-com/services-bim-modal-hint.html' : '/Viewdoc.cshtml?co_id=25207';

export default class BimLibrary02Component extends Component {

	onInit() {
		const menu = window.menu || {};
		const items = window.files || [];
		this.menu = menu;
		this.items = items;
		this.visibleItems = items.slice();
		this.breadcrumb = [menu];
		// this.fake__();
	}

	setMenuItem(child, parent) {
		const clear = (items) => {
			if (items) {
				items.forEach(x => {
					delete x.selectedId;
					delete x.selectedLabel;
					clear(x.items);
				});
			}
		};
		clear(parent.items);
		let index = this.breadcrumb.reduce((p, c, i) => {
			return c.id === parent.id ? i : p;
		}, -1);
		if (index !== -1) {
			parent.selectedId = child.id;
			parent.selectedLabel = child.label;
			const breadcrumb = this.breadcrumb.slice(0, index + 1);
			if (child.items) {
				breadcrumb.push(child);
			}
			this.breadcrumb = [];
			DropdownDirective.dropdown$.next(null);
			this.pushChanges();
			this.breadcrumb = breadcrumb;
			this.visibleItems = this.items.filter(x => {
				return breadcrumb.reduce((p, c) => {
					if (c.selectedId) {
						return p && (x.features.indexOf(c.selectedId) !== -1 || x.id === c.selectedId);
					} else {
						return p;
					}
				}, true);
			});
			this.pushChanges();
		}
	}

	openMore(event) {
		event.preventDefault();
		ModalService.open$({ src: srcMore, data: null }).pipe(
			takeUntil(this.unsubscribe$)
		).subscribe(event => {
			// console.log('BimLibrary02Component.onRegister', event);
		});
	}

	openHint(event) {
		event.preventDefault();
		ModalService.open$({ src: srcHint, data: null }).pipe(
			takeUntil(this.unsubscribe$)
		).subscribe(event => {
			// console.log('BimLibrary02Component.onRegister', event);
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
								title: 'Soluzione',
								items: solutions.filter(s => {
									return products.find(p => p.features.indexOf(d.value) !== -1 && p.features.indexOf(c.value) !== -1 && p.features.indexOf(s.value) !== -1);
								}).map(s => {
									let item = {
										id: s.value,
										label: s.label,
										title: 'Famiglia',
										items: families.filter(f => {
											return products.find(p => p.features.indexOf(d.value) !== -1 && p.features.indexOf(c.value) !== -1 && p.features.indexOf(s.value) !== -1 && p.features.indexOf(f.value) !== -1);
										}).map(f => {
											const item = {
												id: f.value,
												label: f.label,
												title: 'Prodotto',
												items: products.filter(p => {
													return p.features.indexOf(f.value) !== -1;
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
									if (item.items.length === 0) {
										item = {
											id: s.value,
											label: s.label,
											title: 'Prodotto',
											items: products.filter(p => {
												return p.features.indexOf(s.value) !== -1;
											}).map(p => {
												const item = {
													id: p.id,
													label: p.title,
												};
												return item;
											})
										};
									}
									return item;
								})
							};
							return item;
						})
					};
					return item;
				})
			};
			console.log('menu', JSON.stringify(menu));
		});
	}

	titleCase__(str) {
		return str.toLowerCase().split(' ').map(function(word) {
			return (word.charAt(0).toUpperCase() + word.slice(1));
		}).join(' ');
	}

}

BimLibrary02Component.meta = {
	selector: '[bim-library-02]',
};
