function ComponentType (type, template) {
    this.type = type;
    this.template = template;
}
 
ComponentType.prototype.getInfo = function() {
    return 'ComponentType(' + this.type + ')';
};

ComponentType.prototype.getType = function() {
    return this.type;
};

ComponentType.prototype.getTemplate = function() {
    return this.template;
};

ComponentType.prototype.render = function (name, targetSelector, data) {
	var htmlString = template.render(data);
	if (targetSelector) {
		$(targetSelector).html(htmlString);
	}
	return htmlString;
};
