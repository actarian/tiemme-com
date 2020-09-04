import { Directive, getContext } from "rxcomp";
import { takeUntil } from "rxjs/operators";
import AccordionDirective from "./accordion.directive";

export default class AccordionItemDirective extends Directive {

	get id() {
		return this['accordion-item'];
	}

	onInit() {
		const { node } = getContext(this);
		node.classList.add('accordion-item');
		AccordionDirective.accordion$.pipe(
			takeUntil(this.unsubscribe$)
		).subscribe(id => {
			// console.log('AccordionItemDirective', id, this['accordion-item']);
			if (this.id === id) {
				node.classList.remove('opening', 'closing', 'closed');
				node.classList.add('opened');
				setTimeout(() => {
					gsap.set(node, { clearProps: 'height' });
					const height = node.offsetHeight;
					console.log(height);
					gsap.set(node, { height: 0 });
					node.classList.add('opening');
					gsap.to(node, .5, {
						height,
						overwrite: true,
						onComplete: () => {
							node.classList.remove('opening');
						}
					});
				}, 1);
				/*
				node.classList.remove('opening', 'closing', 'closed');
				node.classList.add('opened');
				setTimeout(() => {
					node.classList.add('opening');
					setTimeout(() => {
						node.classList.remove('opening');
					}, 1000);
				}, 1);
				*/
			} else {
				node.classList.remove('opening', 'closing', 'closed');
				node.classList.add('closing');
				gsap.to(node, .5, {
					height: 0,
					overwrite: true,
					onComplete: () => {
						node.classList.remove('opened', 'closing');
						node.classList.add('closed');
					}
				});
				/*
				setTimeout(() => {
					node.classList.add('closing');
					setTimeout(() => {
						node.classList.remove('opened', 'closing');
						node.classList.add('closed');
					}, 1000);
				}, 1);
				*/
			}
		});
	}

}

AccordionItemDirective.meta = {
	selector: '[accordion-item], [[accordion-item]]',
	inputs: ['accordion-item']
};
