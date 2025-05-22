/**
 * Template generator utility to generate project files based on user form data
 */

// Standard README.md template
const readmeTemplate = (data) => `# ${data.project_name}

${data.description}

## Project Organization

    ├── LICENSE
    ├── Makefile           <- Makefile with commands like \`make data\` or \`make train\`
    ├── README.md          <- The top-level README for developers using this project.
    ├── data
    │   ├── external       <- Data from third party sources.
    │   ├── interim        <- Intermediate data that has been transformed.
    │   ├── processed      <- The final, canonical data sets for modeling.
    │   └── raw            <- The original, immutable data dump.
    │
    ├── docs               <- A default ${data.docs === 'mkdocs' ? 'MkDocs' : ''} project; see ${data.docs === 'mkdocs' ? 'mkdocs.org' : 'documentation guide'} for details
    │
    ├── models             <- Trained and serialized models, model predictions, or model summaries
    │
    ├── notebooks          <- Jupyter notebooks. Naming convention is a number (for ordering),
    │                         the creator's initials, and a short \`-\` delimited description, e.g.
    │                         \`1.0-jqp-initial-data-exploration\`.
    │
    ├── references         <- Data dictionaries, manuals, and all other explanatory materials.
    │
    ├── reports            <- Generated analysis as HTML, PDF, LaTeX, etc.
    │   └── figures        <- Generated graphics and figures to be used in reporting
    │
    ├── requirements.txt   <- The requirements file for reproducing the analysis environment, e.g.
    │                         generated with \`pip freeze > requirements.txt\`
    │
${data.streamlit === 'Yes' ? '    ├── streamlit         <- Streamlit app for data visualization\n    │\n' : ''}${data.airflow === 'Yes' ? '    ├── airflow           <- Airflow dags for data pipeline orchestration\n    │\n' : ''}    └── ${data.module_name}        <- Source code for use in this project.
        ├── __init__.py    <- Makes ${data.module_name} a Python module
        │
        ├── data           <- Scripts to download or generate data
        │   └── make_dataset.py
        │
        ├── features       <- Scripts to turn raw data into features for modeling
        │   └── build_features.py
        │
        ├── models         <- Scripts to train models and then use trained models to make
        │   │                 predictions
        │   ├── predict_model.py
        │   └── train_model.py
        │
        └── visualization  <- Scripts to create exploratory and results oriented visualizations
            └── visualize.py
`;

