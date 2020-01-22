import { Component, getContext } from 'rxcomp';

export default class SrcDirective extends Component {

	onChanges(changes) {
		const { node } = getContext(this);
		node.setAttribute('src', this.src);
	}

}

SrcDirective.meta = {
	selector: '[[src]]',
	inputs: ['src'],
};
