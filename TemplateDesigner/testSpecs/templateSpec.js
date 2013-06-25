describe("ds.Template", function() {
 
	beforeEach(function() {
	});

	it("should return default active layout", function() {
		var template = sampleTemplates.empty;
		var layout = ds.template.getActiveLayout(template);
		expect(layout.uniqueID).toEqual("defaultRoot");
	});

	it("should return default active layout if nothing else is available", function() {
		var template = sampleTemplates.empty;
		var layout = ds.template.getActiveLayout(template, { orientation:"landscape"});
		expect(layout.uniqueID).toEqual("defaultRoot");
	});

	it("should return portrait layout in portrait orientation", function() {
		var template = sampleTemplates.emptyResponsive;
		var layout = ds.template.getActiveLayout(template, { orientation:"portrait"});
		expect(layout.uniqueID).toEqual("portraitRoot");
	});

	it("should return landscape layout in landscape orientation", function() {
		var template = sampleTemplates.emptyResponsive;
		var layout = ds.template.getActiveLayout(template, { orientation:"landscape"});
		expect(layout.uniqueID).toEqual("landscapeRoot");
	});

	it("should findComponent in shallow objects", function() {
		var template = sampleTemplates.empty;
		var layout = ds.template.getActiveLayout(template, { orientation:"portrait" });
		var child = ds.template.findComponentInLayout(layout, "defaultRoot");
		expect(child.uniqueID).toEqual("defaultRoot");
	});

	it("should findComponent in deep objects", function() {
		var template = sampleTemplates.front3;
		var layout = ds.template.getActiveLayout(template, { orientation:"portrait" });
		var child = ds.template.findComponentInLayout(layout, "ref001")
		expect(child.uniqueID).toEqual("ref001");
	});

	it("should findParent", function() {
		var template = sampleTemplates.front3;
		var layout = ds.template.getActiveLayout(template, { orientation:"portrait" });
		var child = ds.template.findComponentInLayout(layout, "ref001");
		var actualParent = ds.template.findParentInLayout(layout, child);
		var expectedParent = ds.template.findComponentInLayout(layout, "flow001");
		expect(actualParent).toEqual(expectedParent);
	});

	it("should copy object literal in constructor", function() {
		var template = new ds.Template(sampleTemplates.empty);

		// test the root object
		expect(template.targets.length).toEqual(1);

		// test the target
		var target = template.targets[0];
		expect(target.name).toEqual("default");
		expect(target.layout).toBeDefined();
		expect(target.portraitLayout).toBeUndefined();
		expect(target.landscapeLayout).toBeUndefined();

		// test the layout. It should be a component.
		var layout = target.layout;
		expect(layout.uniqueID).toEqual("defaultRoot");
		expect(layout instanceof ds.Component).toBeTruthy();
		expect(layout.componentType).toEqual("grid");
		expect(layout.children.length).toEqual(0);
	});

	it("should return default active layout", function() {
		var template = new ds.Template(sampleTemplates.empty);
		var layout = template.getActiveLayout();
		expect(layout.uniqueID).toEqual("defaultRoot");
	});

	it("should return default active layout if nothing else is available", function() {
		var template = new ds.Template(sampleTemplates.empty);
		var layout = template.getActiveLayout({ orientation:"landscape"});
		expect(layout.uniqueID).toEqual("defaultRoot");
	});

	it("should return portrait layout in portrait orientation", function() {
		var template = new ds.Template(sampleTemplates.emptyResponsive);
		var layout = template.getActiveLayout({ orientation:"portrait"});
		expect(layout.uniqueID).toEqual("portraitRoot");
	});

	it("should return landscape layout in landscape orientation", function() {
		var template = new ds.Template(sampleTemplates.emptyResponsive);
		var layout = template.getActiveLayout({ orientation:"landscape"});
		expect(layout.uniqueID).toEqual("landscapeRoot");
	});



});