// Generate a Makefile
const makefileTemplate = (data) => {
    let dataSyncCommands = '';
    
    if (data.dataset_storage === 'azure') {
        dataSyncCommands = `
## Sync data from Azure Blob Storage
sync_data_from_azure:
\taz storage blob download-batch --source ${data.container_name} --destination $(LOCAL_DATA_DIR)

## Sync data to Azure Blob Storage
sync_data_to_azure:
\taz storage blob upload-batch --destination ${data.container_name} --source $(LOCAL_DATA_DIR)
`;
    } else if (data.dataset_storage === 's3') {
        dataSyncCommands = `
## Sync data from S3
sync_data_from_s3:
\taws s3 sync s3://${data.bucket_name}/data/ $(LOCAL_DATA_DIR) --profile ${data.aws_profile}

## Sync data to S3
sync_data_to_s3:
\taws s3 sync $(LOCAL_DATA_DIR) s3://${data.bucket_name}/data/ --profile ${data.aws_profile}
`;
    } else if (data.dataset_storage === 'gcs') {
        dataSyncCommands = `
## Sync data from GCS
sync_data_from_gcs:
\tgsutil -m rsync -r gs://${data.bucket_name}/data/ $(LOCAL_DATA_DIR)

## Sync data to GCS
sync_data_to_gcs:
\tgsutil -m rsync -r $(LOCAL_DATA_DIR) gs://${data.bucket_name}/data/
`;
    }

    return `.PHONY: clean data lint requirements sync_data_to_cloud sync_data_from_cloud

#################################################################################
# GLOBALS                                                                       #
#################################################################################

PROJECT_DIR := \$(shell dirname \$(realpath \$(lastword \$(MAKEFILE_LIST))))
DATA_DIR := \${PROJECT_DIR}/data
LOCAL_DATA_DIR := \${DATA_DIR}

#################################################################################
# COMMANDS                                                                      #
#################################################################################

## Install Python Dependencies
requirements:
\t${data.environment_manager === 'virtualenv' ? 'pip install -U pip setuptools wheel\n\tpip install -e .' : data.environment_manager === 'conda' ? 'conda env update -f environment.yml' : data.environment_manager === 'pipenv' ? 'pipenv install --dev' : 'echo "No environment manager specified"'}

## Make Dataset
data: requirements
\t${data.environment_manager === 'virtualenv' ? 'python -m ' : data.environment_manager === 'conda' ? 'python -m ' : data.environment_manager === 'pipenv' ? 'pipenv run python -m ' : 'python -m '}${data.module_name}.data.make_dataset

## Delete all compiled Python files
clean:
\tfind . -type d -name "__pycache__" -exec rm -rf {} +
\tfind . -type f -name "*.py[co]" -delete
\tfind . -type f -name "*.so" -delete
\tfind . -type d -name ".pytest_cache" -exec rm -rf {} +
\tfind . -type d -name ".coverage" -exec rm -rf {} +
\tfind . -type d -name "htmlcov" -exec rm -rf {} +
\tfind . -type d -name ".benchmarks" -exec rm -rf {} +
\tfind . -type d -name "*.egg-info" -exec rm -rf {} +
\tfind . -type d -name "*.egg" -exec rm -rf {} +
\tfind . -type d -name ".ipynb_checkpoints" -exec rm -rf {} +

## Lint using flake8
lint:
\tflake8 ${data.module_name}

${dataSyncCommands}

#################################################################################
# PROJECT RULES                                                                 #
#################################################################################

#################################################################################
# Self Documenting Commands                                                     #
#################################################################################

.DEFAULT_GOAL := help

# Inspired by <http://marmelab.com/blog/2016/02/29/auto-documented-makefile.html>
# sed script explained:
# /^##/:
# 	* save line in hold space
# 	* purge line
# 	* Loop:
# 		* append newline + line to hold space
# 		* go to next line
# 		* if line starts with doc comment, strip comment character off and loop
# 	* remove target prerequisites
# 	* append hold space (+ newline) to line
# 	* replace newline plus comments by \`\n\t\t\`
# 	* print line
# Separate expressions are necessary because labels cannot be delimited by
# semicolon; see <http://stackoverflow.com/a/11799865/1968>
help:
\t@echo "$$(tput bold)Available rules:$$(tput sgr0)"
\t@echo
\t@sed -n -e "/^## / { \
		h; \
		s/.*//; \
		:doc" \
		-e "H; \
		n; \
		/^## /b doc" \
		-e "/^# /b doc" \
		-e "/^[^\t].*[^\\\\]:\s*.*/ { \
			s/:.*//; \
			G; \
			s/\\n## /---/; \
			s/\\n# //g; \
			s/---/\\n/; \
			p; \
		}" \
		-e "}" \
		$(MAKEFILE_LIST) \
	| LC_ALL='C' sort --ignore-case \
	| awk -F '---' \
		-v ncol=$$(tput cols) \
		-v indent=19 \
		-v col_on="$$(tput setaf 6)" \
		-v col_off="$$(tput sgr0)" \
	'{ \
		printf "%s%*s%s ", col_on, -indent, $$1, col_off; \
		n = split($$2, words, " "); \
		line_length = ncol - indent; \
		for (i = 1; i <= n; i++) { \
			line_length -= length(words[i]) + 1; \
			if (line_length <= 0) { \
				line_length = ncol - indent - length(words[i]) - 1; \
				printf "\\n%*s ", -indent, " "; \
			} \
			printf "%s ", words[i]; \
		} \
		printf "\\n"; \
	}'`;
};

// Generate init.py file for the main module
const initPyTemplate = (data) => `"""
${data.project_name}
${'-'.repeat(data.project_name.length)}

${data.description}
"""

__version__ = "0.1.0"
`;

