/**
 * A single component and all of its metadata.
 */

'use strict';

var ds = ds || {};

ds.ComponentType = function(name, displayName) {
    this.name = name;
    this.displayName = displayName;
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

