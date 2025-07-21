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

//-- Function to switch PIP environment
let currentPIPEnvironment = "uat"; //-- Track current environment

function switchPIPEnvironment(environment) {
	console.log("Switching PIP environment to: " + environment);
	
	//-- Update current environment
	currentPIPEnvironment = environment;
	
	//-- Get iframe element
	const iframe = document.getElementById("pip-iframe");
	
	//-- Set base URLs based on environment
	let baseURL;
	let scriptURL;
	
	switch(environment) {
		case "staging":
			baseURL = "https://staging-pip.turn2us.org.uk/?portal=true&id=unknown";
			scriptURL = "https://staging-pip.turn2us.org.uk/static/js/portal.min.js";
			break;
		case "live":
			baseURL = "https://pip.turn2us.org.uk/?portal=true&id=unknown";
			scriptURL = "https://pip.turn2us.org.uk/static/js/portal.min.js";
			break;
		case "local":
			baseURL = "http://local-pip.turn2us.org.uk:3000/?portal=true&id=unknown";
			scriptURL = "http://local-pip.turn2us.org.uk:3000/static/js/portal.min.js";
			break;
		case "uat":
		default:
			baseURL = "https://uat-pip.turn2us.org.uk/?portal=true&id=unknown";
			scriptURL = "https://uat-pip.turn2us.org.uk/static/js/portal.min.js";
			break;
	}
	
	//-- Update iframe src
	iframe.src = baseURL;
	
	//-- Update URL preview
	updatePIPUrlPreview(baseURL);
	
	//-- Update portal script
	const existingScript = document.getElementById("pip-portal-script");
	if (existingScript) {
		existingScript.remove();
	}
	
	//-- Create new script element
	const newScript = document.createElement("script");
	newScript.id = "pip-portal-script";
	newScript.src = scriptURL;
	document.body.appendChild(newScript);
	
	//-- Update button states
	updatePIPButtonStates(environment);
}

function updatePIPButtonStates(activeEnvironment) {
	//-- Remove active class from all buttons
	const buttons = document.querySelectorAll(".pip-env-btn");
	buttons.forEach(btn => {
		btn.classList.remove("active");
	});
	
	//-- Add active class to current button
	const activeButton = document.getElementById(`pip-${activeEnvironment}-btn`);
	if (activeButton) {
		activeButton.classList.add("active");
	}
	
	//-- Update environment badge
	const envBadge = document.getElementById("current-env");
	if (envBadge) {
		const envName = activeEnvironment.charAt(0).toUpperCase() + activeEnvironment.slice(1);
		envBadge.textContent = `${envName} Environment`;
	}
}

//-- Initialize page-specific functionality
document.addEventListener("DOMContentLoaded", function() {
	//-- Setup iframe resize listener for PIP page
	if (document.getElementById("pip-iframe")) {
		setupIframeResize();
	}
	
	//-- Setup iframe resize listener for BC page
	if (document.getElementById("bc-iframe")) {
		setupBCIframeResize();
	}
});

//-- Function to resize iframe based on content
function resizeIframe(iframe) {
	//-- Try to access iframe content height (won't work for cross-origin)
	try {
		const newHeight = iframe.contentWindow.document.body.scrollHeight;
		iframe.style.height = newHeight + 'px';
	} catch (e) {
		//-- For cross-origin, we rely on postMessage
		iframe.style.height = '2000px'; //-- Set a large default height
	}
}

//-- Setup iframe resize functionality
function setupIframeResize() {
	const pipIframe = document.getElementById("pip-iframe");
	if (!pipIframe) return;
	
	//-- Listen for messages from the iframe
	window.addEventListener("message", function(e) {
		//-- Check if message contains height data
		if (e.data && (e.data.height || e.data.frameHeight)) {
			const height = e.data.height || e.data.frameHeight;
			pipIframe.style.height = height + "px";
		}
		
		//-- Also check for Turn2us specific resize messages
		if (e.data && e.data.type === "resize" && e.data.height) {
			pipIframe.style.height = e.data.height + "px";
		}
		
		//-- Check for navigation/URL change messages
		if (e.data && e.data.type === "urlChange" && e.data.url) {
			updatePIPUrlPreview(e.data.url);
		}
		
		//-- Check for Turn2us portal navigation events
		if (e.data && e.data.type === "navigation" && e.data.url) {
			updatePIPUrlPreview(e.data.url);
		}
		
		//-- Check for Turn2us route change events
		if (e.data && e.data.type === "routeChange" && e.data.path) {
			const baseUrl = pipIframe.src.split('?')[0].split('#')[0];
			const newUrl = baseUrl + e.data.path;
			updatePIPUrlPreview(newUrl);
		}
		
		//-- Check if the message contains a URL property
		if (e.data && e.data.url && typeof e.data.url === 'string') {
			updatePIPUrlPreview(e.data.url);
		}
		
		//-- Check for location property
		if (e.data && e.data.location && typeof e.data.location === 'string') {
			updatePIPUrlPreview(e.data.location);
		}
	});
	
	//-- Listen for iframe load events to update URL
	pipIframe.addEventListener('load', function() {
		try {
			//-- Try to get the current URL from iframe
			const iframeUrl = pipIframe.contentWindow.location.href;
			updatePIPUrlPreview(iframeUrl);
		} catch (e) {
			//-- Cross-origin, use the src attribute instead
			updatePIPUrlPreview(pipIframe.src);
		}
	});
	
	//-- Periodically check if we need to resize (fallback for iframes that don't send messages)
	setInterval(function() {
		try {
			const currentHeight = parseInt(pipIframe.style.height) || 0;
			const contentHeight = pipIframe.contentWindow.document.body.scrollHeight;
			if (contentHeight && contentHeight !== currentHeight) {
				pipIframe.style.height = contentHeight + 'px';
			}
		} catch (e) {
			//-- Cross-origin, can't access content
		}
	}, 1000);
}

