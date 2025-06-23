// src/App.jsx

import { Routes,Route } from "react-router-dom";
import Welcome from "./pages/Welcome";
import ProfileSetup from "./pages/ProfileSetup";


function App(){
  return(
    <Routes>
      <Route path="/" element={<Welcome/>}/>
      <Route path="/profile-setup" element={<ProfileSetup/>}/>
    </Routes>
  )
}

export default App