const imagesLoaded = require('imagesloaded');

/**
 * Linear interpolation
 * @param {Number} a - first value to interpolate
 * @param {Number} b - second value to interpolate 
 * @param {Number} n - amount to interpolate
 */
 const lerp = (a, b, n) => (1 - n) * a + n * b;

 /**
  * Gets the cursor position
  * @param {Event} ev - mousemove event
  */
 const getCursorPos = ev => {
     return { 
         x : ev.clientX, 
         y : ev.clientY 
     };
 };

/**
 * Preload images
 * @param {String} selector - Selector/scope from where images need to be preloaded. Default is 'img'
 */
const preloadImages = (selector = 'img') => {
    return new Promise((resolve) => {
        imagesLoaded(document.querySelectorAll(selector), {background: true}, resolve);
    });
};

/**
 * Wraps the elements of an array.
 * @param {Array} arr - the array of elements to be wrapped
 * @param {String} wrapType - the type of the wrap element ('div', 'span' etc)
 * @param {String} wrapClass - the wrap class(es)
 */
 const wrapLines = (arr, wrapType, wrapClass) => {
    arr.forEach(el => {
        const wrapEl = document.createElement(wrapType);
        wrapEl.classList = wrapClass;
        el.parentNode.appendChild(wrapEl);
        wrapEl.appendChild(el);
    });
}

/**
 * Checks if an element is in the viewport
 * @param {Element} elem - the element to be checked
 */
 const isInViewport = elem => {
    var bounding = elem.getBoundingClientRect();
    return (
        (bounding.bottom >= 0 && bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) || bounding.top >= 0 && bounding.top <= (window.innerHeight || document.documentElement.clientHeight)) &&
        (bounding.right >= 0 && bounding.right <= (window.innerWidth || document.documentElement.clientWidth) || bounding.left >= 0 && bounding.left <= (window.innerWidth || document.documentElement.clientWidth))
    );
};

export {
    lerp,
    getCursorPos,
    preloadImages,
    wrapLines,
    isInViewport,
};