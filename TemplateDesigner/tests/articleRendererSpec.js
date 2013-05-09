describe("ds.ArticleRenderer", function() {
 
	var navigationArticle = {
		"id":"001",
		"headline":"Best of Times",
		"style": {
			"textColor":"red",
			"backgroundColor":"blue"
		},
		"children":[
		{
			"id":"001.1",
			"headline":"h1",
			"standFirst":"sf1",
			"body":"body1",
			"image":"img1.jpg"
		},
		{
			"id":"001.2",
			"headline":"h2",
			"standFirst":"sf2",
			"body":"body2",
			"image":"img2.jpg"
		},
		{
			"id":"001.3",
			"headline":"h3",
			"standFirst":"sf3",
			"body":"body3",
			"image":"img3.jpg"
		}
		]
	};

	beforeEach(function() {
	});

	it("should be defined", function() {
		var renderer = new ds.ArticleRenderer();
		expect(renderer).toBeDefined();
	});

	it("should findData in shallow objects", function() {
		var renderer = new ds.ArticleRenderer();

		var expectedOutput = "001";
		var actualOutput = renderer.findData(navigationArticle, "id");
		expect(actualOutput).toEqual(expectedOutput);
	});

	it("should findData in deep objects", function() {
		var renderer = new ds.ArticleRenderer();

		var expectedOutput = "red";
		var actualOutput = renderer.findData(navigationArticle, "style.textColor");
		expect(actualOutput).toEqual(expectedOutput);
	});

	it("should generate the first headline component", function() {
		var renderer = new ds.ArticleRenderer();
		var component = {
			componentType:"headline",
			dataPath:"children",
			dataIndex:0
		};
		var expectedOutput = "<h1>h1</h1>";
		var actualOutput = renderer.renderComponent(component, navigationArticle);
		expect(actualOutput).toEqual(expectedOutput);
	});

	it("should generate the second headline component", function() {
		var renderer = new ds.ArticleRenderer();
		var component = {
			componentType:"headline",
			dataPath:"children",
			dataIndex:1
		};
		var expectedOutput = "<h1>h2</h1>";
		var actualOutput = renderer.renderComponent(component, navigationArticle);
		expect(actualOutput).toEqual(expectedOutput);
	});

	it("should generate styles in a headline component", function() {
		var renderer = new ds.ArticleRenderer();
		var component = {
			componentType:"headline",
			style:"font-size:20px",
			dataPath:"children",
			dataIndex:1
		};
		var expectedOutput = '<h1 style="font-size:20px">h2</h1>';
		var actualOutput = renderer.renderComponent(component, navigationArticle);
		expect(actualOutput).toEqual(expectedOutput);
	});

	it("should generate the first body component", function() {
		var renderer = new ds.ArticleRenderer();
		var component = {
			componentType:"body",
			dataPath:"children",
			dataIndex:0
		};
		var expectedOutput = navigationArticle.children[0].body;
		var actualOutput = renderer.renderComponent(component, navigationArticle);
		expect(actualOutput).toEqual(expectedOutput);
	});

	it("should generate styles in a body component", function() {
		var renderer = new ds.ArticleRenderer();
		var component = {
			componentType:"body",
			style:"font-size:20px",
			dataPath:"children",
			dataIndex:0
		};
		var expectedOutput = '<span style="font-size:20px">body1</span>';
		var actualOutput = renderer.renderComponent(component, navigationArticle);
		expect(actualOutput).toEqual(expectedOutput);
	});

	it("should generate the first image component", function() {
		var renderer = new ds.ArticleRenderer();
		var component = {
			componentType:"image",
			dataPath:"children",
			dataIndex:0
		};
		var expectedOutput = '<img src="img1.jpg">';
		var actualOutput = renderer.renderComponent(component, navigationArticle);
		expect(actualOutput).toEqual(expectedOutput);
	});

	it("should generate the first standfirst component", function() {
		var renderer = new ds.ArticleRenderer();
		var component = {
			componentType:"standfirst",
			dataPath:"children",
			dataIndex:0
		};
		var expectedOutput = "<h2>sf1</h2>";
		var actualOutput = renderer.renderComponent(component, navigationArticle);
		expect(actualOutput).toEqual(expectedOutput);
	});

	it("should generate styles in a standfirst component", function() {
		var renderer = new ds.ArticleRenderer();
		var component = {
			componentType:"standfirst",
			style:"font-size:20px",
			dataPath:"children",
			dataIndex:0
		};
		var expectedOutput = '<h2 style="font-size:20px">sf1</h2>';
		var actualOutput = renderer.renderComponent(component, navigationArticle);
		expect(actualOutput).toEqual(expectedOutput);
	});

	it("should generate a flow component for the first article", function() {
		var renderer = new ds.ArticleRenderer();
		var component = {
			componentType:"flow",
			children: [
				{
					componentType:"headline",
					dataPath:"children",
					dataIndex:0
				},
				{
					componentType:"body",
					dataPath:"children",
					dataIndex:0
				}
			]
		};
		var expectedOutput = '<div class="flow"><h1>h1</h1>body1</div>';
		var actualOutput = renderer.renderComponent(component, navigationArticle);
		expect(actualOutput).toEqual(expectedOutput);
	});

	it("should generate a flow component for the second article", function() {
		var renderer = new ds.ArticleRenderer();
		var component = {
			componentType:"flow",
			children: [
				{
					componentType:"headline",
					dataPath:"children",
					dataIndex:1
				},
				{
					componentType:"body",
					dataPath:"children",
					dataIndex:1
				}
			]
		};
		var expectedOutput = '<div class="flow"><h1>h2</h1>body2</div>';
		var actualOutput = renderer.renderComponent(component, navigationArticle);
		expect(actualOutput).toEqual(expectedOutput);
	});

	it("should generate a grid component for the first article", function() {
		var renderer = new ds.ArticleRenderer();
		var component = {
			componentType:"grid",
			orientation:"landscape",
			width:1024, 
			height:768,
			rows:3, 
			columns:4,
			children: [
				{
					componentType:"headline",
					dataPath:"children",
					dataIndex:0,
					position: { left:0, top:0, width:1, height:1 }
				},
				{
					componentType:"body",
					dataPath:"children",
					dataIndex:0,
					position: { left:0, top:1, width:1, height:2 },
				},
				{
					componentType:"image",
					dataPath:"children",
					dataIndex:0,
					position: { left:1, top:0, width:3, height:3 },
				},
			]
		};
		var expectedOutput = '<div><div style="position:absolute; overflow:hidden; left:0px; top:0px; width:256px; height:256px;"><h1>h1</h1></div><div style="position:absolute; overflow:hidden; left:0px; top:256px; width:256px; height:512px;">body1</div><div style="position:absolute; overflow:hidden; left:256px; top:0px; width:768px; height:768px;"><img src="img1.jpg"></div></div>';
		var actualOutput = renderer.renderComponent(component, navigationArticle);
		expect(actualOutput).toEqual(expectedOutput);
	});

	it("should generate a grid component with gutters", function() {
		var renderer = new ds.ArticleRenderer();
		var component = {
			componentType:"grid",
			orientation:"landscape",
			width:500, 
			height:500,
			rows:2, 
			columns:2,
			rowGutter:10,
			columnGutter:10,
			children: [
				{
					componentType:"headline",
					dataPath:"children",
					dataIndex:0,
					position: { left:0, top:0, width:1, height:1 }
				},
				{
					componentType:"body",
					dataPath:"children",
					dataIndex:0,
					position: { left:0, top:1, width:1, height:1 },
				},
				{
					componentType:"image",
					dataPath:"children",
					dataIndex:0,
					position: { left:1, top:0, width:1, height:2 },
				},
			]
		};
		var expectedOutput = '<div>' +
			'<div style="position:absolute; overflow:hidden; left:0px; top:0px; width:245px; height:245px;"><h1>h1</h1></div>' +
			'<div style="position:absolute; overflow:hidden; left:0px; top:255px; width:245px; height:245px;">body1</div>' +
			'<div style="position:absolute; overflow:hidden; left:255px; top:0px; width:245px; height:500px;"><img src="img1.jpg"></div>' +
			'</div>';
		var actualOutput = renderer.renderComponent(component, navigationArticle);
		expect(actualOutput).toEqual(expectedOutput);
	});

	it("should generate a design time empty grid component", function() {
		var renderer = new ds.ArticleRenderer();
		var component = {
			componentType:"grid",
			orientation:"landscape",
			width:1024, 
			height:768,
			rows:2, 
			columns:2,
			designTime:true,
			uniqueID:"grid01",
			children: [
			]
		};
		var expectedOutput = '<div id="grid01"><div class="gridCell" style="position:absolute; left:0px; top:0px; width:512px; height:384px;" data-row="0" data-column="0"></div><div class="gridCell" style="position:absolute; left:512px; top:0px; width:512px; height:384px;" data-row="0" data-column="1"></div><div class="gridCell" style="position:absolute; left:0px; top:384px; width:512px; height:384px;" data-row="1" data-column="0"></div><div class="gridCell" style="position:absolute; left:512px; top:384px; width:512px; height:384px;" data-row="1" data-column="1"></div></div>';
		var actualOutput = renderer.renderComponent(component, navigationArticle);
		expect(actualOutput).toEqual(expectedOutput);
	});

	it("should generate a simple HTML page with a headline component", function() {
		var renderer = new ds.ArticleRenderer();
		var template = {
			root: {
				componentType:"headline",
				dataPath:"children",
				dataIndex:0
			}
		};
		var expectedOutput = '<html>' +
			'<head><link rel="stylesheet" type="text/css" href="src/renderRuntime.css"><script type="text/javascript" src="src/renderRuntime.js"></script></head>' +
			'<body><h1>h1</h1></body></html>';
		var actualOutput = renderer.renderPage(template, navigationArticle);
		expect(actualOutput).toEqual(expectedOutput);
	});

	it("should generate a complex HTML page with a grid component", function() {
		var renderer = new ds.ArticleRenderer();
		var template = {
			root: {
				componentType:"grid",
				orientation:"landscape",
				width:1024, 
				height:768,
				rows:3, 
				columns:4,
				children: [
					{
						componentType:"headline",
						dataPath:"children",
						dataIndex:0,
						position: { left:0, top:0, width:1, height:1 }
					},
					{
						componentType:"body",
						dataPath:"children",
						dataIndex:0,
						position: { left:0, top:1, width:1, height:2 },
					},
					{
						componentType:"image",
						dataPath:"children",
						dataIndex:0,
						position: { left:1, top:0, width:3, height:3 },
					},
				]
			}
		};
		var actualOutput = renderer.renderPage(template, navigationArticle);
		expect(actualOutput).toMatch(/<html><head>/);
		expect(actualOutput).toMatch(/<div style="position:absolute; overflow:hidden; left:0px; top:0px; width:256px; height:256px;"><h1>h1<\/h1><\/div>/);
		expect(actualOutput).toMatch(/<\/body><\/html>/);
	});


});