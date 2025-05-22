import React, { useState } from 'react';
import { Container, Box, Typography, Paper, Stepper, Step, StepLabel, Button } from '@mui/material';
import ProjectBasicForm from './components/ProjectBasicForm';
import ProjectConfigForm from './components/ProjectConfigForm';
import ProjectFeaturesForm from './components/ProjectFeaturesForm';
import ProjectGenerator from './components/ProjectGenerator';
import './App.css';

const steps = ['Project Details', 'Configuration', 'Additional Features'];

function App() {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    project_name: '',
    repo_name: '',
    module_name: '',
    author_name: '',
    description: '',
    python_version_number: '3.10',
    dataset_storage: 'none',
    aws_profile: 'default',
    container_name: 'container-name',
    bucket_name: 'bucket-name',
    environment_manager: 'virtualenv',
    dependency_file: 'requirements.txt',
    pydata_packages: 'none',
    open_source_license: 'MIT',
    docs: 'mkdocs',
    airflow: 'Yes',
    streamlit: 'Yes',
    include_code_scaffold: 'Yes'
  });

  const handleChange = (field, value) => {
    const newData = { ...formData };
    newData[field] = value;

    // Update dependent fields
    if (field === 'project_name') {
      const lowerNoSpaces = value.toLowerCase().replace(/\s+/g, '_');
      newData.repo_name = lowerNoSpaces;
      newData.module_name = lowerNoSpaces.replace(/-/g, '_');
    }

    setFormData(newData);
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setFormData({
      project_name: '',
      repo_name: '',
      module_name: '',
      author_name: '',
      description: '',
      python_version_number: '3.10',
      dataset_storage: 'none',
      aws_profile: 'default',
      container_name: 'container-name',
      bucket_name: 'bucket-name',
      environment_manager: 'virtualenv',
      dependency_file: 'requirements.txt',
      pydata_packages: 'none',
      open_source_license: 'MIT',
      docs: 'mkdocs',
      airflow: 'Yes',
      streamlit: 'Yes',
      include_code_scaffold: 'Yes'
    });
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return <ProjectBasicForm formData={formData} onChange={handleChange} />;
      case 1:
        return <ProjectConfigForm formData={formData} onChange={handleChange} />;
      case 2:
        return <ProjectFeaturesForm formData={formData} onChange={handleChange} />;
      default:
        return 'Unknown step';
    }
  };

  return (
    <Container maxWidth="lg" className="app-container">
      <Paper elevation={3} className="main-paper">
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Data Science Project Generator
        </Typography>
        <Typography variant="subtitle1" align="center" color="textSecondary" paragraph>
          Create a standardized data science project structure and download as a ZIP file
        </Typography>
        <Box my={4}>
          <Stepper activeStep={activeStep}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <Box mt={3}>
            {activeStep === steps.length ? (
              <ProjectGenerator formData={formData} onReset={handleReset} />
            ) : (
              <>
                {getStepContent(activeStep)}
                <Box mt={3} display="flex" justifyContent="space-between">
                  <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    variant="contained"
                    color="secondary"
                  >
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                  >
                    {activeStep === steps.length - 1 ? 'Generate' : 'Next'}
                  </Button>
                </Box>
              </>
            )}
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default App;
