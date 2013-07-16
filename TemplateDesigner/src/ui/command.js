/*
  * A Command implementation.
  */

'use strict';

var ds = ds || {};

/**
 * Constructs a new Command.
 */
ds.Command = function() {
	this.done = false;
	this.undone = false;
	this.redone = false;
}

ds.Command.prototype.execute = function() {
	this.done = true;
}

ds.Command.prototype.undo = function() {
	this.undone = true;
}

ds.Command.prototype.redo = function() {
	this.redone = true;
}