// Generate a basic Python module structure file
const makeDatasetTemplate = () => `# -*- coding: utf-8 -*-
import logging
from pathlib import Path

def main():
    """ Runs data processing scripts to turn raw data from (../raw) into
        cleaned data ready to be analyzed (saved in ../processed).
    """
    logger = logging.getLogger(__name__)
    logger.info('making final data set from raw data')


if __name__ == '__main__':
    log_fmt = '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    logging.basicConfig(level=logging.INFO, format=log_fmt)

    # find .env automagically by walking up directories until it's found, then
    # load up the .env entries as environment variables
    project_dir = Path(__file__).resolve().parents[2]

    main()
`;

// License templates
const mitLicenseTemplate = (data) => {
    const year = new Date().getFullYear();
    return `MIT License

Copyright (c) ${year} ${data.author_name}

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`;
};

const bsd3LicenseTemplate = (data) => {
    const year = new Date().getFullYear();
    return `BSD 3-Clause License

Copyright (c) ${year}, ${data.author_name}
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this
   list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice,
   this list of conditions and the following disclaimer in the documentation
   and/or other materials provided with the distribution.

3. Neither the name of the copyright holder nor the names of its
   contributors may be used to endorse or promote products derived from
   this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.`;
};

// Configuration file template
const configTemplate = () => `# -*- coding: utf-8 -*-
"""
Configuration file for the project.

This module contains the configuration settings for the project.
"""
import os
from pathlib import Path

# Path to the project directory
PROJECT_DIR = Path(__file__).resolve().parents[1]

# Path to the data directory
DATA_DIR = PROJECT_DIR / "data"

# Path to raw data
RAW_DATA_DIR = DATA_DIR / "raw"

# Path to processed data
PROCESSED_DATA_DIR = DATA_DIR / "processed"

# Path to interim data
INTERIM_DATA_DIR = DATA_DIR / "interim"

# Path to external data
EXTERNAL_DATA_DIR = DATA_DIR / "external"

# Path to model directory
MODELS_DIR = PROJECT_DIR / "models"

# Path to reports directory
REPORTS_DIR = PROJECT_DIR / "reports"

# Path to figures
FIGURES_DIR = REPORTS_DIR / "figures"

# Path to notebooks directory
NOTEBOOKS_DIR = PROJECT_DIR / "notebooks"
`;

// Python requirements file templates
const requirementsTemplate = (data) => {
    const basicPackages = data.pydata_packages === 'basic' ? 
        `numpy==1.24.*
pandas==2.0.*
matplotlib==3.7.*
scikit-learn==1.3.*
jupyter==1.0.*
notebook==6.5.*` : '';
    
    return `# local package
-e .

# external requirements
click==8.1.*
python-dotenv==1.0.*
${basicPackages}
${data.docs === 'mkdocs' ? 'mkdocs==1.5.*' : ''}
${data.streamlit === 'Yes' ? 'streamlit==1.27.*' : ''}
`;
};

// Streamlit app template
const streamlitAppTemplate = (data) => `import streamlit as st
import pandas as pd
import matplotlib.pyplot as plt

# Set page configuration
st.set_page_config(
    page_title="${data.project_name}",
    page_icon="📊",
    layout="wide",
    initial_sidebar_state="expanded",
)

# Main app
def main():
    st.title("${data.project_name}")
    st.markdown("${data.description}")
    
    st.header("Data Exploration")
    
    # Placeholder for actual data loading
    st.info("Load your data here using the data directory paths from your project.")
    
    # Create a sample DataFrame for demonstration
    sample_data = {
        'Feature A': [1, 2, 3, 4, 5],
        'Feature B': [10, 20, 30, 40, 50],
        'Target': [0, 0, 1, 1, 1]
    }
    df = pd.DataFrame(sample_data)
    
    # Display sample data
    st.subheader("Sample Data")
    st.dataframe(df)
    
    # Simple visualization
    st.subheader("Visualization")
    fig, ax = plt.subplots()
    ax.scatter(df['Feature A'], df['Feature B'], c=df['Target'])
    ax.set_xlabel('Feature A')
    ax.set_ylabel('Feature B')
    ax.set_title('Sample Scatter Plot')
    st.pyplot(fig)
    
    # Add more sections as needed
    st.header("Model Results")
    st.info("Add your model results here.")

if __name__ == "__main__":
    main()
`;

