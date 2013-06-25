/**
 * A component object.
 */

'use strict';

var ds = ds || {};

/**
 * Constructs a new Component with optional contents.
 * If contents are defined, the contents are copied into the template instance.
 * The component children are converted into ds.Component objects.
 */
ds.Component = function(contents) {
	this.uniqueID = null;
	this.children = [];
	if (contents) {
		for (var key in contents) {
        	this[key] = contents[key];
    	}
    }
}

ds.Component.prototype.findComponent = function(id) {
	if (id == this.uniqueID)
		return this;
	return null;
}

ds.Component.prototype.findParent = function(component) {
	return null;
}





