# Resume JSON Generator

A lightweight, browser-based tool for building structured resume data and exporting it as JSON. Fill in your details through a guided form, review the generated output, and download it as `resume.json` for use in other projects or workflows.

## Features

- **Single-page form** with nine sections covering personal information, summary, education, skills, experience, projects, certifications, achievements, and positions & leadership.
- **Repeatable sections** for entries such as education, work experience, projects, certifications, achievements, and positions.
- **Live output panel** that updates as you type, with **JSON** and **Plain text** tabs to review the structured resume data before exporting.
- **Download or copy** the generated JSON.
- **Automatic draft saving** in the browser using `localStorage`, so your progress remains available in the same browser.
- **Responsive interface** with a dark theme for desktop and mobile screens.
- **Reset option** to clear the saved draft and start over.

## Design Decisions & FAQ

### 1. What problem does this project solve?

Creating structured resume data manually can be time-consuming and requires knowledge of JSON formatting. This project simplifies that process by providing a guided form where users can enter their resume information and automatically generate structured JSON output.

### 2. Why was this project built?

The project was designed to make resume data creation easier, faster, and more accessible. Instead of manually writing JSON, users can fill out a simple form and obtain structured resume data that can be reused in other applications and workflows.

### 3. What exactly has been implemented?

The application includes:

- A single-page resume builder with nine sections.
- Dynamic fields for adding and removing education, experience, projects, certifications, achievements, and positions.
- Live JSON and plain-text previews.
- Copy-to-clipboard functionality.
- JSON file downloads.
- Automatic draft saving and restoration using browser local storage.
- Light and dark themes.
- Input validation and character counters.
- A reset option to clear resume information.

### 4. What is the technology stack?

The project uses:

- **HTML5:** Structures the application and its form elements.
- **CSS3:** Handles styling, responsive layouts, and themes.
- **Vanilla JavaScript:** Manages form interactions, validation, data collection, and JSON generation.
- **Browser APIs:** Local Storage for draft persistence, Clipboard API for copying output, and Blob APIs for file downloads.
- **Font Awesome:** Provides interface icons through its CDN.

No frontend framework or build tool is required.

### 5. Does the project use a database?

No traditional database or backend is currently used. Resume drafts are stored locally in the user's browser using `localStorage`.

This keeps the application lightweight and avoids sending personal resume information to a central server. However, saved drafts are limited to the browser and device where they were created.

### 6. How are users authenticated?

The current application does not implement user accounts, login, or an authentication system.

Since resume information is processed and stored locally in the browser, users do not need to authenticate to use the application.

### 7. How is the project deployed?

The project is hosted using **GitHub Pages**. Its static HTML, CSS, and JavaScript files are served directly to visitors without requiring a separate application server or backend deployment.

### 8. What was the hardest bug?

The repository does not document one specific hardest bug. However, some technically challenging areas include:

- Managing dynamically added and removed form entries.
- Keeping the generated JSON synchronized with form inputs.
- Restoring previously saved information from local storage.
- Ensuring automatic saving works correctly while users interact with the form.

These areas require careful coordination between form state, browser storage, and generated output.

### 9. What if the number of users increases by 100x?

The current architecture is lightweight because most application logic runs directly in the user's browser.

Since the application does not depend on a centralized database or backend for its core functionality, increasing visitor numbers does not require scaling an application server or database.

GitHub Pages handles static file hosting. If usage grows significantly, hosting limits, asset delivery, caching, and overall performance should still be monitored.

### 10. What are the trade-offs of this architecture?

The project prioritizes simplicity, privacy, and low maintenance.

**Advantages:**
- No backend infrastructure or database costs.
- Resume information stays in the user's browser.
- Simple deployment and maintenance.
- Fast client-side processing.

**Limitations:**
- No cloud synchronization between devices.
- No user accounts or collaborative features.
- Clearing browser data may remove saved drafts.
- Storage depends on browser capabilities and limits.

### 11. What future improvements could be introduced?

Potential improvements include:

- Optional cloud storage and synchronization.
- Resume templates and customization options.
- PDF export alongside JSON downloads.
- Importing existing resume data.
- Improved accessibility and keyboard navigation.
- More comprehensive JSON validation.
- Additional export formats and integrations.

## Live Demo

