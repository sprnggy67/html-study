var sampleTemplates = [

	{ name:"Front 1", definition: {
		root: {
			componentType:"grid",
			orientation:"landscape",
			width:800, 
			height:600,
			rows:3, 
			columns:4,
			children: [
				{
					componentType:"flow",
					children: [
						{
							componentType:"headline",
							dataPath:"children",
							dataIndex:0
						},
						{
							componentType:"standfirst",
							dataPath:"children",
							dataIndex:0
						},
						{
							componentType:"body",
							dataPath:"children",
							dataIndex:0
						}
					],
					position: { left:0, top:0, width:1, height:3 }
				},
				{
					componentType:"image",
					dataPath:"children",
					dataIndex:0,
					position: { left:1, top:0, width:3, height:3 },
				},
			]
		}
	}},

	{ name:"Single Article Grid", definition: {
		root: {
			componentType:"grid",
			orientation:"landscape",
			width:800, 
			height:600,
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
	}},

	{ name:"Single Article Flow", definition: {
		root: {
			componentType:"flow",
			children: [
				{
					componentType:"headline",
					dataPath:"children",
					dataIndex:0
				},
				{
					componentType:"standfirst",
					dataPath:"children",
					dataIndex:0
				},
				{
					componentType:"body",
					dataPath:"children",
					dataIndex:0
				}
			]
		}
	}},

	{ name:"Simple Headline", definition: {
		root: {
			componentType:"headline",
			dataPath:"children",
			dataIndex:0
		}
	}},


];
	