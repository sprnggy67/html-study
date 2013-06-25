/**
 * A canvas where you can display and edit a template.
 */

'use strict';

var ds = ds || {};

/**
 * Constructs a new PropertyList with a root element ID
 * The properties within the list are defined when a component is selected.
 */
ds.Canvas = function(rootElementID, template, activeLayout, sampleArticle, typeLibrary, onComponentSelected) {
	this.rootElementID = rootElementID;
	this.template = template;
	this.activeLayout = activeLayout;
	this.sampleArticle = sampleArticle;
	this.typeLibrary = typeLibrary;
	this.selection = null;
	this.onComponentSelected = onComponentSelected;
	this.activeArticleIndex = 0;
}

/**
 * Renders the template and displays the result in the canvas
 */
ds.Canvas.prototype.repaint = function() {
	// Get the frame attributes.
	var $frame = $(this.rootElementID);
	var $contents = $("#canvas")
	var margin = $contents.css("marginTop");
	margin = parseInt(margin);

	// Generate the content
	console.time("generateArticle");
	var renderer = new ds.ArticleRenderer();
	var rendererOutput = renderer.renderBody(this.template, this.sampleArticle, { 
		"orientation":"portrait",
		"width":$frame.innerWidth() - margin * 2,
		"height":$frame.innerHeight() - margin * 2
	});
	console.timeEnd("generateArticle");

	// Fill the frame.
	console.time("displayArticle");
	$contents.html(rendererOutput);
	console.timeEnd("displayArticle");

	// Update the selection.
	if (this.selection != null) {
		var element = document.getElementById(this.selection.component.uniqueID);
		this.activateSelection(element);
	}

	this.addCanvasInteraction();
};

/**
 * Sets the active article index. This is used to seed the data path when a new component is created
 */
ds.Canvas.prototype.setActiveArticleIndex = function(index) {
	this.activeArticleIndex = index;
}

/**
 * Sets the active article index. This is used to seed the data path when a new component is created
 */
ds.Canvas.prototype.setTemplate = function(template, activeLayout) {
	this.template = template;
	this.activeLayout = activeLayout;
	this.selection = null;
	this.repaint();
	this.fireSelection();
}

/**
 * Adds interaction to all droppable and clickable items in the template canvas
 */
ds.Canvas.prototype.addCanvasInteraction = function() {
	var that = this;
	$(".gridCell").droppable({
	    tolerance: "pointer",
		accept: function( event) {
			var draggable = $(event.context);
			if (draggable.hasClass("paletteItem"))
				return that.canDropPaletteItemOnGrid(this);
			if (draggable.hasClass("selectable")) {
				return that.canDropSelectableOnGrid(draggable, this);
			}
		},
  		hoverClass: "dropTarget",
		drop: function( event, ui ) {
			var draggable = ui.draggable;
			if (draggable.hasClass("paletteItem"))
				that.dropPaletteItemOnGrid(draggable, this);
			if (draggable.hasClass("selectable"))
				that.moveSelectableInGrid(draggable, this);
		},
	});

	$(".flow").droppable({
	    tolerance: "pointer",
  		hoverClass: "dropTarget",
		drop: function( event, ui ) {
			var draggable = ui.draggable;
			if (ui.draggable.hasClass("paletteItem"))
				that.dropPaletteItemOnFlow(draggable, this);
		}
	});

	$(".selectable").click(function(event) {
		that.selectElement(this);
		event.stopPropagation();
	});

	$(".selectable").draggable({ 
		containment: "document", 
		helper: ds.Canvas.createDragElement,
		zIndex: 1000, 
		appendTo: '#canvas', 
		cursor: "pointer", 
		cursorAt: { top: 56, left: 56 }
	});
}

/**
 * Creates the visual element which appears when you drag an object from one cell to another.
 */
ds.Canvas.createDragElement = function( event ) {
	var $this = $(this);
	var clone = $this.clone().removeAttr("id");
	clone.css("maxWidth", $this.width());
	return clone;
}

/**
 * Select an element. This creates an element component pair and calls selectPair
 */
