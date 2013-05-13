/**
 A set of functions to manipulate tempaltes.
 */

'use strict';

var ds = ds || {};

ds.template = ds.template || {};

/**
 * Returns the active layout for a given context, where context has the following form:
 * { orientation: "portrait or landscape "}
 */
ds.template.getActiveLayout = function(template, context) {
	if (template.targets == undefined)
		return null;
	var target = template.targets[0];
	if (context == null)
		return target.layout;
	if (context.orientation == "portrait") {
		if (target.portraitLayout)
			return target.portraitLayout;
	} else if (context.orientation == "landscape") {
		if (target.landscapeLayout)
			return target.landscapeLayout;
	}
	return target.layout;
}

/**
 * Returns a component with a given ID, or null if not found.
 */
ds.template.findComponentInLayout = function(component, id) {
	if (id == component.uniqueID) 
		return component;
	if (component.children) {
		var length = component.children.length;
		for (var i = 0; i < length; ++i) {
			var result = this.findComponentInLayout(component.children[i], id);
			if (result != null)
				return result;
		}
	}
	return null;
}


