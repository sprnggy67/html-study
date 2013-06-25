/**
 * grid where you can display and edit a template.
 */

'use strict';

var ds = ds || {};

/**
 * Constructs a new Grid with optional contents.
 * If contents are defined, the contents are copied into the template instance.
 * The component children are converted into ds.Component objects.
 */
ds.Grid = function(contents) {
	this.width = 0;
	this.height = 0;
	this.columns = 0;
	this.rows = 0;
	ds.Composite.prototype.constructor.call(this, contents);
}

// Define the inheritance chain to Composite
ds.Grid.prototype = new ds.Composite();    
ds.Grid.prototype.constructor = ds.Grid;

/**
 * Resizes a child component to fit in a grid.
 * The width and height of the child is taken from the size parameter
 * and rounded to the closest cell boundary.
 */
ds.Grid.prototype.resizeChild = function(child, size) {
	var width = Math.round(size.width / (this.width / this.columns));
	var height = Math.round(size.height / (this.height / this.rows));
	child.position.width = width;
	child.position.height = height;
}

/**
 * Returns true if the region in a grid is free.
 * The width and height of the child is taken from the size parameter
 * and rounded to the closest cell boundary.
 */
ds.Grid.prototype.isRectFree = function(left, top, right, bottom) {
	// If the target area extends beyond the grid, return false
	if (left < 0 || top < 0 || right >= this.columns || bottom >= this.rows)
		return false;

	// If the target area is occupied, return false.
	var childCount = this.children.length;
	for (var i = 0; i < childCount; ++i) {
		var position = this.children[i].position;
		if ((position.left <= left && right < (position.left + position.width)) &&
			(position.top <= top && bottom < (position.top + position.height)))
			return false;
	}

	return true;
}