//-- Update PIP URL preview
function updatePIPUrlPreview(url) {
	const urlInput = document.getElementById("pip-url-preview");
	if (urlInput && url) {
		urlInput.value = url;
	}
}

//-- Function to switch BC environment
let currentBCEnvironment = "uat"; //-- Track current environment

function switchBCEnvironment(environment) {
	console.log("Switching BC environment to: " + environment);
	
	//-- Update current environment
	currentBCEnvironment = environment;
	
	//-- Get iframe element
	const iframe = document.getElementById("bc-iframe");
	
	//-- Set base URLs based on environment
	let baseURL;
	
	switch(environment) {
		case "staging":
			baseURL = "https://staging-beta-benefits-calculator.turn2us.org.uk/?portal=true&id=unknown";
			break;
		case "live":
			baseURL = "https://benefits-calculator.turn2us.org.uk/?portal=true&id=unknown";
			break;
		case "local":
			baseURL = "https://bcv2.turn2us.org.uk:3000/?portal=true&id=unknown";
			break;
		case "uat":
		default:
			baseURL = "https://uat-beta-benefits-calculator.turn2us.org.uk/?portal=true&id=unknown";
			break;
	}
	
	//-- Update iframe src
	iframe.src = baseURL;
	
	//-- Update URL preview
	updateBCUrlPreview(baseURL);
	
	//-- Update button states
	updateBCButtonStates(environment);
}

function updateBCButtonStates(activeEnvironment) {
	//-- Remove active class from all buttons
	const buttons = document.querySelectorAll(".bc-env-btn");
	buttons.forEach(btn => {
		btn.classList.remove("active");
	});
	
	//-- Add active class to current button
	const activeButton = document.getElementById(`bc-${activeEnvironment}-btn`);
	if (activeButton) {
		activeButton.classList.add("active");
	}
	
	//-- Update environment badge
	const envBadge = document.getElementById("current-env-bc");
	if (envBadge) {
		const envName = activeEnvironment.charAt(0).toUpperCase() + activeEnvironment.slice(1);
		envBadge.textContent = `${envName} Environment`;
	}
}

//-- Setup iframe resize functionality for BC
function setupBCIframeResize() {
	const bcIframe = document.getElementById("bc-iframe");
	if (!bcIframe) return;
	
	//-- Listen for messages from the iframe
	window.addEventListener("message", function(e) {
		//-- Check if message contains height data
		if (e.data && (e.data.height || e.data.frameHeight)) {
			const height = e.data.height || e.data.frameHeight;
			bcIframe.style.height = height + "px";
		}
		
		//-- Check for navigation/URL change messages
		if (e.data && e.data.type === "urlChange" && e.data.url) {
			updateBCUrlPreview(e.data.url);
		}
		
		//-- Check for Turn2us portal navigation events
		if (e.data && e.data.type === "navigation" && e.data.url) {
			updateBCUrlPreview(e.data.url);
		}
		
		//-- Check for Turn2us route change events
		if (e.data && e.data.type === "routeChange" && e.data.path) {
			const baseUrl = bcIframe.src.split('?')[0].split('#')[0];
			const newUrl = baseUrl + e.data.path;
			updateBCUrlPreview(newUrl);
		}
		
		//-- Check if the message contains a URL property
		if (e.data && e.data.url && typeof e.data.url === 'string') {
			updateBCUrlPreview(e.data.url);
		}
		
		//-- Check for location property
		if (e.data && e.data.location && typeof e.data.location === 'string') {
			updateBCUrlPreview(e.data.location);
		}
	});
	
	//-- Listen for iframe load events to update URL
	bcIframe.addEventListener('load', function() {
		try {
			//-- Try to get the current URL from iframe
			const iframeUrl = bcIframe.contentWindow.location.href;
			updateBCUrlPreview(iframeUrl);
		} catch (e) {
			//-- Cross-origin, use the src attribute instead
			updateBCUrlPreview(bcIframe.src);
		}
	});
	
	//-- Set initial height
	bcIframe.style.minHeight = "100vh";
}

//-- Update BC URL preview
function updateBCUrlPreview(url) {
	const urlInput = document.getElementById("bc-url-preview");
	if (urlInput && url) {
		urlInput.value = url;
	}
}

//-- Copy to clipboard function
function copyToClipboard(inputId) {
	const input = document.getElementById(inputId);
	if (!input) return;
	
	//-- Select the text
	input.select();
	input.setSelectionRange(0, 99999); //-- For mobile devices
	
	//-- Copy the text
	navigator.clipboard.writeText(input.value).then(function() {
		console.log("URL copied to clipboard:", input.value);
		
		//-- Show feedback
		const copyButton = input.nextElementSibling;
		if (copyButton && copyButton.classList.contains('btn-copy')) {
			const originalHTML = copyButton.innerHTML;
			copyButton.innerHTML = '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 13l3 3L15 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>Copied!</span>';
			copyButton.classList.add('copied');
			
			//-- Reset after 2 seconds
			setTimeout(function() {
				copyButton.innerHTML = originalHTML;
				copyButton.classList.remove('copied');
			}, 2000);
		}
	}, function(err) {
		console.error("Could not copy text:", err);
		
		//-- Fallback for older browsers
		try {
			document.execCommand('copy');
			console.log("URL copied using fallback method");
		} catch (e) {
			console.error("Fallback copy method also failed:", e);
		}
	});
}
