/**
 The TemplateDesigner implementation
 */

'use strict';

$(function () {

	var sampleArticle,
		publication,
		template,
		activeArticle,
		activeLayout,
		typeLibrary,
		selection;

	init();

	/**
	 * Initializes the template designer data
	 */
	function init() {
		initModel();
		initArticleList();
		initComponentPalette();
		initMenu();
		initKeyHandlers();
	}

	function initModel() {
		selection = null;
		sampleArticle = sampleArticles[0].definition;
		publication = new ds.Publication();
		publication.loadFromServer(function() {
			template = JSON.parse(JSON.stringify(publication.getDefaultTemplate()));
			activeLayout = ds.template.getActiveLayout(template);
			activeLayout.designTime = true;
			renderTemplate();
		});
	}

	function initArticleList() {
		// Create and display the list of articles
		var dataArray = [ { displayName:"Root Article"} ];
		for (var x = 0; x < sampleArticle.children.length; x ++) {
			dataArray.push( { displayName:"Sub Article " + (x+1) });
		};
		$("#dataList").html($("#dataItemTemplate").render(dataArray));

		// Select the first article.
		activeArticle = 0;
		$(".dataItem").first().addClass("selected");

		// Add click interaction.
		$(".dataItem").click(function() {
			$(".dataItem").eq(activeArticle).removeClass("selected");
			activeArticle = this.dataset.index;
			$(".dataItem").eq(activeArticle).addClass("selected");
		});
	}

	function initComponentPalette() {
		// Create and display the component library
		typeLibrary = new ds.ComponentTypeLib();
    	typeLibrary.loadRegistry();
		$("#paletteList").html($("#paletteItemTemplate").render(typeLibrary.getChildren()));

		// Add drag interaction
		$(".paletteItem").draggable({ 
			containment: "document", 
			helper: "clone", 
			zIndex: 100,
			cursor: "pointer", 
		 });
	}

	function initMenu() {
		$("#savePage").click(function() { saveFile(); });
		$("#openPage").click(function() { openFile(); });
		$("#saveHTML").click(function() { saveHTML(); });
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

	function isDescendant(parentElement, childElement) {
	     var node = childElement.parentNode;
	     while (node != null) {
	         if (node == parentElement) {
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
		var templateStr = JSON.stringify(template, null, " ");
		var uriContent = "data:application/octet-stream," + encodeURIComponent(templateStr);
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
			activeLayout = ds.template.getActiveLayout(template);
			activeLayout.designTime = true;
			renderTemplate();
		};

	  	reader.readAsText(file);
	}

	/**
	 * Saves the contents as an HTML file.
	 */
	function saveHTML() {
		// Run the template.
		var renderer = new ds.ArticleRenderer();
		var result = renderer.renderPage(template, sampleArticle);

		// Format the output.
		result = result.replace(/<(\/?)[a-zA-Z]+(?:[^>"']+|"[^"]*"|'[^']*')*>/g, function($0, $1) {
		    return $1 === "/" ? $0+"\n" : "\n"+$0;
		});

		// Save the content to a file.
		var uriContent = "data:application/octet-stream," + encodeURIComponent(result);
		window.open(uriContent, 'Save');		
	}

	/**
	 * Renders the sample article
	 */
	function renderTemplate() {
		// Get the frame attributes.
		var $frame = $("#canvasFrame");
		var $contents = $("#canvas")
		var margin = $contents.css("marginTop");
		margin = parseInt(margin);

		// Generate the content
		console.time("generateArticle");
		var renderer = new ds.ArticleRenderer();
		var rendererOutput = renderer.renderBody(template, sampleArticle, { 
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
		if (selection != null) {
			var element = document.getElementById(selection.component.uniqueID);
			activateSelection(element);
		}

		addCanvasInteraction();
		displayTemplateModel();
	};

	/**
	 * Displays the template model as a JSON string
	 */
	function displayTemplateModel() {
		var templateStr = JSON.stringify(template, null, " ");
		$("#templateModel").val(templateStr);
	}

	/**
	 * Adds interaction to all droppable and clickable items in the template canvas
	 */
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
			helper: createDragElement,
			zIndex: 1000, 
			appendTo: '#canvas', 
			cursor: "pointer", 
			cursorAt: { top: 56, left: 56 }
		});
	}

	/**
	 * Creates the visual element which appears when you drag an object from one cell to another.
	 */
	function createDragElement( event ) {
		var $this = $(this);
		var clone = $this.clone().removeAttr("id");
		clone.css("maxWidth", $this.width());
		return clone;
	}

	/**
	 * Select an element. This creates an element component pair and calls selectPair
	 */
	function selectElement(element) {
		var component = ds.template.findComponentInLayout(activeLayout, element.id);
		if (component == null) {
			console.log("Unable to find component in selectElement: " + element.id);
			return;
		}
		selectPair(component, element);
	}

	/**
	 * Select an component. This creates an element component pair and calls selectPair
	 */
	function selectComponent(component) {
		var id = component.uniqueID
		var element = document.getElementById(id);
		if (element == null) {
			console.log("Unable to element in updateSelectedElement: " + id);
			return;
		}
		selectPair(component, element);
	}

	/**
	 * Select a component element pair
	 */
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

	/**
	 * Displays the properties for an element component pair
	 */
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
			if (pd.type == ds.ComponentType.PROPERTY_BOOLEAN) {
				if (component[pd.name])
					pd.checked = "checked";
				else
					pd.checked = "";
			} else {
				pd.value = component[pd.name];
			}
		}

		// Display the properties.
		$("#propertyList").html($("#propertyItemTemplate").render(pdArray));

		// Listen for property changes.
		$(".propertyValue").change(function() {
			updateProperty(this);
		});
	}

	/**
	 * Updates the property value for an element when it changes.
	 */
	function updateProperty(element) {
		// Get the property value
		var value = element.value;
		if (element.type == "checkbox") {
			value = $(element).is(':checked') ? true : false;
		} else if (value == "") {
			value = null;
		}

		// Store it on the component
		var component = selection.component;
		if (value == null) {
			delete component[element.dataset.prop_name];
		} else {
			component[element.dataset.prop_name] = value;
		}

		// Render
		renderTemplate();		
	}

	// TODO: Convert into OO method
	function canDropPaletteItemOnGrid(targetElement) {
		return canDropOnGrid(targetElement, 1, 1);
	}

	function canDropSelectableOnGrid(draggable, targetElement) {
		var sourceElement = draggable[0];
		var component = ds.template.findComponentInLayout(activeLayout, sourceElement.id);
		if (component == null) {
			console.log("Unable to find component in canDropSelectableOnGrid: " + sourceElement);
			return false;
		}
		if (component.position === undefined)
			return false;
		return canDropOnGrid(targetElement, component.position.width, component.position.height);
	}

	// TODO: Convert into OO method
	function canDropOnGrid(targetElement, width, height) {
		// Get the target grid
		var gridID = targetElement.parentElement.id;
		var grid = ds.template.findComponentInLayout(activeLayout, gridID);
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
	function dropPaletteItemOnGrid(draggable, targetElement) {
		// Get the target parent.
		var gridID = targetElement.parentElement.id;
		var grid = ds.template.findComponentInLayout(activeLayout, gridID);
		if (grid == null) {
			console.log("Unable to find parent in dropPaletteItem: " + gridID);
			return;
		}

		// Create the child component.
		var paletteItem = draggable[0];
		var componentType = typeLibrary.componentNamed(paletteItem.dataset.ctype);
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
		grid.children.push(component);

		// Set the data path.
		if (component.dataPath) {
			setComponentDataPath(component);
		}

		// Rerender
		renderTemplate();

		// Select the new component.
		selectComponent(component);
	}

	function setComponentDataPath(component) {
		if (activeArticle == 0) {
			component.dataPath = '#root';
			component.dataIndex = null;
		} else {
			component.dataPath = 'children';
			component.dataIndex = activeArticle - 1;
		}
	}

	// TODO: Convert into OO method
	function moveSelectableInGrid(draggable, targetElement) {
		// Get the component.
		var element = draggable[0];
		var component = ds.template.findComponentInLayout(activeLayout, element.id);
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
		renderTemplate();
		draggable.data('ui-draggable', draggable_data);
	}

	// TODO: Convert into OO method
	function dropPaletteItemOnFlow(draggable, targetElement) {
		// Get the target parent.
		var parentID = targetElement.id;
		var parent = ds.template.findComponentInLayout(activeLayout, parentID);
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

		// Set the data path.
		if (component.dataPath) {
			setComponentDataPath(component);
		}

		// Rerender
		renderTemplate();

		// Select the new component.
		selectComponent(component);
	}

	function resizeSelectableInGrid(draggable, size) {
		// Get the draggable parent.
		var gridID = draggable.parentElement.id;
		var grid = ds.template.findComponentInLayout(activeLayout, gridID);
		if (grid == null) {
			console.log("Unable to find grid in resizeSelectableInGrid: " + gridID);
			return;
		}

		// Get the component.
		var element = draggable.childNodes[0];
		var component = ds.template.findComponentInLayout(activeLayout, element.id);
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
		renderTemplate();
	}

	function deleteSelection() {
		if (selection == null)
			return;
		if (selection.component === activeLayout)
			return;

		// Get the selection parent.
		var parent = ds.template.findParentInLayout(activeLayout, selection.component);
		if (parent == null) {
			console.log("Unable to find parent in deleteSelection: " + selection.component);
			return;
		}

		// Remove the component.
		var index = parent.children.indexOf(selection.component);
		parent.children.splice(index, 1);
		selectPair(null, null);

		// Rerender
		renderTemplate();
	}

});


