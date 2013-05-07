/**
 * Creates a new component type with a name and a jsRender template.
 * If you have a template string use makeComponentType instead.
 */

'use strict';

var ds = ds || {};

// Define the path to jsRender when jQuery is present and not present.
var $views = (typeof jQuery === 'undefined') ? jsviews : jQuery.views;

ds.ComponentType = function(name, template) {
    this.name = name;
    this.template = template;
    this.composite = false;
}
 
/**
 * Creates a new component type with a name and template string.
 */
ds.ComponentType.makeComponentType = function(name, htmlTmpl, composite) {
	var jsRenderTmpl = $views.templates(htmlTmpl);
	if (jsRenderTmpl == null)
		throw 'Invalid template:' + htmlTmpl;
	var cmp = new ds.ComponentType(name, jsRenderTmpl);
	if (composite)
		cmp.setComposite(composite);
	return cmp;
}

ds.ComponentType.prototype.getInfo = function() {
    return 'ComponentType(' + this.name + ')';
};

ds.ComponentType.prototype.getName = function() {
    return this.name;
};

ds.ComponentType.prototype.getTemplate = function() {
    return this.template;
};

ds.ComponentType.prototype.render = function(data, targetSelector) {
	var htmlString = this.template.render(data);
	if (targetSelector) {
		$(targetSelector).html(htmlString);
	}
	return htmlString;
};

ds.ComponentType.prototype.setComposite = function(composite) {
	this.composite = composite;
};

ds.ComponentType.prototype.isComposite = function() {
	return this.composite;
};