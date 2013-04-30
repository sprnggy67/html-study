function ArticleRenderer(typeLib) {
    this.typeLib = typeLib;
}

/**
 Generates the <body> element for a document from an input of the form:

 input = {
      "name":"Big Text",
      "root":{
        type:"Text",
		dataPath:"children",
        dataIndex:0
      }
 };

 */
ArticleRenderer.prototype.render = function(template, article) {
	return this.renderComponent(template.root, article);
};

ArticleRenderer.prototype.renderComponent = function(component, article) {
	var typeDef = typeLib.objectNamed(component.componentType);
	if (typeDef == null || typeDef.getTemplate() == null) {
		console.log("Invalid component type:" + component);
		return null;
	} else {
		var input = this.findPath(article, component.dataPath);
		if (component.dataIndex != undefined) 
			input = input[component.dataIndex];
		var output = typeDef.render(input);
		return output;
	}
};

ArticleRenderer.prototype.findPath = function(obj, path) {
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


