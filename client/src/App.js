import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./main/HomePage";
import LoginPage from "./auth/LoginPage";
import SignUpPage from "./auth/SignUpPage";
import ProfilePage from "./main/ProfilePage";
function App() {
  return (
    <div>
      <Router>
        <Routes>
          {/* Common Routes */}
          <Route exact path="/" element={<HomePage />} />

          {/* User */}
          <Route path="/profile" element={<ProfilePage />} />

          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/sign-up" element={<SignUpPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
