/**
 The TemplateDesigner implementation
 */

'use strict';

$(function () {

	var sampleArticle, publication, template, activeLayout, typeLibrary;
	var articleList, componentPalette, propertyList, canvas;
	var commandStack;
	var listener;

	init();

	/**
	 * Initializes the template designer data
	 */
	function init() {
		initModel();
	}

	function initModel() {
		sampleArticle = sampleArticles[0].definition;
		typeLibrary = new ds.ComponentTypeLib();
    	typeLibrary.loadRegistry();
		publication = new ds.Publication();
		publication.loadFromServer(function() {
			template = publication.createDefaultTemplate();
			activeLayout = template.getActiveLayout();
			activeLayout.designTime = true;
			initUserInterface();
		});
	}

	var DOM_VK_DELETE = 46;

	function initUserInterface() {
		// Init the article list.
		articleList = new ds.ArticleList("#articleList", sampleArticle, onArticleSelected);

		// Init the component palette
		componentPalette = new ds.ComponentPalette("#componentList", typeLibrary);

		// Init the property list.
		propertyList = new ds.PropertyList("#propertyList", typeLibrary, onPropertyChanged)

		// Init the canvas.
		canvas = new ds.Canvas("#canvasFrame", template, activeLayout, sampleArticle, typeLibrary, onComponentSelected);
		if (getQueryParameter("test"))
			canvas.setTest();
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

		// Init the command stack
		commandStack = new ds.CommandStack();
	}

	function getQueryParameter(search_for) {
		var query = window.location.search.substring(1);
		var parms = query.split('&');
		for (var i=0; i<parms.length; i++) {
			var pos = parms[i].indexOf('=');
			if (pos > 0  && search_for == parms[i].substring(0,pos)) {
				return parms[i].substring(pos+1);;
			}
		}
		return null;
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

	function setTemplate(t) {
		template = t;
		activeLayout = template.getActiveLayout();
		activeLayout.designTime = true;
		commandStack.clear();
		canvas.setTemplate(template, activeLayout);
	}

	function getTemplate() {
		return template;
	}

	function getActiveLayout() {
		return activeLayout;
	}

	/**
	 * Creates a new template
	 */
	function newTemplate() {
		setTemplate(publication.createDefaultTemplate());
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
			var seed = 	JSON.parse(templateStr);
			setTemplate(new ds.Template(seed));
		};

	  	reader.readAsText(file);
	}

	/**
	 * Saves the current template to a file.
	 */
	function saveTemplate() {
		var activeLayout = getActiveLayout();
		activeLayout.designTime = false;
		var templateStr = JSON.stringify(getTemplate(), null, " ");
		activeLayout.designTime = true;
		var uriContent = "data:application/octet-stream," + encodeURIComponent(templateStr);
		window.location.href = uriContent;
		commandStack.clear();		
	}

	/**
	 * Saves the contents as an HTML file.
	 */
	function saveHTML() {
		// Run the template.
		var activeLayout = getActiveLayout();
		activeLayout.designTime = false;
		var renderer = new ds.ArticleRenderer();
		var result = renderer.renderPage(template, sampleArticle);
		activeLayout.designTime = true;

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


