/**
 * A single component and all of its metadata.
 */

'use strict';

var ds = ds || {};

ds.ComponentType = function(name, displayName, ctorFunc) {
    this.name = name;
    this.displayName = displayName;
    this.ctorFunc = ctorFunc;
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

