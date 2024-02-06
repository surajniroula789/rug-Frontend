import React, { useEffect, useRef, useState } from "react";
import Header from "./Header";

const Canvas = React.forwardRef((props, ref) => {
  return <canvas ref={ref} {...props} style={{ border: "2px solid black" }} />;
});

const CanvasPage = () => {
  const canvasRef = useRef(null);
  const [rosetteImgUrl, setRosetteImageUrl] = useState("");
  const [wallpaperImgUrl, setWallpaperImageUrl] = useState("");
  const [imageWidth, setImageWidth] = useState(0);
  const [imageHeight, setImageHeight] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartY, setDragStartY] = useState(0);
  const [dragOffsetX, setDragOffsetX] = useState(0);
  const [dragOffsetY, setDragOffsetY] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const storedWallpaperImage = localStorage.getItem("wallpaperImage");
    const storedRosetteImage = localStorage.getItem("rosetteImage");

    if (storedWallpaperImage) {
      const img = new Image();
      img.onload = () => {
        setImageWidth(img.width);
        setImageHeight(img.height);
        context.drawImage(img, 0, 0, img.width, img.height); // Draw the image on the canvas
      };
      img.src = storedWallpaperImage;
      console.log(storedWallpaperImage)
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
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      const scaleFactor = parseFloat(event.target.value) / 100;
      const newWidth = img.width * scaleFactor;
      const newHeight = img.height * scaleFactor;
      setImageWidth(newWidth);
      setImageHeight(newHeight);
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(img, 0, 0, newWidth, newHeight);
    };
    img.src = localStorage.getItem("canvasImage");
  };

  const drawImage = (offsetX, offsetY) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(
        img,
        offsetX + dragOffsetX,
        offsetY + dragOffsetY,
        imageWidth,
        imageHeight
      );
    };
    img.src = localStorage.getItem("canvasImage");
  };

  // const handleSave = () => {
  //   const canvas = canvasRef.current;
  //   const dataURL = canvas.toDataURL();
  //   localStorage.setItem("wallpaperImage", dataURL); // Store image data in local storage
  //   // Navigate to the canvas page
  //   window.location.href = "/canvas";
  // };

  return (
    <>
      <input
        type="range"
        min="10"
        max="200"
        defaultValue="100"
        onChange={handleResize}
      />
      <br />
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
      {/* <button onClick={handleSave}>Go To Wallpaper</button> */}
    </>
  );
};

export default CanvasPage;
