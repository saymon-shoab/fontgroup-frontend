import { useState, useEffect } from 'react';
import { Table, Alert, Spinner } from 'react-bootstrap';
import { getFonts } from '../services/api';

const FontList = ({ refreshTrigger }) => {
  const [fonts, setFonts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadFonts = async () => {
    try {
      setLoading(true);
      setError('');
      const result = await getFonts();
      setFonts(result.data || result);
    } catch (err) {
      setError(err.message || 'Failed to load fonts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFonts();
  }, [refreshTrigger]);

  // Load fonts dynamically for preview
  useEffect(() => {
    fonts.forEach((font) => {
      if (font.fontUrl) {
        const linkId = `font-${font._id || font.id}`;
        if (!document.getElementById(linkId)) {
          const link = document.createElement('link');
          link.id = linkId;
          link.href = font.fontUrl;
          link.rel = 'stylesheet';
          document.head.appendChild(link);
        }
      }
    });
  }, [fonts]);

  if (loading) {
    return (
      <div className="text-center py-4">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading fonts...</p>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <div className="mb-4">
      <h3>Uploaded Fonts</h3>
      
      {fonts.length === 0 ? (
        <Alert variant="info">No fonts uploaded yet. Upload your first font above!</Alert>
      ) : (
        <Table bordered hover responsive>
          <thead className="table-dark">
            <tr>
              <th>Font Name</th>
              <th>Preview</th>
            </tr>
          </thead>
          <tbody>
            {fonts.map((font) => (
              <tr key={font._id || font.id}>
                <td>{font.fontName || font.name}</td>
                <td>
                  <span
                    style={{
                      fontFamily: font.fontFamily || font.fontName || font.name,
                      fontSize: '1.2rem',
                      fontWeight: 'normal'
                    }}
                  >
                    The quick brown fox jumps over the lazy dog
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default FontList;