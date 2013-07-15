/**
 A component palette
 */

'use strict';

var ds = ds || {};

/**
 * Constructs a new ComponentPalette with a root element ID and a type library.
 * A palette item for every object in the type lirbrary will be displayed within the root element.
 */
ds.ComponentPalette = function(rootElementID, typeLibrary) {
	this.init(rootElementID, typeLibrary);
}

ds.ComponentPalette.prototype.init = function(rootElementID, typeLibrary) {
	// Create and display the component library
	$(rootElementID).html($("#componentListItemTemplate").render(typeLibrary.getChildren()));

	// Add drag interaction
	$(".componentListItem").draggable({ 
		containment: "document", 
		helper: "clone", 
		zIndex: 100,
		cursor: "pointer", 
	 });
}