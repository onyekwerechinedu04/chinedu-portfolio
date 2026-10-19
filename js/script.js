
/* =====================================
   CHINEDU ONYEKWERE - PORTFOLIO
   Dynamic Project Loading and Filtering
===================================== */

document.addEventListener("DOMContentLoaded", () => {

    // Only run on the Projects page
    const projectContainer = document.getElementById("projectContainer");

    if (!projectContainer) {
        return;
    }

    const searchInput = document.getElementById("projectSearch");
    const filterButtons = document.querySelectorAll(".filter-btn");
    const statusText = document.getElementById("projectStatus");

    let allProjects = [];
    let selectedCategory = "All";
    let searchTerm = "";

    // Load projects from the JSON file
    async function loadProjects() {
        try {
            const response = await fetch("data/projects.json");

            if (!response.ok) {
                throw new Error("Unable to load projects.");
            }

            allProjects = await response.json();

            renderProjects();

        } catch (error) {
            console.error("Project loading error:", error);

            statusText.textContent =
                "Projects could not be loaded. Please open the website using a local web server.";
        }
    }

    // Make an element containing plain text
    function createTextElement(tag, className, content) {
        const element = document.createElement(tag);
        element.className = className;
        element.textContent = content;
        return element;
    }

    // Create a Bootstrap project card
    function createProjectCard(project, index) {

        const column = document.createElement("div");
        column.className = "col-md-6 col-lg-4";

        const card = document.createElement("div");
        card.className = "card project-card h-100";

        // Decorative top section
        const visual = document.createElement("div");
        visual.className = "project-card-visual";

        const projectNumber = createTextElement(
            "span",
            "project-card-number",
            String(project.id || index + 1).padStart(2, "0")
        );

        const visualLabel = createTextElement(
            "span",
            "project-card-label",
            project.category
        );

        visual.appendChild(projectNumber);
        visual.appendChild(visualLabel);

        // Card content
        const cardBody = document.createElement("div");
        cardBody.className = "card-body d-flex flex-column";

        const category = createTextElement(
            "p",
            "project-category",
            project.category
        );

        const title = createTextElement(
            "h3",
            "project-card-title",
            project.title
        );

        const status = createTextElement(
            "span",
            "project-status-badge",
            project.status
        );

        const description = createTextElement(
            "p",
            "project-card-description",
            project.description
        );

        // Technologies
        const techList = document.createElement("div");
        techList.className = "project-tech-list";

        project.technologies.forEach(technology => {
            const badge = createTextElement(
                "span",
                "badge project-tech-badge",
                technology
            );

            techList.appendChild(badge);
        });

        // Details button
        const detailsButton = document.createElement("button");

        detailsButton.type = "button";
        detailsButton.className = "btn project-details-btn mt-auto";
        detailsButton.textContent = "View Project Details →";

        detailsButton.addEventListener("click", () => {
            showProjectDetails(project);
        });

        cardBody.appendChild(category);
        cardBody.appendChild(title);
        cardBody.appendChild(status);
        cardBody.appendChild(description);
        cardBody.appendChild(techList);
        cardBody.appendChild(detailsButton);

        card.appendChild(visual);
        card.appendChild(cardBody);
        column.appendChild(card);

        return column;
    }

    // Display projects based on active filters
    function renderProjects() {
        projectContainer.replaceChildren();

        const filteredProjects = allProjects.filter(project => {

            const categoryMatches =
                selectedCategory === "All" ||
                project.category === selectedCategory;

            const searchableText = [
                project.title,
                project.category,
                project.description,
                ...project.technologies
            ].join(" ").toLowerCase();

            const searchMatches =
                searchableText.includes(searchTerm);

            return categoryMatches && searchMatches;
        });

        filteredProjects.forEach((project, index) => {
            const card = createProjectCard(project, index);
            projectContainer.appendChild(card);
        });

        if (filteredProjects.length === 0) {
            statusText.textContent =
                "No projects match your search. Try another category or keyword.";
        } else {
            statusText.textContent =
                `Showing ${filteredProjects.length} of ${allProjects.length} projects.`;
        }
    }

    // Category filtering
    filterButtons.forEach(button => {

        button.addEventListener("click", () => {

            selectedCategory = button.dataset.filter;

            filterButtons.forEach(filterButton => {
                const isActive = filterButton === button;

                filterButton.classList.toggle("active", isActive);
                filterButton.setAttribute(
                    "aria-pressed",
                    String(isActive)
                );
            });

            renderProjects();
        });
    });

    // Live keyword searching
    searchInput.addEventListener("input", () => {
        searchTerm = searchInput.value.trim().toLowerCase();
        renderProjects();
    });

    // Open project details in Bootstrap modal
    function showProjectDetails(project) {

        document.getElementById("projectModalTitle").textContent =
            project.title;

        document.getElementById("projectModalCategory").textContent =
            project.category + " | " + project.status;

        document.getElementById("projectModalDescription").textContent =
            project.description;

        const modalTechnologies =
            document.getElementById("projectModalTechnologies");

        modalTechnologies.replaceChildren();

        project.technologies.forEach(technology => {
            const badge = createTextElement(
                "span",
                "badge project-tech-badge",
                technology
            );

            modalTechnologies.appendChild(badge);
        });

        const modalElement = document.getElementById("projectModal");

        const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
        modal.show();
    }

    // Start loading when page is ready
    loadProjects();

});
