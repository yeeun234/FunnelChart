import { Routes, Route } from "react-router-dom";
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import About from './About';
import Login from './Login';
import JoinUs from "./JoinUs";
import Funnel from "./Funnel";


function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<About />} />
      <Route path="/join" element={<JoinUs />} />
      <Route path="/funnel" element={<Funnel />} />
    </Routes>
  );
}

export default App;