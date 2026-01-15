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

//-- ===========================
//-- LOGIC VALIDATOR FUNCTIONS
//-- ===========================

//-- Initialize logic validator if on the logic checker page
document.addEventListener("DOMContentLoaded", function() {
	const editor = document.getElementById("editor");
	const lineNumbers = document.getElementById("lineNumbers");
	const errorsPanel = document.getElementById("errorsPanel");

	if (!editor || !lineNumbers || !errorsPanel) {
		//-- Not on the logic checker page, exit early
		return;
	}

	//-- Initialize version management
	window.savedVersions = JSON.parse(localStorage.getItem('logicValidatorVersions') || '[]');

	//-- Setup event listeners
	editor.addEventListener('input', function() {
		updateLineNumbers();
		validateExpression();
	});

	editor.addEventListener('scroll', function() {
		lineNumbers.scrollTop = editor.scrollTop;
	});

	//-- Initialize line numbers
	updateLineNumbers();
	renderVersionsList();
});

function updateLineNumbers() {
	const editor = document.getElementById("editor");
	const lineNumbers = document.getElementById("lineNumbers");
	const lines = editor.value.split('\n').length;
	lineNumbers.innerHTML = Array.from({length: lines}, (_, i) => i + 1).join('\n');
	document.getElementById('lineCount').textContent = lines;
}

function validateExpression() {
	const editor = document.getElementById("editor");
	const errorsPanel = document.getElementById("errorsPanel");
	const code = editor.value;

	if (!code.trim()) {
		errorsPanel.innerHTML = `
			<div class="no-errors">
				<span>ℹ️</span>
				<span>Enter code to validate...</span>
			</div>
		`;
		updateStats(0, 0, 'Ready');
		hidePathwayPanel();
		return;
	}

	const errors = [];
	const warnings = [];

	//-- Check for bracket matching
	const bracketErrors = checkBrackets(code);
	errors.push(...bracketErrors);

	//-- Check for quote matching
	const quoteResults = checkQuotes(code);
	errors.push(...quoteResults.errors);
	warnings.push(...quoteResults.warnings);

	//-- Check for operator issues
	const operatorResults = checkOperators(code);
	errors.push(...operatorResults.errors);
	warnings.push(...operatorResults.warnings);

	//-- Check for expression validity
	const expressionWarnings = checkExpressions(code);
	warnings.push(...expressionWarnings);

	//-- Display results
	displayResults(errors, warnings);

	const status = errors.length > 0 ? 'Invalid' : warnings.length > 0 ? 'Valid (with warnings)' : 'Valid';
	updateStats(errors.length, warnings.length, status);

	//-- Generate pathway analysis if no critical errors
	if (errors.length === 0) {
		analyzePathways(code);
	} else {
		hidePathwayPanel();
	}
}

function checkBrackets(code) {
	const errors = [];
	const stack = [];
	const lines = code.split('\n');

	let lineNum = 0;
	let charNum = 0;

	for (let i = 0; i < code.length; i++) {
		const char = code[i];

		if (char === '\n') {
			lineNum++;
			charNum = 0;
			continue;
		}

		charNum++;

		if (char === '(') {
			stack.push({ char: '(', line: lineNum, col: charNum, index: i });
		} else if (char === ')') {
			if (stack.length === 0) {
				errors.push({
					type: 'Bracket Error',
					line: lineNum + 1,
					col: charNum,
					message: 'Closing bracket ")" has no matching opening bracket',
					context: getContext(code, i, lines, lineNum),
					suggestion: 'Add an opening bracket "(" before this closing bracket, or remove this closing bracket'
				});
			} else {
				stack.pop();
			}
		}
	}

	//-- Check for unclosed brackets
	while (stack.length > 0) {
		const unclosed = stack.pop();
		errors.push({
			type: 'Bracket Error',
			line: unclosed.line + 1,
			col: unclosed.col,
			message: 'Opening bracket "(" has no matching closing bracket',
			context: getContext(code, unclosed.index, lines, unclosed.line),
			suggestion: 'Add a closing bracket ")" to match this opening bracket'
		});
	}

	return errors;
}

