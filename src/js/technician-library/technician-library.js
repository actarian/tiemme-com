import { Component } from 'rxcomp';
import { takeUntil } from 'rxjs/operators';
import { FilterMode } from '../filter/filter-item';
import FilterService from '../filter/filter.service';

export default class TechnicianLibraryComponent extends Component {
	onInit() {
		const items = this.items = window.technicians || [];
		const filters = window.filters || {};
		const initialParams = window.params || {};
		filters.departments.mode = FilterMode.OR;
		const filterService = new FilterService(filters, initialParams, (key, filter) => {
			switch (key) {
				case 'departments':
					filter.filter = (item, value) => {
						console.log(item, value);
						return item.department.id === value;
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
			console.log('TechnicianLibraryComponent.items', items.length);
		});
		this.filterService = filterService;
		this.filters = filterService.filters;
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
}

TechnicianLibraryComponent.meta = {
	selector: '[technician-library]',
};