// Airflow DAG template
const airflowDagTemplate = (data) => `"""
Example Airflow DAG for ${data.project_name}.
"""
from datetime import datetime, timedelta

from airflow import DAG
from airflow.operators.python import PythonOperator

default_args = {
    "owner": "${data.author_name}",
    "depends_on_past": False,
    "email_on_failure": False,
    "email_on_retry": False,
    "retries": 1,
    "retry_delay": timedelta(minutes=5),
}

def fetch_data(**kwargs):
    """Fetch data from an API or other source."""
    print("Fetching data...")
    # Your code to fetch data here
    return {"status": "success", "rows_fetched": 100}

def process_data(**kwargs):
    """Process the fetched data."""
    ti = kwargs["ti"]
    fetch_result = ti.xcom_pull(task_ids="fetch_data")
    print(f"Processing {fetch_result['rows_fetched']} rows of data...")
    # Your code to process data here
    return {"status": "success", "rows_processed": fetch_result["rows_fetched"]}

def train_model(**kwargs):
    """Train a model on the processed data."""
    ti = kwargs["ti"]
    process_result = ti.xcom_pull(task_ids="process_data")
    print(f"Training model on {process_result['rows_processed']} rows...")
    # Your code to train model here
    return {"status": "success", "model_accuracy": 0.85}

with DAG(
    "${data.module_name}_dag",
    default_args=default_args,
    description="${data.description}",
    schedule_interval=timedelta(days=1),
    start_date=datetime(2023, 1, 1),
    catchup=False,
    tags=["${data.module_name}"],
) as dag:

    fetch_task = PythonOperator(
        task_id="fetch_data",
        python_callable=fetch_data,
    )

    process_task = PythonOperator(
        task_id="process_data",
        python_callable=process_data,
    )

    train_task = PythonOperator(
        task_id="train_model",
        python_callable=train_model,
    )

    # Set task dependencies
    fetch_task >> process_task >> train_task
`;

// MkDocs configuration template
const mkDocsTemplate = (data) => `site_name: ${data.project_name}
site_description: ${data.description}
site_author: ${data.author_name}
repo_url: ''

nav:
  - Home: index.md
  - Getting Started: getting-started.md

theme:
  name: material
  palette:
    primary: indigo
    accent: indigo
  features:
    - navigation.instant
    - navigation.tracking
    - navigation.expand
    - navigation.indexes
    - content.code.copy

plugins:
  - search
  - mkdocstrings:
      default_handler: python
      handlers:
        python:
          selection:
            docstring_style: google
          rendering:
            show_source: true
            show_root_heading: true

markdown_extensions:
  - pymdownx.highlight
  - pymdownx.superfences
  - admonition
  - toc:
      permalink: true
`;

// Python project config file
const pyprojectTemplate = (data) => {
    const pythonVersion = data.python_version_number.startsWith('3.') ?
        `python_version = "${data.python_version_number}"` :
        `python_version = "3.10"`;
    
    return `[build-system]
requires = ["setuptools>=42", "wheel"]
build-backend = "setuptools.build_meta"

[tool.black]
line-length = 88
target-version = ["py${data.python_version_number.replace('.', '')}"]
include = '\.pyi?$'

[tool.isort]
profile = "black"
multi_line_output = 3

[tool.pytest.ini_options]
testpaths = ["tests"]
python_files = "test_*.py"

[tool.mypy]
python_version = "${data.python_version_number}"
warn_return_any = true
warn_unused_configs = true
disallow_untyped_defs = true
disallow_incomplete_defs = true

[tool.poetry]
name = "${data.module_name}"
version = "0.1.0"
description = "${data.description}"
authors = ["${data.author_name}"]

[tool.poetry.dependencies]
python = "^${data.python_version_number}"
`;
};

// Setup.cfg template
const setupCfgTemplate = (data) => `[metadata]
name = ${data.module_name}
version = 0.1.0
description = ${data.description}
author = ${data.author_name}
license = ${data.open_source_license === 'No license file' ? 'MIT' : data.open_source_license}
long_description = file: README.md
long_description_content_type = text/markdown

[options]
package_dir =
    = .
packages = find:
python_requires = >=${data.python_version_number}
install_requires =
    click
    python-dotenv

[options.packages.find]
where = .

[options.extras_require]
dev =
    pytest>=6.0
    pytest-cov>=2.0
    flake8>=3.9
    black>=21.5b2
    isort>=5.9

[flake8]
max-line-length = 88
exclude = .tox,.eggs,ci/templates,build,dist
`;

