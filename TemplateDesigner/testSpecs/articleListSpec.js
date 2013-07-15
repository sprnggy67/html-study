describe("ds.ArticleList", function() {

	var root = null;
	var sampleArticle = null;

	beforeEach(function() {
		sampleArticle = sampleArticles[0].definition;
		loadFixtures('simpleListFixture.html');		
	});

	it("can be instantiated", function() {
		// When
		var articleList = new ds.ArticleList("#dataList", sampleArticle, null);

		// Then
		expect(articleList).toBeDefined();
	});

	it("has the right children", function() {
		// When
		var articleList = new ds.ArticleList("#dataList", sampleArticle, null);

		// Then
		var listItems = $('#dataList > li');
		expect(listItems).toHaveLength(5);
		expect(listItems[0].innerText).toEqual('Root Article');
		expect(listItems[1].innerText).toEqual('Sub Article 1');
		expect(listItems[4].innerText).toEqual('Sub Article 4');
	});

	it("selects the first article by default", function() {
		// When
		var articleList = new ds.ArticleList("#dataList", sampleArticle, null);

		// Then the first item must be selected
		var selection = articleList.getActiveArticleIndex();
		expect(selection).toEqual(0);

		// And it must have the selected class.
		var listItems = $('#dataList > li');
		var item = listItems[selection];
		expect(item).toHaveClass('selected');
	});

	it("invokes the callback on selection", function() {
		// Given
		var didCallback = false;
		var didCallbackWith = 0;;
		var articleList = new ds.ArticleList("#dataList", sampleArticle, function(element, index) {
			didCallback = true;
			didCallbackWith = index;
		});

		// When the third element article is selected.
		var listItems = $('#dataList > li');
		$(listItems[3]).click();

		// Then the third item must be selected
		var selection = articleList.getActiveArticleIndex();
		expect(selection).toEqual(3);

		// And the callback must be invoked.
		expect(didCallback).toBe(true);
		expect(didCallbackWith).toEqual(3);
	});

});