describe("ds.Template", function() {
 
	beforeEach(function() {
	});

	it("should return default active layout", function() {
		var template = defaultTemplates.empty;
		var layout = ds.template.getActiveLayout(template);
		expect(layout.uniqueID).toEqual("defaultRoot");
	});

	it("should return default active layout if nothing else is available", function() {
		var template = defaultTemplates.empty;
		var layout = ds.template.getActiveLayout(template, { orientation:"landscape"});
		expect(layout.uniqueID).toEqual("defaultRoot");
	});

	it("should return portrait layout in portrait orientation", function() {
		var template = defaultTemplates.emptyResponsive;
		var layout = ds.template.getActiveLayout(template, { orientation:"portrait"});
		expect(layout.uniqueID).toEqual("portraitRoot");
	});

	it("should return landscape layout in landscape orientation", function() {
		var template = defaultTemplates.emptyResponsive;
		var layout = ds.template.getActiveLayout(template, { orientation:"landscape"});
		expect(layout.uniqueID).toEqual("landscapeRoot");
	});

	it("should findComponent in shallow objects", function() {
		var template = defaultTemplates.empty;
		var layout = ds.template.getActiveLayout(template);
		var child = ds.template.findComponentInLayout(layout, "defaultRoot");
		expect(child.uniqueID).toEqual("defaultRoot");
	});

	it("should findComponent in deep objects", function() {
		var template = defaultTemplates.front3;
		var layout = ds.template.getActiveLayout(template);
		var child = ds.template.findComponentInLayout(layout, "ref001")
		expect(child.uniqueID).toEqual("ref001");
	});

	it("should findParent", function() {
		var template = defaultTemplates.front3;
		var layout = ds.template.getActiveLayout(template);
		var child = ds.template.findComponentInLayout(layout, "ref001");
		var actualParent = ds.template.findParentInLayout(layout, child);
		var expectedParent = ds.template.findComponentInLayout(layout, "flow001");
		expect(actualParent).toEqual(expectedParent);
	});


});