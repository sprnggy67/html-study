var isCommonJS = typeof window == "undefined" && typeof exports == "object";

/**
 * Top level namespace for Jasmine, a lightweight JavaScript BDD/spec/testing framework.
 *
 * @namespace
 */
var generator = {};
if (isCommonJS) exports.generator = generator;
/**
 * @private
 */
generator.unimplementedMethod_ = function() {
  throw new Error("unimplemented method");
};

generator.generate = function(input) {
	return "Foo";
};

