var defaultTemplates = {

	"empty" : {
		targets: [
			{
				name:"default",
				layout: {
					uniqueID:"defaultRoot",
					componentType:"grid",
					width:600, 
					height:800,
					rows:4, 
					columns:3,
					rowGutter:10,
					columnGutter:10,
					children: [
					]
				},
			}
		]
	},

	"emptyResponsive" : {
		targets: [
			{
				name:"default",
				portraitLayout: {
					uniqueID:"portraitRoot",
					componentType:"grid",
					width:600, 
					height:800,
					rows:4, 
					columns:3,
					rowGutter:10,
					columnGutter:10,
					children: [
					]
				},
				landscapeLayout: {
					uniqueID:"landscapeRoot",
					componentType:"grid",
					width:800, 
					height:600,
					rows:3, 
					columns:4,
					rowGutter:10,
					columnGutter:10,
					children: [
					]
				},
			}
		]
	},

	"front3": {
		targets: [
			{
				name:"default",
				layout: {
					uniqueID:"portraitRoot",
					componentType:"grid",
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
									dataIndex:0,
									uniqueID:"ref001",
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
			}
		]
	}
};
	