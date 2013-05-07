/**
 An ArticleRenderer can be used to generate the HTML for a given template.
 The template usually has the following form:

 input = {
      "name":"Big Text",
      "root":{
        type:"Text",
		dataPath:"children",
        dataIndex:0
      }
 };

 This class uses jsRender to do the heavy lifting. The templates are defined once and used many times
 by the renderPage and renderComponent functions.

 The renderer output is defined using a template as shown above. The template describes the layout of the
 article as a series of hierarchical components, such as headline, standfirst, image, body, flow and grid.
 These components can be nested to create a rich layout.  

 The tests for this can be found in articleRendererSpec.js

 If you need to debug this code please use the breakHere helper below.
 */

'use strict';

var ds = ds || {};

// Define the path to jsRender when jQuery is present and not present.
var $views = (typeof jQuery === 'undefined') ? jsviews : jQuery.views;
var $viewHelpers = (typeof jQuery === 'undefined') ? jsviews.views.helpers : $views.helpers;

ds.ArticleRenderer = function() {
	if (!ds.ArticleRenderer.initialised)
		ds.ArticleRenderer._initClass();
}

ds.ArticleRenderer.initialised = false;

/**
 Render the complete HTML for a given template and article.
 Return the HTML.

 This method clones the template and then injects the article data into the template.
 This combined set of data is then used to render the HTML.
 */
ds.ArticleRenderer.prototype.renderPage = function(template, article) {
	// Clone the template and add article data to it.
	// This gives us a single model which can be passed to the jsRender renderer.
	var inputData = JSON.parse(JSON.stringify(template));
	this._linkRealData(inputData.root, article);

	// Render the HTML.
	var html = $views.render.root(inputData);

	// Trim the whitespace.
	html = html.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
	return html;
};

/**
 Render the HTML for a given component and article. 
 The component may contain sub components.
 Return the HTML.

 This method clones the template and then injects the article data into the template.
 This combined set of data is then used to render the HTML.
 */
ds.ArticleRenderer.prototype.renderComponent = function(component, article) {
	// Clone the component and add article data to it.
	// This gives us a single model which can be passed to the jsRender renderer.
	var inputData = JSON.parse(JSON.stringify(component));
	this._linkRealData(inputData, article);

	// Render the HTML.
	var html = $views.render.component(inputData);

	// Trim the whitespace.
	html = html.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
	return html;
};

ds.ArticleRenderer._initClass = function() {
	ds.ArticleRenderer.initialised = true;
	$views.templates({
		root: 
			'<html>' +
			'<head>' +
			'<link rel="stylesheet" type="text/css" href="src/renderRuntime.css">' +
			'<script type="text/javascript" src="src/renderRuntime.js"></script>' +
			'</head>' +
			'<body>' +
				'{{for root tmpl="component"/}}' +
			'</body></html>',
		component: 
			'{{if componentType==="headline" tmpl="headline"/}}' +
			'{{if componentType==="standfirst" tmpl="standfirst"/}}' +
			'{{if componentType==="body" tmpl="body"/}}' +
			'{{if componentType==="image" tmpl="image"/}}' +
			'{{if componentType==="flow" tmpl="flow"/}}' +
			'{{if componentType==="grid" tmpl="grid"/}}',
		headline: '<h1' +
			'{{if style}}' +
			' style="{{:style}}"' +
			'{{/if}}' +
			'>{{:realData.headline}}</h1>',
		standfirst: '<h2' +
			'{{if style}}' +
			' style="{{:style}}"' +
			'{{/if}}' +
			'>{{:realData.standFirst}}</h2>',
		body: 
			'{{if style}}' +
			'<span style="{{:style}}">' +
			'{{/if}}' +
			'{{:realData.body}}' +
			'{{if style}}' +
			'</span>' +
			'{{/if}}',
		image: '<img src="{{:realData.image}}">',
		flow: 
			'<div>' +
				'{{for children tmpl="component"/}}' +
			'</div>',
		grid: 
			'<div>' +
				'{{for children}}' +
					'<div style="position:absolute; overflow:hidden; ' +
							'left:{{:~getLeftPx(position, #parent.parent.data)}}px; ' +
							'top:{{:~getTopPx(position, #parent.parent.data)}}px; ' +
							'width:{{:~getWidthPx(position, #parent.parent.data)}}px; ' +
							'height:{{:~getHeightPx(position, #parent.parent.data)}}px;">' +
						'{{if true tmpl="component"/}}' +
					'</div>' +
				'{{/for}}' +
			'</div>',
	});
	$viewHelpers({
		// Add the following code to your template if you want to break somewhere and look at the jsRender stack: 
		// '{{:~breakHere()}}' +
		breakHere:function() {
			console.log("In breakHere");
		},
		getLeftPx:function(position, grid) {
			return ds.ArticleRenderer._calcStartPx(position.left, grid.width, grid.columns, grid.columnGutter);
		},
		getTopPx:function(position, grid) {
			return ds.ArticleRenderer._calcStartPx(position.top, grid.height, grid.rows, grid.rowGutter);
		},
		getWidthPx:function(position, grid) {
			return ds.ArticleRenderer._calcWidthPx(position.left, position.width, grid.width, grid.columns, grid.columnGutter);
		},
		getHeightPx:function(position, grid) {
			return ds.ArticleRenderer._calcWidthPx(position.top, position.height, grid.height, grid.rows, grid.rowGutter);
		},
	});

};

/**
 * Calculates the start position for an element in a grid. This can be used to calculate the left edge of
 * a cell or the top edge of a cell. You just need to pass in the row or column dimensions, as appropriate.
 */
ds.ArticleRenderer._calcStartPx = function(start, gridWidth, gridColumns, gridGutter) {
	var result = start * gridWidth / gridColumns;
	if (gridGutter && start > 0) { 
		result = result + gridGutter / 2;
	}
	return result;
}

/**
 * Calculates the width for an element in a grid. This can be used to calculate the width or height of a cell. 
 * You just need to pass in the row or column dimensions, as appropriate.
 */
ds.ArticleRenderer._calcWidthPx = function(start, width, gridWidth, gridColumns, gridGutter) {
	var result = width * gridWidth / gridColumns;
	if (gridGutter) {
		var delta = gridGutter / 2;
		if (start > 0) result = result - delta;
		if (start + width < gridColumns) result = result - delta;
	}
	return result;
}

/**
 Adds real article data to a hierarchical component model.

 The algorithm looks for data references in the model. When one is found, it looks up the
 data reference and adds the real data to the component in a "realData" property. This can be
 referenced by a jsRender template.

 The algorithm also recursively descends when it finds "children" or a property called "component" in the
 root object.

 @private

 This method could be moved into the constructor, but if I do that it will be defined every time
 the constructor is invoked, for no benefit. Gotta love javascript.
 
 */
ds.ArticleRenderer.prototype._linkRealData = function(component, article) {
	if (component.dataPath) {
		var realData = this.findData(article, component.dataPath);
		if (component.dataIndex != undefined) 
			realData = realData[component.dataIndex];
		component.realData = realData;
	}
	if (component.children) {
		var length = component.children.length;
		for (var i = 0; i < length; ++i) {
			this._linkRealData(component.children[i], article);
		}
	}
	if (component.component) {
		this._linkRealData(component.component, article);
	}
	return component;
};

ds.ArticleRenderer.prototype.findData = function(obj, path) {
	var paths = path.split('.');
	var current = obj;
	var i;

	for (i = 0; i < paths.length; ++i) {
		if (current[paths[i]] == undefined) {
			return undefined;
		} else {
			current = current[paths[i]];
		}
	}

	return current;
};
