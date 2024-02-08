import React from 'react';
import { createRoot } from 'react-dom/client';

//import HandApp from './handDraw';
import DrawingCanvas from './wallpaper'
//import Rossette from './rosette'
//import MainWindow from './drawing';
const root = document.getElementById('root');

const renderApp = () => {
  createRoot(root).render(
    <React.StrictMode>
      <DrawingCanvas/>
    </React.StrictMode>
  );
};

renderApp();
