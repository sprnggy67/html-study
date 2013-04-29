describe("ComponentType", function() {
 
  beforeEach(function() {
  });

  it("should be defined", function() {
    var actualOutput = new ComponentType("Text", "{{>data}}");
    expect(actualOutput).toBeDefined();
  });

 it("implements getInfo", function() {
    var input = new ComponentType("Text","{{>data}}");
    var expectedOutput = 'ComponentType(Text)';
    var actualOutput = input.getInfo();
    expect(actualOutput).toEqual(expectedOutput);
 });

 it("implements getName", function() {
    var input = new ComponentType("Text","{{>data}}");
    var expectedOutput = "Text";
    var actualOutput = input.getType();
    expect(actualOutput).toEqual(expectedOutput);
 });

 it("implements getTemplate", function() {
    var input = new ComponentType("Text","{{>data}}");
    var expectedOutput = "{{>data}}";
    var actualOutput = input.getTemplate();
    expect(actualOutput).toEqual(expectedOutput);
 });
});