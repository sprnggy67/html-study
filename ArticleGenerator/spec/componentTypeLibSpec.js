describe("ComponentTypeLib", function() {
 
  beforeEach(function() {
  });

  it("should be defined", function() {
    var actualOutput = new ComponentTypeLib();
    expect(actualOutput).toBeDefined();
  });

 it("should init", function() {
    var input = new ComponentTypeLib();

    input.loadComponentsFromRegistry();
    expect(input.length).toEqual(3);
 });

 it("should add component types", function() {
    var input = new ComponentTypeLib();

    var c1 = new ComponentType("Text","{{>data}}");
    input.add(c1);
    expect(input.objectAt(0)).toBe(c1);
 
    var c2 = new ComponentType("Text","{{>data}}");
    input.add(c2);
    expect(input.objectAt(0)).toBe(c1);
    expect(input.objectAt(1)).toBe(c2);
 });

 it("should return size 0 when empty", function() {
    var input = new ComponentTypeLib();
     var expectedSize = 0;
    var actualSize = input.length();;
    expect(actualSize).toEqual(expectedSize);
 });

 it("should return size 2 when there are two children", function() {
    var input = new ComponentTypeLib();
    input.add(new ComponentType("Text","{{>data}}"));
    input.add(new ComponentType("Image","{{>data}}"));
    var expectedSize = 2;
    var actualSize = input.length();
    expect(actualSize).toEqual(expectedSize);
 });

 it("should return children by type", function() {
    var input = new ComponentTypeLib();

    var c1 = new ComponentType("Text","{{>data}}");
    input.add(c1);
    expect(input.objectByType("Text")).toBe(c1);
 
    var c2 = new ComponentType("Image","{{>data}}");
    input.add(c2);
    expect(input.objectByType("Text")).toBe(c1);
    expect(input.objectByType("Image")).toBe(c2);
 });

 it("should return null when child of type does not exist", function() {
    var input = new ComponentTypeLib();

    var c1 = new ComponentType("Text","{{>data}}");
    input.add(c1);
    expect(input.objectByType("Image")).toBeNull();
 });
});