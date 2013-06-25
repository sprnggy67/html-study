/**
 * A component factory.
 * This class is used to convert a simple JS object into Component or Grid object.
 */

'use strict';

var ds = ds || {};

ds.componentFactory = ds.componentFactory || {};

/**
 * Constructs a new Component with optional contents.
 * If contents are defined, the contents are copied into the template instance.
 * The component children are converted into ds.Component objects.
 */
ds.componentFactory.createComponent = function(contents) {
	if (contents.componentType == "grid")
		return new ds.Grid(contents);
	if (contents.componentType == "flow")
		return new ds.Composite(contents);
	else
		return new ds.Component(contents);
}