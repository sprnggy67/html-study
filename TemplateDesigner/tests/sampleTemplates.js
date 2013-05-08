var sampleTemplates = [

	{ name:"Front 1", definition: {
		root: {
			componentType:"grid",
			orientation:"landscape",
			width:800, 
			height:600,
			rows:3, 
			columns:4,
			rowGutter:10,
			columnGutter:10,
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

	{ name:"Front 1b", definition: {
		root: {
			componentType:"grid",
			orientation:"landscape",
			width:800, 
			height:600,
			rows:3, 
			columns:4,
			rowGutter:10,
			columnGutter:10,
			children: [
				{
					componentType:"flow",
					children: [
						{
							componentType:"headline",
							style:"font-size:20px; margin-top:0px",
							dataPath:"children",
							dataIndex:0
						},
						{
							componentType:"standfirst",
							style:"font-size:18px",
							dataPath:"children",
							dataIndex:0
						},
						{
							componentType:"body",
							style:"font-size:10px",
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

	{ name:"Front 3", definition: {
		root: {
			componentType:"grid",
			orientation:"landscape",
			width:800, 
			height:600,
			rows:3, 
			columns:4,
			rowGutter:10,
			columnGutter:10,
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
							style:"font-size:20px;",
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
					dataIndex:1,
					position: { left:1, top:0, width:2, height:2 },
				},
				{
					componentType:"flow",
					children: [
						{
							componentType:"headline",
							dataPath:"children",
							dataIndex:1
						},
						{
							componentType:"standfirst",
							style:"font-size:20px;",
							dataPath:"children",
							dataIndex:1
						},
					],
					position: { left:1, top:2, width:2, height:1 }
				},
				{
					componentType:"flow",
					children: [
						{
							componentType:"headline",
							dataPath:"children",
							dataIndex:2
						},
						{
							componentType:"standfirst",
							style:"font-size:20px;",
							dataPath:"children",
							dataIndex:2
						},
						{
							componentType:"body",
							dataPath:"children",
							dataIndex:2
						}
					],
					position: { left:3, top:0, width:1, height:3 }
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

	{ name:"Empty Grid", definition: {
		designTime:true,
		root: {
			componentType:"grid",
			orientation:"landscape",
			width:800, 
			height:600,
			rows:3, 
			columns:4,
			children: [
			]
		}
	}},


];
	