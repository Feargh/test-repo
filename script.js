function hideShow(elementId) {
	console.log("toggle hideShow function called. ElementId: " + elementId);

	var element = document.getElementById(elementId);
	if (element.style.display === "none") {
		element.style.display = "block";
	} else {
		element.style.display = "none";
	}
}

function createiFrame(URL, id = "", environment = "") {
	var iframe = document.createElement("iframe");
	iframe.src = URL;
	iframe.id = new Date().getTime();
	iframe.width = "100%";
	iframe.height = "1399px";

	const params = new URLSearchParams(URL);
	if (params.has("amp;id")) {
		id = params.get("amp;id");
	}
	if (params.has("id")) {
		id = params.get("id");
	}

	var container = document.createElement("div");
	container.classList.add("test-iframe");
	var heading = document.createElement("h2");

	if (id != "") {
		heading.textContent = `${id} (${environment})`;
	} else {
		heading.textContent = `Turn2us (${environment})`;
	}

	var removeButton = document.createElement("button");
	removeButton.textContent = "Remove iFrame";
	removeButton.onclick = function () {
		container.remove();
	};
	removeButton.classList.add("btn");
	removeButton.classList.add("btn-danger");
	removeButton.classList.add("btn-sm");

	heading.appendChild(removeButton);

	// copy URL button
	// var copyButton = document.createElement("button");
	// copyButton.textContent = "Copy URL";
	// copyButton.onclick = function () {
	// 	navigator.clipboard
	// 		.writeText(
	// 			document.getElementById(iframe.id).contentWindow.document.referrer
	// 		)
	// 		.then(
	// 			function () {
	// 				console.log("URL copied to clipboard");
	// 				console.log(
	// 					document.getElementById(iframe.id).contentWindow.document.referrer
	// 				);
	// 			},
	// 			function (err) {
	// 				console.error("Could not copy text: ", err);
	// 			}
	// 		);
	// };
	// copyButton.classList.add("btn");
	// copyButton.classList.add("btn-primary");
	// copyButton.classList.add("btn-sm");
	// heading.appendChild(copyButton);

	container.appendChild(heading);
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
	event.preventDefault();

	var url = document.getElementById("portalURL").value + "&portal=true";

	createiFrame(url);
}

// function addiFrameRemoveButton() {
// 	var button = document.createElement("button");
// 	button.textContent = "Remove iFrame";
// 	button.onclick = function () {
// 		container.remove();
// 	};
// 	button.classList.add("btn");
// 	button.classList.add("btn-danger");
// 	button.classList.add("btn-sm");

// 	heading.appendChild(button);

// 	// container.appendChild(heading);
// 	// container.appendChild(iframe);

// 	// var iframeContainer = document.getElementById("iframe-container");
// 	// iframeContainer.appendChild(container);
// }
