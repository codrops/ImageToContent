import { Content } from './content';

/**
 * Class representing a Preview element (.preview)
 */
export class Preview {
	// DOM elements
	DOM = {
		// main element (.preview)
		el: null,
		// image wrap element (.preview__img-wrap)
		imageWrap: null,
        // image element (.preview__img)
		image: null,
		// image inner element (.preview__img-inner)
		imageInner: null,
        // title element (.preview__title)
		title: null,
        // inner title elements (.oh__inner)
        titleInner: null,
        // description element (.preview__desc)
        description: null,
	};
	
	/**
	 * Constructor.
	 * @param {Element} DOM_el - main element (.preview)
	 */
	constructor(DOM_el, content_el) {
		this.DOM.el = DOM_el;
        this.content = new Content(content_el);
        this.DOM.imageWrap = this.DOM.el.querySelector('.preview__img-wrap');
		this.DOM.image = this.DOM.imageWrap.querySelector('.preview__img');
		this.DOM.imageInner = this.DOM.image.querySelector('.preview__img-inner');
		this.DOM.title = this.DOM.el.querySelector('.preview__title');
        this.DOM.titleInner = [...this.DOM.title.querySelectorAll('.oh__inner')];
        this.DOM.description = this.DOM.el.querySelector('.preview__desc');
	}
}