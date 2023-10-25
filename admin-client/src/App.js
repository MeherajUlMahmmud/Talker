import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import AppLayout from "./pages/AppLayout";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          {/* App Routes */}
          <Route path="/" element={<AppLayout />} >
            <Route path="/" element={<HomePage />} />
          </Route>

          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </Router>
    </div>
  )
};

export default App;