// Environment.yml template for conda
const condaEnvTemplate = (data) => {
    const basicPackages = data.pydata_packages === 'basic' ?
        `  - numpy>=1.24
  - pandas>=2.0
  - matplotlib>=3.7
  - scikit-learn>=1.3
  - jupyter>=1.0
  - notebook>=6.5` : '';
    
    return `name: ${data.module_name}
channels:
  - conda-forge
  - defaults
dependencies:
  - python=${data.python_version_number}
  - pip
  - click
  - pip:
    - python-dotenv
${basicPackages}
${data.docs === 'mkdocs' ? '  - mkdocs\n' : ''}${data.streamlit === 'Yes' ? '  - streamlit\n' : ''}
  - pip:
    - -e .  # Install local package in development mode
`;
};

// Pipfile template
const pipfileTemplate = (data) => {
    const basicPackages = data.pydata_packages === 'basic' ?
        `numpy = ">=1.24"
pandas = ">=2.0"
matplotlib = ">=3.7"
scikit-learn = ">=1.3"
jupyter = ">=1.0"
notebook = ">=6.5"` : '';
    
    return `[[source]]
url = "https://pypi.org/simple"
verify_ssl = true
name = "pypi"

[packages]
click = "*"
python-dotenv = "*"
${data.module_name} = {editable = true, path = "."}
${basicPackages}
${data.docs === 'mkdocs' ? 'mkdocs = "*"\n' : ''}${data.streamlit === 'Yes' ? 'streamlit = "*"\n' : ''}

[dev-packages]
pytest = ">=6.0"
pytest-cov = ">=2.0"
flake8 = ">=3.9"
black = ">=21.5b2"
isort = ">=5.9"

[requires]
python_version = "${data.python_version_number}"
`;
};

// Docker Compose template
const dockerComposeTemplate = (data) => `version: '3'

services:
${data.airflow === 'Yes' ? `  airflow:
    build:
      context: ./airflow
    ports:
      - "8080:8080"
    volumes:
      - ./airflow/dags:/opt/airflow/dags
      - ./data:/opt/airflow/data
    environment:
      - AIRFLOW__CORE__LOAD_EXAMPLES=False
    healthcheck:
      test: ["CMD", "curl", "--fail", "http://localhost:8080/health"]
      interval: 10s
      timeout: 10s
      retries: 5` : ''}
${data.streamlit === 'Yes' ? `
  streamlit:
    build:
      context: ./streamlit
    ports:
      - "8501:8501"
    volumes:
      - ./streamlit:/app
      - ./data:/app/data
    environment:
      - MODULE_NAME=${data.module_name}` : ''}
${data.docs === 'mkdocs' ? `
  docs:
    build:
      context: ./docs
    ports:
      - "8000:8000"
    volumes:
      - ./docs:/docs` : ''}`;

