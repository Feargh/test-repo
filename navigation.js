//-- Shared navigation component for all pages

//-- Function to create the navigation HTML
function createNavigation(currentPage) {
	const navHTML = `
		<!-- Sidebar -->
		<aside class="sidebar" id="sidebar">
			<!-- Logo Section -->
			<div class="sidebar-logo">
				<div class="logo-wrapper">
					<div class="logo-icon">
						<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
							<circle cx="16" cy="16" r="15" stroke="currentColor" stroke-width="2"/>
							<path d="M10 16L14 20L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
						</svg>
					</div>
					<span class="logo-text">Portal Testing Tool</span>
				</div>
				<!-- Sidebar Toggle for Mobile -->
				<button class="sidebar-toggle" id="sidebarToggle">
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M6 18L18 6M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
					</svg>
				</button>
			</div>

			<!-- Navigation Section -->
			<nav class="sidebar-nav">
				<div class="nav-section">
					<h6 class="nav-section-title">Pages</h6>
					<a href="index.html" class="nav-link page-nav-link ${currentPage === 'index' ? 'active' : ''}">
						<span class="page-indicator"></span>
						<span>Home</span>
					</a>
					<a href="pip.html" class="nav-link page-nav-link ${currentPage === 'pip' ? 'active' : ''}">
						<span class="page-indicator"></span>
						<span>PIP Helper</span>
					</a>
					<a href="bc.html" class="nav-link page-nav-link ${currentPage === 'bc' ? 'active' : ''}">
						<span class="page-indicator"></span>
						<span>Benefits Calculator</span>
					</a>
					<a href="custom-testing.html" class="nav-link page-nav-link ${currentPage === 'custom-testing' ? 'active' : ''}">
						<span class="page-indicator"></span>
						<span>Custom Testing</span>
					</a>
				</div>
				${getPageSpecificSections(currentPage)}
			</nav>

			<!-- Cat Image at Bottom -->
			<div class="sidebar-footer">
				<img src="https://placecats.com/300/200" alt="Cat mascot" class="sidebar-cat-image" />
			</div>
		</aside>
		
		<!-- Mobile Backdrop -->
		<div class="mobile-backdrop" id="mobileBackdrop"></div>
		
		<!-- Mobile Menu Button -->
		<button class="mobile-menu-btn" id="mobileMenuBtn">
			<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
			</svg>
			<span>Menu</span>
		</button>
	`;
	
	return navHTML;
}

//-- Function to get page-specific sections
function getPageSpecificSections(currentPage) {
	if (currentPage === 'pip') {
		return `
			<div class="nav-section">
				<h6 class="nav-section-title">Environment</h6>
				<div class="environment-buttons">
					<button id="pip-uat-btn" type="button" class="env-btn pip-env-btn active" onClick="switchPIPEnvironment('uat')">
						<span class="env-indicator"></span>
						UAT
					</button>
					<button id="pip-staging-btn" type="button" class="env-btn pip-env-btn" onClick="switchPIPEnvironment('staging')">
						<span class="env-indicator"></span>
						Staging
					</button>
					<button id="pip-live-btn" type="button" class="env-btn pip-env-btn" onClick="switchPIPEnvironment('live')">
						<span class="env-indicator"></span>
						Live
					</button>
					<button id="pip-local-btn" type="button" class="env-btn pip-env-btn" onClick="switchPIPEnvironment('local')">
						<span class="env-indicator"></span>
						Local
					</button>
				</div>
			</div>
		`;
	} else if (currentPage === 'bc') {
		return `
			<div class="nav-section">
				<h6 class="nav-section-title">Environment</h6>
				<div class="environment-buttons">
					<button id="bc-uat-btn" type="button" class="env-btn bc-env-btn active" onClick="switchBCEnvironment('uat')">
						<span class="env-indicator"></span>
						UAT
					</button>
					<button id="bc-staging-btn" type="button" class="env-btn bc-env-btn" onClick="switchBCEnvironment('staging')">
						<span class="env-indicator"></span>
						Staging
					</button>
					<button id="bc-live-btn" type="button" class="env-btn bc-env-btn" onClick="switchBCEnvironment('live')">
						<span class="env-indicator"></span>
						Live
					</button>
					<button id="bc-local-btn" type="button" class="env-btn bc-env-btn" onClick="switchBCEnvironment('local')">
						<span class="env-indicator"></span>
						Local
					</button>
				</div>
			</div>
		`;
	}
	return '';
}

//-- Function to initialize navigation
function initializeNavigation(currentPage) {
	//-- Insert navigation at the beginning of dashboard-container
	const dashboardContainer = document.querySelector('.dashboard-container');
	if (dashboardContainer) {
		const mainContent = dashboardContainer.querySelector('.main-content');
		dashboardContainer.innerHTML = createNavigation(currentPage);
		if (mainContent) {
			dashboardContainer.appendChild(mainContent);
		}
	}
	
	//-- Initialize mobile menu functionality
	initializeMobileMenu();
}

//-- Function to initialize mobile menu
function initializeMobileMenu() {
	const sidebarToggle = document.getElementById("sidebarToggle");
	const mobileMenuBtn = document.getElementById("mobileMenuBtn");
	const sidebar = document.getElementById("sidebar");
	const mobileBackdrop = document.getElementById("mobileBackdrop");
	
	if (sidebar) {
		//-- Toggle sidebar on button click
		if (sidebarToggle) {
			sidebarToggle.addEventListener("click", function(e) {
				e.stopPropagation();
				sidebar.classList.toggle("active");
			});
		}
		
		//-- Mobile menu button
		if (mobileMenuBtn) {
			mobileMenuBtn.addEventListener("click", function(e) {
				e.stopPropagation();
				sidebar.classList.add("active");
			});
		}
		
		//-- Close sidebar when clicking backdrop
		if (mobileBackdrop) {
			mobileBackdrop.addEventListener("click", function() {
				sidebar.classList.remove("active");
			});
		}
		
		//-- Close sidebar when clicking outside on mobile
		document.addEventListener("click", function(event) {
			if (window.innerWidth <= 768) {
				if (!sidebar.contains(event.target) && sidebar.classList.contains("active")) {
					sidebar.classList.remove("active");
				}
			}
		});
		
		//-- Handle window resize
		let resizeTimer;
		window.addEventListener("resize", function() {
			clearTimeout(resizeTimer);
			resizeTimer = setTimeout(function() {
				if (window.innerWidth > 768) {
					sidebar.classList.remove("active");
				}
			}, 250);
		});
	}
}