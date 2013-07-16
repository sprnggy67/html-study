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
	this.debug = true;
}

/**
 * Sets the template. This is used when a new template is created, or an old template is reopened.
 */
ds.Canvas.prototype.setTemplate = function(template, activeLayout) {
	this.template = template;
	this.activeLayout = activeLayout;
	this.selection = null;
	this.repaint();
	this.fireSelection();
}

/**
 * Sets the active article index. This is used to seed the data path when a new component is created
 */
ds.Canvas.prototype.setActiveArticleIndex = function(index) {
	this.activeArticleIndex = index;
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
 * Adds interaction to all droppable and clickable items in the template canvas
 */
ds.Canvas.prototype.addCanvasInteraction = function() {
	var that = this;

	// Click to select an object
	$(".selectable").click(function(event) {
		that.selectElement(this);
		event.stopPropagation();
	});

	// Click and drag to move an object
	$(".selectable").draggable({ 
		containment: "document", 
		helper: ds.Canvas.createDragElement,
		zIndex: 1000, 
		appendTo: '#canvas', 
		cursor: "pointer", 
		cursorAt: { top: 56, left: 56 }
	});

	// Drop an object on a grid
	$(".gridCell").droppable({
	    tolerance: "intersect",
		accept: function( event) {
			var draggable = $(event.context);
			if (draggable.hasClass("componentListItem"))
				return that.canDropPaletteItemOnGrid(this);
			if (draggable.hasClass("selectable")) {
				return that.canDropSelectableOnGrid(draggable, this);
			}
		},
  		hoverClass: "dropTarget",
		drop: function( event, ui ) {
			console.log("drop on gridCell");
			var draggable = ui.draggable;
			if (draggable.hasClass("componentListItem"))
				that.dropPaletteItemOnGrid(draggable, this);
			if (draggable.hasClass("selectable"))
				that.dropSelectableOnGrid(draggable, this);
		},
	});

	// Drop an object on a flow
	$(".flow").droppable({
	    tolerance: "intersect",
  		hoverClass: "dropTarget",
		drop: function( event, ui ) {
			console.log("drop on flow");
			var draggable = ui.draggable;
			if (ui.draggable.hasClass("componentListItem"))
				that.dropPaletteItemOnFlow(draggable, this);
		}
	});
}

/**
 * Select an element. This creates an element component pair and calls selectPair
 */
ds.Canvas.prototype.selectElement = function(element) {
	var component = this.activeLayout.findComponent(element.id);
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

ds.Canvas.prototype.deleteSelection = function() {
	if (this.selection == null)
		return;
	if (this.selection.component === this.activeLayout)
		return;

	// Get the selection parent.
	var parentComponent = this.activeLayout.findParent(this.selection.component);
	if (parentComponent == null) {
		console.log("Unable to find parent in deleteSelection: " + this.selection.component);
		return;
	}

	// Remove the component.
	parentComponent.removeChild(this.selection.component);
	this.selectPair(null, null);

	// Rerender
	this.repaint();
}

/**
 * Creates the element which appears when you drag an object from one cell to another.
 */
ds.Canvas.createDragElement = function( event ) {
	var $this = $(this);
	var clone = $this.clone().removeAttr("id");
	clone.css("maxWidth", $this.width());
	return clone;
}

ds.Canvas.prototype.canDropPaletteItemOnGrid = function(targetElement) {
	var result = this.canDropOnGrid(targetElement, 1, 1);
	if (this.debug) {
		console.log("canDropPaletteItemOnGrid returns " + result);
	}
	return result;
}

ds.Canvas.prototype.canDropSelectableOnGrid = function(draggable, targetElement) {
	var sourceElement = draggable[0];
	var grid = this.activeLayout.findComponent(sourceElement.id);
	if (grid == null) {
		console.log("Unable to find component in canDropSelectableOnGrid: " + sourceElement);
		return false;
	}
	if (grid.position === undefined)
		return false;
	return this.canDropOnGrid(targetElement, grid.position.width, grid.position.height);
}

ds.Canvas.prototype.canDropOnGrid = function(targetElement, width, height) {
	// Get the target grid id
	var gridID = targetElement.parentElement.id;

	// Get the target grid
	var grid = this.activeLayout.findComponent(gridID);
	if (grid == null) {
		console.log("Unable to find grid in canDropOnGrid: " + gridID);
		return false;
	}

	// Calculate the target area
	var left = +targetElement.dataset.column;
	var top = +targetElement.dataset.row;
	var right = left + width - 1;
	var bottom = top + height - 1;

	// Determine if the target area is free
	return grid.isRectFree(left, top, right, bottom);
}

ds.Canvas.prototype.dropPaletteItemOnGrid = function(draggable, targetElement) {
	if (this.debug) {
		console.log("dropPaletteItemOnGrid");
	}

	// Get the target parent.
	var gridID = targetElement.parentElement.id;
	var grid = this.activeLayout.findComponent(gridID);
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
	grid.addChild(component);

	// Set the data path.
	if (component.dataPath) {
		this.setComponentDataPath(component);
	}

	// Rerender
	this.repaint();

	// Select the new component.
	this.selectComponent(component);
}

ds.Canvas.prototype.dropPaletteItemOnFlow = function(draggable, targetElement) {
	// Get the target parent.
	var flowID = targetElement.id;
	var flow = this.activeLayout.findComponent(flowID);
	if (flow == null) {
		console.log("Unable to find parent in dropPaletteItem: " + flowID);
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
	flow.addChild(component);

	// Set the data path.
	if (component.dataPath) {
		this.setComponentDataPath(component);
	}

	// Rerender
	this.repaint();

	// Select the new component.
	this.selectComponent(component);
}

ds.Canvas.prototype.dropSelectableOnGrid = function(draggable, targetElement) {
	// Get the component.
	var element = draggable[0];
	var component = this.activeLayout.findComponent(element.id);
	if (component == null) {
		console.log("Unable to find component in dropSelectableOnGrid: " + element);
		return false;
	}

	// Reposition the component.
	component.position.left = +targetElement.dataset.column;
	component.position.top = +targetElement.dataset.row;

	// Fix "Uncaught TypeError: Cannot read property 'options' of undefined"
	// See http://forum.jquery.com/topic/on-draggable-destroy-uncaught-typeerror-cannot-read-property-options-of-undefined
	var draggable_data = draggable.data('ui-draggable');

	// Rerender
	this.repaint();

	draggable.data('ui-draggable', draggable_data);
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

ds.Canvas.prototype.resizeSelectableInGrid = function(draggable, size) {
	// Get the draggable parent.
	var gridID = draggable.parentElement.id;
	var grid = this.activeLayout.findComponent(gridID);
	if (grid == null) {
		console.log("Unable to find grid in resizeSelectableInGrid: " + gridID);
		return;
	}

	// Get the component.
	var element = draggable.childNodes[0];
	var component = this.activeLayout.findComponent(element.id);
	if (component == null) {
		console.log("Unable to find component in resizeSelectableInGrid: " + element);
		return false;
	}

	// Resize the component.
	grid.resizeChild(component, size);

	// Rerender
	this.repaint();
}


