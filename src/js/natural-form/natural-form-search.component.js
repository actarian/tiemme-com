import { Component, getContext } from 'rxcomp';

export default class NaturalFormSearchComponent extends Component {

	onInit() {
		console.log('NaturalFormSearchComponent.onInit');
		const { node, module } = getContext(this);
		node.classList.add('natural-form-search');
	}

	onChanges() {
		console.log('NaturalFormSearchComponent.onChanges', this);
		this.initControls();
	}

	initControls() {
		if (!this.controls && this.filters) {
			console.log('NaturalFormSearchComponent.initControls', this.filters);
			const { node, module } = getContext(this);
			let html = node.innerHTML;
			const keys = Object.keys(this.filters);
			keys.forEach(x => {
				// console.log(x);
				html = html.replace(`$${x}$`, /* html */ `
					<span class="natural-form__control" natural-form-control [filter]="filters.${x}" [label]="filters.${x}.label" (change)="onNaturalForm($event)"></span>
				`);
			});
			// console.log('MoodboardSearchDirective', html);
			node.innerHTML = html;
			this.controls = Array.from(node.childNodes).map(x => {
				console.log(x);
				return module.compile(x, this);
			});

			/*
			const hasFilter = Object.keys(scope.filters).map(x => scope.filters[x]).find(x => x.value !== null) !== undefined;
			if (!hasFilter) {
				this.animateUnderlines(node);
			}
			scope.animateOff = () => {
				this.animateOff(node);
			};
			*/
		}
	}

	onNaturalForm(event) {
		const values = {};
		Object.keys(this.filters).forEach(key => {
			values[key] = this.filters[key].value;
		});
		this.change.next(values);
	}

	animateUnderlines(node) {
		this.animated = true;
		const values = [...node.querySelectorAll('.moodboard__underline')];
		values.forEach(x => {
			gsap.set(x, { transformOrigin: '0 50%', scaleX: 0 });
		});
		let i = -1;
		const animate = () => {
			i++;
			i = i % values.length;
			const u = values[i];
			gsap.set(u, { transformOrigin: '0 50%', scaleX: 0 });
			gsap.to(u, 0.50, {
				scaleX: 1,
				transformOrigin: '0 50%',
				delay: 0,
				ease: Power3.easeInOut,
				overwrite: 'all',
				onComplete: () => {
					gsap.set(u, { transformOrigin: '100% 50%', scaleX: 1 });
					gsap.to(u, 0.50, {
						scaleX: 0,
						transformOrigin: '100% 50%',
						delay: 1.0,
						ease: Power3.easeInOut,
						overwrite: 'all',
						onComplete: () => {
							animate();
						}
					});
				}
			});
		};
		animate();
	}

	animateOff(node) {
		if (this.animated) {
			this.animated = false;
			// console.log('animateOff');
			// gsap.killAll();
			const values = [...node.querySelectorAll('.moodboard__underline')];
			gsap.set(values, { transformOrigin: '0 50%', scaleX: 0 });
			gsap.to(values, 0.50, {
				scaleX: 1,
				transformOrigin: '0 50%',
				delay: 0,
				ease: Power3.easeInOut,
				overwrite: 'all',
			});
		}
	}

}

NaturalFormSearchComponent.meta = {
	selector: '[natural-form-search]',
	inputs: ['filters'],
	outputs: ['change']
};
