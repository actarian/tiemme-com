import { Component } from 'rxcomp';
import { takeUntil } from 'rxjs/operators';
import FilterService from '../filter/filter.service';

// const GTM_CAT = 'media-library';

export default class MediaLibraryComponent extends Component {

	onInit() {
		this.filteredItems = [];
		const filters = window.filters || {};
		const initialParams = window.params || {};
		const filterService = new FilterService(filters, initialParams, (key, filter) => {
			switch (key) {
				default:
					filter.filter = (item, value) => {
						return item.features.indexOf(value) !== -1;
					};
			}
		});
		filterService.items$(window.medias || []).pipe(
			takeUntil(this.unsubscribe$),
		).subscribe(filteredItems => {
			this.filteredItems = filteredItems;
			this.pushChanges();
			/*
			setTimeout(() => {
				this.filteredItems = filteredItems;
				this.pushChanges();
			}, 50);
			*/
			// console.log('MediaLibraryComponent.filteredItems', filteredItems.length);
		});

		this.filterService = filterService;
		this.filters = filterService.filters;

	}

}

MediaLibraryComponent.meta = {
	selector: '[media-library]',
	inputs: ['items', 'filters']
};
