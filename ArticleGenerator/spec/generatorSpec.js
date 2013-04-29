describe("Generator", function() {
 
  var typeLib;

  beforeEach(function() {
    var typeLib = new ComponentTypeLib();
    typeLib.loadComponentsFromRegistry();
  });

  it("should be defined", function() {
    var generator = new Generator(typeLib);
    expect(generator).toBeDefined();
  });

  it("should generate a single text component", function() {
    var generator = new Generator(typeLib);
    var input = {
      "name":"Big Text",
      "root":{
        type:"Text",
        data:"Hello World"
      }
    };
    var expectedOutput = "<body>Hello World</body>";
    var actualOutput = generator.generate(input);
    expect(actualOutput).toEqual(expectedOutput);
  });

  it("should generate a single image component", function() {
    var generator = new Generator(typeLib);
    var input = {
      "name":"Big Text",
      "root":{
        type:"Image",
        data:"img.jpg"
      }
    };
    var expectedOutput = '<body><img src="img.jpg"></body>';
    var actualOutput = generator.generate(input);
    expect(actualOutput).toEqual(expectedOutput);
  });

});