function ComponentTypeLib () {
	this.children = [];
}

ComponentTypeLib.prototype.getInfo = function() {
	return 'ComponentTypeLib(' + this.children + ')';
};

ComponentTypeLib.prototype.loadComponentsFromRegistry = function() {
	var file = "components.json";
	$.get(file, null, function (data) {
		var length = data.length;
		for (var i = 0; i < length; i ++) {
			var child = data[i];
			this.loadComponent(child);
		}
	});
};

ComponentTypeLib.prototype.loadComponent = function(name) {
	var file = formatComponentPath(name);
	$.get(file, null, function (template) {
		var tmpl = jsviews.templates(template);
		var cmp = new ComponentType(name, tmpl);
		this.add(cmp);
	});
};

ComponentTypeLib.prototype.formatComponentPath = function(name) {
	return "/components/" + name + "/tmpl.html";
};

ComponentTypeLib.prototype.add = function(child) {
	this.children.push(child); 
};

ComponentTypeLib.prototype.length = function(child) {
	return this.children.length; 
};

ComponentTypeLib.prototype.objectAt = function(index) {
	return this.children[index]; 
};

ComponentTypeLib.prototype.objectByType = function(type) {
	var length = this.children.length;
	for (var i = 0; i < length; i ++) {
		var child = this.children[i];
		if (type == child.getType())
			return child;
	}
	return null;
};


