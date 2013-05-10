/**
 The TemplateDesigner implementation
 */

'use strict';

$(function () {

	var article,
		publication,
		template,
		typeLibrary,
		selection;

	init();

	/**
	 * Initializes the template designer data
	 */
	function init() {
		initPalette();
		initModel();
		initKeyHandlers();

		$("#savePage").click(function() { saveFile(); });
		$("#openPage").click(function() { openFile(); });
	}

	function initModel() {
		selection = null;
		article = sampleArticles[0].definition;

		publication = new ds.Publication();
		publication.loadFromServer(function() {
			template = JSON.parse(JSON.stringify(publication.getDefaultTemplate()));
			template.designTime = true;
			renderArticle();
		});
	}

	function initPalette() {
		typeLibrary = new ds.ComponentTypeLib();
    	typeLibrary.loadRegistry();
		$("#paletteList").html($("#paletteItemTemplate").render(typeLibrary.getChildren()));
		$(".paletteItem").draggable({ 
			containment: "document", 
			helper: "clone", 
			zIndex: 100,
			cursor: "pointer", 
		 });
	}

	var DOM_VK_DELETE = 46;

	function initKeyHandlers() {
		$(document).keyup(function(event) {
			if (event.keyCode == DOM_VK_DELETE) {
				var focus = document.activeElement;
				var properties = document.getElementById("properties");
				if (focus == null || !isDescendant(properties, focus)) {
	 				deleteSelection();
	 			}
	 		}
		});
	}

	function isDescendant(parent, child) {
	     var node = child.parentNode;
	     while (node != null) {
	         if (node == parent) {
	             return true;
	         }
	         node = node.parentNode;
	     }
	     return false;
	}

	/**
	 * Saves the current template to a file.
	 */
	function saveFile() {
		var uriContent = "data:application/octet-stream," + encodeURIComponent($("#templateModel").val());
		window.location.href = uriContent;		
	}

	/**
	 * Asks the user to select a file, and then opens it.
	 */
	function openFile() {
		ds.openFileDialog(openFileNamed);
	}

	/**
	 * Opens a named file
	 */
	function openFileNamed(file) {
		var reader = new FileReader();

		reader.onload = function(e) {
			var templateStr = e.target.result;
			template = 	JSON.parse(templateStr);
			template.designTime = true;
			renderArticle();
		};

	  	reader.readAsText(file);
	}

	/**
	 * Renders an article
	 */
	function renderArticle() {
		// Generate content
		console.time("generateArticle");
		var renderer = new ds.ArticleRenderer();
		var actualOutput = renderer.renderPage(template, article);
		console.timeEnd("generateArticle");

		// Replace
		console.time("displayArticle");
		$("#canvas").html(actualOutput);
		console.timeEnd("displayArticle");

		// Update the selection.
		if (selection != null) {
			var element = document.getElementById(selection.component.uniqueID);
			activateSelection(element);
		}

		addCanvasInteraction();
		renderTemplate();
	};

	function addCanvasInteraction() {
		$(".gridCell").droppable({
		    tolerance: "pointer",
			accept: function( event) {
				var draggable = $(event.context);
				if (draggable.hasClass("paletteItem"))
					return canDropPaletteItemOnGrid(this);
				if (draggable.hasClass("selectable")) {
					return canDropSelectableOnGrid(draggable, this);
				}
			},
      		hoverClass: "dropTarget",
			drop: function( event, ui ) {
				var draggable = ui.draggable;
				if (draggable.hasClass("paletteItem"))
					dropPaletteItemOnGrid(draggable, this);
				if (draggable.hasClass("selectable"))
					moveSelectableInGrid(draggable, this);
			},
		});

		$(".flow").droppable({
		    tolerance: "pointer",
      		hoverClass: "dropTarget",
			drop: function( event, ui ) {
				var draggable = ui.draggable;
				if (ui.draggable.hasClass("paletteItem"))
					dropPaletteItemOnFlow(draggable, this);
			}
		});

		$(".selectable").click(function(event) {
			selectElement(this);
			event.stopPropagation();
		});

		$(".selectable").draggable({ 
			containment: "document", 
			helper: createSelectableDragElement,
			zIndex: 1000, 
			appendTo: '#canvas', 
			cursor: "pointer", 
			cursorAt: { top: 56, left: 56 }
		});
	}

	function selectElement(element) {
		var component = findComponent(element.id);
		if (component == null) {
			console.log("Unable to find component in selectElement: " + element.id);
			return;
		}
		selectPair(component, element);
	}

	function selectComponent(component) {
		var id = component.uniqueID
		var element = document.getElementById(id);
		if (element == null) {
			console.log("Unable to element in updateSelectedElement: " + id);
			return;
		}
		selectPair(component, element);
	}

	function selectPair(component, element) {
		// Short circuit selection
		if (selection != null && selection.component === component && selection.element === element)
			return;

		// Deselect the old one.
		if (selection) {
			deactivateSelection(selection.element);
			$("#propertyList").html("");
			selection = null;
		}

		// Select the new one.
		if (component) {
			selection = { "element":element, "component":component };
			activateSelection(element);
			displayProperties(selection);
		}
	}

	function activateSelection(element) {
		$(element).addClass("selected");
		$(element.parentElement).resizable({ 
     		helper: "resizable-helper",
			stop: function( event, ui ) {
				resizeSelectableInGrid(this, ui.size);
			},
		});
		selection.element = element;
	}

	function deactivateSelection(element) {
		$(element).removeClass("selected");
		$(element.parentElement).resizable("destroy");
	}

	function displayProperties(selection) {
		var component = selection.component;

		// Get the component type
		var componentType = typeLibrary.componentNamed(component.componentType);
		if (componentType == null) {
			console.log("Unable to find ctype in displayProperties: " + component.componentType);
			return;
		}

		// Get the property descriptors.
		var pdArray = componentType.getPropertyDescriptors();
		if (pdArray == null || pdArray.length == 0)
			return;

		// Craete a copy of the property descriptors and add property values.
		pdArray = JSON.parse(JSON.stringify(pdArray));
		for (var i = 0; i < pdArray.length; i++) {
			var pd = pdArray[i];
			pd.value = component[pd.name];
		}

		// Display the properties.
		$("#propertyList").html($("#propertyItemTemplate").render(pdArray));

		// Add property change listeners.
		$(".propertyValue").change(function() {
			updateProperty(this);
		});
	}

	function updateProperty(element) {
		// Update the property
		var component = selection.component;
		component[element.dataset.prop_name] = element.value;

		// Render
		renderArticle();		
	}

	function createSelectableDragElement( event ) {
		var $this = $(this);
		var clone = $this.clone().removeAttr("id");
		clone.css("maxWidth", $this.width());
		return clone;
	}

	// TODO: Convert into OO method
	function canDropPaletteItemOnGrid(target) {
		return canDropOnGrid(target, 1, 1);
	}

	function canDropSelectableOnGrid(draggable, target) {
		var element = draggable[0];
		var component = findComponent(element.id);
		if (component == null) {
			console.log("Unable to find component in canDropSelectableOnGrid: " + element);
			return false;
		}
		if (component.position === undefined)
			return false;
		return canDropOnGrid(target, component.position.width, component.position.height);
	}

	// TODO: Convert into OO method
	function canDropOnGrid(target, width, height) {
		// Get the target grid
		var gridID = target.parentElement.id;
		var grid = findComponent(gridID);
		if (grid == null) {
			console.log("Unable to find grid in canDropOnGrid: " + gridID);
			return false;
		}

		// Calculate the target area
		var left = +target.dataset.column;
		var top = +target.dataset.row;
		var right = left + width - 1;
		var bottom = top + height - 1;

		// Make sure the target area is in the grid.
		if (left < 0 || top < 0 || right >= grid.columns || bottom >= grid.rows)
			return false;

		// Make sure the target area is unoccupied.
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

	// TODO: Convert into OO method
	function dropPaletteItemOnGrid(draggable, target) {
		// Get the target parent.
		var gridID = target.parentElement.id;
		var grid = findComponent(gridID);
		if (grid == null) {
			console.log("Unable to find parent in dropPaletteItem: " + gridID);
			return;
		}

		// Create the child component.
		// TODO: Convert into factory method.
		var paletteItem = draggable[0];
		var componentType = typeLibrary.componentNamed(paletteItem.dataset.ctype);
		if (componentType == null) {
			console.log("Unable to find ctype in dropPaletteItem: " + paletteItem.dataset.ctype);
			return;
		}
		var component = componentType.createComponent(paletteItem.dataset.ctype);
		component.position = {
				left: +target.dataset.column,
				top: +target.dataset.row,
				width:1,
				height:1
		};
		grid.children.push(component);

		// Rerender
		renderArticle();

		// Select the new component.
		selectComponent(component);
	}

	// TODO: Convert into OO method
	function moveSelectableInGrid(draggable, target) {
		// Get the component.
		var element = draggable[0];
		var component = findComponent(element.id);
		if (component == null) {
			console.log("Unable to find component in dropSelectableOnGrid: " + element);
			return false;
		}

		// Reposition the component.
		component.position.left = +target.dataset.column;
		component.position.top = +target.dataset.row;

		// See http://forum.jquery.com/topic/on-draggable-destroy-uncaught-typeerror-cannot-read-property-options-of-undefined
		var draggable_data = draggable.data('ui-draggable');

		// Rerender
		renderArticle();
		draggable.data('ui-draggable', draggable_data);
	}

	// TODO: Convert into OO method
	function dropPaletteItemOnFlow(draggable, target) {
		// Get the target parent.
		var parentID = target.id;
		var parent = findComponent(parentID);
		if (parent == null) {
			console.log("Unable to find parent in dropPaletteItem: " + parentID);
			return;
		}

		// Create the child component.
		// TODO: Convert into factory method.
		var paletteItem = draggable[0];
		var componentType = typeLibrary.componentNamed(paletteItem.dataset.ctype);
		if (componentType == null) {
			console.log("Unable to find ctype in dropPaletteItem: " + paletteItem.dataset.ctype);
			return;
		}
		var component = componentType.createComponent(paletteItem.dataset.ctype);
		parent.children.push(component);

		// Rerender
		renderArticle();

		// Select the new component.
		selectComponent(component);
	}

	function resizeSelectableInGrid(draggable, size) {
		// Get the target parent.
		var gridID = draggable.parentElement.id;
		var grid = findComponent(gridID);
		if (grid == null) {
			console.log("Unable to find grid in resizeSelectableInGrid: " + gridID);
			return;
		}

		// Get the component.
		var element = draggable.childNodes[0];
		var component = findComponent(element.id);
		if (component == null) {
			console.log("Unable to find component in resizeSelectableInGrid: " + element);
			return false;
		}

		// Resize the component.
		var width = Math.round(size.width / (grid.width / grid.columns));
		var height = Math.round(size.height / (grid.height / grid.rows));
		component.position.width = width;
		component.position.height = height;

		// Rerender
		renderArticle();
	}

	function deleteSelection() {
		if (selection == null)
			return;
		if (selection.component === template.root)
			return;

		// Get the target parent.
		var parent = findParent(selection.component);
		if (parent == null) {
			console.log("Unable to find parent in deleteSelection: " + selection.component);
			return;
		}

		// Remove the component.
		var index = parent.children.indexOf(selection.component);
		parent.children.splice(index, 1);
		selectPair(null, null);

		// Rerender
		renderArticle();
	}

	function renderTemplate() {
		var templateStr = JSON.stringify(template, null, " ");
		$("#templateModel").val(templateStr);
	}

	// TODO: Convert into OO method
	function findComponent(id) {
		return findComponentIn(id, template.root);
	}

	// TODO: Convert into OO method
	function findComponentIn(id, component) {
		if (id == component.uniqueID) 
			return component;
		if (component.children) {
			var length = component.children.length;
			for (var i = 0; i < length; ++i) {
				var result = findComponentIn(id, component.children[i]);
				if (result != null)
					return result;
			}
		}
		return null;
	}

	// TODO: Convert into OO method
	function findParent(child) {
		return findParentIn(child, template.root);
	}

	// TODO: Convert into OO method
	function findParentIn(child, component) {
		var children = component.children;
		if (children) {
			if (children.indexOf(child) >= 0)
				return component;
			var length = children.length;
			for (var i = 0; i < length; ++i) {
				var result = findParentIn(child, children[i]);
				if (result != null)
					return result;
			}
		}
		return null;
	}

});


