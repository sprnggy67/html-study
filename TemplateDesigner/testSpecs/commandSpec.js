describe("ds.Command", function() {

	var command = null;

	beforeEach(function() {
		command = new ds.Command();
	});

	it("can be instantiated", function() {
		// Given the stack 

		// Then
		expect(command).toBeDefined();
	});

	it("can execute", function() {
		// When
		command.execute();

		// Then
		expect(command.done).toBeTruthy();
	});

	it("can undo", function() {
		// When
		command.undo();

		// Then
		expect(command.undone).toBeTruthy();
	});

	it("can redo", function() {
		// When
		command.redo();

		// Then
		expect(command.redone).toBeTruthy();
	});

});