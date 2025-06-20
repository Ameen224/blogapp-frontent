// src/App.jsx

import { Routes,Route } from "react-router-dom";
import Welcome from "./pages/Welcome";


function App(){
  return(
    <Routes>
      <Route path="/" element={<Welcome/>}/>
    </Routes>
  )
}

export default App