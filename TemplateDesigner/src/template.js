/**
 A template is used to model the layout of a page.

 It can be represented using a JS object literal, or the object below.
 */

'use strict';

var ds = ds || {};

ds.Template = function() {
}

/**
 * Creates a new template object with the object literal data. 
 */
ds.Template.createTemplate = function(objectLiteral) {
	var result = new ds.Template();
	result = $.extend(result, objectLiteral);
	return result;
}

/**
 * Returns a component with a given ID, or null if not found.
 */
ds.Template.prototype.findComponent = function(id) {
	return this._findComponent(id, this.root);
}

/**
 * Returns a component with a given ID, or null if not found.
 */
ds.Template.prototype._findComponent = function(id, component) {
	if (id == component.uniqueID) 
		return component;
	if (component.children) {
		var length = component.children.length;
		for (var i = 0; i < length; ++i) {
			var result = this._findComponent(id, component.children[i]);
			if (result != null)
				return result;
		}
	}
	return null;
}

