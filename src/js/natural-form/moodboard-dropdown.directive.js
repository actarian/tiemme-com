
/* global window, document, angular, TweenMax, TimelineMax */

export default class MoodboardDropdownDirective {

	constructor(
		$compile
	) {
		this.$compile = $compile;
		this.restrict = 'A';
		this.template = `
<span has-dropdown=".moodboard__value">
	<span class="dropdown">
		<ul class="nav nav--select">
			<li ng-repeat="item in filter.options track by $index" ng-class="{ active: filter.value == item.value, disabled: item.disabled }">
				<span class="option" ng-class="{ 'option--picture': item.image }" ng-click="setFilter(item, filter)">
					<img ng-src="{{item.image}}" ng-if="item.image" />
					<span ng-bind="item.label"></span>
				</span>
			</li>
		</ul>
	</span>
	<span class="moodboard__value" ng-class="{ active: filter.value }">
		<span class="moodboard__underline"></span>
		<span class="moodboard__text">{{filter.placeholder}}</span>
	</span>
</span>
`;
		// this.require = 'ngModel';
		this.scope = {
			filter: '=?moodboardDropdown',
		};
	}

	link(scope, element, attributes, controller) {
		// console.log('MoodboardDropdownDirective', this.filter);
		const filter = scope.filter;
		if (filter.value) {
			filter.placeholder = filter.options.find(x => x.value === filter.value).label;
		}
		scope.setFilter = (item, filter) => {
			item = item || filter.options[0];
			filter.value = item.value;
			filter.placeholder = item.label;
			if (typeof filter.doFilter === 'function') {
				filter.doFilter(item, item.value);
			}
			scope.$broadcast('onCloseDropdown');
		};
		scope.removeFilter = (filter) => {
			this.setFilter(null, filter);
		};
		scope.$on('$destroy', () => {});
	}

	static factory($compile) {
		return new MoodboardDropdownDirective($compile);
	}

}

MoodboardDropdownDirective.factory.$inject = ['$compile'];
