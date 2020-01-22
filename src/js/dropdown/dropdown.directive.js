import { Component, getContext } from "rxcomp";
import { BehaviorSubject } from "rxjs";
import { takeUntil } from "rxjs/operators";

let DROPDOWN_ID = 1000000;

export default class DropdownDirective extends Component {

	onInit() {
		const { node } = getContext(this);
		// const consumer = attributes.hasDropdownConsumer !== undefined ? scope.$eval(attributes.hasDropdownConsumer) : null;
		const trigger = node.getAttribute('dropdown-target');
		this.trigger = trigger ? node.querySelector(trigger) : node;
		this.opened = null;
		const uid = node.getAttribute('dropdown-id');
		this.uid = uid ? uid : DROPDOWN_ID++;
		// console.log(this.uid);
		/*
		scope.$on('onCloseDropdown', closeDropdown);
		scope.$on('onNavigateOut', closeDropdown);
		scope.$on('onNavigationTransitionIn', closeDropdown);
		*/
		this.onClick = this.onClick.bind(this);
		this.onDocumentClick = this.onDocumentClick.bind(this);
		this.openDropdown = this.openDropdown.bind(this);
		this.closeDropdown = this.closeDropdown.bind(this);
		this.addListeners();
		DropdownDirective.dropdown$.pipe(
			takeUntil(this.unsubscribe$)
		).subscribe(dropdown => {
			if (this.uid === dropdown) {
				node.classList.add('opened');
			} else {
				node.classList.remove('opened');
			}
			this.pushChanges();
		});
	}

	onClick(event) {
		const { node } = getContext(this);
		if (this.opened === null) {
			this.openDropdown();
		} else if (this.trigger !== node) {
			this.closeDropdown();
		}
	}

	onDocumentClick(event) {
		const { node } = getContext(this);
		const clickedInside = node === event.target || node.contains(event.target);
		if (!clickedInside) {
			this.closeDropdown();
		}
	}

	// scope.$watch('hasDropdown', onShowHide);

	openDropdown() {
		if (this.opened === null) {
			this.opened = true;
			this.addDocumentListeners();
			DropdownDirective.dropdown$.next(this.uid);
			this.dropdown.next(this.uid);
		}
	}

	closeDropdown() {
		if (this.opened !== null) {
			this.removeDocumentListeners();
			// this.$timeout(() => {
			this.opened = null;
			if (DropdownDirective.dropdown$.getValue() === this.uid) {
				DropdownDirective.dropdown$.next(null);
				this.dropdown.next(null);
			}
			// });
		}
	}

	addListeners() {
		this.trigger.addEventListener('click', this.onClick);
	}

	addDocumentListeners() {
		document.addEventListener('click', this.onDocumentClick);
	}

	removeListeners() {
		this.trigger.removeEventListener('click', this.onClick);
	}

	removeDocumentListeners() {
		document.removeEventListener('click', this.onDocumentClick);
	}

	onDestroy() {
		this.removeListeners();
		this.removeDocumentListeners();
	}

}

DropdownDirective.meta = {
	selector: '[(dropdown)]',
	outputs: ['dropdown']
};

DropdownDirective.dropdown$ = new BehaviorSubject(null);
