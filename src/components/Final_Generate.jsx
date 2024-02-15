import React, { useEffect, useRef, useState } from "react";
import Header from "./Header";
const backendUrl = "http://localhost:8000/send_here/";

const MergeImages = () => {
  const canvasRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartY, setDragStartY] = useState(0);
  const [dragOffsetX, setDragOffsetX] = useState(0);
  const [dragOffsetY, setDragOffsetY] = useState(0);
  const [combinedScaleFactor, setCombinedScaleFactor] = useState(1);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    // Get image data from FinalCanvas
    const finalCanvasData = localStorage.getItem("combinedImage");
    const finalCanvasImage = new Image();
    finalCanvasImage.onload = () => {
      context.drawImage(
        finalCanvasImage,
        dragOffsetX,
        dragOffsetY,
        finalCanvasImage.width * combinedScaleFactor,
        finalCanvasImage.height * combinedScaleFactor
      );
    };
    finalCanvasImage.src = finalCanvasData;

    // Get image data from FirezeImage
    const firezeCanvasData = localStorage.getItem("FirezeImage");
    const firezeCanvasImage = new Image();
    firezeCanvasImage.onload = () => {
      context.drawImage(firezeCanvasImage, 0, 0);
    };
    firezeCanvasImage.src = firezeCanvasData;
  }, [dragOffsetX, dragOffsetY, combinedScaleFactor]);

  const handleMouseDown = (event) => {
    setDragging(true);
    setDragStartX(event.clientX);
    setDragStartY(event.clientY);
  };

  const handleMouseMove = (event) => {
    if (dragging) {
      const offsetX = event.clientX - dragStartX;
      const offsetY = event.clientY - dragStartY;
      setDragOffsetX(offsetX);
      setDragOffsetY(offsetY);
      drawCanvas();
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Get image data from FinalCanvas
    const finalCanvasData = localStorage.getItem("combinedImage");
    const finalCanvasImage = new Image();
    finalCanvasImage.onload = () => {
      context.drawImage(
        finalCanvasImage,
        dragOffsetX,
        dragOffsetY,
        finalCanvasImage.width * combinedScaleFactor,
        finalCanvasImage.height * combinedScaleFactor
      );
    };
    finalCanvasImage.src = finalCanvasData;

    // Get image data from FirezeImage
    const firezeCanvasData = localStorage.getItem("FirezeImage");
    const firezeCanvasImage = new Image();
    firezeCanvasImage.onload = () => {
      context.drawImage(firezeCanvasImage, 0, 0);
    };
    firezeCanvasImage.src = firezeCanvasData;
  };

  const handleResizeCombined = (event) => {
    const scaleFactor = parseFloat(event.target.value) / 100;
    setCombinedScaleFactor(scaleFactor);
  };
  function dataURItoBlob(dataURI) {
    const byteString = atob(dataURI.split(",")[1]);
    const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  }

  const handleSend = async () => {
    
    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL("image/png");
    const blob = dataURItoBlob(dataURL);
    let formData = new FormData();
    formData.append("image", blob, "combinedImage.png");

    try{
      const response = await fetch(backendUrl, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        // Handle successful response
        console.log("Image sent successfully");
      } else {
        // Handle error response
        console.error("Error sending image");
      }
    } catch (error) {
      console.error("Error sending image:", error);
    }
  };
  
  return (
    <div className="flex flex-col items-center">
      <Header />
      <div className="flex justify-center mt-4">
        <input
          type="range"
          min="10"
          max="200"
          defaultValue="100"
          onChange={handleResizeCombined}
          className="w-64 mb-0 bg-gray-200 h-3 rounded-full overflow-hidden cursor-pointer"
        />
      </div>
      <div className="flex justify-center mt-4">
        <canvas
          ref={canvasRef}
          width={600}
          height={600}
          className="border-2 border-black"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        />
      </div>
      <div className="mt-4">
        <button
          onClick={handleSend}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Send Image
        </button>
      </div>
    </div>
  );
};

export default MergeImages;
``;
