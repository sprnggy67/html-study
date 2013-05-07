describe("ds.ComponentTypeLib", function() {

  beforeEach(function() {
  });

  it("should be defined", function() {
    var actualOutput = new ds.ComponentTypeLib();
    expect(actualOutput).toBeDefined();
  });

  it("should load registry", function() {
    typeLib = new ds.ComponentTypeLib();
    typeLib.loadRegistry();
    expect(typeLib.length()).toBeGreaterThan(0);
  });

  it("should add component types", function() {
    var input = new ds.ComponentTypeLib();

    var c1 = new ds.ComponentType("Text","{{>data}}");
    input.add(c1);
    expect(input.objectAt(0)).toBe(c1);

    var c2 = new ds.ComponentType("Text","{{>data}}");
    input.add(c2);
    expect(input.objectAt(0)).toBe(c1);
    expect(input.objectAt(1)).toBe(c2);
  });

  it("throws an exception when adding invalid children", function() {
    var input = new ds.ComponentTypeLib();
    var exceptionThrown = false;
    try {
        input.add("Foo", "Bar");
    } catch (e) {
        exceptionThrown = true;
    }
    expect(exceptionThrown).toBe(true);
  });

  it("should return size 0 when empty", function() {
    var input = new ds.ComponentTypeLib();
    var expectedSize = 0;
    var actualSize = input.length();;
    expect(actualSize).toEqual(expectedSize);
  });

  it("should return size 2 when there are two children", function() {
    var input = new ds.ComponentTypeLib();
    input.add(new ds.ComponentType("Text","{{>data}}"));
    input.add(new ds.ComponentType("Image","{{>data}}"));
    var expectedSize = 2;
    var actualSize = input.length();
    expect(actualSize).toEqual(expectedSize);
  });

  it("should return children named:", function() {
    var input = new ds.ComponentTypeLib();

    var c1 = new ds.ComponentType("Text","{{>data}}");
    input.add(c1);
    expect(input.objectNamed("Text")).toBe(c1);

    var c2 = new ds.ComponentType("Image","{{>data}}");
    input.add(c2);
    expect(input.objectNamed("Text")).toBe(c1);
    expect(input.objectNamed("Image")).toBe(c2);
  });

  it("should return null when child named does not exist", function() {
    var input = new ds.ComponentTypeLib();

    var c1 = new ds.ComponentType("Text","{{>data}}");
    input.add(c1);
    expect(input.objectNamed("Image")).toBeNull();
  });
});