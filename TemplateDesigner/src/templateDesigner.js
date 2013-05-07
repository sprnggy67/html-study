/**
 The TemplateDesigner implementation
 */

'use strict';

$(function () {

	var template,
		publication;

	initTD();

	/**
	 * Initializes the template designer data
	 */
	function initTD() {
		publication = new ds.Publication();
		publication.loadFromServer(function() {
			template = JSON.parse(JSON.stringify(publication.getDefaultTemplate()));
			var templateStr = JSON.stringify(template);
			$("#templateData").val(templateStr);
		});

		$("#savePage").click(function() { saveFile(); });
		$("#openPage").click(function() { openFile(); });
	}

	/**
	 * Saves the current template to a file.
	 */
	function saveFile() {
		var uriContent = "data:application/octet-stream," + encodeURIComponent($("#templateData").val());
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
			$("#templateData").val(e.target.result);
		};

	  	reader.readAsText(file);
	}

	/**
	 * Renders an article
	 */
	function renderArticle(template, article) {
		console.time("renderArticle");
		var renderer = new ds.ArticleRenderer();
		var actualOutput = renderer.renderPage(template, article);
		console.timeEnd("renderArticle");
		return actualOutput;
	};

});


