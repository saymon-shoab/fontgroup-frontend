import React, { useRef, useState } from 'react';
import { Alert, Spinner } from 'react-bootstrap';
import { uploadFont } from '../services/api';

const FontUploader = ({ onFontUploaded }) => {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);

  const handleFileSelect = async (file) => {
    if (!file) return;
    
    // Validate file type
    if (!file.name.toLowerCase().endsWith('.ttf')) {
      setError('Please select a .ttf font file only');
      return;
    }

    setError('');
    setUploading(true);

    try {
      const result = await uploadFont(file);
      onFontUploaded(result);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      setError(err.message || 'Failed to upload font');
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    handleFileSelect(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  return (
    <div className="mb-4">
      <h3>Upload Font</h3>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      <div
        className={`border-2 border-dashed rounded p-4 text-center position-relative ${
          dragOver ? 'border-primary bg-light' : 'border-secondary'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        style={{ minHeight: '120px', cursor: 'pointer' }}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".ttf"
          onChange={handleFileChange}
          style={{ display: 'none' }}
          disabled={uploading}
        />
        
        {uploading ? (
          <div className="d-flex flex-column align-items-center justify-content-center h-100">
            <Spinner animation="border" variant="primary" className="mb-2" />
            <span>Uploading font...</span>
          </div>
        ) : (
          <div className="d-flex flex-column align-items-center justify-content-center h-100">
            <i className="bi bi-cloud-upload fs-1 text-muted mb-2"></i>
            <p className="mb-1">
              <strong>Click to select</strong> or drag and drop a .ttf font file
            </p>
            <small className="text-muted">Only .ttf files are supported</small>
          </div>
        )}
      </div>
    </div>
  );
};

export default FontUploader;