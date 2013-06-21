/**
 The TemplateDesigner implementation
 */

'use strict';

$(function () {

	var sampleArticle, publication, template, activeLayout, typeLibrary;
	var articleList, componentPalette, propertyList, canvas;
	var listener;

	init();

	/**
	 * Initializes the template designer data
	 */
	function init() {
		initModel();
		initUserInterface();
	}

	function initModel() {
		sampleArticle = sampleArticles[0].definition;
		publication = new ds.Publication();
		publication.loadFromServer(function() {
			template = JSON.parse(JSON.stringify(publication.getDefaultTemplate()));
			activeLayout = ds.template.getActiveLayout(template);
			activeLayout.designTime = true;
			renderTemplate();
		});
		typeLibrary = new ds.ComponentTypeLib();
    	typeLibrary.loadRegistry();
	}

	var DOM_VK_DELETE = 46;

	function initUserInterface() {
		// Init the article list.
		articleList = new ds.ArticleList("#dataList", sampleArticle, onArticleSelected);

		// Init the component palette
		componentPalette = new ds.ComponentPalette("#paletteList", typeLibrary);

		// Init the property list.
		propertyList = new ds.PropertyList("#propertyList", typeLibrary, onPropertyChanged)

		// Init the canvas.
		canvas = new ds.Canvas("#canvasFrame", template, activeLayout, sampleArticle, typeLibrary, onComponentSelected);
		renderTemplate();

		// Initialize the menus
		$("#newTemplate").click(function() { newTemplate(); });
		$("#openTemplate").click(function() { openTemplate(); });
		$("#saveTemplate").click(function() { saveTemplate(); });
		$("#saveHTML").click(function() { saveHTML(); });

		// Hook the delete key.
		$(document).keyup(function(event) {
			if (event.keyCode == DOM_VK_DELETE) {
				var focus = document.activeElement;
				var properties = document.getElementById("properties");
				if (focus == null || !isDescendant(properties, focus)) {
	 				canvas.deleteSelection();
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
	 * Creates a new template
	 */
	function newTemplate() {
		template = JSON.parse(JSON.stringify(publication.getDefaultTemplate()));
		loadTemplateIntoCanvas(template);
	}

	/**
	 * Asks the user to select a file, and then opens it.
	 */
	function openTemplate() {
		ds.openFileDialog(openTemplateNamed);
	}

	/**
	 * Opens a named file
	 */
	function openTemplateNamed(file) {
		var reader = new FileReader();

		reader.onload = function(e) {
			var templateStr = e.target.result;
			template = 	JSON.parse(templateStr);
			loadTemplateIntoCanvas(template);
		};

	  	reader.readAsText(file);
	}

	function loadTemplateIntoCanvas(template) {
		activeLayout = ds.template.getActiveLayout(template);
		activeLayout.designTime = true;
		canvas.setTemplate(template, activeLayout);
	}

	/**
	 * Saves the current template to a file.
	 */
	function saveTemplate() {
		activeLayout.designTime = false;
		var templateStr = JSON.stringify(template, null, " ");
		activeLayout.designTime = true;
		var uriContent = "data:application/octet-stream," + encodeURIComponent(templateStr);
		window.location.href = uriContent;		
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
	 * Renders the template and displays the result in the canvas
	 */
	function renderTemplate() {
		if (canvas)
			canvas.repaint();
	};

	function onArticleSelected(source, index) {
		canvas.setActiveArticleIndex(index);
	}

	function onPropertyChanged(source, component) {
		canvas.repaint();
	}

	function onComponentSelected(source, component) {
		propertyList.displayProperties(component);
	}

});


