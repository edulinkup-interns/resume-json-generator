# Resume JSON Generator

A lightweight, browser-based resume builder that converts your professional information into structured JSON and clean plain text.

**[Live Demo](https://edulinkup-interns.github.io/resume-json-generator/)**

## Preview

![Resume JSON Generator Preview](https://github.com/user-attachments/assets/6fd66f17-493c-400a-9b8d-b9924cb47462)

## Features

- Interactive resume builder with real-time output generation.
- Manage personal information, education, skills, experience, and projects.
- Add and remove entries in dynamic resume sections.
- Export resume data as JSON or plain text.
- Copy generated output to the clipboard.
- Download generated files in `.json` and `.txt` formats.
- Automatically save and restore drafts using Local Storage.
- Dark and light theme support.
- Responsive interface for different screen sizes.
- Browser-based data handling without a backend.

## Tech Stack

| Technology | Purpose |
|---|---|
| HTML5 | Page structure |
| CSS3 | Styling and responsive design |
| JavaScript (ES6+) | Application logic and DOM manipulation |
| Local Storage | Persistent draft storage |
| Clipboard API | Copy generated output |
| Blob API | File generation and downloads |
| GitHub Pages | Hosting and deployment |

## Getting Started

### Prerequisites

- A modern web browser.
- Git (optional, for cloning the repository).

### Run Locally

1. Clone the repository:

   ```bash
   git clone https://github.com/edulinkup-interns/resume-json-generator.git
   ```

2. Navigate to the project directory:

   ```bash
   cd resume-json-generator
   ```

3. Open `index.html` in your browser.

   Alternatively, use the Live Server extension in VS Code.

No additional dependencies, build tools, or backend configuration are required.

## Output Structure

The generated JSON contains the following top-level fields:

| Field | Description |
|---|---|
| `personal` | Contact details and professional links |
| `summary` | Professional summary |
| `education` | Educational qualifications |
| `skills` | Technical and professional skills |
| `experience` | Work experience and internships |
| `projects` | Projects, technologies, and links |
| `certifications` | Professional certifications |
| `achievements` | Accomplishments and awards |
| `positions` | Leadership roles and responsibilities |

### Example JSON

```json
{
  "personal": {
    "fullName": "Alex Morgan",
    "email": "alex@example.com",
    "phone": "+91 98765 43210",
    "location": "Kolkata, India",
    "linkedin": "https://linkedin.com/in/alexmorgan",
    "github": "https://github.com/alexmorgan",
    "portfolio": "https://alexmorgan.dev"
  },
  "summary": "Computer Science student interested in software development.",
  "education": [],
  "skills": [
    "JavaScript",
    "React",
    "Node.js",
    "MongoDB"
  ],
  "experience": [],
  "projects": [],
  "certifications": [],
  "achievements": [],
  "positions": []
}
```

*This is an illustrative example. Actual output is generated dynamically from the information entered in the application.*

## Privacy & Data Storage

- Resume information is stored locally in the browser using `localStorage`.
- No backend or external database is required.
- Resume data is not uploaded to an external server by the application.
- Saved drafts are available in the same browser profile.
- Clearing browser site data may permanently remove saved information.

**Note:** Anyone with access to the same browser profile may be able to view saved resume information. Avoid using shared or public devices for sensitive information.

## Contributing

Contributions, bug reports, and suggestions are welcome!

1. Fork the repository.
2. Create a feature branch:

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. Make your changes and test them locally.
4. Commit and push your changes:

   ```bash
   git add .
   git commit -m "Describe your changes"
   git push origin feature/your-feature-name
   ```

5. Open a Pull Request against the upstream repository.

## License

This project is licensed under the [MIT License](LICENSE).