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

function addiFrame(event) {
	console.log("addiFrame function called.");
	event.preventDefault();

	var id = document.getElementById("portalId").value;
	var iframe = document.createElement("iframe");

	// Get the selected environment value
	const environment = document.querySelector(
		'input[name="environment"]:checked'
	).value;

	if (environment === "production") {
		iframe.src = `https://benefits-calculator.turn2us.org.uk/survey/?portal=true&id=${id}&utm_source=${id}&utm_medium=iFrame&utm_campaign=BCPortal`;
	}
	if (environment === "staging") {
		iframe.src = `https://uat-beta-benefits-calculator.turn2us.org.uk/survey/?portal=true&id=${id}&utm_source=${id}&utm_medium=iFrame&utm_campaign=BCPortal`;
	}
	if (environment === "uat") {
		iframe.src = `https://uat-beta-benefits-calculator.turn2us.org.uk/survey/?portal=true&id=${id}&utm_source=${id}&utm_medium=iFrame&utm_campaign=BCPortal`;
	}
	if (environment === "local") {
		iframe.src = `https://bcv2.turn2us.org.uk:3000/survey/?portal=true&id=${id}&utm_source=${id}&utm_medium=iFrame&utm_campaign=BCPortal`;
	}
	iframe.width = "100%";
	iframe.height = "1399px";

	var container = document.createElement("div");
	container.classList.add("test-iframe");
	var heading = document.createElement("h2");
	heading.textContent = `${id} (${environment})`;

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
