/**
 * A library of components.
 */

'use strict'

var ds = ds || {};

ds.ComponentTypeLib = function() {
	this.children = [];
}

ds.ComponentTypeLib.prototype.getInfo = function() {
	return 'ComponentTypeLib(' + this.children + ')';
};

ds.ComponentTypeLib.prototype.loadRegistry = function() {
	this.add(new ds.ComponentType('headline', 'Headline', ds.ComponentTypeLib.createSimpleComponent));
	this.add(new ds.ComponentType('standfirst', 'Standfirst', ds.ComponentTypeLib.createSimpleComponent));
	this.add(new ds.ComponentType('body', 'Body', ds.ComponentTypeLib.createSimpleComponent));
	this.add(new ds.ComponentType('image', 'Main image', ds.ComponentTypeLib.createSimpleComponent));
	this.add(new ds.ComponentType('flow', 'Flow', ds.ComponentTypeLib.createCompositeComponent));
	this.add(new ds.ComponentType('grid', 'Grid', ds.ComponentTypeLib.createCompositeComponent));
	this.add(new ds.ComponentType('teaser', 'Teaser', ds.ComponentTypeLib.createSimpleComponent));
};

ds.ComponentTypeLib.idCount = 0;

ds.ComponentTypeLib.createSimpleComponent = function(type) {
	return {
		componentType: type,
		dataPath: "children",
		dataIndex: 0,
		uniqueID: "cmp" + (++ds.ComponentTypeLib.idCount)
	};
};

ds.ComponentTypeLib.createCompositeComponent = function(type) {
	var result = ds.ComponentTypeLib.createSimpleComponent(type);
	result.children = [];
	return result;
};

ds.ComponentTypeLib.prototype.add = function(child) {
	if (!(child instanceof ds.ComponentType))
		throw 'Child must be instance of ds.ComponentType' + child;
	this.children.push(child); 
};

ds.ComponentTypeLib.prototype.length = function() {
	return this.children.length; 
};

ds.ComponentTypeLib.prototype.componentAt = function(index) {
	return this.children[index]; 
};

ds.ComponentTypeLib.prototype.componentNamed = function(name) {
	var length = this.children.length;
	for (var i = 0; i < length; i ++) {
		var child = this.children[i];
		if (name == child.getName())
			return child;
	}
	return null;
};

ds.ComponentTypeLib.prototype.getChildren = function() {
	return this.children;
};


