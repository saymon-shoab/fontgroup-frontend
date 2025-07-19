import { useState } from "react";
import "./App.css";
import FontUploader from "./components/FontUploader";
import { Container } from "react-bootstrap";
import FontList from "./components/FontList";
import CreateFontGroup from "./components/CreateFontGroup";
import FontGroupList from "./components/FontGroupList";

function App() {
  const [fontRefreshTrigger, setFontRefreshTrigger] = useState(0);
  const [groupRefreshTrigger, setGroupRefreshTrigger] = useState(0)
  const handleFontUploaded = () => {
    setFontRefreshTrigger((prev) => prev + 1);
  };
  const handleGroupCreated = () => {
    setGroupRefreshTrigger(prev => prev +1)
  }
  return (
    <>
      <div className="min-vh-100 bg-light">
        <Container className="py-4">
          <div className="text-center mb-5">
            <h1 className="display-4 fw-bold text-bg-success">
              Font Group System
            </h1>
            <p className="lead text-muted">
              Upload fonts, create groups, and manage your typography collection
            </p>
          </div>

          <FontUploader onFontUploaded={handleFontUploaded} />
          <FontList refreshTrigger={fontRefreshTrigger} />
          <CreateFontGroup onGroupCreated={handleGroupCreated}/>
          <FontGroupList refreshTrigger={groupRefreshTrigger} />
        </Container>
      </div>
    </>
  );
}

export default App;
