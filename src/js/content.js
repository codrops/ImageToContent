import { TextLinesReveal } from './textLinesReveal';

/**
 * Class representing a Content element (.content)
 */
export class Content {
	// DOM elements
	DOM = {
		// main element (.content)
		el: null,
        // title element (.content__title)
		title: null,
        // inner title elements (.content__title .oh__inner)
        titleInner: null,
        // inner meta element (.content__meta .oh__inner)
        metaInner: null,
        // text element (.content__text)
        text: null,
		// thumbs (.content__thumbs-item)
		thumbs: null,
	};
	
	/**
	 * Constructor.
	 * @param {Element} DOM_el - main element (.content)
	 */
	constructor(DOM_el) {
		this.DOM.el = DOM_el;
        this.DOM.title = this.DOM.el.querySelector('.content__title');
        this.DOM.titleInner = [...this.DOM.title.querySelectorAll('.oh__inner')];
        this.DOM.metaInner = this.DOM.el.querySelector('.content__meta > .oh__inner');
        this.DOM.text = this.DOM.el.querySelector('.content__text');
        this.multiLine = new TextLinesReveal(this.DOM.text);
		this.DOM.thumbs = [...this.DOM.el.querySelectorAll('.content__thumbs-item')];
	}
}