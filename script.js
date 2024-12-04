function hideShow() {
	console.log("toggle hideShow funciton clicked");

	var hero = document.getElementById("hero");
	if (hero.style.display === "none") {
		hero.style.display = "block";
	} else {
		hero.style.display = "none";
	}
}
