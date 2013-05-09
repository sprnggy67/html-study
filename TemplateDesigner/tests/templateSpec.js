describe("ds.Template", function() {
 
	beforeEach(function() {
	});

	it("should be defined", function() {
		var template = new ds.Template();
		expect(template).toBeDefined();
	});

	it("should createTemplate", function() {
		var template = ds.Template.createTemplate(defaultTemplates.empty);
		expect(template).toBeDefined();
	});

	it("should findComponent in shallow objects", function() {
		var template = ds.Template.createTemplate(defaultTemplates.empty);
		var child = template.findComponent("grid001")
		expect(child.uniqueID).toEqual("grid001");
	});

	it("should findComponent in deep objects", function() {
		var template = ds.Template.createTemplate(defaultTemplates.front3);
		var child = template.findComponent("ref001")
		expect(child.uniqueID).toEqual("ref001");
	});

});