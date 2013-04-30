function ComponentTypeLib () {
	this.children = [];
}

ComponentTypeLib.prototype.getInfo = function() {
	return 'ComponentTypeLib(' + this.children + ')';
};

ComponentTypeLib.prototype.loadRegistry = function() {
	this.add(makeComponentType("headline", "<h1>{{:headline}}</h1>"));
	this.add(makeComponentType("body", "{{:body}}"));
};

ComponentTypeLib.prototype.add = function(child) {
	if (!(child instanceof ComponentType))
		throw "Invalid child:" + child;
	this.children.push(child); 
};

ComponentTypeLib.prototype.length = function() {
	return this.children.length; 
};

ComponentTypeLib.prototype.objectAt = function(index) {
	return this.children[index]; 
};

ComponentTypeLib.prototype.objectNamed = function(name) {
	var length = this.children.length;
	for (var i = 0; i < length; i ++) {
		var child = this.children[i];
		if (name == child.getName())
			return child;
	}
	return null;
};


