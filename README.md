# Data Science Project Generator

A React-based browser application for generating data science project structures based on the [Cookiecutter Data Science](https://github.com/drivendata/cookiecutter-data-science) template.

## Features

- Web-based interface for configuring a data science project structure
- Support for various project configurations:
  - Python versions
  - Environment managers (virtualenv, conda, pipenv)
  - Cloud storage integrations (AWS S3, Azure Blob Storage, Google Cloud Storage)
  - Documentation options (MkDocs)
  - Airflow integration
  - Streamlit dashboards
- Download the generated project as a ZIP file
- Preview the project structure before downloading

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <your-repository-url>
cd react-app
```

2. Install dependencies
```bash
npm install
# or 
yarn install
```

3. Start the development server
```bash
npm start
# or
yarn start
```

The application will be available at http://localhost:3000

### Building for Production

To build the application for production:

```bash
npm run build
# or
yarn build
```

The build artifacts will be stored in the `build/` directory.

## Usage

1. Fill out the project details in the form
2. Review the configuration options
3. Select additional features as needed
4. Click "Generate" to preview the project structure
5. Click "Download ZIP" to download the project files

## Project Structure

This React application follows a standard React project structure:

```
react-app/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── ProjectBasicForm.js
│   │   ├── ProjectConfigForm.js
│   │   ├── ProjectFeaturesForm.js
│   │   └── ProjectGenerator.js
│   ├── utils/
│   │   └── templateGenerator.js
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
└── package.json
```

## License

This project is licensed under the MIT License.
