/**
 A TemplateDesigner 
 */

'use strict';

var ds = ds || {};

ds.TemplateDesigner = function() {
}

/**
 Loads the default designer state from a server.
 */
ds.TemplateDesigner.prototype.loadFromServer = function(callback) {
	this.publication = new ds.Publication();
	var that = this;
	this.publication.loadFromServer(function() {
		// Create the initial template.
		that.template = JSON.parse(JSON.stringify(that.publication.getDefaultTemplate()));

		// Notify listeners.
		callback();
	});
};

/**
 Returns the publication name.
 */
ds.TemplateDesigner.prototype.getPublication = function() {
	return this.publication;
};

/**
 Returns the template.
 */
ds.TemplateDesigner.prototype.getTemplate = function() {
	return this.template;
};




