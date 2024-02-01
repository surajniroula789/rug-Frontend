import React from 'react';
import { createRoot } from 'react-dom/client';
//import MyDrawingApp from './draw';
//import HandApp from './handDraw';
//import DrawingCanvas from './wallpaper'
import Rossette from './rosette'
const root = document.getElementById('root');

const renderApp = () => {
  createRoot(root).render(
    <React.StrictMode>
      <Rossette/>
    </React.StrictMode>
  );
};

renderApp();
