import React, { useEffect, useRef, useState } from "react";
import Header from "./Header";

const Canvas = React.forwardRef((props, ref) => {
  return <canvas ref={ref} {...props} style={{ border: "2px solid black" }} />;
});

const CanvasWallpaper = () => {
  const canvasRef = useRef(null);
  const [imageWidth, setImageWidth] = useState(0);
  const [imageHeight, setImageHeight] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartY, setDragStartY] = useState(0);
  const [dragOffsetX, setDragOffsetX] = useState(0);
  const [dragOffsetY, setDragOffsetY] = useState(0);
  const [scaleFactor, setScaleFactor] = useState(1);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const storedImage = localStorage.getItem("wallpaperImage");

    if (storedImage) {
      const img = new Image();
      img.onload = () => {
        setImageWidth(img.width);
        setImageHeight(img.height);
        context.drawImage(img, 0, 0, img.width, img.height);
      };
      img.src = storedImage;
    }
  }, []);

  const handleMouseDown = (event) => {
    setDragging(true);
    setDragStartX(event.clientX);
    setDragStartY(event.clientY);
    setDragOffsetX(0);
    setDragOffsetY(0);
  };

  const handleMouseMove = (event) => {
    if (dragging) {
      const offsetX = event.clientX - dragStartX;
      const offsetY = event.clientY - dragStartY;
      setDragOffsetX(offsetX);
      setDragOffsetY(offsetY);
      drawImage(offsetX, offsetY);
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  const handleResize = (event) => {
    const scaleFactor = parseFloat(event.target.value) / 100;
    setScaleFactor(scaleFactor);
    drawImage(0, 0); // Redraw the image with the new scale factor
  };

  const drawImage = (offsetX, offsetY) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      const scaledWidth = imageWidth * scaleFactor;
      const scaledHeight = imageHeight * scaleFactor;
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(
        img,
        offsetX + dragOffsetX,
        offsetY + dragOffsetY,
        scaledWidth,
        scaledHeight
      );
    };
    img.src = localStorage.getItem("wallpaperImage");
  };

  return (
    <>
      <Header />
      <div className="flex justify-center mt-5">
        <input
          type="range"
          min="10"
          max="200"
          defaultValue="100"
          onChange={handleResize}
          className="w-64  mb-0 bg-gray-200 h-3 rounded-full overflow-hidden cursor-pointer"
        />
      </div>

      <br />

      <div className="flex justify-center items-center h-30">
        <Canvas
          ref={canvasRef}
          width={600}
          height={600}
          id="canvas"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
      </div>
    </>
  );
};

export default CanvasWallpaper;
