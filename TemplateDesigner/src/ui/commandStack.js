 /*
  * A stack of commands which are executed and can be undone.
  */

'use strict';

var ds = ds || {};

/**
 * Constructs a new CommandStack.
 */
ds.CommandStack = function() {
    this.undoStack = [];
    this.redoStack = [];
}

/**
 * Stores a command and then executes it.
 */
ds.CommandStack.prototype.storeAndExecute = function(command) {
	this.undoStack.push(command);
	command.execute();
}

/**
 * Returns true if there is a command to undo.
 */
ds.CommandStack.prototype.canUndo = function() {
	return (this.undoStack.length > 0);
}

/**
 * Undoes the last command on the stack.
 */
ds.CommandStack.prototype.executeUndo = function() {
	if (this.undoStack.length > 0) {
		var command = this.undoStack.pop();
		command.undo();
		this.redoStack.push(command);
	}
}

/**
 * Returns true if there is a command to redo.
 */
ds.CommandStack.prototype.canRedo = function() {
	return (this.redoStack.length > 0);
}

/**
 * Redoes the last command on the redo stack.
 */
ds.CommandStack.prototype.executeRedo = function() {
	if (this.redoStack.length > 0) {
		var command = this.redoStack.pop();
		command.redo();
		this.undoStack.push(command);
	}
}

/**
 * Clears the command stack (undo and redo)
 */
ds.CommandStack.prototype.clear = function() {
    this.undoStack = [];
    this.redoStack = [];
}

