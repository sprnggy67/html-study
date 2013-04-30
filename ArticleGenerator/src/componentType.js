/**
 * Creates a new component type with a name and template string.
 */
makeComponentType = function(name, htmlTmpl) {
	var jsRenderTmpl = jsviews.templates(htmlTmpl);
	var cmp = new ComponentType(name, jsRenderTmpl);
	return cmp;
}

function ComponentType (name, template) {
    this.name = name;
    this.template = template;
}
 
ComponentType.prototype.getInfo = function() {
    return 'ComponentType(' + this.name + ')';
};

ComponentType.prototype.getName = function() {
    return this.name;
};

ComponentType.prototype.getTemplate = function() {
    return this.template;
};

ComponentType.prototype.render = function(data, targetSelector) {
	var htmlString = this.template.render(data);
	if (targetSelector) {
		$(targetSelector).html(htmlString);
	}
	return htmlString;
};
