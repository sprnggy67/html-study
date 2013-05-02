describe("ds.ComponentType", function() {

  beforeEach(function() {
  });

  it("should be defined", function() {
    var actualOutput = new ds.ComponentType("Text", "{{>data}}");
    expect(actualOutput).toBeDefined();
    expect(actualOutput.getName()).toEqual("Text");
    expect(actualOutput.getTemplate()).toBeDefined();
    expect(actualOutput.isComposite()).toBeFalsy();
  });

  it("implements makeComponentType", function() {
    var actualOutput = ds.ComponentType.makeComponentType("Text", "{{>data}}");
    expect(actualOutput).toBeDefined();
    expect(actualOutput.getName()).toEqual("Text");
    expect(actualOutput.getTemplate()).toBeDefined();
  });

  it("implements getInfo", function() {
    var input = new ds.ComponentType("Text","{{>data}}");
    var expectedOutput = 'ComponentType(Text)';
    var actualOutput = input.getInfo();
    expect(actualOutput).toEqual(expectedOutput);
  });

  it("implements getName", function() {
    var input = new ds.ComponentType("Text","{{>data}}");
    var expectedOutput = "Text";
    var actualOutput = input.getName();
    expect(actualOutput).toEqual(expectedOutput);
  });

  it("implements getTemplate", function() {
    var input = new ds.ComponentType("Text","{{>data}}");
    var expectedOutput = "{{>data}}";
    var actualOutput = input.getTemplate();
    expect(actualOutput).toEqual(expectedOutput);
  });

  it("implements does render", function() {
    var cType = ds.ComponentType.makeComponentType("Text","{{>data}}");
    var article = { "data":"FooBar" };
    var actualOutput = cType.render(article);
    expect(actualOutput).toEqual(article.data);
  });

  it("implements can be a composite", function() {
    var cType = ds.ComponentType.makeComponentType("Text","{{>data}}", true);
    expect(cType.isComposite()).toBeTruthy();
  });
});