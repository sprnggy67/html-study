/**
 The TemplateDesigner implementation
 */

'use strict';

$(function () {

	var article,
		publication,
		template,
		typeLibrary;

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
		article = sampleArticles[0].definition;

		publication = new ds.Publication();
		publication.loadFromServer(function() {
			template = JSON.parse(JSON.stringify(publication.getDefaultTemplate()));
//			template = ds.Template.createTemplate(template);
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
//			template = ds.Template.createTemplate(template);
			template.designTime = true;
			renderArticle();
		};

	  	reader.readAsText(file);
	}

	/**
	 * Renders an article
	 */
	function renderArticle() {
		console.time("renderArticle");
		var renderer = new ds.ArticleRenderer();
		var actualOutput = renderer.renderPage(template, article);
		$("#canvas").html(actualOutput);
		console.timeEnd("renderArticle");

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
			console.log("Unable to find parent in dropPaletteItem");
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
			console.log("Unable to find parent in dropPaletteItem");
			return;
		}

		// Create the child component.
		// TODO: Convert into factory method.
		var paletteItem = draggable[0];
		var componentType = typeLibrary.componentNamed(paletteItem.dataset.ctype);
		if (componentType == null) {
			console.log("Unable to find ctype in dropPaletteItem");
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
	}

	// TODO: Convert into OO method
	function dropPaletteItemOnFlow(draggable, target) {
		// Get the target parent.
		var parentID = target.id;
		var parent = findComponent(parentID);
		if (parent == null) {
			console.log("Unable to find parent in dropPaletteItem");
			return;
		}

		// Create the child component.
		// TODO: Convert into factory method.
		var paletteItem = draggable[0];
		var componentType = typeLibrary.componentNamed(paletteItem.dataset.ctype);
		if (componentType == null) {
			console.log("Unable to find ctype in dropPaletteItem");
			return;
		}
		var component = componentType.createComponent(paletteItem.dataset.ctype);
		parent.children.push(component);

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

});


