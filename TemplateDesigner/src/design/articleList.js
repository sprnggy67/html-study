/**
 A list of articles
 */

'use strict';

var ds = ds || {};

/**
 * Constructs a new ArticleList with a root element ID and a sample article.
 * The sample article and its children will be displayed within the root element.
 */
ds.ArticleList = function(rootElementID, sampleArticle) {
	this.init(rootElementID, sampleArticle);
}

ds.ArticleList.prototype.init = function(rootElementID, sampleArticle) {
	// Create and display the list of articles
	var dataArray = [ { displayName:"Root Article"} ];
	for (var x = 0; x < sampleArticle.children.length; x ++) {
		dataArray.push( { displayName:"Sub Article " + (x+1) });
	};
	$(rootElementID).html($("#dataItemTemplate").render(dataArray));

	// Select the first article.
	this.activeArticleIndex = 0;
	$(".dataItem").first().addClass("selected");

	// Add click interaction.
	var that = this;
	$(".dataItem").click(function() {
		that.setActiveArticleIndex(this.dataset.index);
	});
}

ds.ArticleList.prototype.getActiveArticleIndex = function() {
	return this.activeArticleIndex;
}

ds.ArticleList.prototype.setActiveArticleIndex = function(index) {
	$(".dataItem").eq(this.activeArticleIndex).removeClass("selected");
	this.activeArticleIndex = index;
	$(".dataItem").eq(this.activeArticleIndex).addClass("selected");
}

