'use strict'

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
});

var openFileCallback = null;
var fileSelection = null;

function openFileDialog(callback) {
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

