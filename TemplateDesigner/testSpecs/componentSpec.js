describe("ds.Component", function() {

	var root = null;

	beforeEach(function() {
		root = new ds.Component({
			uniqueID:"portraitRoot",
			componentType:"grid",
			children: [{
				componentType:"image"
			}]
		});		
	});

	it("should copy object literal in constructor", function() {
		// test the root object
		expect(root.uniqueID).toEqual("portraitRoot");
		expect(root.componentType).toEqual("grid");
		expect(root instanceof ds.Component).toBeTruthy();
		expect(root.children.length).toEqual(1);

		// test the child object
		var child = root.children[0];
		expect(child.componentType).toEqual("image");
	});

});