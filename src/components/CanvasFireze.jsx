import React, { useEffect, useRef, useState } from "react";
import Header from "./Header";
import { useNavigate } from "react-router-dom";

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 600;

const Canvas = React.forwardRef((props, ref) => {
  return <canvas ref={ref} {...props} style={{ border: "2px solid black" }} />;
});

const CanvasFireze = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [imageWidth, setImageWidth] = useState(0);
  const [imageHeight, setImageHeight] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartY, setDragStartY] = useState(0);
  const [dragOffsetX, setDragOffsetX] = useState(0);
  const [dragOffsetY, setDragOffsetY] = useState(0);
  const [scaleFactor, setScaleFactor] = useState(1);

  const [combinedImage, setCombinedImage] = useState(null);

  useEffect(() => {
    const imageData = localStorage.getItem("FirezeImage");
    combineImage(imageData);
  }, []);

  useEffect(() => {
    console.log("combnined useeffect image called");
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      setImageWidth(img.width);
      setImageHeight(img.height);
      context.drawImage(img, 0, 0, img.width, img.height);
    };
    img.src = combinedImage;
  }, [combinedImage]);

  function rotateBase64Image(base64String) {
    return new Promise((resolve, reject) => {
      var img = new Image();
      img.onload = function () {
        var canvas = document.createElement("canvas");
        var ctx = canvas.getContext("2d");
        canvas.width = img.height;
        canvas.height = img.width;
        ctx.rotate(Math.PI / 2);
        ctx.translate(0, -canvas.width);
        ctx.drawImage(img, 0, 0);
        var rotatedBase64String = canvas.toDataURL();
        resolve(rotatedBase64String);
      };
      img.src = base64String;
    });
  }

  const combineImage = async (topImageData) => {
    const topImage = new Image();
    const rightImage = new Image();
    const bottomImage = new Image();
    const leftImage = new Image();

    // Function to crop top image diagonally
    const cropDiagonally = async (imageData) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous"; // Enable cross-origin resource sharing
        img.onload = () => {
          console.log("cropping diagonally");
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const context = canvas.getContext("2d");

          // Draw the image onto the canvas
          //context.drawImage(img, 0, 0);

          // Clear any existing content on the canvas
          context.clearRect(0, 0, canvas.width, canvas.height);

          // Draw the diagonal clipping path
          context.beginPath();
          context.moveTo(0, 0);
          context.lineTo(canvas.height, canvas.height); // virtue of 45 degree
          //context.closePath();

          //context.beginPath()
          context.lineTo(canvas.width - canvas.height, canvas.height); // virtue of 45 degree slope
          context.lineTo(canvas.width, 0);
          context.closePath();
          context.clip();

          // Draw the image again after clipping
          context.drawImage(img, 0, 0);

          // Resolve with the data URL of the cropped image
          resolve(canvas.toDataURL());
        };
        img.onerror = reject;
        img.src = imageData;
      });
    };

    // Crop top image diagonally
    const croppedTopImageData = await cropDiagonally(topImageData);
    console.log(croppedTopImageData);

    // Rotate cropped top image to obtain other images
    const rightImageData = await rotateBase64Image(croppedTopImageData);
    const bottomImageData = await rotateBase64Image(rightImageData);
    const leftImageData = await rotateBase64Image(bottomImageData);

    topImage.onload = function () {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // Set canvas size to fit the trapezium shape
      canvas.width = topImage.width;
      canvas.height = canvas.width;

      // Draw the trapezium shape using the cropped top image
      ctx.drawImage(topImage, 0, 0);

      // Draw the other images at appropriate positions
      ctx.drawImage(rightImage, canvas.width - topImage.height, 0);
      ctx.drawImage(bottomImage, 0, canvas.height - topImage.height);
      ctx.drawImage(leftImage, 0, 0); //topImage.height);

      const combinedBase64 = canvas.toDataURL();
      setCombinedImage(combinedBase64);
    };

    topImage.src = croppedTopImageData;
    rightImage.src = rightImageData;
    bottomImage.src = bottomImageData;
    leftImage.src = leftImageData;
  };

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
    img.src = combinedImage;
  };

  const handleOkayButtonClick = () => {
    const canvas = canvasRef.current;
    const imageData = canvas.toDataURL();
    localStorage.setItem("FirezeImage", imageData);
    // Optionally, you can navigate to another page or perform other actions after storing the image locally
    navigate("/finale");
  };

  const handleBackToFirezeClick = () => {
    navigate("/fireze");
  };

  const clearAll = () => {
    localStorage.setItem("FirezeImage", null);
    window.location.reload();
  };

  return (
    <>
      <>
        <Header />
        <h2 className="text-center font-medium mt-4 mb-4">Resize Fireze </h2>

        <div className="flex justify-center mt-5 mb-7">
          <input
            type="range"
            min="10"
            max="200"
            defaultValue="100"
            onChange={handleResize}
            className="w-64 mb-0 bg-gray-200 h-3 rounded-full overflow-hidden cursor-pointer"
          />
        </div>

        <div className="flex justify-center items-center h-30">
          <Canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            id="canvas"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />
        </div>

        <div className="flex justify-center mt-5">
          <button
            onClick={handleOkayButtonClick}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            send_to_final_design
          </button>
          <button
            onClick={handleBackToFirezeClick}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-4"
          >
            Back to Fireze
          </button>
        </div>
        <div className="flex justify-center items-center mt-4">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={clearAll}
          >
            Clear Drawing
          </button>
        </div>
      </>
    </>
  );
};

export default CanvasFireze;
