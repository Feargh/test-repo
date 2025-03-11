function hideShow() {
	console.log("toggle hideShow funciton clicked");

	var hero = document.getElementById("hero");
	if (hero.style.display === "none") {
		hero.style.display = "block";
	} else {
		hero.style.display = "none";
	}
}

function hideShow(elementId) {
	console.log("toggle hideShow function called. ElementId: " + elementId);

	var element = document.getElementById(elementId);
	if (element.style.display === "none") {
		element.style.display = "block";
	} else {
		element.style.display = "none";
	}
}

// document
// 	.getElementById("myCheckbox")
// 	.addEventListener("click", function (event) {
// 		event.preventDefault();
// 	});

function createiFrame(URL, id = "", environment = "") {
	// if (URL.contains("?_ga=")) {
	// 	URL = URL.split("?_ga=")[0];
	// }

	// if (!URL.contains("?portal=true")) {
	// 	URL = URL + "?portal=true";
	// }

	var iframe = document.createElement("iframe");
	iframe.src = URL;
	iframe.width = "100%";
	iframe.height = "1399px";

	var container = document.createElement("div");
	container.classList.add("test-iframe");
	var heading = document.createElement("h2");

	if (id == "") {
		heading.textContent = "iFrame";
	} else {
		heading.textContent = `${id} (${environment})`;
	}

	var button = document.createElement("button");
	button.textContent = "Remove iFrame";
	button.onclick = function () {
		container.remove();
	};
	button.classList.add("btn");
	button.classList.add("btn-danger");
	button.classList.add("btn-sm");

	container.appendChild(heading);
	heading.appendChild(button);
	container.appendChild(iframe);

	var iframeContainer = document.getElementById("iframe-container");
	iframeContainer.appendChild(container);
}

function newiFrameURL(environment, id, testing) {
	switch (environment) {
		case "staging":
			return `https://staging-beta-benefits-calculator.turn2us.org.uk/survey/?portal=true&id=${id}&test=${testing}`;
			break;
		case "uat":
			return `https://uat-beta-benefits-calculator.turn2us.org.uk/survey/?portal=true&id=${id}&test=${testing}`;
			break;
		case "local":
			return `https://bcv2.turn2us.org.uk:3000/survey/?portal=true&id=${id}&test=${testing}`;
			break;
		default: // production
			return `https://benefits-calculator.turn2us.org.uk/survey/?portal=true&id=${id}&test=${testing}`;
			break;
	}
}

function addiFrame(event) {
	console.log("addiFrame function called.");
	event.preventDefault();

	const id = document.getElementById("portalId").value;
	const environment = document.querySelector(
		'input[name="environment"]:checked'
	).value;

	const testing = document.querySelector('input[name="testing"]:checked').value;

	let iframeURL = newiFrameURL(environment, id, testing);

	createiFrame(iframeURL, id, environment);
}

function addiFrameURL(event) {
	console.log("addiFrameURL function called.");
	event.preventDefault();

	var url = document.getElementById("portalURL").value;

	createiFrame(url);
}
