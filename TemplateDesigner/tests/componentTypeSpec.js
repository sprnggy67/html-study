describe("ds.ComponentType", function() {

  beforeEach(function() {
  });

  it("should be defined", function() {
    var actualOutput = new ds.ComponentType("text", "DisplayText");
    expect(actualOutput).toBeDefined();
  });

  it("should getInfo", function() {
    var cmp = new ds.ComponentType("text", "DisplayText");
    var expectedOutput = 'ComponentType(text)';
    var actualOutput = cmp.getInfo();
    expect(actualOutput).toEqual(expectedOutput);
  });

  it("should getName", function() {
    var cmp = new ds.ComponentType("text", "DisplayText");
    var expectedOutput = "text";
    var actualOutput = cmp.getName();
    expect(actualOutput).toEqual(expectedOutput);
  });

  it("should getDisplayName", function() {
    var cmp = new ds.ComponentType("text", "DisplayText");
    var expectedOutput = "DisplayText";
    var actualOutput = cmp.getDisplayName();
    expect(actualOutput).toEqual(expectedOutput);
  });

  it("should call constructor in createComponent", function() {
    var ctorCalled = false;
    var cmp = new ds.ComponentType("text", "DisplayText", function(foo, bar) {
      ctorCalled = true;
    });
    cmp.createComponent();
    expect(ctorCalled).toBeTruthy();
  });

  it("should set and get property descriptors", function() {
    var cmp = new ds.ComponentType("text", "DisplayText");

    var pd1 = cmp.addPropertyDescriptor("data1", "Data 1");
    expect(pd1).toBeDefined();

    var pd2 = cmp.addPropertyDescriptor("data1", "Data 1");
    expect(pd2).toBeDefined();

    var pdArray = cmp.getPropertyDescriptors();
    expect(pdArray).toBeDefined();

    expect(pdArray.indexOf(pd1) > -1).toBeTruthy;
    expect(pdArray.indexOf(pd2) > -1).toBeTruthy;
  });

});