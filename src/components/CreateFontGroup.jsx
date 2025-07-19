import { useState, useEffect } from "react";
import { Alert, Button, Card, Col, Form, Row } from "react-bootstrap";
import { createFontGroup, getFonts } from "../services/api";

const CreateFontGroup = ({onGroupCreated}) => {
  const [fonts, setFonts] = useState([]);
  const [selectedFonts, setSelectedFonts] = useState([""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [groupName, setGroupName] = useState("");

  useEffect(() => {
    loadFonts();
  }, []);

  const loadFonts = async () => {
    try {
      const result = await getFonts();
      setFonts(result.data || result);
    } catch (error) {
      console.error("failed to load fonts:", error);
    }
  };

  const handleFontChange = (value, index) => {
    const updatedFonts = [...selectedFonts];
    updatedFonts[index] = value;
    setSelectedFonts(updatedFonts);
  };

  const addFontRow = () => {
    setSelectedFonts([...selectedFonts, ""]);
  };

  const removeFontRow = (index) => {
    if (selectedFonts.length > 1) {
      const updatedFonts = selectedFonts.filter((_, i) => i !== index);
      setSelectedFonts(updatedFonts);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validFonts = selectedFonts.filter((fontId) => fontId.trim() != "");

    if (!groupName.trim()) {
      return setError("Please enter a group name.");
    }

    if (validFonts.length < 2) {
      return setError("you must select at lest 2 fonts to create a group.");
    }

    const uniqueFonts = [...new Set(validFonts)];
    if (uniqueFonts.length !== validFonts.length) {
      return setError("Please select different fonts for each now");
    }
    setLoading(true);
    try {
      const result = await createFontGroup(groupName.trim(), validFonts);
      setGroupName("");
      setSelectedFonts("");
      setError("");
      onGroupCreated(result)
    } catch (error) {
      setError(error.message || "Failed to create font group");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mb-4">
      <Card.Header>
        <h3 className="mb-0">Create Font Group</h3>
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          {error && <Alert variant="danger">{error}</Alert>}

          <Form.Group className="mb-3">
            <Form.Label>Group Name *</Form.Label>
            <Form.Control
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Enter group name"
              disabled={loading}
            />
          </Form.Group>

          <Form.Label>Select Fonts * (minimum 2)</Form.Label>
          {selectedFonts.map((selectedFont, index) => (
            <Row key={index} className="mb-2 align-items-center">
              <Col md={10}>
                <Form.Select
                  value={selectedFont}
                  onChange={(e) => handleFontChange(e.target.value, index)}
                  disabled={loading}
                >
                  <option value="">Select a font...</option>
                  {fonts.map((font) => (
                    <option
                      key={font._id}
                      value={font._id}
                      disabled={
                        selectedFonts.includes(font._id) &&
                        selectedFont !== font._id
                      }
                    >
                      {font.fontName || font.name}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={2}>
                {selectedFonts.length > 1 && (
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => removeFontRow(index)}
                    disabled={loading}
                  >
                    Remove
                  </Button>
                )}
              </Col>
            </Row>
          ))}

          <div className="d-flex gap-2 mt-3">
            <Button
              variant="outline-secondary"
              onClick={addFontRow}
              disabled={loading || fonts.length === 0}
            >
              Add Font Row
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={loading || fonts.length === 0}
            >
              {loading ? "Creating..." : "Create Group"}
            </Button>
          </div>

          {fonts.length === 0 && (
            <Alert variant="warning" className="mt-3">
              No fonts available. Please upload some fonts first.
            </Alert>
          )}
        </Form>
      </Card.Body>
    </Card>
  );
};

export default CreateFontGroup;
