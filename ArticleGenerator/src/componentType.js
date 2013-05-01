/**
 * Creates a new component type with a name and template string.
 */
makeComponentType = function(name, htmlTmpl, composite) {
	var jsRenderTmpl = jsviews.templates(htmlTmpl);
	if (jsRenderTmpl == null)
		throw "Invalid template:" + htmlTmpl;
	var cmp = new ComponentType(name, jsRenderTmpl);
	if (composite)
		cmp.setComposite(composite);
	return cmp;
}

function ComponentType (name, template) {
    this.name = name;
    this.template = template;
    this.composite = false;
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

ComponentType.prototype.setComposite = function(composite) {
	this.composite = composite;
};

ComponentType.prototype.isComposite = function() {
	return this.composite;
};