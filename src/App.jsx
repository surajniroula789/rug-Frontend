import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Contact from "./components/Contact";
import Home from "./components/Home";
import Footer from "./components/Footer";
import Design from "./components/Design";
import CarpetDesigner from "./components/Demo";
import FinalDesign from "./components/FinalDesign";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Header />} />
        <Route index element={<Home />} />
        <Route path="home" element={<Home />} />
        <Route path="design" element={<Design />} />
        <Route path="contact" element={<Contact />} />
        <Route path="footer" element={<Footer />} />
        <Route path="demo" element={<CarpetDesigner />} />
        <Route path="final" element={<FinalDesign />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
