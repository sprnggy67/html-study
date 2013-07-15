describe("ds.ComponentPalette", function() {

	var typeLibrary = null;

	beforeEach(function() {
		typeLibrary = new ds.ComponentTypeLib();
    	typeLibrary.loadRegistry();
		loadFixtures('simpleListFixture.html');		
	});

	it("can be instantiated", function() {
		// When
		var componentPalette = new ds.ComponentPalette("#dataList", typeLibrary);

		// Then
		expect(componentPalette).toBeDefined();
	});

	it("has the right children", function() {
		// When
		var componentPalette = new ds.ComponentPalette("#dataList", typeLibrary);

		// Then
		var listItems = $('#dataList > li');
		var expectedLength = typeLibrary.length()
		expect(listItems).toHaveLength(expectedLength);
		for (var x = 0; x < expectedLength; x ++) {
			expect(listItems[x].innerText).toEqual(typeLibrary.componentAt(x).displayName);
		}
	});

});