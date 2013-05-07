describe("ds.Publication", function() {

  beforeEach(function() {
  });

  it("should be defined", function() {
    var actualOutput = new ds.Publication();
    expect(actualOutput).toBeDefined();
  });

  it("loads from server", function() {
    var publication = new ds.Publication();
    var doneCallback = false;
    publication.loadFromServer(function() {
      doneCallback = true;
    });

    waitsFor(function() {
      return doneCallback;
    }, "loadFromServer never completed", 10000);

    expect(publication.getName()).toBeDefined();
    expect(publication.getDefaultTemplate()).toBeDefined();
  });

});