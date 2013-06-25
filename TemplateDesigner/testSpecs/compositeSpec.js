describe("ds.Composite", function() {

	var root = null;
	beforeEach(function() {
		root = new ds.Composite(front3PortraitLayout);		
	});

	it("should copy object literal in constructor", function() {
		// test the root object
		expect(root.uniqueID).toEqual("portraitRoot");
		expect(root.orientation).toEqual("landscape");
		expect(root.width).toEqual(600);
		expect(root.height).toEqual(800);
		expect(root.children.length).toEqual(4);
		expect(root instanceof ds.Composite).toBeTruthy();

		// test a child object
		var child = root.children[1];
		expect(child.uniqueID).toEqual("flow001");
		expect(child.componentType).toEqual("flow");
		expect(child.children.length).toEqual(3);
		expect(child instanceof ds.Component).toBeTruthy();
	});

	it("should findComponent self", function() {
		var child = root.findComponent("portraitRoot");
		expect(child).toEqual(root);
		expect(child.uniqueID).toEqual("portraitRoot");
	});

	it("should findComponent in deep objects", function() {
		var child = root.findComponent("flow001")
		expect(child.uniqueID).toEqual("flow001");
	});

	it("should findComponent in very deep objects", function() {
		var child = root.findComponent("ref001")
		expect(child.uniqueID).toEqual("ref001");
	});

	it("should findParent", function() {
		var child = root.findComponent("ref001");
		var actualParent = root.findParent(child);
		var expectedParent = root.findComponent("flow001");
		expect(actualParent).toEqual(expectedParent);
	});

});