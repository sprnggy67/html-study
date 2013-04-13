describe("Generator", function() {
 
  beforeEach(function() {
  });

  it("should generate a single text component", function() {
    var input = {
      "name":"Big Text",
      "root":{
        type:"Text",
        data:"Hello World"
      }
    };
    var expectedOutput = "<body><div>Hello World</div></body>";
    var actualOutput = generator.generate(input);
    expect(actualOutput).toEqual(expectedOutput);
  });

});