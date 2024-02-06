import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Home from "./components/Home";
import Footer from "./components/Footer";
import Rossette from "./components/rosette";
import Frieze from "./components/frieze";
import Walpaper from "./components/Walpaper";
import Demo from "./components/Demo";
import Canvas from "./components/Canvas";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Header />} />
        <Route index element={<Home />} />
        <Route path="home" element={<Home />} />
        <Route path="rossette" element={<Rossette />} />
        <Route path="contact" element={<Frieze />} />
        <Route path="footer" element={<Footer />} />
        <Route path="demo" element={<Demo />} />
        <Route path="walpaper" element={<Walpaper />} />
        <Route path="canvas" element={<Canvas />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