[🚀 Try Resume JSON Generator](https://edulinkup-interns.github.io/resume-json-generator/)

## Preview

### Light Mode
![Resume JSON Generator - Light Mode](public/preview-light.png)

### Dark Mode
![Resume JSON Generator - Dark Mode](public/preview-dark.png)

## Getting Started

### Run locally

1. Clone the repository:

   ```bash
   git clone https://github.com/edulinkup-interns/resume-json-generator.git
   ```

2. Open the project folder:

   ```bash
   cd resume-json-generator
   ```

3. Open `index.html` in your browser.

You can also use a local development server, such as the **Live Server** extension in VS Code.

## How to Use

1. Open the application in your browser.
2. Fill in the resume sections on the single-page form, scrolling down through each section.
3. Use **+ Add** and **Remove** to add or remove entries where needed.
4. Watch the **Live Output** panel update as you type, and switch between the **JSON** and **Plain text** tabs.
5. Select **Copy to clipboard** to copy the output, or **Download output** to save it as a file.
6. To start over, use the reset option to clear the form and the saved draft.

Your draft is automatically saved in your browser. Drafts are stored locally and are not synced between browsers or devices. Clearing the browser's site data may remove the saved draft.

## Output Structure

The exported file is a JSON object with the following top-level fields:

| Field | Description |
| --- | --- |
| `personal` | Object containing full name, email, phone, location, LinkedIn, GitHub, and portfolio |
| `summary` | Professional summary text |
| `education` | Array of education entries |
| `skills` | Flat array of skills, including programming languages, web technologies, databases, tools/platforms, and other skills |
| `experience` | Array of work, internship, or freelance experience entries |
| `projects` | Array of projects, including technologies, descriptions, and links |
| `certifications` | Array of certification entries |
| `achievements` | Array of achievements |
| `positions` | Array of leadership and other position entries |

Example output:

```json
{
  "personal": {
    "fullName": "Alex Morgan",
    "email": "alex@example.com",
    "phone": "+91 98765 43210",
    "location": "Bengaluru, India",
    "linkedin": "https://linkedin.com/in/alexmorgan",
    "github": "https://github.com/alexmorgan",
    "portfolio": "https://alexmorgan.dev"
  },
  "summary": "Computer Science student interested in software development.",
  "education": [],
  "skills": [
    "Java",
    "Python",
    "JavaScript",
    "HTML",
    "CSS",
    "React",
    "MongoDB",
    "Git",
    "GitHub",
    "Problem Solving"
  ],
  "experience": [],
  "projects": [],
  "certifications": [],
  "achievements": [],
  "positions": []
}
```

The example is illustrative; fields are populated based on the information entered in the form. The `personal` object contains the user's personal information, while `skills` is exported as a flat array of strings. Optional personal fields are included only when values are provided.

## Project Structure

```
resume-json-generator/
├── .github/         # GitHub configuration
├── public/
│   └── logo.png     # Application logo
├── countries.js     # Country data used by the form
├── favicon.png      # Site favicon
├── index.html       # Form structure and page layout
├── style.css        # Styling and responsive layout
├── script.js        # Form navigation, data collection, autosave, and JSON export
├── README.md        # Project documentation
└── LICENSE          # MIT License
```

## Technologies

- HTML
- CSS
- Vanilla JavaScript
- Browser APIs: Local Storage, Clipboard API, and Blob downloads

No framework, backend, database, or third-party package is required.

## Privacy

Resume information and saved drafts are handled in your browser by this application. Drafts are stored in `localStorage`; avoid using a shared or public device for sensitive personal information, and clear the saved draft when finished.

## Good First Issues

New to open source? We'd love to have you contribute!

Explore open issues labelled for community contributions:

- [Good First Issues](https://github.com/edulinkup-interns/resume-json-generator/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22) – Beginner-friendly tasks suitable for first-time contributors.
- [Help Wanted](https://github.com/edulinkup-interns/resume-json-generator/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22) – Issues where maintainers are looking for additional contributions.

### How to Select an Issue

- Start with `good first issue` if you are new to the repository or prefer a small, well-scoped task (such as documentation updates, UI polish, or minor bug fixes).
- Browse `help wanted` once you are comfortable with the codebase and want to tackle broader enhancements.
- Choose a task that matches your comfort level with HTML, CSS, vanilla JavaScript, or documentation, and look for issues without an assignee.

### Before You Start

1. Read the issue description and acceptance criteria carefully.
2. Check the **Assignees** field, linked pull requests, and recent comments to confirm nobody is already working on the issue.
3. Comment on the issue to introduce yourself and outline your proposed approach before starting work.
4. Follow the workflow in [CONTRIBUTING.md](CONTRIBUTING.md) (fork, branch, commit, and open a pull request).
5. Test your changes locally in the browser and include a clear summary in your pull request.

## Roadmap

This roadmap separates completed improvements from potential future enhancements. Future ideas are proposals and are not confirmed development commitments.

### Recently Completed

- [x] [Improve copy feedback and clipboard error handling (#39)](https://github.com/edulinkup-interns/resume-json-generator/issues/39) – Consistent feedback for JSON and plain-text copying, with graceful clipboard failure handling ([PR #81](https://github.com/edulinkup-interns/resume-json-generator/pull/81)).
- [x] [Toolbar keyboard accessibility](https://github.com/edulinkup-interns/resume-json-generator/pull/79) – Improved keyboard navigation support for toolbar actions ([PR #79](https://github.com/edulinkup-interns/resume-json-generator/pull/79)).
- [x] [Invalid export blocking and draft safety](https://github.com/edulinkup-interns/resume-json-generator/pull/76) – Blocked invalid exports, handled malformed drafts safely, and added pasted phone number splitting ([PR #76](https://github.com/edulinkup-interns/resume-json-generator/pull/76)).
- [x] [Accessible input validation feedback](https://github.com/edulinkup-interns/resume-json-generator/pull/75) – Added accessible validation feedback for form fields ([PR #75](https://github.com/edulinkup-interns/resume-json-generator/pull/75)).

### Future Ideas

The following improvements are proposed areas for future exploration:

#### Resume Customization
- Resume templates and customization options.
- Importing existing resume data.

#### Export and Integration
- PDF export alongside JSON downloads.
- Additional export formats and integrations.

#### Storage, Validation, and Accessibility
- Optional cloud storage and synchronization.
- Additional accessibility and keyboard navigation improvements.
- More comprehensive JSON validation.

Have another idea? Open an issue on [GitHub Issues](https://github.com/edulinkup-interns/resume-json-generator/issues) to discuss a potential improvement.

## Contributing

Issues and pull requests for bug fixes, usability improvements, and additional export formats are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) for setup and pull request guidelines.

## License

[MIT LICENSE](LICENSE)
