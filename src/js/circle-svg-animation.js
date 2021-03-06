/**
 *
 * @private
 * @author Arthor Serdyuk
 * @param {Selector} selector selector to initialize plugin
 * @param {Object} svgOptions Object with svg styles
 * @param {Object} svgCircleOptions Object with svg circle styles
 * @param {Object} innerNumberStyles Object with svg inner number styles
 */
function SVG(selector, svgOptions, svgCircleOptions, innerNumberStyles) {
    this.element = document.querySelector(selector);
    const defaultCircleOptions = {
        strokeColor: '#006363',
        strokeWidth: '20px',
        circleCx: 110,
        circleCy: 110,
        circleR: 100
    };
    this.svgCircleOptions = Object.assign({}, defaultCircleOptions, svgCircleOptions);
    const circleLength = 2 * Math.PI * defaultCircleOptions.circleR;
    const defaultSvgOptions = {
        SVGWidth: 200,
        SVGHeight: 200,
        innerNumber: 75,
        speed: 2000
    };
    this.svgOptions = Object.assign({}, defaultSvgOptions, svgOptions, {
        circleLength: circleLength,
        strokeDasharray: circleLength,
        strokeDashoffset: circleLength,
        fill: 'none',
    });

    const defaultInnerNumberOptions = {
        color: this.svgCircleOptions.strokeColor,
        fontWeight: 800,
        fontSize: '50px'
    };
    this.innerNumberStyles = Object.assign({}, defaultInnerNumberOptions, innerNumberStyles, {
        position: 'absolute',
        display: 'inline-block',
        left: '50%',
        transform: 'translate(-50%) rotate(90deg)',
        lineHeight: this.svgOptions.SVGWidth + 'px',
    });
    this.animateToNumber = circleLength - circleLength / 100 * this.svgOptions.innerNumber;
    this.init();
}

SVG.prototype.createSvg = function (width, height, fill, strokeDasharray, strokeDashoffset, strokeColor, strokeWidth, cx, cy, r) {
    return `<svg width="${width}" height="${height}" viewBox="0 0 220 220"><circle class="circle" cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" stroke-dasharray="${strokeDasharray}" stroke-dashoffset="${strokeDashoffset}" stroke="${strokeColor}" stroke-width="${strokeWidth}"/>`;
};

SVG.prototype.createInnerNumber = function (innerNumber) {
    return `<div class="svg-number">${innerNumber}</div>`;
};

SVG.prototype.setRootElementStyles = function (el) {
    setStyles(el, {
        'position': 'relative',
        'display': 'inline-block',
        'transform': 'rotate(-90deg)'
    });
};

SVG.prototype.setSvgStyles = function (el) {
    setStyles(el, this.svgOptions);
};

SVG.prototype.setInnerNumberStyles = function (el) {
    setStyles(el, this.innerNumberStyles);
};

SVG.prototype.init = function () {
    this.element.innerHTML = this.createSvg(this.svgOptions.SVGWidth, this.svgOptions.SVGHeight, this.svgOptions.fill, this.svgOptions.strokeDasharray,+
        this.svgOptions.strokeDashoffset, this.svgCircleOptions.strokeColor, this.svgCircleOptions.strokeWidth, this.svgCircleOptions.circleCx, this.svgCircleOptions.circleCy,+
        this.svgCircleOptions.circleR);
    this.element.innerHTML += this.createInnerNumber(this.svgOptions.innerNumber);

    this.setRootElementStyles(this.element);
    this.setSvgStyles(document.querySelector('.circle'));
    this.setInnerNumberStyles(document.querySelector('.svg-number'));
    this.setSvgAnimation();
    this.setInnerNumberAnimation(this.animateToNumber);
};

SVG.prototype.setSvgAnimation = function () {
    setAnimation($('.svg-number'), {num: this.svgOptions.innerNumber}, {
        duration: this.svgOptions.speed,
        step: function (num) {
            $(this).text((num).toFixed(0) + '%');
        }
    });
};

SVG.prototype.setInnerNumberAnimation = function (animateToNumber) {
    setAnimation($('circle'), {'stroke-dashoffset': animateToNumber}, this.svgOptions.speed);
};

function setAnimation(element, animationProperty, animationsvgOptions) {
    return element.animate(animationProperty, animationsvgOptions);
}

function setStyles(element, styles) {
    return Object.assign(element.style, styles);
}

const svg = new SVG('.circle-box');
