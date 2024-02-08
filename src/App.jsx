import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Home from "./components/Home";
import Rossette from "./components/rosette";
import Walpaper from "./components/Walpaper";
import Canvas from "./components/Canvas";
import CanvasWallpaper from "./components/CanvasWalpaper";
import CombinedCanvas from "./components/CombinedCanvas";
import CanvasRosette from "./components/CanvasRosette";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Header />} />
        <Route index element={<Home />} />
        <Route path="home" element={<Home />} />
        <Route path="rossette" element={<Rossette />} />
        <Route path="walpaper" element={<Walpaper />} />
        <Route path="canvas" element={<Canvas />} />
        <Route path="c-rosette" element={<CanvasRosette />} />
        <Route path="c-wall" element={<CanvasWallpaper />} />
        <Route path="combined" element={<CombinedCanvas />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
