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
    const rightImageData = await rotateBase64Image(topImageData);
    const bottomImageData = await rotateBase64Image(rightImageData);
    const leftImageData = await rotateBase64Image(bottomImageData);

    console.log(rightImageData);

    topImage.onload = function () {
      const canvas = document.createElement("canvas");
      console.log(topImage.width);
      canvas.width = topImage.width + topImage.height;
      canvas.height = canvas.width;

      const context = canvas.getContext("2d");

      context.drawImage(topImage, 0, 0);
      context.drawImage(rightImage, topImage.width, 0);
      context.drawImage(bottomImage, topImage.height, topImage.width);
      context.drawImage(leftImage, 0, topImage.height);

      const combinedBase64 = canvas.toDataURL();
      setCombinedImage(combinedBase64);
    };

    topImage.src = topImageData;
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
          // width={window.innerWidth}
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
          Okay
        </button>
      </div>
    </>
  );
};

export default CanvasFireze;
