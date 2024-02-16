// CombinedCanvas.js
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "./Header";

const Canvas = React.forwardRef((props, ref) => {
  return <canvas ref={ref} {...props} style={{ border: "2px solid black" }} />;
});

const CombinedCanvas = () => {
  const canvasRef = useRef(null);
  const [imageWidth1, setImageWidth1] = useState(0);
  const [imageHeight1, setImageHeight1] = useState(0);
  const [imageWidth2, setImageWidth2] = useState(0);
  const [imageHeight2, setImageHeight2] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartY, setDragStartY] = useState(0);
  const [dragOffsetX, setDragOffsetX] = useState(0);
  const [dragOffsetY, setDragOffsetY] = useState(0);
  const [scaleFactor, setScaleFactor] = useState(1);
  const navigate = useNavigate(); // Use useNavigate instead of useHistory

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    // Load and draw first image
    const storedImage1 = localStorage.getItem("wallpaperImage");
    if (storedImage1) {
      const img1 = new Image();
      img1.onload = () => {
        setImageWidth1(img1.width);
        setImageHeight1(img1.height);
        context.drawImage(img1, 0, 0, img1.width, img1.height);
      };
      img1.src = storedImage1;
    }

    // Load and draw rosette image
    const storedRosetteImage = localStorage.getItem("rosetteImage");
    if (storedRosetteImage) {
      const img2 = new Image();
      img2.onload = () => {
        setImageWidth2(img2.width);
        setImageHeight2(img2.height);
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        const canvasCenterX = canvas.width / 2;
        const canvasCenterY = canvas.height / 2;
        const rosetteX = canvasCenterX - img2.width / 2;
        const rosetteY = canvasCenterY - img2.height / 2;
        context.drawImage(img2, rosetteX, rosetteY, img2.width, img2.height);
      };
      img2.src = storedRosetteImage;
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
    drawImage(0, 0); // Redraw the images with the new scale factor
  };

  const drawImage = (offsetX, offsetY) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    // Clear canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw wallpaper image
    const img1 = new Image();
    img1.onload = () => {
      const scaledWidth1 = imageWidth1 * scaleFactor;
      const scaledHeight1 = imageHeight1 * scaleFactor;
      context.drawImage(img1, 0, 0, canvas.width, canvas.height);
    };
    img1.src = localStorage.getItem("wallpaperImage");

    // Draw rosette image with resizing and centering
    const img2 = new Image();
    img2.onload = () => {
      const scaledWidth2 = imageWidth2 * scaleFactor;
      const scaledHeight2 = imageHeight2 * scaleFactor;

      // Calculate center of the canvas
      const canvasCenterX = canvas.width / 2;
      const canvasCenterY = canvas.height / 2;

      // Calculate position to center the rosette image
      const rosetteX = canvasCenterX - scaledWidth2 / 2 + offsetX;
      const rosetteY = canvasCenterY - scaledHeight2 / 2 + offsetY;

      // Save the current context state
      context.save();

      // Create a clipping path in the shape of a circle
      context.beginPath();
      context.arc(
        canvasCenterX,
        canvasCenterY,
        Math.min(scaledWidth2, scaledHeight2) / 2,
        0,
        Math.PI * 2
      );
      context.closePath();
      context.clip();

      // Draw the rosette image within the circular clipping path
      context.drawImage(img2, rosetteX, rosetteY, scaledWidth2, scaledHeight2);

      // Restore the context state to remove the clipping path
      context.restore();
    };
    img2.src = localStorage.getItem("rosetteImage");
  };

  const handleNextButtonClick = () => {
    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL(); // Get the image data URL
    localStorage.setItem("combinedImage", dataURL); // Save combined image data to localStorage
    navigate("/finale"); // Navigate to the /finale route
  };

  return (
    <>
      <Header />
      <div className="flex justify-center mt-11">
        <input
          type="range"
          min="10"
          max="200"
          defaultValue="100"
          onChange={handleResize}
          className="w-64 mb-0 h-3 rounded-full overflow-hidden cursor-pointer bg-gradient-to-r from-gray-200 to-blue-500"
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
      <div className="flex justify-center mt-4">
        <button
          onClick={() => navigate("/wallpaper")}
          className="px-4 py-2 mr-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Back to Wallpaper
        </button>
        <button
          onClick={() => navigate("/rosette")}
          className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Back to Rosette
        </button>
      </div>
      <div className="flex justify-center mt-4">
        <button
          onClick={handleNextButtonClick}
          className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Next
        </button>
      </div>
    </>
  );
};

export default CombinedCanvas;
