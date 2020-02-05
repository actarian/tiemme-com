import { Component } from 'rxcomp';
import { takeUntil } from 'rxjs/operators';
import FilterService from '../filter/filter.service';

// const GTM_CAT = 'media-library';

export default class MediaLibraryComponent extends Component {

	onInit() {
		const items = window.medias || [];
		const filters = window.filters || {};
		const initialParams = window.params || {};
		filters.departments.mode = FilterMode.OR;
		filters.languages.mode = FilterMode.OR;
		filters.categories.mode = FilterMode.OR;
		const filterService = new FilterService(filters, initialParams, (key, filter) => {
			switch (key) {
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
			/*
			setTimeout(() => {
				this.items = items;
				this.pushChanges();
			}, 50);
			*/
			// console.log('MediaLibraryComponent.items', items.length);
		});

		this.filterService = filterService;
		this.filters = filterService.filters;

	}

}

MediaLibraryComponent.meta = {
	selector: '[media-library]',
};
