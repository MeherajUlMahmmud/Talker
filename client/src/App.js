import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/main/HomePage";
import ProfilePage from "./pages/main/ProfilePage";
import SignUpPage from "./pages/auth/SignUpPage";
import LoginPage from "./pages/auth/LoginPage";


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
