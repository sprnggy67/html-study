describe("ds.TemplateDesigner", function() {

  beforeEach(function() {
  });

  it("should be defined", function() {
    var actualOutput = new ds.TemplateDesigner();
    expect(actualOutput).toBeDefined();
  });

  it("loads from server", function() {
    var designer = new ds.TemplateDesigner();
    var doneCallback = false;
    designer.loadFromServer(function() {
      doneCallback = true;
    });

    waitsFor(function() {
      return doneCallback;
    }, "loadFromServer never completed", 10000);

    expect(designer.getPublication()).toBeDefined();
    expect(designer.getTemplate()).toBeDefined();
  });

});