// Function to generate all templates
export const generateTemplates = (data) => {
    const files = {};
    const repoName = data.repo_name;
    const moduleName = data.module_name;
    
    // Root-level files
    files[`${repoName}/README.md`] = readmeTemplate(data);
    files[`${repoName}/Makefile`] = makefileTemplate(data);
    files[`${repoName}/pyproject.toml`] = pyprojectTemplate(data);
    files[`${repoName}/setup.cfg`] = setupCfgTemplate(data);
    
    if (data.open_source_license !== 'No license file') {
        files[`${repoName}/LICENSE`] = data.open_source_license === 'MIT' ? 
            mitLicenseTemplate(data) : bsd3LicenseTemplate(data);
    }
    
    // Create the module structure
    files[`${repoName}/${moduleName}/__init__.py`] = initPyTemplate(data);
    files[`${repoName}/${moduleName}/config.py`] = configTemplate();
    
    if (data.include_code_scaffold === 'Yes') {
        files[`${repoName}/${moduleName}/data/__init__.py`] = '';
        files[`${repoName}/${moduleName}/data/make_dataset.py`] = makeDatasetTemplate();
        files[`${repoName}/${moduleName}/features/__init__.py`] = '';
        files[`${repoName}/${moduleName}/features/build_features.py`] = '# Code to build features';
        files[`${repoName}/${moduleName}/models/__init__.py`] = '';
        files[`${repoName}/${moduleName}/models/predict_model.py`] = '# Code to make predictions';
        files[`${repoName}/${moduleName}/models/train_model.py`] = '# Code to train models';
        files[`${repoName}/${moduleName}/visualization/__init__.py`] = '';
        files[`${repoName}/${moduleName}/visualization/visualize.py`] = '# Code to create visualizations';
    }
    
    // Create empty directories with .gitkeep files
    ['data/raw', 'data/processed', 'data/interim', 'data/external',
     'models', 'notebooks', 'references', 'reports/figures'].forEach(dir => {
        files[`${repoName}/${dir}/.gitkeep`] = '';
    });
    
    // Environment management files
    if (data.environment_manager === 'conda') {
        files[`${repoName}/environment.yml`] = condaEnvTemplate(data);
    } else if (data.environment_manager === 'pipenv') {
        files[`${repoName}/Pipfile`] = pipfileTemplate(data);
    } else if (data.environment_manager === 'virtualenv') {
        files[`${repoName}/requirements.txt`] = requirementsTemplate(data);
    }
    
    // Docker compose if any services are enabled
    if (data.airflow === 'Yes' || data.streamlit === 'Yes' || data.docs === 'mkdocs') {
        files[`${repoName}/docker-compose.yml`] = dockerComposeTemplate(data);
    }
    
    // Streamlit app
    if (data.streamlit === 'Yes') {
        files[`${repoName}/streamlit/streamlit_app.py`] = streamlitAppTemplate(data);
        files[`${repoName}/streamlit/requirements.txt`] = `streamlit==1.27.*\npandas==2.0.*\nmatplotlib==3.7.*`;
        files[`${repoName}/streamlit/__init__.py`] = '';
        files[`${repoName}/streamlit/Dockerfile`] = `FROM python:${data.python_version_number}-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

EXPOSE 8501

CMD ["streamlit", "run", "streamlit_app.py", "--server.address=0.0.0.0"]`;
    }
    
    // Airflow dags
    if (data.airflow === 'Yes') {
        files[`${repoName}/airflow/dags/example_api_call_dag.py`] = airflowDagTemplate(data);
        files[`${repoName}/airflow/Dockerfile`] = `FROM apache/airflow:2.7.1

COPY requirements.txt .
RUN pip install -r requirements.txt

WORKDIR /opt/airflow`;
        files[`${repoName}/airflow/requirements.txt`] = `pandas==2.0.*\nrequests==2.31.*`;
        files[`${repoName}/airflow/entrypoint.sh`] = `#!/bin/bash
airflow db init
airflow users create --username admin --password admin --firstname Admin --lastname User --role Admin --email admin@example.com
airflow webserver`;
    }
    
    // MkDocs documentation
    if (data.docs === 'mkdocs') {
        files[`${repoName}/docs/mkdocs.yml`] = mkDocsTemplate(data);
        files[`${repoName}/docs/docs/index.md`] = `# ${data.project_name}\n\n${data.description}\n\n## Overview\n\nAdd your documentation here.`;
        files[`${repoName}/docs/docs/getting-started.md`] = `# Getting Started\n\n## Installation\n\n\`\`\`bash\n# Clone the repository\ngit clone <repository-url>\n\n# Change to the project directory\ncd ${repoName}\n\n# Install dependencies\nmake requirements\n\`\`\`\n\n## Usage\n\nDescribe how to use your project here.`;
        files[`${repoName}/docs/Dockerfile`] = `FROM python:${data.python_version_number}-slim

WORKDIR /docs

COPY requirements.txt .
RUN pip install -r requirements.txt

EXPOSE 8000

CMD ["mkdocs", "serve", "-a", "0.0.0.0:8000"]`;
        files[`${repoName}/docs/requirements.txt`] = `mkdocs==1.5.*\nmkdocs-material==9.4.*\nmkdocstrings==0.23.*`;
    }
    
    return files;
};
