/**
 * A single component and all of its metadata.
 */

'use strict';

var ds = ds || {};

ds.ComponentType = function(name, displayName, ctorFunc) {
    this.name = name;
    this.displayName = displayName;
    this.ctorFunc = ctorFunc;
    this.propertyDescriptors = [];
}
 
ds.ComponentType.prototype.getInfo = function() {
    return 'ComponentType(' + this.name + ')';
};

ds.ComponentType.prototype.getName = function() {
    return this.name;
};

ds.ComponentType.prototype.getDisplayName = function() {
    return this.displayName;
};

ds.ComponentType.prototype.createComponent = function(param1, param2, param3) {
    if (this.ctorFunc)
    	return this.ctorFunc(param1, param2, param3);
    throw "ctorFunc is not defined in ds.ComponentType.createComponent";
};

/**
 * Adds a new property descriptor to the cType and returns the result
 */
ds.ComponentType.prototype.addPropertyDescriptor = function(propertyName, displayName) {
	var pd = { 'name': propertyName, 'displayName': displayName };
	this.propertyDescriptors.push(pd);
	return pd;
};

/**
 * Returns an array of property descriptors for the cType
 */
ds.ComponentType.prototype.getPropertyDescriptors = function() {
	return this.propertyDescriptors;
};


