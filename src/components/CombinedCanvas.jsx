import React, { useEffect, useRef, useState } from "react";
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

    // Load and draw second image
    const storedImage2 = localStorage.getItem("rosetteImage");
    if (storedImage2) {
      const img2 = new Image();
      img2.onload = () => {
        setImageWidth2(img2.width);
        setImageHeight2(img2.height);
        context.drawImage(img2, 0, 0, img2.width, img2.height);
      };
      img2.src = storedImage2;
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

    // Draw rosette image with resizing and dragging
    const img2 = new Image();
    img2.onload = () => {
      const scaledWidth2 = imageWidth2 * scaleFactor;
      const scaledHeight2 = imageHeight2 * scaleFactor;

      // Calculate new position of the rosette image
      const rosetteX = (canvas.width - scaledWidth2) / 2 + offsetX;
      const rosetteY = (canvas.height - scaledHeight2) / 2 + offsetY;

      // Save the current context state
      context.save();

      // Create a clipping path in the shape of a circle
      context.beginPath();
      context.arc(
        canvas.width / 2,
        canvas.height / 2,
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

  const handleSaveImage = () => {
    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = "combined_image.png";
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
          // Add a gradient background color that changes from gray to blue
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
          onClick={handleSaveImage}
          className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Save Image
        </button>
      </div>
    </>
  );
};

export default CombinedCanvas;
