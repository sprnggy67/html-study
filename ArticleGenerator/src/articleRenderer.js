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

 The renderer output is defined using a template as shown above. This describes the layout of the
 article as a series of hierarchical components, such as headline, standfirst, image, body, flow and grid.
 These components can be nested to create a rich layout.  

 The renderPage and renderComponent functions below are used to render an article in a given template.

 The tests for this can be found in articleRendererSpec.js

 If you need to debug this code please use the breakHere helper below.
 */

'use strict';

var ds = ds || {};

ds.ArticleRenderer = function() {
	if (!ds.ArticleRenderer.initialised)
		ds.ArticleRenderer.initClass();
}

ds.ArticleRenderer.initialised = false;

ds.ArticleRenderer.initClass = function() {
	ds.ArticleRenderer.initialised = true;
	jsviews.templates({
		root: 
			'<html><body>' +
				'{{for root tmpl="component"/}}' +
			'</body></html>',
		component: 
			'{{if componentType==="headline" tmpl="headline"/}}' +
			'{{if componentType==="standfirst" tmpl="standfirst"/}}' +
			'{{if componentType==="body" tmpl="body"/}}' +
			'{{if componentType==="image" tmpl="image"/}}' +
			'{{if componentType==="flow" tmpl="flow"/}}' +
			'{{if componentType==="grid" tmpl="grid"/}}',
		headline: '<h1>{{:realData.headline}}</h1>',
		standfirst: '<h2>{{:realData.standFirst}}</h2>',
		body: '{{:realData.body}}',
		image: '<img src="{{:realData.image}}">',
		flow: 
			'<div>' +
				'{{for children tmpl="component"/}}' +
			'</div>',
		grid: 
			'<div>' +
				'{{for children}}' +
					'<div style="position:absolute; overflow:hidden; ' +
							'left:{{:position.left * #parent.parent.data.width / #parent.parent.data.columns}}px; ' +
							'top:{{:position.top * #parent.parent.data.height / #parent.parent.data.rows}}px; ' +
							'width:{{:position.width * #parent.parent.data.width / #parent.parent.data.columns}}px; ' +
							'height:{{:position.height * #parent.parent.data.height / #parent.parent.data.rows}}px;">' +
						'{{if true tmpl="component"/}}' +
					'</div>' +
				'{{/for}}' +
			'</div>',
	});
	jsviews.views.helpers({
		// Add the following code to your template if you want to break somewhere and look at the jsRender stack: 
		// '{{:~breakHere()}}' +
		breakHere:function() {
			console.log("In breakHere");
		}
	});
};

/**
 Render the complete HTML for a given template and article.
 Return the HTML.
 */
ds.ArticleRenderer.prototype.renderPage = function(template, article) {
	// Clone the template and add article data to it.
	// This gives us a single model which can be passed to the jsRender renderer.
	var inputData = JSON.parse(JSON.stringify(template));
	this.privateLink(inputData.root, article);

	// Render the HTML.
	var html = jsviews.render.root(inputData);

	// Trim the whitespace.
	html = html.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
	return html;
};

/**
 Render the HTML for a given component and article. 
 The component may contain sub components.
 Return the HTML.
 */
ds.ArticleRenderer.prototype.renderComponent = function(component, article) {
	// Clone the component and add article data to it.
	// This gives us a single model which can be passed to the jsRender renderer.
	var inputData = JSON.parse(JSON.stringify(component));
	this.privateLink(inputData, article);

	// Render the HTML.
	var html = jsviews.render.component(inputData);

	// Trim the whitespace.
	html = html.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
	return html;
};

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
ds.ArticleRenderer.prototype.privateLink = function(component, article) {
	if (component.dataPath) {
		var realData = this.findData(article, component.dataPath);
		if (component.dataIndex != undefined) 
			realData = realData[component.dataIndex];
		component.realData = realData;
	}
	if (component.children) {
		var length = component.children.length;
		for (var i = 0; i < length; ++i) {
			this.privateLink(component.children[i], article);
		}
	}
	if (component.component) {
		this.privateLink(component.component, article);
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


