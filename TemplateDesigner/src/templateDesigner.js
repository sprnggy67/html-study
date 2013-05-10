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
		$(".paletteItem").draggable({ containment: "document", helper: "clone", zIndex: 100 });
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
		// Render
		console.time("renderArticle");
		var renderer = new ds.ArticleRenderer();
		var actualOutput = renderer.renderPage(template, article);
		$("#canvas").html(actualOutput);
		console.timeEnd("renderArticle");

		// Update the selection.
		if (selection != null) {
			var element = document.getElementById(selection.component.uniqueID);
			$(element).addClass("selected");
			selection.element = element;
		}

		addCanvasInteraction();
		renderTemplate();
	};

	function addCanvasInteraction() {
		$(".gridCell").droppable({
			accept: function( event ) {
				return canDropPaletteItemOnGrid(this);
			},
      		hoverClass: "dropTarget",
			drop: function( event, ui ) {
				var draggable = ui.draggable;
				if (ui.draggable.hasClass("paletteItem"))
					dropPaletteItemOnGrid(draggable, this);
			}
		});

		$(".flow").droppable({
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
			$(selection.element).removeClass("selected");
			$("#propertyList").html("");
			selection = null;
		}

		// Select the new one.
		if (component) {
			selection = { "element":element, "component":component };
			$(element).addClass("selected");
			displayProperties(selection);
		}
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

	// TODO: Convert into OO method
	function canDropPaletteItemOnGrid(target) {
		// Get the drop target.
		var left = +target.dataset.column;
		var top = +target.dataset.row;

		// Get the target parent.
		var parentID = target.parentElement.id;
		var parent = findComponent(parentID);
		if (parent == null) {
			console.log("Unable to find parent in canDropPaletteItem: " + parentID);
			return false;
		}

		var childCount = parent.children.length;
		for (var i = 0; i < childCount; ++i) {
			var position = parent.children[i].position;
			// TODO: Convert into rectangle function
			if ((position.left <= left && left < (position.left + position.width)) &&
				(position.top <= top && top < (position.top + position.height)))
				return false;
		}

		return true;
	}

	// TODO: Convert into OO method
	function dropPaletteItemOnGrid(draggable, target) {
		// Get the target parent.
		var parentID = target.parentElement.id;
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
		component.position = {
				left: +target.dataset.column,
				top: +target.dataset.row,
				width:1,
				height:1
		};
		parent.children.push(component);

		// Rerender
		renderArticle();

		// Select the new component.
		selectComponent(component);
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

});