ds.Canvas.prototype.selectElement = function(element) {
	var component = ds.template.findComponentInLayout(this.activeLayout, element.id);
	if (component == null) {
		console.log("Unable to find component in selectElement: " + element.id);
		return;
	}
	this.selectPair(component, element);
}

/**
 * Select an component. This creates an element component pair and calls selectPair
 */
ds.Canvas.prototype.selectComponent = function(component) {
	var id = component.uniqueID
	var element = document.getElementById(id);
	if (element == null) {
		console.log("Unable to element in updateSelectedElement: " + id);
		return;
	}
	this.selectPair(component, element);
}

/**
 * Select a component element pair
 */
ds.Canvas.prototype.selectPair = function(component, element) {
	// Short circuit selection
	if (this.selection != null && this.selection.component === component && this.selection.element === element)
		return;

	// Deselect the old one.
	if (this.selection) {
		this.deactivateSelection(this.selection.element);
		this.selection = null;
	}

	// Select the new one.
	if (component) {
		this.selection = { "element":element, "component":component };
		this.activateSelection(element);
	}

	this.fireSelection();
}

ds.Canvas.prototype.activateSelection = function(element) {
	var that = this;
	$(element).addClass("selected");
	$(element.parentElement).resizable({ 
 		helper: "resizable-helper",
		stop: function( event, ui ) {
			that.resizeSelectableInGrid(this, ui.size);
		},
	});
	this.selection.element = element;
}

ds.Canvas.prototype.deactivateSelection = function(element) {
	$(element).removeClass("selected");
	$(element.parentElement).resizable("destroy");
}

ds.Canvas.prototype.getSelection = function() {
	return this.selection;
}

ds.Canvas.prototype.fireSelection = function() {
	if (this.onComponentSelected) {
		if (this.selection)
			this.onComponentSelected(this, this.selection.component);
		else
			this.onComponentSelected(this, null);
	}
}

ds.Canvas.prototype.canDropPaletteItemOnGrid = function(targetElement) {
	return this.canDropOnGrid(targetElement, 1, 1);
}

ds.Canvas.prototype.canDropSelectableOnGrid = function(draggable, targetElement) {
	var sourceElement = draggable[0];
	var component = ds.template.findComponentInLayout(this.activeLayout, sourceElement.id);
	if (component == null) {
		console.log("Unable to find component in canDropSelectableOnGrid: " + sourceElement);
		return false;
	}
	if (component.position === undefined)
		return false;
	return this.canDropOnGrid(targetElement, component.position.width, component.position.height);
}

ds.Canvas.prototype.canDropOnGrid = function(targetElement, width, height) {
	// Get the target grid id
	var gridID = targetElement.parentElement.id;

	// Get the target grid
	var grid = ds.template.findComponentInLayout(this.activeLayout, gridID);
	if (grid == null) {
		console.log("Unable to find grid in canDropOnGrid: " + gridID);
		return false;
	}

	// Calculate the target area
	var left = +targetElement.dataset.column;
	var top = +targetElement.dataset.row;
	var right = left + width - 1;
	var bottom = top + height - 1;

	// Make sure the target area is in the grid.
	if (left < 0 || top < 0 || right >= grid.columns || bottom >= grid.rows)
		return false;

	// Make sure the target area is unoccupied.
	// This should be a method in Component.
	var childCount = grid.children.length;
	for (var i = 0; i < childCount; ++i) {
		var position = grid.children[i].position;
		// TODO: Convert into rectangle function
		if ((position.left <= left && right < (position.left + position.width)) &&
			(position.top <= top && bottom < (position.top + position.height)))
			return false;
	}

	return true;
}

