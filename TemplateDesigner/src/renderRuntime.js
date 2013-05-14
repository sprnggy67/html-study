(function() {

console.info("Loaded renderRuntime.js");

document.addEventListener("refreshTemplate", refreshTemplate);

function refreshTemplate(e) {
	$(".link").click(tapToNavigate);
}

function tapToNavigate() {
	calliOSFunction("navigateTo", this.dataset.article_id);
}

}) ();

