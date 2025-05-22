import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, CircularProgress } from '@mui/material';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

// Template files for the project structure
import { generateTemplates } from '../utils/templateGenerator';

function ProjectGenerator({ formData, onReset }) {
  const [generating, setGenerating] = useState(false);
  const [fileTree, setFileTree] = useState(null);

  // Generate directory structure but don't download on first render
  useEffect(() => {
    async function generatePreview() {
      const templates = generateTemplates(formData);
      const tree = buildFileTree(templates);
      setFileTree(tree);
    }
    
    generatePreview();
  }, [formData]);

  const buildFileTree = (templates) => {
    const root = {
      name: formData.repo_name,
      isFolder: true,
      children: []
    };

    const paths = Object.keys(templates).sort();
    
    // Build the file tree structure
    paths.forEach(path => {
      const parts = path.split('/');
      let current = root;
      
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        const isLast = i === parts.length - 1;
        
        let found = current.children.find(child => child.name === part);
        
        if (!found) {
          const newNode = {
            name: part,
            isFolder: !isLast,
            children: []
          };
          
          current.children.push(newNode);
          found = newNode;
        }
        
        current = found;
      }
    });
    
    return root;
  };

  const renderFileTree = (node) => {
    return (
      <li key={node.name} className={node.isFolder ? "file-tree-folder" : "file-tree-item"}>
        {node.name}
        {node.isFolder && node.children.length > 0 && (
          <ul>
            {node.children.map(child => renderFileTree(child))}
          </ul>
        )}
      </li>
    );
  };

  const handleDownload = async () => {
    setGenerating(true);
    
    try {
      const zip = new JSZip();
      const templates = generateTemplates(formData);
      
      // Add all files to the zip
      for (const [path, content] of Object.entries(templates)) {
        zip.file(path, content);
      }
      
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      saveAs(zipBlob, `${formData.repo_name}.zip`);
    } catch (error) {
      console.error('Error generating zip file:', error);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Project Structure Preview
      </Typography>
      
      <Paper elevation={1} className="preview-container">
        <Typography variant="body2" gutterBottom>
          Project files to be generated:
        </Typography>
        
        {fileTree && (
          <ul className="file-tree">
            {renderFileTree(fileTree)}
          </ul>
        )}
      </Paper>
      
      <Box mt={3} display="flex" justifyContent="space-between">
        <Button
          onClick={onReset}
          variant="outlined"
          color="secondary"
        >
          Start Over
        </Button>
        
        <Button
          onClick={handleDownload}
          variant="contained"
          color="primary"
          disabled={generating}
          startIcon={generating ? <CircularProgress size={20} /> : null}
        >
          {generating ? 'Generating...' : 'Download ZIP'}
        </Button>
      </Box>
    </Box>
  );
}

export default ProjectGenerator;
