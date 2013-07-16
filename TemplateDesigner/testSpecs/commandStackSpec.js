describe("ds.CommandStack", function() {

	var stack = null;

	beforeEach(function() {
		commandStack = new ds.CommandStack();
	});

	it("can be instantiated", function() {
		// Given the stack 

		// Then
		expect(commandStack).toBeDefined();
	});

	it("can store and execute", function() {
		// Given
		var command = new ds.Command();

		// When
		commandStack.storeAndExecute(command);

		// Then
		expect(command.done).toBeTruthy();
	});

	it("can undo", function() {
		// Given
		var command = new ds.Command();

		// When
		commandStack.storeAndExecute(command);

		// Then
		expect(commandStack.canUndo()).toBeTruthy();
	});

	it("does undo", function() {
		// Given
		var command = new ds.Command();

		// When
		commandStack.storeAndExecute(command);
		commandStack.executeUndo();

		// Then
		expect(command.undone).toBeTruthy();
		expect(commandStack.canUndo()).toBeFalsy();
		expect(commandStack.canRedo()).toBeTruthy();
	});

	it("does redo", function() {
		// Given
		var command = new ds.Command();

		// When
		commandStack.storeAndExecute(command);
		commandStack.executeUndo();
		commandStack.executeRedo();

		// Then
		expect(command.redone).toBeTruthy();
		expect(commandStack.canUndo()).toBeTruthy();
		expect(commandStack.canRedo()).toBeFalsy();
	});

	it("does clear", function() {
		// Given
		var command = new ds.Command();

		// When
		commandStack.storeAndExecute(command);
		commandStack.clear();

		// Then
		expect(commandStack.canUndo()).toBeFalsy();
		expect(commandStack.canRedo()).toBeFalsy();
	});

});