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
		var actualOutput = renderer._findData(navigationArticle, "id");
		expect(actualOutput).toEqual(expectedOutput);
	});

	it("should findData in deep objects", function() {
		var renderer = new ds.ArticleRenderer();

		var expectedOutput = "red";
		var actualOutput = renderer._findData(navigationArticle, "style.textColor");
		expect(actualOutput).toEqual(expectedOutput);
	});

	it("should generate a test component", function() {
		var renderer = new ds.ArticleRenderer();
		var component = {
			componentType:"test",
		};
		var expectedOutput = 'test';
		var actualOutput = renderer.renderComponent(component, navigationArticle);
		expect(actualOutput).toEqual(expectedOutput);
	});

	it("should generate a root headline component", function() {
		var renderer = new ds.ArticleRenderer();
		var component = {
			componentType:"headline",
			dataPath:"#root",
		};
		var expectedOutput = '<h1 class="selectable">Best of Times</h1>';
		var actualOutput = renderer.renderComponent(component, navigationArticle);
		expect(actualOutput).toEqual(expectedOutput);
	});

	it("should generate the first headline component", function() {
		var renderer = new ds.ArticleRenderer();
		var component = {
			componentType:"headline",
			dataPath:"children",
			dataIndex:0
		};
		var expectedOutput = '<h1 class="selectable">h1</h1>';
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
		var expectedOutput = '<h1 class="selectable">h2</h1>';
		var actualOutput = renderer.renderComponent(component, navigationArticle);
		expect(actualOutput).toEqual(expectedOutput);
	});

	it("should generate a colored headline component", function() {
		var renderer = new ds.ArticleRenderer();
		var component = {
			componentType:"headline",
			"color": "#000080",
      		"backgroundColor": "#99cc00",
			dataPath:"#root",
		};
		var expectedOutput = '<h1 class="selectable" style="color:#000080;background-color:#99cc00;">Best of Times</h1>';
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
		var expectedOutput = '<h1 class="selectable" style="font-size:20px">h2</h1>';
		var actualOutput = renderer.renderComponent(component, navigationArticle);
		expect(actualOutput).toEqual(expectedOutput);
	});

	it("should link in a headline component", function() {
		var renderer = new ds.ArticleRenderer();
		var component = {
			componentType:"headline",
			dataPath:"children",
			dataIndex:1,
			link:true
		};
		var expectedOutput = '<h1 class="selectable link" data-article_id="001.2">h2</h1>';
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
		var expectedOutput = '<span class="selectable" style="display:table-cell;">body1</span>';
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
		var expectedOutput = '<span class="selectable" style="display:table-cell;font-size:20px">body1</span>';
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
		var expectedOutput = '<img class="selectable" src="img1.jpg">';
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
		var expectedOutput = '<h2 class="selectable">sf1</h2>';
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
		var expectedOutput = '<h2 class="selectable" style="font-size:20px">sf1</h2>';
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
					componentType:"test",
					dataPath:"children",
					dataIndex:0
				}
			]
		};
		var expectedOutput = '<div class="selectable flow"><h1 class="selectable">h1</h1>test</div>';
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
					componentType:"test",
					dataPath:"children",
					dataIndex:1
				}
			]
		};
		var expectedOutput = '<div class="selectable flow"><h1 class="selectable">h2</h1>test</div>';
		var actualOutput = renderer.renderComponent(component, navigationArticle);
		expect(actualOutput).toEqual(expectedOutput);
	});

	it("should generate a flow component with tap navigation", function() {
		var renderer = new ds.ArticleRenderer();
		var component = {
			dataPath:"children",
			dataIndex:0,
			componentType:"flow",
			children: [
				{
					componentType:"test",
					dataPath:"children",
					dataIndex:0
				}
			],
			link:true
		};
		var expectedOutput = '<div class="selectable flow link" data-article_id="001.1">test</div>';
		var actualOutput = renderer.renderComponent(component, navigationArticle);
		expect(actualOutput).toEqual(expectedOutput);
	});

	var gridComponent = {
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

	it("should generate a grid component for the first article", function() {
		var renderer = new ds.ArticleRenderer();
		var component = gridComponent;
		var expectedOutput = '<div class="selectable">' +
			'<div class="gridData" style="position:absolute; overflow:hidden; left:0px; top:0px; width:256px; height:256px;"><h1 class="selectable">h1</h1></div>' +
			'<div class="gridData" style="position:absolute; overflow:hidden; left:0px; top:256px; width:256px; height:512px;"><span class="selectable" style="display:table-cell;">body1</span></div>' +
			'<div class="gridData" style="position:absolute; overflow:hidden; left:256px; top:0px; width:768px; height:768px;"><img class="selectable" src="img1.jpg"></div>' +
			'</div>';
		var actualOutput = renderer.renderComponent(component, navigationArticle);
		expect(actualOutput).toEqual(expectedOutput);
	});

	it("should generate a grid component with width and height", function() {
		var renderer = new ds.ArticleRenderer();
		var component = gridComponent;
		var expectedOutput = '<div class="selectable">' +
			'<div class="gridData" style="position:absolute; overflow:hidden; left:0px; top:0px; width:200px; height:200px;"><h1 class="selectable">h1</h1></div>' +
			'<div class="gridData" style="position:absolute; overflow:hidden; left:0px; top:200px; width:200px; height:400px;"><span class="selectable" style="display:table-cell;">body1</span></div>' +
			'<div class="gridData" style="position:absolute; overflow:hidden; left:200px; top:0px; width:600px; height:600px;"><img class="selectable" src="img1.jpg"></div>' +
			'</div>';
		var actualOutput = renderer.renderComponent(component, navigationArticle, { width:800, height:600 });
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
					componentType:"test",
					position: { left:0, top:0, width:1, height:1 }
				},
				{
					componentType:"test",
					position: { left:0, top:1, width:1, height:1 },
				},
				{
					componentType:"test",
					position: { left:1, top:0, width:1, height:2 },
				},
			]
		};
		var expectedOutput = '<div class="selectable">' +
			'<div class="gridData" style="position:absolute; overflow:hidden; left:0px; top:0px; width:245px; height:245px;">test</div>' +
			'<div class="gridData" style="position:absolute; overflow:hidden; left:0px; top:255px; width:245px; height:245px;">test</div>' +
			'<div class="gridData" style="position:absolute; overflow:hidden; left:255px; top:0px; width:245px; height:500px;">test</div>' +
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
		var expectedOutput = '<div class="selectable" id="grid01">' +
			'<div class="gridCell" style="position:absolute; left:0px; top:0px; width:512px; height:384px;" data-row="0" data-column="0"></div>' +
			'<div class="gridCell" style="position:absolute; left:512px; top:0px; width:512px; height:384px;" data-row="0" data-column="1"></div>' +
			'<div class="gridCell" style="position:absolute; left:0px; top:384px; width:512px; height:384px;" data-row="1" data-column="0"></div>' +
			'<div class="gridCell" style="position:absolute; left:512px; top:384px; width:512px; height:384px;" data-row="1" data-column="1"></div>' +
			'</div>';
		var actualOutput = renderer.renderComponent(component, navigationArticle);
		expect(actualOutput).toEqual(expectedOutput);
	});

	it("should generate the body for a headline component", function() {
		var renderer = new ds.ArticleRenderer();
		var template = {
			targets: [
				{
					name:"default",
					layout: {
						componentType:"headline",
						dataPath:"children",
						dataIndex:0
					}
				}
			]
		};
		var expectedOutput = '<h1 class="selectable">h1</h1>';
		var actualOutput = renderer.renderBody(template, navigationArticle);
		expect(actualOutput).toEqual(expectedOutput);
	});

	it("should generate a simple HTML page with a test component", function() {
		var renderer = new ds.ArticleRenderer();
		var template = {
			targets: [
				{
					name:"default",
					layout: {
						componentType:"test",
					}
				}
			]
		};
		var expectedOutput = '<html>' +
			'<head>' +
				ds.ArticleRenderer.BOILER_PLATE +
			'</head>' +
			'<body>' +
				'test' +
			'</body>' + 
			'</html>';
		var actualOutput = renderer.renderPage(template, navigationArticle);
		expect(actualOutput).toEqual(expectedOutput);
	});

	it("should generate a simple HTML page with a landscape body component", function() {
		var renderer = new ds.ArticleRenderer();
		var template = {
			targets: [
				{
					name:"default",
					portraitLayout: {
						componentType:"headline",
						dataPath:"children",
						dataIndex:0
					},
					landscapeLayout: {
						componentType:"body",
						dataPath:"children",
						dataIndex:0
					}
				}
			]
		};
		var expectedOutput = '<html>' +
			'<head>' +
				ds.ArticleRenderer.BOILER_PLATE +
			'</head>' +
			'<body>' +
				'<span class="selectable" style="display:table-cell;">body1</span>' +
			'</body>' + 
			'</html>';
		var actualOutput = renderer.renderPage(template, navigationArticle, { orientation:"landscape"} );
		expect(actualOutput).toEqual(expectedOutput);
	});

	var gridTemplate = {
		targets: [
			{
				name:"default",
				layout: {
					componentType:"grid",
					orientation:"landscape",
					width:1024, 
					height:768,
					rows:1, 
					columns:1,
					children: [
						{
							componentType:"headline",
							dataPath:"children",
							dataIndex:0,
							position: { left:0, top:0, width:1, height:1 }
						},
					]
				}
			}
		]
	};

	it("should generate a complex HTML page with a grid component", function() {
		var renderer = new ds.ArticleRenderer();
		var template = gridTemplate;
		var expectedOutput = '<html>' +
			'<head>' +
				ds.ArticleRenderer.BOILER_PLATE +
			'</head>' +
			'<body>' +
				'<div class="selectable"><div class="gridData" style="position:absolute; overflow:hidden; left:0px; top:0px; width:1024px; height:768px;"><h1 class="selectable">h1</h1></div></div>' +
			'</body>' + 
			'</html>';
		var actualOutput = renderer.renderPage(template, navigationArticle);
		expect(actualOutput).toEqual(expectedOutput);
	});

	it("should generate a complex HTML page with a grid component and options", function() {
		var renderer = new ds.ArticleRenderer();
		var template = gridTemplate;
		var expectedOutput = '<html>' +
			'<head>' +
				ds.ArticleRenderer.BOILER_PLATE +
			'</head>' +
			'<body>' +
				'<div class="selectable"><div class="gridData" style="position:absolute; overflow:hidden; left:0px; top:0px; width:500px; height:600px;"><h1 class="selectable">h1</h1></div></div>' +
			'</body>' + 
			'</html>';
		var actualOutput = renderer.renderPage(template, navigationArticle, { width:500, height:600 });
		expect(actualOutput).toEqual(expectedOutput);
	});


});