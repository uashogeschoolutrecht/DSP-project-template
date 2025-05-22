import React from 'react';
import {
  Box,
  Typography,
  Grid,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';

function ProjectFeaturesForm({ formData, onChange }) {
  return (
    <Box className="form-section">
      <Typography variant="h6" gutterBottom>
        Additional Features
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <FormControl component="fieldset" className="form-field">
            <FormLabel component="legend">Documentation</FormLabel>
            <RadioGroup
              name="docs"
              value={formData.docs}
              onChange={(e) => onChange('docs', e.target.value)}
            >
              <FormControlLabel value="mkdocs" control={<Radio />} label="MkDocs" />
              <FormControlLabel value="none" control={<Radio />} label="None" />
            </RadioGroup>
            <div className="form-help-text">Include documentation setup</div>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={4}>
          <FormControl component="fieldset" className="form-field">
            <FormLabel component="legend">Airflow</FormLabel>
            <RadioGroup
              name="airflow"
              value={formData.airflow}
              onChange={(e) => onChange('airflow', e.target.value)}
            >
              <FormControlLabel value="Yes" control={<Radio />} label="Include" />
              <FormControlLabel value="No" control={<Radio />} label="Exclude" />
            </RadioGroup>
            <div className="form-help-text">Include Apache Airflow setup</div>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={4}>
          <FormControl component="fieldset" className="form-field">
            <FormLabel component="legend">Streamlit</FormLabel>
            <RadioGroup
              name="streamlit"
              value={formData.streamlit}
              onChange={(e) => onChange('streamlit', e.target.value)}
            >
              <FormControlLabel value="Yes" control={<Radio />} label="Include" />
              <FormControlLabel value="No" control={<Radio />} label="Exclude" />
            </RadioGroup>
            <div className="form-help-text">Include Streamlit dashboard setup</div>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <FormControl component="fieldset" className="form-field">
            <FormLabel component="legend">Code Scaffold</FormLabel>
            <RadioGroup
              name="include_code_scaffold"
              value={formData.include_code_scaffold}
              onChange={(e) => onChange('include_code_scaffold', e.target.value)}
            >
              <FormControlLabel value="Yes" control={<Radio />} label="Include" />
              <FormControlLabel value="No" control={<Radio />} label="Exclude" />
            </RadioGroup>
            <div className="form-help-text">Include code structure and helper modules</div>
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ProjectFeaturesForm;
