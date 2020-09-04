import { Directive, getContext } from "rxcomp";
import { BehaviorSubject } from "rxjs";
import { takeUntil } from "rxjs/operators";

let ACCORDION_ID = 1000000;

export default class AccordionDirective extends Directive {
	get id() {
		return this.accordion || this.id_ || (this.id_ = AccordionDirective.nextId());
	}
	onInit() {
		const { node } = getContext(this);
		let trigger = node.getAttribute('accordion-trigger');
		trigger = trigger ? node.querySelector(trigger) : node;
		trigger.classList.add('accordion-trigger');
		this.trigger = trigger;
		this.opened = null;
		this.onClick = this.onClick.bind(this);
		this.onDocumentClick = this.onDocumentClick.bind(this);
		this.openAccordion = this.openAccordion.bind(this);
		this.closeAccordion = this.closeAccordion.bind(this);
		this.addListeners();
		AccordionDirective.accordion$.pipe(
			takeUntil(this.unsubscribe$)
		).subscribe(id => {
			// console.log('AccordionDirective', id, this['accordion-item']);
			if (this.id === id) {
				node.classList.remove('opening', 'closing', 'closed');
				node.classList.add('opened');
				setTimeout(() => {
					node.classList.add('opening');
					setTimeout(() => {
						node.classList.remove('opening');
					}, 1000);
				}, 1);
			} else {
				node.classList.remove('opening', 'closing', 'closed');
				setTimeout(() => {
					node.classList.add('closing');
					setTimeout(() => {
						node.classList.remove('opened', 'closing');
						node.classList.add('closed');
					}, 1000);
				}, 1);
			}
		});
	}
	onClick(event) {
		const { node } = getContext(this);
		if (this.opened === null) {
			this.openAccordion();
		} else {
			const accordionItemNode = node.querySelector('[accordion-item]');
			// console.log('accordionItemNode', accordionItemNode);
			if (!accordionItemNode) { // if (this.trigger !== node) {
				this.closeAccordion();
			}
		}
	}
	onDocumentClick(event) {
		const { node } = getContext(this);
		const clickedInside = node === event.target || node.contains(event.target);
		if (!clickedInside) {
			this.closeAccordion();
		}
	}
	openAccordion() {
		if (this.opened === null) {
			this.opened = true;
			this.addDocumentListeners();
			AccordionDirective.accordion$.next(this.id);
			this.open.next(this.id);
		}
	}
	closeAccordion() {
		if (this.opened !== null) {
			this.removeDocumentListeners();
			this.opened = null;
			if (AccordionDirective.accordion$.getValue() === this.id) {
				AccordionDirective.accordion$.next(null);
				this.open.next(null);
			}
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
	static nextId() {
		return ACCORDION_ID++;
	}
}

AccordionDirective.meta = {
	selector: '[accordion]',
	inputs: ['accordion', 'accordion-trigger'],
	outputs: ['open']
};

AccordionDirective.accordion$ = new BehaviorSubject(null);
