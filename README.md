# Vanilla JavaScript Blog App

A responsive blog management application built with HTML, CSS, and vanilla JavaScript as part of a frontend internship training task.

The application uses `json-server` as a mock REST API to store and manage blog posts.

## Features

- Display blog posts from a local REST API
- View blog post details
- Add new blog posts
- Delete blog posts with a confirmation modal
- Validate blog title and description
- Show empty, loading, and error states
- Responsive layout for different screen sizes

## Technologies

- HTML5
- CSS3
- JavaScript
- Fetch API
- json-server
- CSS Grid
- Flexbox
- Font Awesome
- Normalize.css

## How to Run

1. Clone the repository:

   ```bash
   git clone https://github.com/Duha-Maali/javascript-blog-task.git
   ```
2. Open the project directory:

   ```bash
   cd javascript-blog-task
   ```
3. Start `json-server`:

   ```bash
   npx json-server --watch db.json --port 3000
   ```
4. Open `index.html` in the browser:
