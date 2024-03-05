import React, { useEffect, useRef, useState } from "react";
import Header from "./Header";

const FinalCanvas = () => {
  const canvasRef = useRef(null);
  const [scaleFactor, setScaleFactor] = useState(1);
  const [dragging, setDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartY, setDragStartY] = useState(0);
  const [dragOffsetX, setDragOffsetX] = useState(0);
  const [dragOffsetY, setDragOffsetY] = useState(0);
  const [image, setImage] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    // Get image data from localStorage
    const storedImage = localStorage.getItem("combinedImage");
    if (storedImage) {
      const img = new Image();
      img.onload = () => {
        setImage(img);
        drawImage(context, img);
      };
      img.src = storedImage;
    }
  }, [scaleFactor]);

  const drawImage = (context, img) => {
    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    const scaledWidth = img.width * scaleFactor;
    const scaledHeight = img.height * scaleFactor;
    context.drawImage(img, dragOffsetX, dragOffsetY, scaledWidth, scaledHeight);
  };

  const handleMouseDown = (event) => {
    setDragging(true);
    setDragStartX(event.clientX);
    setDragStartY(event.clientY);
  };

  const handleMouseMove = (event) => {
    if (dragging && image) {
      const offsetX = event.clientX - dragStartX;
      const offsetY = event.clientY - dragStartY;
      setDragOffsetX(offsetX);
      setDragOffsetY(offsetY);
      drawImage(canvasRef.current.getContext("2d"), image);
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  const handleResize = (event) => {
    const scaleFactor = parseFloat(event.target.value) / 100;
    setScaleFactor(scaleFactor);
  };

  return (
    <div>
      <Header />
      <input
        type="range"
        min="10"
        max="200"
        defaultValue="100"
        onChange={handleResize}
        className="w-64 mb-0 bg-gray-200 h-3 rounded-full overflow-hidden cursor-pointer"
      />
      <div className="flex justify-center">
        <canvas
          ref={canvasRef}
          width={600}
          height={600}
          style={{ border: "2px solid black" }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        />
      </div>
    </div>
  );
};

export default FinalCanvas;
