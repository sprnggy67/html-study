function ComponentTypeLib () {
	this.root = null;
	this.children = [];
}

ComponentTypeLib.prototype.getInfo = function() {
	return 'ComponentTypeLib(' + this.children + ')';
};

ComponentTypeLib.prototype.loadRegistry = function(rootUrl) {
	this.root = rootUrl;
	var registryFile = rootUrl + "/components.json";
	var typeLib = this;
	$.getJSON(registryFile, function (data) {
		var length = data.length;
		for (var i = 0; i < length; i ++) {
			var child = data[i];
			typeLib.loadComponent(child);
		}
	});
};

ComponentTypeLib.prototype.loadComponent = function(name) {
	var file = this.formatComponentPath(name);
	var typeLib = this;
	$.get(file, function (template) {
		var tmpl = jsviews.templates(template);
		var cmp = new ComponentType(name, tmpl);
		typeLib.add(cmp);
	});
};

ComponentTypeLib.prototype.formatComponentPath = function(name) {
	return this.root + "/components/" + name + "/_tmpl.html";
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


