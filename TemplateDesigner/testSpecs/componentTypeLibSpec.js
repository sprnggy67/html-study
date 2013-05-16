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

    var c1 = new ds.ComponentType("text","DisplayText");
    input.add(c1);
    expect(input.componentAt(0)).toBe(c1);

    var c2 = new ds.ComponentType("text","DisplayText");
    input.add(c2);
    expect(input.componentAt(0)).toBe(c1);
    expect(input.componentAt(1)).toBe(c2);
  });

  it("throws an exception when adding invalid components", function() {
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

  it("should return size 2 when there are two components", function() {
    var input = new ds.ComponentTypeLib();
    input.add(new ds.ComponentType("text","DisplayText"));
    input.add(new ds.ComponentType("Image","DisplayText"));
    var expectedSize = 2;
    var actualSize = input.length();
    expect(actualSize).toEqual(expectedSize);
  });

  it("should return components named:", function() {
    var input = new ds.ComponentTypeLib();

    var c1 = new ds.ComponentType("text","DisplayText");
    input.add(c1);
    expect(input.componentNamed("text")).toBe(c1);

    var c2 = new ds.ComponentType("image","DisplayImage");
    input.add(c2);
    expect(input.componentNamed("text")).toBe(c1);
    expect(input.componentNamed("image")).toBe(c2);
  });

  it("should return null when child named does not exist", function() {
    var input = new ds.ComponentTypeLib();

    var c1 = new ds.ComponentType("text","DisplayText");
    input.add(c1);
    expect(input.componentNamed("Image")).toBeNull();
  });

  it("should return its children", function() {
    var input = new ds.ComponentTypeLib();

    var c1 = new ds.ComponentType("text","DisplayText");
    input.add(c1);
    var c2 = new ds.ComponentType("image","DisplayImage");
    input.add(c2);
 
    var children = input.getChildren();
    expect(children.length).toEqual(2);
    expect(children[0]).toBe(c1);
    expect(children[1]).toBe(c2);
  });

});