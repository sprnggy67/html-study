/**
 @deprecated
 
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

 This class is obsolete.  After implementing a single level of generation, I discovered that it would be easier
 to let jsRender do all of the work for me.
 */

var ds = ds || {};

ds.OldArticleRenderer = function(typeLib) {
    this.typeLib = typeLib;
}

ds.OldArticleRenderer.prototype.render = function(template, article) {
	return this.renderComponent(template.root, article);
};

ds.OldArticleRenderer.prototype.renderComponent = function(component, article) {
	var typeDef = typeLib.objectNamed(component.componentType);
	if (typeDef == null || typeDef.getTemplate() == null) {
		console.log('Invalid component type:' + component);
		return null;
	} 

	if (typeDef.isComposite()) {
		throw 'renderComponent cannot render composites';
	} else {
		return this.renderSimpleComponent(component, article);
	}	
};

ds.OldArticleRenderer.prototype.renderSimpleComponent = function(component, article) {
	var typeDef = typeLib.objectNamed(component.componentType);
	var input = this.findPath(article, component.dataPath);
	if (component.dataIndex != undefined) 
		input = input[component.dataIndex];
	var output = typeDef.render(input);
	return output;
};

ds.OldArticleRenderer.prototype.findPath = function(obj, path) {
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