ds.Canvas.prototype.dropPaletteItemOnGrid = function(draggable, targetElement) {
	// Get the target parent.
	var gridID = targetElement.parentElement.id;
	var grid = ds.template.findComponentInLayout(this.activeLayout, gridID);
	if (grid == null) {
		console.log("Unable to find parent in dropPaletteItem: " + gridID);
		return;
	}

	// Create the child component.
	var paletteItem = draggable[0];
	var componentType = this.typeLibrary.componentNamed(paletteItem.dataset.ctype);
	if (componentType == null) {
		console.log("Unable to find ctype in dropPaletteItem: " + paletteItem.dataset.ctype);
		return;
	}
	var component = componentType.createComponent(paletteItem.dataset.ctype);
	component.position = {
			left: +targetElement.dataset.column,
			top: +targetElement.dataset.row,
			width:1,
			height:1
	};

	// Add the child to the grid.
	// This should be a method in Component.
	grid.children.push(component);

	// Set the data path.
	if (component.dataPath) {
		this.setComponentDataPath(component);
	}

	// Rerender
	this.repaint();

	// Select the new component.
	this.selectComponent(component);
}

ds.Canvas.prototype.setComponentDataPath = function(component) {
	if (this.activeArticleIndex == 0) {
		component.dataPath = '#root';
		component.dataIndex = null;
	} else {
		component.dataPath = 'children';
		component.dataIndex = this.activeArticleIndex - 1;
	}
}

ds.Canvas.prototype.moveSelectableInGrid = function(draggable, targetElement) {
	// Get the component.
	var element = draggable[0];
	var component = ds.template.findComponentInLayout(this.activeLayout, element.id);
	if (component == null) {
		console.log("Unable to find component in dropSelectableOnGrid: " + element);
		return false;
	}

	// Reposition the component.
	component.position.left = +targetElement.dataset.column;
	component.position.top = +targetElement.dataset.row;

	// See http://forum.jquery.com/topic/on-draggable-destroy-uncaught-typeerror-cannot-read-property-options-of-undefined
	var draggable_data = draggable.data('ui-draggable');

	// Rerender
	this.repaint();

	draggable.data('ui-draggable', draggable_data);
}

ds.Canvas.prototype.dropPaletteItemOnFlow = function(draggable, targetElement) {
	// Get the target parent.
	var parentID = targetElement.id;
	var parent = ds.template.findComponentInLayout(this.activeLayout, parentID);
	if (parent == null) {
		console.log("Unable to find parent in dropPaletteItem: " + parentID);
		return;
	}

	// Create the child component.
	var paletteItem = draggable[0];
	var componentType = this.typeLibrary.componentNamed(paletteItem.dataset.ctype);
	if (componentType == null) {
		console.log("Unable to find ctype in dropPaletteItem: " + paletteItem.dataset.ctype);
		return;
	}
	var component = componentType.createComponent(paletteItem.dataset.ctype);

	// Add the child to the flow.
	// This should be a method in Component.
	parent.children.push(component);

	// Set the data path.
	if (component.dataPath) {
		this.setComponentDataPath(component);
	}

	// Rerender
	this.repaint();

	// Select the new component.
	this.selectComponent(component);
}

ds.Canvas.prototype.resizeSelectableInGrid = function(draggable, size) {
	// Get the draggable parent.
	var gridID = draggable.parentElement.id;
	var grid = ds.template.findComponentInLayout(this.activeLayout, gridID);
	if (grid == null) {
		console.log("Unable to find grid in resizeSelectableInGrid: " + gridID);
		return;
	}

	// Get the component.
	var element = draggable.childNodes[0];
	var component = ds.template.findComponentInLayout(this.activeLayout, element.id);
	if (component == null) {
		console.log("Unable to find component in resizeSelectableInGrid: " + element);
		return false;
	}

	// Resize the component.
	// This should be a method in Component.
	var width = Math.round(size.width / (grid.width / grid.columns));
	var height = Math.round(size.height / (grid.height / grid.rows));
	component.position.width = width;
	component.position.height = height;

	// Rerender
	this.repaint();
}

ds.Canvas.prototype.deleteSelection = function() {
	if (this.selection == null)
		return;
	if (this.selection.component === this.activeLayout)
		return;

	// Get the selection parent.
	var parentComponent = ds.template.findParentInLayout(this.activeLayout, this.selection.component);
	if (parentComponent == null) {
		console.log("Unable to find parent in deleteSelection: " + this.selection.component);
		return;
	}

	// Remove the component.
	var index = parentComponent.children.indexOf(this.selection.component);
	parentComponent.children.splice(index, 1);
	this.selectPair(null, null);

	// Rerender
	this.repaint();
}


