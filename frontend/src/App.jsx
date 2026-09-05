import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <div className="app">
        <h1>Online Learning Platform</h1>
        <p>App routes will be configured in Phase 5.</p>
      </div>
    </BrowserRouter>
  );
}

export default App;
