console.time("init");

// Execute the following in function scope to avoid polluting the global namespace.
(function() {

"use strict";

var articleSelection = -1;

window.addEventListener("DOMContentLoaded", init);

function init() {
	fillMenu();
	showArticle(0);
	console.timeEnd("init");
}

function fillMenu() {
	var ul = document.createElement("ul");
	ul.setAttribute("id","menuList");
	ul.className = "menuList";
	for (var i = 0; i < articleList.length; i++) { 
		var articleData = articleList[i];
		var newLI = document.createElement("li");
		newLI.innerHTML = articleData.headline;
		newLI.className = "menuItem";

		(function(element, i) {
			element.addEventListener("click", function() {
				showArticle(i);
			});
		})(newLI, i);
		
		ul.appendChild(newLI);
	}
	var menu = document.getElementById("menu");
	menu.appendChild(ul);
}

function showArticle(number) {
	console.time("showArticle");
	if (articleSelection == number)
		return;
	if (articleSelection >= 0) {
		var li = findArticleMenuItem(articleSelection);
		if (li) {
			removeClass(li, "selected");
		}
		articleSelection = -1;
	}
	if (true) {
		articleSelection = number;
		var li = findArticleMenuItem(number);
		if (li) {
			addClass(li, "selected");
		}
		showArticleInContentArea(articleList[number]);
	}
	console.timeEnd("showArticle");
}

function showArticleInContentArea(articleData) {
	fadeIn(document.getElementById("content"),1);
	document.getElementById("headline").innerHTML=articleData.headline;
	document.getElementById("standFirst").innerHTML=articleData.standFirst;
	document.getElementById("body").innerHTML=articleData.body;
}

function findArticleMenuItem(number) {
	var ul = document.getElementById("menuList");
	if (ul) {
		return ul.children[number];
	}
	return null;
}

function fadeIn(elem, speed){
    if (elem.style) {
        elem.style.opacity= '0';
    }
    window.fadetimer = setInterval(function(){
        elem.style.opacity = +(elem.style.opacity) + .02;
        if (elem.style.opacity > 1) {
            clearInterval(fadetimer);
        }
    }, speed);
}

function addClass(element, clsName) {
	removeClass(element, clsName);
	element.className += " " + clsName;
}

function removeClass(element, clsName) {
    var newClassName = "";
    var i;
    var classes = element.className.split(" ");
    for(i = 0; i < classes.length; i++) {
        if(classes[i] !== clsName) {
            newClassName += classes[i] + " ";
        }
    }
    element.className = newClassName;
}

})();
