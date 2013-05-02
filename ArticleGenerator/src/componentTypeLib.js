/**
 @deprecated

 A library of comopnents.

 This class was deprecated when I moved to a full implementation of templating with jsRender.

 In retrospect, the children could be implemented as an javascript object with associative array properties.
 They should all have unique names.
 
 */

var ds = ds || {};

ds.ComponentTypeLib = function() {
	this.children = [];
}

ds.ComponentTypeLib.prototype.getInfo = function() {
	return 'ComponentTypeLib(' + this.children + ')';
};

ds.ComponentTypeLib.prototype.loadRegistry = function() {
	this.add(ds.ComponentType.makeComponentType('headline', '<h1>{{:headline}}</h1>'));
	this.add(ds.ComponentType.makeComponentType('standFirst', '<h2>{{:standFirst}}</h2>'));
	this.add(ds.ComponentType.makeComponentType('body', '{{:body}}'));
	this.add(ds.ComponentType.makeComponentType('image', '<img src="{{:image}}">'));
};

ds.ComponentTypeLib.prototype.add = function(child) {
	if (!(child instanceof ds.ComponentType))
		throw 'Child must be instance of ds.ComponentType' + child;
	this.children.push(child); 
};

ds.ComponentTypeLib.prototype.length = function() {
	return this.children.length; 
};

ds.ComponentTypeLib.prototype.objectAt = function(index) {
	return this.children[index]; 
};

ds.ComponentTypeLib.prototype.objectNamed = function(name) {
	var length = this.children.length;
	for (var i = 0; i < length; i ++) {
		var child = this.children[i];
		if (name == child.getName())
			return child;
	}
	return null;
};


