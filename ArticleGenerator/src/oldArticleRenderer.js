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

function OldArticleRenderer(typeLib) {
    this.typeLib = typeLib;
}

OldArticleRenderer.prototype.render = function(template, article) {
	return this.renderComponent(template.root, article);
};

OldArticleRenderer.prototype.renderComponent = function(component, article) {
	var typeDef = typeLib.objectNamed(component.componentType);
	if (typeDef == null || typeDef.getTemplate() == null) {
		console.log("Invalid component type:" + component);
		return null;
	} 

	if (typeDef.isComposite()) {
		return null;
	} else {
		return this.renderSimpleComponent(component, article);
	}	
};

OldArticleRenderer.prototype.renderSimpleComponent = function(component, article) {
	var typeDef = typeLib.objectNamed(component.componentType);
	var input = this.findPath(article, component.dataPath);
	if (component.dataIndex != undefined) 
		input = input[component.dataIndex];
	var output = typeDef.render(input);
	return output;
};

OldArticleRenderer.prototype.findPath = function(obj, path) {
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


