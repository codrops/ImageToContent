import { preloadImages, isInViewport } from './utils';
import { Preview } from './preview';
import Lenis from '@studio-freight/lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
import { Flip } from 'gsap/Flip';
gsap.registerPlugin(Flip);

const ANIMATION_CONFIG = {duration: 1.5, ease: 'power4.inOut'};

const previewElems = [...document.querySelectorAll('.preview')];
const contentElems = [...document.querySelectorAll('.content')];
const previewItems = [];
previewElems.forEach((item, pos) => {
	previewItems.push(new Preview(item, contentElems[pos]))
});
const backCtrl = document.querySelector('.action--back');

// Smooth scrolling.
let lenis;
// Current open item's position
let currentItem = -1;

let isAnimating = false;

const initSmoothScrolling = () => {
	// Smooth scrolling initialization (using Lenis https://github.com/studio-freight/lenis)
	lenis = new Lenis({
		lerp: 0.1,
		smooth: true,
		direction: 'vertical',
	});
	const scrollFn = () => {
		lenis.raf();
		requestAnimationFrame(scrollFn);
	};
	requestAnimationFrame(scrollFn);
};

const animateOnScroll = () => {

	for (const item of previewItems) {

		gsap.set(item.DOM.imageInner, {transformOrigin: '50% 0%'});
		
		item.scrollTimeline = gsap.timeline({
			scrollTrigger: {
				trigger: item.DOM.el,
				start: 'top bottom',
				end: 'bottom top',
				scrub: true
			}
		})
		.addLabel('start', 0)
		.to(item.DOM.title, {
			ease: 'none',
			yPercent: -100
		}, 'start')
		.to(item.DOM.imageInner, {
			ease: 'none',
			scaleY: 1.8,
		}, 'start')

	}

};

const getAdjacentItems = item => {
	let arr = [];
	for (const [position, otherItem] of previewItems.entries()) {
		
		if ( item != otherItem && isInViewport(otherItem.DOM.el) ) {
			arr.push({position: position, item: otherItem});
		}

	}
	return arr;
};

const showContent = item => {
	
	// Get adjacent items. Need to hide them.
	const itemIndex = previewItems.indexOf(item);
	const adjacentItems = getAdjacentItems(item);
	item.adjacentItems = adjacentItems;

	const tl = gsap.timeline({
		defaults: ANIMATION_CONFIG,
		onStart: () => {
			// Stop the "animate on scroll" timeline for this item
			//item.scrollTimeline.pause();
			// Stop the Lenis instance
			lenis.stop();
			
			// Overflow hidden and pointer events control class
			document.body.classList.add('content-open');
			// Shows current content element
			item.content.DOM.el.classList.add('content--current');

			gsap.set([item.content.DOM.titleInner, item.content.DOM.metaInner], {
				yPercent: -101,
				opacity: 0
			});
			gsap.set(item.content.DOM.thumbs, {
				transformOrigin: '0% 0%',
				scale: 0,
				yPercent: 150,
			});
			gsap.set([item.content.DOM.text, backCtrl], {
				opacity: 0
			});

			// Save image current scaleY value
			const scaleY = item.DOM.imageInner.getBoundingClientRect().height / item.DOM.imageInner.offsetHeight;
			item.imageInnerScaleYCached = scaleY;
		},
		onComplete: () => isAnimating = false
	})
	.addLabel('start', 0);
	// hide adjacent preview elements

	for (const el of item.adjacentItems) {
		tl.to(el.item.DOM.el, {
			y: el.position < itemIndex ? -window.innerHeight : window.innerHeight
		}, 'start')
	}
	
	// gsap Flip logic: move the image element inside the content area
    tl.add(() => {
		const flipstate = Flip.getState(item.DOM.image);
		item.content.DOM.el.appendChild(item.DOM.image);
        Flip.from(flipstate, {
            duration: ANIMATION_CONFIG.duration,
            ease: ANIMATION_CONFIG.ease,
            absolute: true,
        });
    }, 'start')
	// preview title
	.to(item.DOM.titleInner, {
		yPercent: 101,
		opacity: 0,
		stagger: -0.03
	}, 'start')
	// preview description
	.to(item.DOM.description, {
		yPercent: 101,
		opacity: 0
	}, 'start')
	// Reset image scaleY values (changed during scroll)
	.to(item.DOM.imageInner, {
		scaleY: 1
	}, 'start')
	
	// Content elements come in a bit later
	.addLabel('content', 0.15)
	// Back control button
	.to(backCtrl, {
		opacity: 1
	}, 'content')
	// content title
	.to(item.content.DOM.titleInner, {
		yPercent: 0,
		opacity: 1,
		stagger: -0.05
	}, 'content')
	// content meta / author
	.to(item.content.DOM.metaInner, {
		yPercent: 0,
		opacity: 1,
	}, 'content')
	// content thumbs
	.to(item.content.DOM.thumbs, {
		scale: 1,
		yPercent: 0,
		stagger: -0.05
	}, 'content')
	// content text (lines)
	.add(() => {
        item.content.multiLine.in();

		gsap.set(item.content.DOM.text, {
			opacity: 1,
			delay: 0.01
		});
    }, 'content');

};

