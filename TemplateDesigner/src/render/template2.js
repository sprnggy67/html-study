/**
 * A set of functions to manipulate tempaltes.
 */

'use strict';

var ds = ds || {};

/**
 * Constructs a new Template with optional contents.
 * If contents are defined, the contents are copied into the template instance.
 * The component definitions are converted into ds.Component objects.
 */
ds.Template = function(contents) {
	this.targets = undefined;
	if (contents) {
		// Copy all the fields
		for (var key in contents) {
        	this[key] = contents[key];
    	}

    	// Convert the children to Components.
		if (this.targets) {
			var length = this.targets.length;
			for (var i = 0; i < length; ++i) {
				var target = this.targets[i];
				if (target.layout)
					target.layout = ds.componentFactory.createComponent(target.layout);
				if (target.portraitLayout)
					target.portraitLayout = ds.componentFactory.createComponent(target.portraitLayout);
				if (target.landscapeLayout)
					target.landscapeLayout = ds.componentFactory.createComponent(target.landscapeLayout);
			}
		}
	}
}

/**
 * Returns the active layout for a given context, where context has the following form:
 * { orientation: "portrait or landscape "}
 * A layout is a Component object.
 */
ds.Template.prototype.getActiveLayout = function(context) {
	if (this.targets == undefined)
		return null;
	var target = this.targets[0];
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