function checkQuotes(code) {
	const errors = [];
	const warnings = [];
	const lines = code.split('\n');

	for (let lineNum = 0; lineNum < lines.length; lineNum++) {
		const line = lines[lineNum];

		//-- Count total quotes
		const quoteCount = (line.match(/'/g) || []).length;

		//-- If odd number of quotes, there might be an issue
		if (quoteCount % 2 !== 0) {
			//-- Check if line contains complete quoted strings with apostrophes inside
			const quotedStringsWithApostrophes = line.match(/'[^']*'[^']*'/g);

			if (quotedStringsWithApostrophes && quotedStringsWithApostrophes.length > 0) {
				//-- This is a string with an apostrophe inside - just warn
				warnings.push({
					type: 'Quote Warning',
					line: lineNum + 1,
					col: 1,
					message: "Line contains apostrophes within strings (e.g., \"Jobseeker's Allowance\") - verify quotes are balanced",
					context: line,
					suggestion: "If your parser handles apostrophes within single-quoted strings, this is fine. Otherwise, consider escaping or using double quotes."
				});
			} else {
				//-- Likely a real unclosed string
				const firstQuote = line.indexOf("'");
				errors.push({
					type: 'Quote Error',
					line: lineNum + 1,
					col: firstQuote + 1,
					message: 'Odd number of quotes detected - possible unclosed string',
					context: line,
					suggestion: "Add a closing single quote ' to match the opening quote"
				});
			}
		}
	}

	return { errors, warnings };
}

function checkOperators(code) {
	const errors = [];
	const warnings = [];
	const lines = code.split('\n');

	for (let lineNum = 0; lineNum < lines.length; lineNum++) {
		const line = lines[lineNum];

		//-- Check for single = instead of ==
		const singleEquals = /(?<![=!<>])=(?!=)/g;
		let match;
		while ((match = singleEquals.exec(line)) !== null) {
			//-- Skip if it's inside a string
			if (!isInsideString(line, match.index)) {
				errors.push({
					type: 'Operator Error',
					line: lineNum + 1,
					col: match.index + 1,
					message: 'Single "=" found - did you mean "==" for comparison?',
					context: line,
					suggestion: 'Use "==" for equality comparison, not "="'
				});
			}
		}

		//-- Check for double && or ||
		if (/&&\s*&&/.test(line)) {
			errors.push({
				type: 'Operator Error',
				line: lineNum + 1,
				col: line.indexOf('&&'),
				message: 'Double AND operator "&&&&" found',
				context: line,
				suggestion: 'Remove one of the && operators'
			});
		}

		if (/\|\|\s*\|\|/.test(line)) {
			errors.push({
				type: 'Operator Error',
				line: lineNum + 1,
				col: line.indexOf('||'),
				message: 'Double OR operator "||||" found',
				context: line,
				suggestion: 'Remove one of the || operators'
			});
		}

		//-- Check for single & or | operators (bitwise vs logical)
		//-- Look for single & that isn't part of &&
		const singleAnd = /(?<!&)&(?!&)/g;
		while ((match = singleAnd.exec(line)) !== null) {
			if (!isInsideString(line, match.index)) {
				warnings.push({
					type: 'Operator Warning',
					line: lineNum + 1,
					col: match.index + 1,
					message: 'Single "&" found - did you mean "&&" for logical AND?',
					context: line,
					suggestion: 'Use "&&" for logical AND operator. Single "&" is a bitwise operator in C#.'
				});
			}
		}

		//-- Look for single | that isn't part of ||
		const singleOr = /(?<!\|)\|(?!\|)/g;
		while ((match = singleOr.exec(line)) !== null) {
			if (!isInsideString(line, match.index)) {
				warnings.push({
					type: 'Operator Warning',
					line: lineNum + 1,
					col: match.index + 1,
					message: 'Single "|" found - did you mean "||" for logical OR?',
					context: line,
					suggestion: 'Use "||" for logical OR operator. Single "|" is a bitwise operator in C#.'
				});
			}
		}

		//-- Check for triple &&& or |||
		if (/&&&/.test(line)) {
			errors.push({
				type: 'Operator Error',
				line: lineNum + 1,
				col: line.indexOf('&&&'),
				message: 'Triple AND operator "&&&" found',
				context: line,
				suggestion: 'Use "&&" for logical AND'
			});
		}

		if (/\|\|\|/.test(line)) {
			errors.push({
				type: 'Operator Error',
				line: lineNum + 1,
				col: line.indexOf('|||'),
				message: 'Triple OR operator "|||" found',
				context: line,
				suggestion: 'Use "||" for logical OR'
			});
		}

		//-- Check for misplaced NOT operator
		if (/!\s*!/.test(line)) {
			const doubleNotIndex = line.search(/!\s*!/);
			if (!isInsideString(line, doubleNotIndex)) {
				warnings.push({
					type: 'Operator Warning',
					line: lineNum + 1,
					col: doubleNotIndex + 1,
					message: 'Double negation "!!" found',
					context: line,
					suggestion: 'Double negation (!!) cancels out. Consider simplifying or verifying this is intentional.'
				});
			}
		}

		//-- Check for XOR operator usage (less common in logic expressions)
		const xorOperator = /\^/g;
		while ((match = xorOperator.exec(line)) !== null) {
			if (!isInsideString(line, match.index)) {
				//-- Make sure it's not part of a string or variable name
				const prevChar = match.index > 0 ? line[match.index - 1] : ' ';
				const nextChar = match.index < line.length - 1 ? line[match.index + 1] : ' ';
				if (!/[a-zA-Z0-9_]/.test(prevChar) && !/[a-zA-Z0-9_]/.test(nextChar)) {
					warnings.push({
						type: 'Operator Warning',
						line: lineNum + 1,
						col: match.index + 1,
						message: 'XOR operator "^" found',
						context: line,
						suggestion: 'The "^" operator is XOR (exclusive OR) in C#. Verify this is the intended logical operation.'
					});
				}
			}
		}

		//-- Check for mixed bitwise and logical operators on same line
		const hasBitwiseAnd = /(?<!&)&(?!&)/.test(line);
		const hasLogicalAnd = /&&/.test(line);
		const hasBitwiseOr = /(?<!\|)\|(?!\|)/.test(line);
		const hasLogicalOr = /\|\|/.test(line);

		if ((hasBitwiseAnd && hasLogicalAnd) || (hasBitwiseOr && hasLogicalOr)) {
			errors.push({
				type: 'Operator Error',
				line: lineNum + 1,
				col: 1,
				message: 'Mixed bitwise and logical operators on same line',
				context: line,
				suggestion: 'Mixing bitwise (&, |) and logical (&&, ||) operators can be confusing. Use consistent operators.'
			});
		}
	}

	return { errors, warnings };
}

function checkExpressions(code) {
	const warnings = [];
	const lines = code.split('\n');

	for (let lineNum = 0; lineNum < lines.length; lineNum++) {
		const line = lines[lineNum].trim();

		//-- Check for lines ending with operators
		if (/(\|\||&&)$/.test(line) && lineNum < lines.length - 1) {
			const nextLine = lines[lineNum + 1].trim();
			if (nextLine === '' || nextLine.startsWith(')')) {
				warnings.push({
					type: 'Expression Warning',
					line: lineNum + 1,
					col: line.length,
					message: 'Logical operator at end of line with no following expression',
					context: line,
					suggestion: 'Ensure there is a valid expression after this operator'
				});
			}
		}

		//-- Check for empty parentheses
		if (/\(\s*\)/.test(line)) {
			warnings.push({
				type: 'Expression Warning',
				line: lineNum + 1,
				col: line.indexOf('('),
				message: 'Empty parentheses found',
				context: line,
				suggestion: 'Remove empty parentheses or add an expression inside them'
			});
		}

		//-- Check for negation followed by operators
		if (/!\s*(\|\||&&)/.test(line)) {
			warnings.push({
				type: 'Expression Warning',
				line: lineNum + 1,
				col: line.indexOf('!'),
				message: 'Negation operator "!" followed directly by logical operator',
				context: line,
				suggestion: 'Add an expression after the ! operator'
			});
		}
	}

	return warnings;
}

function isInsideString(line, position) {
	let inString = false;
	for (let i = 0; i < position; i++) {
		if (line[i] === "'") {
			inString = !inString;
		}
	}
	return inString;
}

function getContext(code, index, lines, lineNum) {
	const line = lines[lineNum];
	return line;
}

function displayResults(errors, warnings) {
	const errorsPanel = document.getElementById("errorsPanel");

	if (errors.length === 0 && warnings.length === 0) {
		errorsPanel.innerHTML = `
			<div class="no-errors">
				<span>✅</span>
				<span>No errors or warnings found! Your expression looks valid.</span>
			</div>
		`;
		return;
	}

	let html = '';

	//-- Display errors first
	errors.forEach(error => {
		html += `
			<div class="error-item">
				<div class="error-header">
					<span class="error-type">❌ ${error.type}</span>
					<span class="error-location">Line ${error.line}, Col ${error.col}</span>
				</div>
				<div class="error-message">${error.message}</div>
				<div class="error-context">${escapeHtml(error.context)}</div>
				<div class="error-suggestion">💡 ${error.suggestion}</div>
			</div>
		`;
	});

	//-- Then display warnings
	warnings.forEach(warning => {
		html += `
			<div class="error-item warning">
				<div class="error-header">
					<span class="error-type">⚠️ ${warning.type}</span>
					<span class="error-location">Line ${warning.line}, Col ${warning.col}</span>
				</div>
				<div class="error-message">${warning.message}</div>
				<div class="error-context">${escapeHtml(warning.context)}</div>
				<div class="error-suggestion">💡 ${warning.suggestion}</div>
			</div>
		`;
	});

	errorsPanel.innerHTML = html;
}

function updateStats(errorCount, warningCount, status) {
	document.getElementById('errorCount').textContent = errorCount;
	document.getElementById('warningCount').textContent = warningCount;

	const statusElement = document.getElementById('status');
	statusElement.textContent = status;
	statusElement.className = 'stat-value';

	if (status === 'Invalid') {
		statusElement.classList.add('error');
	} else if (status === 'Valid (with warnings)') {
		statusElement.classList.add('warning');
	} else {
		statusElement.classList.add('success');
	}
}

function escapeHtml(text) {
	return text.replace(/&/g, '&amp;')
				.replace(/</g, '&lt;')
				.replace(/>/g, '&gt;')
				.replace(/"/g, '&quot;')
				.replace(/'/g, '&#039;');
}

function clearEditor() {
	const editor = document.getElementById("editor");
	editor.value = '';
	updateLineNumbers();
	validateExpression();
	hidePathwayPanel();
}

function loadExample() {
	const editor = document.getElementById("editor");
	editor.value = `ClientLiveWithPartner == 'Yes'
&& !funcPartnerIsPensionCreditAge
&& !(funcClientCountry == Scotland && funcIsChildUnder6)
&& (
PartnerWorking == 'Unemployed and looking for work'
|| (
ClientPartnerReceivingBens == 'No'
&& (
(funcPartnerAge < 25 && (funcPartnerJsaWorking < {EsaYoungVariable}))
|| (funcPartnerAge >= 25 && (funcPartnerJsaWorking < {EsaBasicVariable}))
)
&& (
PartnerWorkStatus == 'Employed'
|| PartnerWorkStatus == 'In the reserve forces'
|| PartnerNonWorkStatus == 'In the reserve forces'
|| PartnerWorkStatus == 'On call firefighter'
)
)
|| (PartnerDisability == 'Yes'
&& (PartnerNonWorkStatus == 'Unable to work due to illness or disability' || PartnerNonWorkStatus == 'Employed - on long term sick' || PartnerNonWorkStatus == 'Self employed - on long term sick' || PartnerWorkStatus ==  'Employed - on long term sick' || PartnerWorkStatus == 'Self employed - on long term sick')
&& PartnerIncomeSickPay != 'Yes'))
&& !(PartnerIncomeMaternityPay > 0)
&& !(PartnerIncomeContractualMaternityPay > 0)
&& !(PartnerIncomeMaternityAllowance > 0)
&& ClientPartnerIrEsa != 'Yes'
&& ClientPartnerIbJsa != 'Yes'
&& ClientPartnerIncomeSupport != 'Yes'
&& ClientPartnerPensionCredit != 'Yes'
&& PartnerIncomeFromBenefits != 'New Style Jobseeker's Allowance' && PartnerIncomeFromBenefits != 'New Style Employment and Support Allowance' && PartnerIncomeFromBenefits != 'Contributory Employment and Support Allowance'
&& PartnerIncomeFromBenefits != 'Widowed Mother's Allowance or Widowed Parent's Allowance' && PartnerIncomeFromBenefits != 'War widows / Widower's pension or War Disablement pension or Guaranteed Income Payment' && PartnerIncomeFromBenefits != 'Industrial Injuries Disablement Benefit or Reduced Earnings Allowance' && PartnerIncomeFromBenefits != 'Severe Disablement Allowance'
&& PartnerCarerAllow != 'Yes' && PartnerRequestCA != 'Yes' && PartnerCarerSupport != 'Yes' && PartnerRequestCSP != 'Yes'`;

	updateLineNumbers();
	validateExpression();
}

//-- === PATHWAY ANALYSIS FUNCTIONS ===

function analyzePathways(code) {
	//-- Remove newlines and extra spaces for easier parsing
	const cleanCode = code.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();

	try {
		const tree = parseExpression(cleanCode);
		displayPathwayTree(tree);
		showPathwayPanel();
	} catch (e) {
		console.error('Error parsing pathways:', e);
		hidePathwayPanel();
	}
}

function parseExpression(expr) {
	expr = expr.trim();

	//-- Split by top-level && operators
	const andParts = splitByTopLevel(expr, '&&');

	if (andParts.length > 1) {
		//-- Multiple AND conditions
		const children = andParts.map(part => parseExpression(part));

		//-- Separate preconditions from main pathways
		const preconditions = [];
		const mainLogic = [];

		children.forEach(child => {
			if (child.type === 'or' || (child.type === 'group' && hasOrOperator(child.expression))) {
				mainLogic.push(child);
			} else {
				preconditions.push(child);
			}
		});

		return {
			type: 'and',
			children: children,
			preconditions: preconditions,
			mainLogic: mainLogic,
			expression: expr
		};
	}

	//-- Split by top-level || operators
	const orParts = splitByTopLevel(expr, '||');

	if (orParts.length > 1) {
		return {
			type: 'or',
			children: orParts.map(part => parseExpression(part)),
			expression: expr
		};
	}

	//-- Handle grouped expressions
	if (expr.startsWith('(') && expr.endsWith(')')) {
		const inner = expr.slice(1, -1);
		return {
			type: 'group',
			child: parseExpression(inner),
			expression: inner
		};
	}

	//-- Leaf node (simple condition)
	return {
		type: 'condition',
		expression: expr
	};
}

function splitByTopLevel(expr, operator) {
	const parts = [];
	let current = '';
	let depth = 0;
	let i = 0;

	while (i < expr.length) {
		const char = expr[i];

		if (char === '(') {
			depth++;
			current += char;
		} else if (char === ')') {
			depth--;
			current += char;
		} else if (depth === 0 && expr.slice(i, i + operator.length) === operator) {
			if (current.trim()) {
				parts.push(current.trim());
			}
			current = '';
			i += operator.length - 1;
		} else {
			current += char;
		}

		i++;
	}

	if (current.trim()) {
		parts.push(current.trim());
	}

	return parts.length > 1 ? parts : [expr];
}

function hasOrOperator(expr) {
	let depth = 0;
	for (let i = 0; i < expr.length - 1; i++) {
		if (expr[i] === '(') depth++;
		else if (expr[i] === ')') depth--;
		else if (depth === 0 && expr[i] === '|' && expr[i + 1] === '|') {
			return true;
		}
	}
	return false;
}

function displayPathwayTree(tree) {
	const pathwayTree = document.getElementById('pathwayTree');
	let html = '';

	if (tree.type === 'and' && tree.preconditions.length > 0) {
		//-- Display preconditions first
		html += '<div class="tree-node">';
		html += '<div class="node-content">';
		html += '<span class="node-icon">📋</span>';
		html += '<span class="node-label precondition">PRECONDITIONS</span>';
		html += '<div class="node-expression">These conditions must ALL be true:</div>';
		html += '</div>';
		html += '<div class="node-children">';
		tree.preconditions.forEach(precond => {
			html += renderNode(precond, 'precondition');
		});
		html += '</div>';
		html += '</div>';

		//-- Display main pathways
		if (tree.mainLogic.length > 0) {
			const pathwayCount = countPathways(tree.mainLogic);
			document.getElementById('pathwayCount').textContent = `${pathwayCount} pathway${pathwayCount !== 1 ? 's' : ''}`;

			html += '<div class="tree-node" style="margin-top: var(--spacing-lg);">';
			html += '<div class="node-content">';
			html += '<span class="node-icon">🔀</span>';
			html += '<span class="node-label or">THEN ONE OF</span>';
			html += '<div class="node-expression">At least ONE of these pathways must be satisfied:</div>';
			html += '</div>';
			html += '<div class="node-children">';
			tree.mainLogic.forEach((pathway, index) => {
				html += renderNode(pathway, 'pathway', index + 1);
			});
			html += '</div>';
			html += '</div>';
		}
	} else {
		html += renderNode(tree);
	}

	pathwayTree.innerHTML = html;
}

function renderNode(node, context = '', pathwayNum = null) {
	let html = '<div class="tree-node">';

	if (node.type === 'and') {
		html += '<div class="node-content">';
		html += '<span class="node-icon">➕</span>';
		html += '<span class="node-label and">AND</span>';
		html += '<div class="node-expression">All of these must be true:</div>';
		html += '</div>';
		html += '<div class="node-children">';
		node.children.forEach(child => {
			html += renderNode(child, context);
		});
		html += '</div>';
	} else if (node.type === 'or') {
		html += '<div class="node-content">';
		html += '<span class="node-icon">🔀</span>';
		html += '<span class="node-label or">OR</span>';
		html += '<div class="node-expression">At least one of these must be true:</div>';
		html += '</div>';
		html += '<div class="node-children">';
		node.children.forEach(child => {
			html += renderNode(child, context);
		});
		html += '</div>';
	} else if (node.type === 'group') {
		return renderNode(node.child, context, pathwayNum);
	} else {
		//-- Leaf condition
		const expr = node.expression;
		const displayExpr = formatExpression(expr);

		html += '<div class="node-content">';
		if (context === 'pathway' && pathwayNum) {
			html += `<span class="node-icon">🎯</span>`;
			html += `<span class="node-label pathway">PATH ${pathwayNum}</span>`;
		} else {
			html += '<span class="node-icon">✓</span>';
		}
		html += `<div class="node-expression">`;
		html += displayExpr;
		html += '</div>';
		html += '</div>';
	}

	html += '</div>';
	return html;
}

function formatExpression(expr) {
	//-- Escape HTML entities first to prevent XSS
	expr = expr.replace(/&/g, '&amp;')
				.replace(/</g, '&lt;')
				.replace(/>/g, '&gt;');

	//-- Add syntax highlighting to expressions
	let formatted = expr;

	//-- Highlight operators with better spacing and line breaks for long expressions
	formatted = formatted.replace(/&amp;&amp;/g, '\n<span style="color: var(--color-warning); font-weight: bold;">AND</span> ');
	formatted = formatted.replace(/\|\|/g, '\n<span style="color: #9b59b6; font-weight: bold;">OR</span> ');
	formatted = formatted.replace(/!=/g, ' <span style="color: var(--color-danger);">≠</span> ');
	formatted = formatted.replace(/==/g, ' <span style="color: var(--color-success);">=</span> ');
	formatted = formatted.replace(/(&lt;=|&gt;=|&lt;|&gt;)/g, ' <span style="color: var(--color-primary);">$1</span> ');

	//-- Highlight negation
	formatted = formatted.replace(/^!([a-zA-Z])/g, '<span style="color: var(--color-danger); font-weight: bold;">NOT</span> $1');
	formatted = formatted.replace(/\s!([a-zA-Z])/g, ' <span style="color: var(--color-danger); font-weight: bold;">NOT</span> $1');

	//-- Trim extra whitespace but preserve line breaks
	formatted = formatted.trim();

	return formatted;
}

function countPathways(nodes) {
	let count = 0;
	nodes.forEach(node => {
		if (node.type === 'or') {
			count += node.children.length;
		} else {
			count += 1;
		}
	});
	return count;
}

function showPathwayPanel() {
	const panel = document.getElementById('pathwayPanel');
	if (panel) {
		panel.classList.add('visible');
	}
}

function hidePathwayPanel() {
	const panel = document.getElementById('pathwayPanel');
	if (panel) {
		panel.classList.remove('visible');
	}
}

//-- === VERSION MANAGEMENT ===

function openSaveVersionModal() {
	const editor = document.getElementById("editor");
	if (!editor.value.trim()) {
		alert('Please enter some code before saving a version.');
		return;
	}
	document.getElementById('saveVersionModal').classList.add('active');
	document.getElementById('versionName').value = '';
	document.getElementById('versionDescription').value = '';
	document.getElementById('versionName').focus();
}

function closeSaveVersionModal() {
	document.getElementById('saveVersionModal').classList.remove('active');
}

function saveVersion() {
	const editor = document.getElementById("editor");
	const name = document.getElementById('versionName').value.trim();
	const description = document.getElementById('versionDescription').value.trim();
	const code = editor.value;

	if (!name) {
		alert('Please enter a version name.');
		return;
	}

	const version = {
		id: Date.now(),
		name: name,
		description: description,
		code: code,
		timestamp: new Date().toISOString(),
		dateFormatted: new Date().toLocaleString()
	};

	window.savedVersions.unshift(version);
	localStorage.setItem('logicValidatorVersions', JSON.stringify(window.savedVersions));

	closeSaveVersionModal();
	renderVersionsList();
}

function loadVersion(id) {
	const editor = document.getElementById("editor");
	const version = window.savedVersions.find(v => v.id === id);
	if (version) {
		editor.value = version.code;
		updateLineNumbers();
		validateExpression();
	}
}

function deleteVersion(id) {
	if (confirm('Are you sure you want to delete this version?')) {
		window.savedVersions = window.savedVersions.filter(v => v.id !== id);
		localStorage.setItem('logicValidatorVersions', JSON.stringify(window.savedVersions));
		renderVersionsList();
	}
}

function compareVersions(id) {
	const editor = document.getElementById("editor");
	const version = window.savedVersions.find(v => v.id === id);
	if (!version) return;

	const currentCode = editor.value;
	const versionCode = version.code;

	showComparison(currentCode, versionCode, 'Current Code', version.name);
}

function renderVersionsList() {
	const versionsList = document.getElementById('versionsList');
	const versionCount = document.getElementById('versionCount');

	if (!versionsList || !versionCount) return;

	versionCount.textContent = `${window.savedVersions.length} saved`;

	if (window.savedVersions.length === 0) {
		versionsList.innerHTML = '<div class="no-versions">No versions saved yet. Click "Save Version" to save the current expression.</div>';
		return;
	}

	let html = '';
	window.savedVersions.forEach(version => {
		html += `
			<div class="version-item">
				<div class="version-info">
					<div class="version-name">${escapeHtml(version.name)}</div>
					<div class="version-meta">
						${version.dateFormatted}
						${version.description ? ' • ' + escapeHtml(version.description) : ''}
					</div>
				</div>
				<div class="version-actions">
					<button class="version-btn load" onclick="loadVersion(${version.id})">Load</button>
					<button class="version-btn compare" onclick="compareVersions(${version.id})">Compare</button>
					<button class="version-btn delete" onclick="deleteVersion(${version.id})">Delete</button>
				</div>
			</div>
		`;
	});

	versionsList.innerHTML = html;
}

//-- === COMPARISON FUNCTIONS ===

function showComparison(codeA, codeB, titleA = 'Version A', titleB = 'Version B') {
	document.getElementById('comparisonLeftTitle').textContent = titleA;
	document.getElementById('comparisonRightTitle').textContent = titleB;

	const diff = computeDiff(codeA, codeB);
	document.getElementById('comparisonLeft').innerHTML = diff.left;
	document.getElementById('comparisonRight').innerHTML = diff.right;

	document.getElementById('comparisonView').classList.add('active');
}

function closeComparison() {
	document.getElementById('comparisonView').classList.remove('active');
}

function computeDiff(codeA, codeB) {
	const linesA = codeA.split('\n');
	const linesB = codeB.split('\n');

	let leftHtml = '';
	let rightHtml = '';

	const maxLines = Math.max(linesA.length, linesB.length);

	for (let i = 0; i < maxLines; i++) {
		const lineA = linesA[i] !== undefined ? linesA[i] : '';
		const lineB = linesB[i] !== undefined ? linesB[i] : '';

		if (lineA === lineB) {
			//-- Same line
			leftHtml += escapeHtml(lineA) + '\n';
			rightHtml += escapeHtml(lineB) + '\n';
		} else {
			//-- Different lines
			if (lineA && !lineB) {
				leftHtml += `<span class="diff-removed">${escapeHtml(lineA)}</span>\n`;
				rightHtml += '\n';
			} else if (!lineA && lineB) {
				leftHtml += '\n';
				rightHtml += `<span class="diff-added">${escapeHtml(lineB)}</span>\n`;
			} else {
				//-- Both exist but different
				leftHtml += `<span class="diff-changed">${escapeHtml(lineA)}</span>\n`;
				rightHtml += `<span class="diff-changed">${escapeHtml(lineB)}</span>\n`;
			}
		}
	}

	return { left: leftHtml, right: rightHtml };
}

//-- === DUPLICATE CHECKER ===

function checkDuplicates() {
	const editor = document.getElementById("editor");
	const code = editor.value;

	if (!code.trim()) {
		alert('Please enter some code to check for duplicates.');
		return;
	}

	const duplicates = findDuplicates(code);
	displayDuplicates(duplicates);
}

function findDuplicates(code) {
	//-- Normalize the code
	const normalized = code.replace(/\s+/g, ' ').trim();

	//-- Find repeated patterns (substrings that appear more than once)
	const patterns = new Map();
	const minLength = 20; //-- Minimum length for a duplicate to be worth reporting

	//-- Extract all substrings of reasonable length
	for (let len = minLength; len <= normalized.length / 2; len++) {
		for (let i = 0; i <= normalized.length - len; i++) {
			const substring = normalized.substr(i, len);

			//-- Skip if it's all whitespace or very simple
			if (substring.trim().length < minLength) continue;

			//-- Look for this substring elsewhere in the code
			const firstIndex = normalized.indexOf(substring);
			const lastIndex = normalized.lastIndexOf(substring);

			if (firstIndex !== lastIndex && !patterns.has(substring)) {
				//-- Found a duplicate
				const occurrences = countOccurrences(normalized, substring);
				if (occurrences > 1) {
					patterns.set(substring, {
						pattern: substring,
						count: occurrences,
						length: len
					});
				}
			}
		}
	}

	//-- Filter out subpatterns
	const filtered = Array.from(patterns.values())
		.sort((a, b) => b.length - a.length)
		.filter((pattern, index, arr) => {
			//-- Check if this pattern is contained in any longer pattern
			for (let i = 0; i < index; i++) {
				if (arr[i].pattern.includes(pattern.pattern)) {
					return false;
				}
			}
			return true;
		})
		.slice(0, 10); //-- Limit to top 10

	return filtered;
}

function countOccurrences(str, substr) {
	let count = 0;
	let pos = 0;
	while ((pos = str.indexOf(substr, pos)) !== -1) {
		count++;
		pos += substr.length;
	}
	return count;
}

function displayDuplicates(duplicates) {
	const resultsPanel = document.getElementById('duplicateResults');

	if (duplicates.length === 0) {
		resultsPanel.innerHTML = `
			<div class="duplicate-header">✅ No Significant Duplicates Found</div>
			<p style="color: var(--color-gray-600);">Your code doesn't contain any repeated logic patterns.</p>
		`;
		resultsPanel.classList.add('visible');
		return;
	}

	let html = `<div class="duplicate-header">⚠️ Found ${duplicates.length} Duplicate Pattern${duplicates.length > 1 ? 's' : ''}</div>`;

	duplicates.forEach((dup, index) => {
		//-- Format the pattern for display
		const formatted = dup.pattern.length > 100
			? dup.pattern.substr(0, 100) + '...'
			: dup.pattern;

		html += `
			<div class="duplicate-item">
				<div class="duplicate-title">Duplicate #${index + 1} (appears ${dup.count} times)</div>
				<div class="duplicate-code">${escapeHtml(formatted)}</div>
				<div class="duplicate-locations">
					💡 Consider extracting this logic into a reusable function or variable.
				</div>
			</div>
		`;
	});

	resultsPanel.innerHTML = html;
	resultsPanel.classList.add('visible');
}
