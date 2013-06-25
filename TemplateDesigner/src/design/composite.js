/**
 * A composite component object.
 */

'use strict';

var ds = ds || {};

/**
 * Constructs a new Composite with optional contents.
 * If contents are defined, the contents are copied into the object instance.
 * The component children are converted into ds.Component objects.
 */
ds.Composite = function(contents) {
	this.children = [];
	ds.Component.prototype.constructor.call(this, contents);

	// Convert the children to Components.
	if (this.children) {
		var oldChildren = this.children;
		this.children = [];
		var length = oldChildren.length;
		for (var i = 0; i < length; ++i) {
			var newChild = ds.componentFactory.createComponent(oldChildren[i]);
			this.children.push(newChild);
		}
	}
}

// Define the inheritance chain to Component
ds.Composite.prototype = new ds.Component();    
ds.Composite.prototype.constructor = ds.Composite;

/**
 * Adds a child to the component
 */
ds.Composite.prototype.addChild = function(component) {
	this.children.push(component);
}

/**
 * Removes a child from the component
 */ 
ds.Composite.prototype.removeChild = function(component) {
	var index = this.children.indexOf(component);
	if (index >= 0)
		this.children.splice(index, 1);
}

/**
 * Returns a component with a given ID, or null if not found.
 */
ds.Composite.prototype.findComponent = function(id) {
	if (id == this.uniqueID) 
		return this;
	var childrenLength = this.children.length;
	for (var i = 0; i < childrenLength; ++i) {
		var child = this.children[i];
		var result = child.findComponent(id);
		if (result != null)
			return result;
	}
	return null;
}

/**
 * Returns the parent for a given component, or null if not found.
 */
ds.Composite.prototype.findParent = function(component) {
	if (this == component)
		return null;
	if (this.children.indexOf(component) >= 0)
		return this;
	var childrenLength = this.children.length;
	for (var i = 0; i < childrenLength; ++i) {
		var child = this.children[i];
		var result = child.findParent(component);
		if (result != null)
			return result;
	}
	return null;
}



