describe("ds.componentFactory", function() {
 
	beforeEach(function() {
	});

	it("should return a component", function() {
		var object = ds.componentFactory.createComponent({
			componentType:"flow",
			uniqueID:"portraitRoot",
		});
		expect(object instanceof ds.Component).toBeTruthy();
		expect(object.uniqueID).toEqual("portraitRoot");
	});

	it("should return a grid", function() {
		var object = ds.componentFactory.createComponent({
			componentType:"grid",
			uniqueID:"portraitRoot",
		});
		expect(object instanceof ds.Grid).toBeTruthy();
	});
});

