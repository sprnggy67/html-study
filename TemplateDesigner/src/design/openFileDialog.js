/**
 A dialog to open files.

 The dialog is opened by calling ds.openFileDialog.
 */

'use strict';

var ds = ds || {};

$(function() {

	$("#openFileDialog").dialog({
	  autoOpen: false,
	  width: 500,
	  buttons: {
		Cancel: function() {
		  $( this ).dialog( "close" );
		},
		"Open": function() {
			openFileSelection();
			$( this ).dialog( "close" );
		},
	  }
	});

	document.getElementById('files').addEventListener('change', handleFileSelect, false);		

	var openFileCallback = null;
	var fileSelection = null;

	/**
	 * Opens a file dialog.  
	 * If a file is selected and the user clicks "Open" the file is passed to the callback function.
	 */
	ds.openFileDialog = function(callback) {
		openFileCallback = callback;
		$( "#openFileDialog" ).dialog( "open" );
	}

	function handleFileSelect(evt) {
		var files = evt.target.files;
		fileSelection = files[0];
	}

	function openFileSelection() {
		openFileCallback(fileSelection);
	}

});

