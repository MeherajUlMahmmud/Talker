import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/main/HomePage";
import ProfilePage from "./pages/main/ProfilePage";
import SignUpPage from "./pages/auth/SignUpPage";
import LoginPage from "./pages/auth/LoginPage";
import AppLayout from "./pages/AppLayout";
import AuthLayout from "./pages/AuthLayout";
import ChatLayout from "./pages/ChatLayout";
import SettingsPage from "./pages/main/SettingsPage";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route path="/" element={<ChatLayout />}>
              {/* Common Routes */}
              <Route path="/" element={<HomePage />} />

            </Route>
            {/* User */}
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>

          {/* Auth Routes */}
          <Route path="/auth" element={<AuthLayout />} >
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/auth/sign-up" element={<SignUpPage />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
