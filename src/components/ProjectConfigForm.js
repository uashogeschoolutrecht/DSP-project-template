import React from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  MenuItem, 
  Grid, 
  FormControl,
  InputLabel,
  Select
} from '@mui/material';

function ProjectConfigForm({ formData, onChange }) {
  const pythonVersions = ['3.8', '3.9', '3.10', '3.11'];
  
  const handleDatasetStorageChange = (e) => {
    onChange('dataset_storage', e.target.value);
  };

  return (
    <Box className="form-section">
      <Typography variant="h6" gutterBottom>
        Project Configuration
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth className="form-field">
            <InputLabel id="python-version-label">Python Version</InputLabel>
            <Select
              labelId="python-version-label"
              id="python_version_number"
              value={formData.python_version_number}
              label="Python Version"
              onChange={(e) => onChange('python_version_number', e.target.value)}
            >
              {pythonVersions.map((version) => (
                <MenuItem key={version} value={version}>
                  {version}
                </MenuItem>
              ))}
            </Select>
            <div className="form-help-text">The version of Python that the project will use</div>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth className="form-field">
            <InputLabel id="dataset-storage-label">Dataset Storage</InputLabel>
            <Select
              labelId="dataset-storage-label"
              id="dataset_storage"
              value={formData.dataset_storage}
              label="Dataset Storage"
              onChange={handleDatasetStorageChange}
            >
              <MenuItem value="none">None</MenuItem>
              <MenuItem value="azure">Azure Storage</MenuItem>
              <MenuItem value="s3">AWS S3</MenuItem>
              <MenuItem value="gcs">Google Cloud Storage</MenuItem>
            </Select>
            <div className="form-help-text">Cloud storage location for data</div>
          </FormControl>
        </Grid>

        {formData.dataset_storage === 'azure' && (
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="container_name"
              label="Azure Container Name"
              value={formData.container_name}
              onChange={(e) => onChange('container_name', e.target.value)}
              className="form-field"
              helperText="Name of the Azure storage container"
            />
          </Grid>
        )}

        {formData.dataset_storage === 's3' && (
          <Grid container item xs={12} spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="bucket_name"
                label="S3 Bucket Name"
                value={formData.bucket_name}
                onChange={(e) => onChange('bucket_name', e.target.value)}
                className="form-field"
                helperText="Name of the S3 bucket"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="aws_profile"
                label="AWS Profile"
                value={formData.aws_profile}
                onChange={(e) => onChange('aws_profile', e.target.value)}
                className="form-field"
                helperText="AWS credentials profile to use"
              />
            </Grid>
          </Grid>
        )}

        {formData.dataset_storage === 'gcs' && (
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="bucket_name"
              label="GCS Bucket Name"
              value={formData.bucket_name}
              onChange={(e) => onChange('bucket_name', e.target.value)}
              className="form-field"
              helperText="Name of the GCS bucket"
            />
          </Grid>
        )}

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth className="form-field">
            <InputLabel id="env-manager-label">Environment Manager</InputLabel>
            <Select
              labelId="env-manager-label"
              id="environment_manager"
              value={formData.environment_manager}
              label="Environment Manager"
              onChange={(e) => onChange('environment_manager', e.target.value)}
            >
              <MenuItem value="virtualenv">virtualenv</MenuItem>
              <MenuItem value="conda">conda</MenuItem>
              <MenuItem value="pipenv">pipenv</MenuItem>
              <MenuItem value="none">none</MenuItem>
            </Select>
            <div className="form-help-text">Python environment management tool</div>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth className="form-field">
            <InputLabel id="dependency-file-label">Dependency File</InputLabel>
            <Select
              labelId="dependency-file-label"
              id="dependency_file"
              value={formData.dependency_file}
              label="Dependency File"
              onChange={(e) => onChange('dependency_file', e.target.value)}
            >
              <MenuItem value="requirements.txt">requirements.txt</MenuItem>
              <MenuItem value="environment.yml">environment.yml</MenuItem>
              <MenuItem value="Pipfile">Pipfile</MenuItem>
            </Select>
            <div className="form-help-text">File type for Python dependencies</div>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth className="form-field">
            <InputLabel id="pydata-packages-label">PyData Packages</InputLabel>
            <Select
              labelId="pydata-packages-label"
              id="pydata_packages"
              value={formData.pydata_packages}
              label="PyData Packages"
              onChange={(e) => onChange('pydata_packages', e.target.value)}
            >
              <MenuItem value="none">None</MenuItem>
              <MenuItem value="basic">Basic (pandas, numpy, etc.)</MenuItem>
            </Select>
            <div className="form-help-text">Include common data science packages</div>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth className="form-field">
            <InputLabel id="license-label">Open Source License</InputLabel>
            <Select
              labelId="license-label"
              id="open_source_license"
              value={formData.open_source_license}
              label="Open Source License"
              onChange={(e) => onChange('open_source_license', e.target.value)}
            >
              <MenuItem value="No license file">No license file</MenuItem>
              <MenuItem value="MIT">MIT</MenuItem>
              <MenuItem value="BSD-3-Clause">BSD-3-Clause</MenuItem>
            </Select>
            <div className="form-help-text">Project license type</div>
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ProjectConfigForm;
