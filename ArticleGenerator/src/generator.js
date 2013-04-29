function Generator(typeLib) {
    this.typeLib = typeLib;
}

/**
 Generates the <body> element for a document from an input of the form:

 input = {
      "name":"Big Text",
      "root":{
        type:"Text",
        data:"Hello World"
      }
 };

 */
Generator.prototype.generate = function(input) {
	var component = input.root;
	var typeDef = typeLib.objectByType(component.type);
	if (typeDef == null) {
		return null;
	} else {}
		var template = typeDef.getTemplate();
		var result = '<body>' + jsRender.render(template, null, component) + '</body>';
		return result;
	}
};

