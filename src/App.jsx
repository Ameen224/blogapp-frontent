// ✅ Updated src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Welcome from "./pages/Welcome";
import ProfileSetup from "./pages/ProfileSetup";
import Home from "./pages/Home";
import AuthSuccess from "./pages/AuthSuccess";
import { useSelector, useDispatch } from "react-redux";
import { setCredentials, logout } from "./features/auth/authSlice";
import api from "./utils/api";
import { useEffect, useState } from "react";

function App() {
  const user = useSelector(state => state.auth.user);
  const [load, setLoad] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get('/user/refresh');
        dispatch(setCredentials(res.data));
      } catch {
        dispatch(logout());
      } finally {
        setLoad(false);
      }
    };
    checkAuth();
  }, [dispatch]);

  if (load) return <div className="p-8">Loading......</div>;

  return (
    <Routes>
      <Route path="/" element={
        !user ? <Welcome /> :
        (!user.name || !user.category) ? <Navigate to="/profile-setup" /> :
        <Navigate to="/home" />
      } />

      <Route path="/profile-setup" element={
        user && (!user.name || !user.category) ? <ProfileSetup /> : <Navigate to="/" />
      } />

      <Route path="/home" element={
        user && user.name && user.category ? <Home /> : <Navigate to="/" />
      } />

      <Route path="/auth/success" element={<AuthSuccess />} />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