const hideContent = () => {
	
	// the current open item
	const item = previewItems[currentItem];

	gsap.timeline({
		defaults: ANIMATION_CONFIG,
		onComplete: () => {
			// Stop the "animate on scroll" timeline for this item
			//item.scrollTimeline.play();

			// Start the Lenis instance
			lenis.start();

			// Overflow hidden and pointer events control class
			document.body.classList.remove('content-open');
			// Hides current content element
			item.content.DOM.el.classList.remove('content--current');

			isAnimating = false;
		}
	})
	.addLabel('start', 0)
	// Back control button
	.to(backCtrl, {
		opacity: 0
	}, 'start')
	// content title
	.to(item.content.DOM.titleInner, {
		yPercent: -101,
		opacity: 0,
		stagger: 0.05
	}, 'start')
	// content meta / author
	.to(item.content.DOM.metaInner, {
		yPercent: -101,
		opacity: 0,
	}, 'start')
	// content thumbs
	.to(item.content.DOM.thumbs, {
		scale: 0,
		yPercent: 150,
		stagger: -0.05
	}, 'start')
	// content text (lines)
	.add(() => {
        item.content.multiLine.out();
    }, 'start')
	
	// Preview elements come in a bit later
	.addLabel('preview', 0.15)
	// hide adjacent preview elements
	.to(item.adjacentItems.map(el => el.item.DOM.el), {
		y: 0
	}, 'preview')
	// gsap Flip logic: move the image element inside the content area
    .add(() => {
		const flipstate = Flip.getState(item.DOM.image);
		item.DOM.imageWrap.appendChild(item.DOM.image);
        Flip.from(flipstate, {
            duration: ANIMATION_CONFIG.duration,
            ease: ANIMATION_CONFIG.ease,
            absolute: true,
        });
    }, 'preview')
	// preview title
	.to(item.DOM.titleInner, {
		yPercent: 0,
		opacity: 1,
		stagger: 0.03
	}, 'preview')
	// preview description
	.to(item.DOM.description, {
		yPercent: 0,
		opacity: 1
	}, 'preview')
	// Reset image scaleY values
	.to(item.DOM.imageInner, {
		scaleY: item.imageInnerScaleYCached
	}, 'preview')

};

// Initialize the events
const initEvents = () => {
	for (const [pos,item] of previewItems.entries()) {
		item.DOM.imageWrap.addEventListener('click', () => {
			if ( isAnimating ) return;
			isAnimating = true;
			currentItem = pos;
			showContent(item);
		});
	}

	backCtrl.addEventListener('click', () => {
		if ( isAnimating ) return;
		isAnimating = true;
		hideContent();
	});
};

// Preload images and initialize scrolling animations
preloadImages('.preview__img-inner, .content__thumbs-item').then( _ => {
	document.body.classList.remove('loading');

	initSmoothScrolling();
	animateOnScroll();
	initEvents();
});