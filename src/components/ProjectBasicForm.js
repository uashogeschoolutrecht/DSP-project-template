import React from 'react';
import { Box, Typography, TextField, Grid } from '@mui/material';

function ProjectBasicForm({ formData, onChange }) {
  return (
    <Box className="form-section">
      <Typography variant="h6" gutterBottom>
        Project Basic Information
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            id="project_name"
            label="Project Name"
            name="project_name"
            value={formData.project_name}
            onChange={(e) => onChange('project_name', e.target.value)}
            className="form-field"
            helperText="A name for the project, for example 'My Project'."
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="repo_name"
            label="Repository Name"
            name="repo_name"
            value={formData.repo_name}
            onChange={(e) => onChange('repo_name', e.target.value)}
            className="form-field"
            helperText="Used for folder and repo name for the project."
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="module_name"
            label="Module Name"
            name="module_name"
            value={formData.module_name}
            onChange={(e) => onChange('module_name', e.target.value)}
            className="form-field"
            helperText="Used as a compatible Python module name."
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            id="author_name"
            label="Author Name"
            name="author_name"
            value={formData.author_name}
            onChange={(e) => onChange('author_name', e.target.value)}
            className="form-field"
            helperText="Name of the individual or organization that created the project."
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            id="description"
            label="Project Description"
            name="description"
            value={formData.description}
            onChange={(e) => onChange('description', e.target.value)}
            multiline
            rows={3}
            className="form-field"
            helperText="A short description that appears in the README.md file by default."
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default ProjectBasicForm;
