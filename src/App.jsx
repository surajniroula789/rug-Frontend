import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Home from "./components/Home";
import Rossette from "./components/rosette";
import Walpaper from "./components/Walpaper";
import Canvas from "./components/Canvas";
import CanvasWallpaper from "./components/CanvasWalpaper";
import CombinedCanvas from "./components/CombinedCanvas";
import CanvasRosette from "./components/CanvasRosette";
import FriezeSymmetry from "./components/Fireze";
import CanvasFireze from "./components/CanvasFireze";
import FinalDesign from "./components/FinalDesign";
import MergeImages from "./components/Final_Generate";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Header />} />
        <Route index element={<Home />} />
        <Route path="home" element={<Home />} />
        <Route path="rosette" element={<Rossette />} />
        <Route path="wallpaper" element={<Walpaper />} />
        <Route path="fireze" element={<FriezeSymmetry />} />
        <Route path="canvas" element={<Canvas />} />
        <Route path="c-rosette" element={<CanvasRosette />} />
        <Route path="c-wall" element={<CanvasWallpaper />} />
        <Route path="c-fireze" element={<CanvasFireze />} />
        <Route path="combined" element={<CombinedCanvas />} />
        <Route path="final" element={<FinalDesign />} />
        <Route path="finale" element={<MergeImages />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
