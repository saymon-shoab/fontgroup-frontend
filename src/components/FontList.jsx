import { useState, useEffect } from "react";
import { Table, Alert, Spinner } from "react-bootstrap";
import { getFonts } from "../services/api";
import { getCleanFontName } from "../utils/comonFunction";

const FontList = ({ refreshTrigger }) => {
  const [fonts, setFonts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load fonts from backend
  const loadFonts = async () => {
    try {
      setLoading(true);
      setError("");
      const result = await getFonts();
      const fetchedFonts = result.data || result;

      // Add fontFamily (cleaned name) to each font object
      const enhancedFonts = fetchedFonts.map((font) => {
        const cleanedName = (font.name || "CustomFont")
          .replace(/\.[^/.]+$/, "") // remove .ttf
          .replace(/\s+/g, "-") // replace spaces with dashes
          .replace(/[^a-zA-Z0-9-_]/g, ""); // remove special characters

        return {
          ...font,
          fontFamily: cleanedName,
        };
      });

      setFonts(enhancedFonts);
    } catch (err) {
      setError(err.message || "Failed to load fonts");
    } finally {
      setLoading(false);
    }
  };

  // Reload fonts on initial load or when refresh is triggered
  useEffect(() => {
    loadFonts();
  }, [refreshTrigger]);

  // Inject @font-face for font preview
  useEffect(() => {
    fonts.forEach((font) => {
      const styleId = `font-style-${font._id}`;
      if (!document.getElementById(styleId)) {
        const style = document.createElement("style");
        style.id = styleId;
        style.innerHTML = `
          @font-face {
            font-family: '${font.fontFamily}';
            src: url('${font.url}') format('truetype');
          }
        `;
        document.head.appendChild(style);
      }
    });
  }, [fonts]);

  // UI rendering
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
        <Alert variant="info">
          No fonts uploaded yet. Upload your first font above!
        </Alert>
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
              <tr key={font._id}>
                <td>{getCleanFontName(font.name)}</td>
                <td>
                  <span
                    style={{
                      fontFamily: font.fontFamily,
                      fontSize: "1.2rem",
                      fontWeight: "normal",
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
