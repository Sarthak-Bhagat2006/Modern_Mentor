import Navbar from "./components/Navbar";
import { Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage.jsx";
import { useEffect } from "react";

import { useAuthStore } from "./store/useAuthStore";

function App() {
  const fetchCurrUser = useAuthStore((state) => state.fetchCurrUser);

  useEffect(() => {
    fetchCurrUser(); // ✅ Fetch user on app load
  }, []);

  return (
    <>
      {/* <Navbar /> */}

      <Routes>
        <Route path="/member/:groupId" element={<HomePage />} />
        <Route path="/set" element={<SettingsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </>
  );
}

export default App;
