describe("ds.ComponentType", function() {

  beforeEach(function() {
  });

  it("should be defined", function() {
    var actualOutput = new ds.ComponentType("text", "DisplayText");
    expect(actualOutput).toBeDefined();
  });

  it("implements getInfo", function() {
    var input = new ds.ComponentType("text", "DisplayText");
    var expectedOutput = 'ComponentType(text)';
    var actualOutput = input.getInfo();
    expect(actualOutput).toEqual(expectedOutput);
  });

  it("implements getName", function() {
    var input = new ds.ComponentType("text", "DisplayText");
    var expectedOutput = "text";
    var actualOutput = input.getName();
    expect(actualOutput).toEqual(expectedOutput);
  });

  it("implements getDisplayName", function() {
    var input = new ds.ComponentType("text", "DisplayText");
    var expectedOutput = "DisplayText";
    var actualOutput = input.getDisplayName();
    expect(actualOutput).toEqual(expectedOutput);
  });

});